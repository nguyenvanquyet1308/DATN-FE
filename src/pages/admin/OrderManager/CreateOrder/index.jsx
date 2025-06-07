import React, { useEffect, useState } from "react";
import { 
  Input, 
  Modal, 
  notification, 
  Select, 
  Button, 
  Card, 
  Typography, 
  Space, 
  Row, 
  Col, 
  Checkbox, 
  InputNumber, 
  Empty, 
  Divider,
  List,
  Avatar,
  Descriptions
} from "antd";
import { 
  PlusOutlined, 
  ShoppingCartOutlined, 
  CheckCircleOutlined, 
  SearchOutlined, 
  EnvironmentOutlined,
  MinusOutlined
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { createOrder } from "apis/order.api";
import { getDelivery } from "apis/delivery.api";
import { fillUniqueATTSkus } from "utils/helper";
import { formatCurrency } from "utils/formatCurrency";
import AddressOrder from "./AddressOrder";
import OrderSuccess from "../OrderSuccess";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { Search } = Input;

const CreateOrder = () => {
  const { data: products = [] } = useSelector((state) => state.product.productList);
  
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [deliveryId, setDeliveryId] = useState(null);
  const [deliveryData, setDeliveryData] = useState("");
  const [skuCurrent, setSkuCurrent] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [stock, setStock] = useState(999);
  const [keyword, setKeyword] = useState("");
  const [filteredData, setFilteredData] = useState(products);
  const [isShowModal, setIsShowModal] = useState(false);
  const [isShowModalOrderSuccess, setIsShowModalOrderSuccess] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  // Payment type is fixed to COD for now
  const typePayment = "COD";

  // Modal handlers
  const openFormDelivery = () => {
    setIsShowModal(true);
  };

  const openFormOrderSuccess = (response) => {
    setOrderSuccess(response);
    setIsShowModalOrderSuccess(true);
  };

  // Filter products by search keyword
  useEffect(() => {
    if (Array.isArray(products)) {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(keyword.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData([]);
    }
  }, [products, keyword]);

  // Fetch delivery details when deliveryId changes
  useEffect(() => {
    const fetchDelivery = async () => {
      if (!deliveryId) return;
      
      try {
        const response = await getDelivery(deliveryId);
        setDeliveryData(response?.result);
      } catch (error) {
        notification.error({
          message: "Lỗi khi tải thông tin giao hàng",
          description: error.message || "Đã xảy ra lỗi, vui lòng thử lại sau",
          duration: 3
        });
      }
    };
    
    fetchDelivery();
  }, [deliveryId]);

  // Handle quantity changes
  const handleQuantityChange = (productId, newQuantity, maxStock) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, Math.min(newQuantity, maxStock || 999)),
    }));
  };

  // Handle product selection (checkbox)
  const handleCheckboxChange = (product) => {
    setSelectedProducts((prevSelected) => {
      // If product is already selected, remove it
      if (prevSelected.some((p) => p.id === product.id)) {
        return prevSelected.filter((p) => p.id !== product.id);
      } 
      // Otherwise add it to selected products
      else {
        // Initialize quantity if not already set
        if (!quantities[product.id]) {
          setQuantities(prev => ({
            ...prev,
            [product.id]: 1
          }));
        }
        return [...prevSelected, product];
      }
    });
  };

  // Handle attribute changes (color, size)
  const handleChangeAtt = (key, value) => {
    products.forEach((product) => {
      if (Array.isArray(product?.skus)) {
        product.skus.forEach((sku) => {
          const isMatch = Object.entries({
            ...skuCurrent?.attributes,
            [key]: value,
          }).every(([attrKey, attrValue]) => {
            return sku?.attributes[attrKey] === attrValue;
          });

          if (isMatch) {
            setSkuCurrent(sku);
          }
        });
      }
    });
  };

  // Create order
  const handleSubmitOrder = async () => {
    if (selectedProducts.length === 0) {
      notification.error({ 
        message: "Không có sản phẩm nào được chọn", 
        description: "Vui lòng chọn ít nhất một sản phẩm" 
      });
      return;
    }

    if (!deliveryData) {
      notification.error({ 
        message: "Thiếu thông tin giao hàng", 
        description: "Vui lòng thêm địa chỉ giao hàng" 
      });
      return;
    }

    setLoading(true);

    const orderData = {
      delivery: deliveryData || null,
      payment: {
        method: typePayment,
        amount: selectedProducts.reduce(
          (total, product) => total + product.skus[0].price * (quantities[product.id] || 1),
          0
        ),
      },
      orderDetails: selectedProducts.map((product) => ({
        productId: product.id,
        quantity: quantities[product.id] || 1,
        skuId: product.skus[0]?.id, // Use the first SKU if skuCurrent not set
      })),
      discountValue: 0,
    };

    try {
      const res = await createOrder(orderData);
      notification.success({ 
        message: "Tạo đơn hàng thành công", 
        description: "Đơn hàng của bạn đã được tạo" 
      });
      openFormOrderSuccess(res);
    } catch (error) {
      notification.error({ 
        message: "Lỗi khi tạo đơn hàng", 
        description: error.message || "Đã xảy ra lỗi, vui lòng thử lại sau" 
      });
    } finally {
      setLoading(false);
    }
  };

  // Calculate total amount
  const calculateTotal = () => {
    return selectedProducts.reduce(
      (total, product) => {
        const quantity = quantities[product.id] || 1;
        const price = product.skus[0]?.price || 0;
        return total + (price * quantity);
      }, 
      0
    );
  };

  return (
    <div className="create-order">
      <Row gutter={[16, 16]}>
        {/* Delivery information */}
        <Col xs={24} lg={8}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Card title="Thông tin giao hàng">
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={openFormDelivery}
                block
                size="large"
                style={{ marginBottom: 16 }}
              >
                Thêm địa chỉ giao hàng
              </Button>

              {deliveryData ? (
                <Descriptions bordered column={1} size="small">
                  <Descriptions.Item label="Họ và tên">
                    {deliveryData.username}
                  </Descriptions.Item>
                  {deliveryData.company_name && (
                    <Descriptions.Item label="Công ty">
                      {deliveryData.company_name}
                    </Descriptions.Item>
                  )}
                  <Descriptions.Item label="Số điện thoại">
                    {deliveryData.numberPhone}
                  </Descriptions.Item>
                  <Descriptions.Item label="Địa chỉ">
                    {deliveryData.street}, {deliveryData.ward}, {deliveryData.district}, {deliveryData.city}
                  </Descriptions.Item>
                </Descriptions>
              ) : (
                <Empty 
                  description="Chưa có thông tin giao hàng" 
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              )}
            </Card>

            {selectedProducts.length > 0 && (
              <Card title="Tóm tắt đơn hàng">
                <Descriptions bordered column={1}>
                  <Descriptions.Item label="Tổng số sản phẩm">
                    {selectedProducts.length} sản phẩm
                  </Descriptions.Item>
                  <Descriptions.Item label="Tổng tiền">
                    <Text strong style={{ color: '#f5222d', fontSize: '16px' }}>
                      {formatCurrency(calculateTotal())} đ
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Phương thức thanh toán">
                    Thanh toán khi nhận hàng (COD)
                  </Descriptions.Item>
                </Descriptions>

                <Button
                  type="primary"
                  icon={<ShoppingCartOutlined />}
                  size="large"
                  block
                  style={{ marginTop: 16 }}
                  onClick={handleSubmitOrder}
                  loading={loading}
                  disabled={!deliveryData}
                >
                  Tạo đơn hàng
                </Button>
              </Card>
            )}
          </Space>
        </Col>

        {/* Product list */}
        <Col xs={24} lg={16}>
          <Card title="Danh sách sản phẩm">
            <Search
              placeholder="Tìm kiếm sản phẩm"
              allowClear
              enterButton="Tìm kiếm"
              size="large"
              onSearch={(value) => setKeyword(value)}
              onChange={(e) => setKeyword(e.target.value)}
              style={{ marginBottom: 16 }}
              prefix={<SearchOutlined />}
            />

            <List
              itemLayout="horizontal"
              dataSource={filteredData}
              locale={{ emptyText: "Không tìm thấy sản phẩm" }}
              renderItem={(product) => {
                const quantity = quantities[product.id] || 1;
                
                return (
                  <List.Item
                    key={product.id}
                    actions={[
                      <Space>
                        <Button
                          icon={<MinusOutlined />}
                          onClick={() => handleQuantityChange(product.id, quantity - 1, stock)}
                          disabled={quantity <= 1}
                        />
                        <InputNumber
                          min={1}
                          max={stock}
                          value={quantity}
                          onChange={(value) => handleQuantityChange(product.id, value, stock)}
                          style={{ width: 60 }}
                        />
                        <Button
                          icon={<PlusOutlined />}
                          onClick={() => handleQuantityChange(product.id, quantity + 1, stock)}
                        />
                      </Space>
                    ]}
                  >
                    <Checkbox 
                      checked={selectedProducts.some(p => p.id === product.id)}
                      onChange={() => handleCheckboxChange(product)}
                    />
                    <List.Item.Meta
                      avatar={
                        <Avatar 
                          src={product.skus[0]?.images.split(",")[0]} 
                          size={64}
                          shape="square"
                        />
                      }
                      title={product.name}
                      description={
                        <Space direction="vertical" size="small">
                          <Text strong style={{ color: '#f5222d' }}>
                            {formatCurrency(product.skus[0]?.price || 0)} đ
                          </Text>

                          <Space size="large">
                            {fillUniqueATTSkus(product?.skus, "color").length > 1 && (
                              <Space>
                                <Text strong>Màu:</Text>
                                <Select
                                  style={{ width: 120 }}
                                  placeholder="Chọn màu"
                                  defaultValue={product?.skus[0]?.attributes?.color}
                                  onChange={(value) => handleChangeAtt("color", value)}
                                >
                                  {fillUniqueATTSkus(product.skus, "color").map((el, index) => (
                                    <Option key={index} value={el.attributes.color}>
                                      {el.attributes.color}
                                    </Option>
                                  ))}
                                </Select>
                              </Space>
                            )}

                            {fillUniqueATTSkus(product?.skus, "size").length > 1 && (
                              <Space>
                                <Text strong>Kích thước:</Text>
                                <Select
                                  style={{ width: 120 }}
                                  placeholder="Chọn size"
                                  defaultValue={product?.skus[0]?.attributes?.size}
                                  onChange={(value) => handleChangeAtt("size", value)}
                                >
                                  {fillUniqueATTSkus(product.skus, "size").map((el, index) => (
                                    <Option key={index} value={el.attributes.size}>
                                      {el.attributes.size}
                                    </Option>
                                  ))}
                                </Select>
                              </Space>
                            )}
                          </Space>
                        </Space>
                      }
                    />
                  </List.Item>
                );
              }}
              pagination={{
                pageSize: 5,
                hideOnSinglePage: true
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* Modals */}
      <Modal
        title="Thêm địa chỉ giao hàng"
        open={isShowModal}
        onCancel={() => setIsShowModal(false)}
        footer={null}
        width={900}
        destroyOnClose
      >
        <AddressOrder
          setDeliveryId={setDeliveryId}
          closeModal={() => setIsShowModal(false)}
        />
      </Modal>

      <Modal
        title="Đặt hàng thành công"
        open={isShowModalOrderSuccess}
        onCancel={() => setIsShowModalOrderSuccess(false)}
        footer={null}
        width={600}
        destroyOnClose
      >
        <OrderSuccess
          data={orderSuccess}
          closeModal={() => setIsShowModalOrderSuccess(false)}
        />
      </Modal>
    </div>
  );
};

export default CreateOrder;
