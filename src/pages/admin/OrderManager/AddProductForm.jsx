import React, { useEffect, useState } from "react";
import { 
  Input, 
  notification, 
  Card, 
  Typography, 
  Button, 
  Space, 
  Row, 
  Col, 
  Carousel, 
  Tag, 
  Rate, 
  Badge, 
  Divider, 
  InputNumber,
  Image 
} from "antd";
import { 
  ShoppingCartOutlined, 
  MinusOutlined, 
  PlusOutlined, 
  InfoCircleOutlined 
} from "@ant-design/icons";
import { fillUniqueATTSkus, formatCurrency } from "utils/helper";
import DOMPurify from "dompurify";
import withBaseComponent from "hocs";
import { useDispatch } from "react-redux";
import { changeLoading } from "store/slicers/common.slicer";
import { createOrderDetail } from "apis/order.api";
import { useParams } from "react-router-dom";
import logo from "assets/logo.png";

const { Title, Text, Paragraph } = Typography;

function AddProductForm({ data, checkLoginBeforeAction, closeModal }) {
  const [selectedATT, setSelectedATT] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [selectedSku, setSelectedSku] = useState(0);
  const [price, setPrice] = useState(data.skus[0].price);
  const [stock, setStock] = useState(999);
  const totalPrice = quantity * price;
  const { orderId } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    let stockCal = data?.skus.reduce((acc, sku, index) => {
      const isMatch = Object.entries(selectedATT).every(([key, value]) => {
        return sku?.attributes[key] === value;
      });

      if (isMatch) {
        setSelectedSku(index);
        acc += sku?.stock;
      }
      return acc;
    }, 0);
    
    setStock(stockCal);
  }, [selectedATT, data?.skus]);

  useEffect(() => {
    if (data?.skus[0]?.attributes) {
      setSelectedATT(data?.skus[0]?.attributes);
    }
  }, [data]);

  const handleSelectAttSku = (key, value) => {
    setSelectedATT((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddCart = async () => {
    dispatch(changeLoading());
    const dataOrderDetail = {
      quantity,
      orderId: orderId,
      productId: data.id,
      skuId: data.skus[selectedSku].id,
      price,
    };
    
    try {
      await createOrderDetail(dataOrderDetail);
      notification.success({ 
        message: "Thành công", 
        description: "Đã thêm sản phẩm vào đơn hàng" 
      });
      closeModal();
    } catch (error) {
      notification.error({ 
        message: "Lỗi", 
        description: error.message || "Không thể thêm sản phẩm vào đơn hàng" 
      });
    }
    
    dispatch(changeLoading());
  };

  const handleIncreaseQuantity = () => {
    setQuantity(prev => prev < stock ? prev + 1 : prev);
  };

  const handleDecreaseQuantity = () => {
    setQuantity(prev => prev > 1 ? prev - 1 : 1);
  };

  const handleQuantityChange = (value) => {
    if (!value) {
      setQuantity(1);
      return;
    }
    
    const newQuantity = parseInt(value);
    if (isNaN(newQuantity)) {
      return;
    }
    
    setQuantity(newQuantity > stock ? stock : newQuantity);
  };

  // Xử lý hiển thị hình ảnh
  const imageUrls = data?.skus[selectedSku]?.images?.split(",") || [];
  
  // Danh sách màu sắc và kích thước
  const uniqueColors = fillUniqueATTSkus(data?.skus, "color");
  const uniqueSizes = fillUniqueATTSkus(data?.skus, "size");

  return (
    <Card>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Space>
            <img src={logo} alt="Logo" style={{ height: 32 }} />
            <Title level={4} style={{ margin: 0 }}>Thêm sản phẩm vào đơn hàng</Title>
          </Space>
        </div>

        <Row gutter={16}>
          {/* Phần hình ảnh sản phẩm */}
          <Col xs={24} sm={24} md={12}>
            <Card bordered={false}>
              {imageUrls.length > 1 ? (
                <Carousel autoplay>
                  {imageUrls.map((img, index) => (
                    <div key={index}>
                      <Image
                        src={img}
                        alt={`Product ${index + 1}`}
                        style={{ width: '100%', height: '300px', objectFit: 'contain' }}
                      />
                    </div>
                  ))}
                </Carousel>
              ) : (
                <Image
                  src={data?.skus[selectedSku]?.images}
                  alt="Product"
                  style={{ width: '100%', height: '300px', objectFit: 'contain' }}
                />
              )}
            </Card>
          </Col>

          {/* Phần thông tin sản phẩm */}
          <Col xs={24} sm={24} md={12}>
            <Card bordered={false}>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <Title level={4}>{data.name}</Title>
                
                <Space align="center">
                  <Rate allowHalf defaultValue={data?.stars || 5} disabled />
                  {data?.totalSold > 0 && (
                    <Badge count={data?.totalSold} overflowCount={9999}>
                      <Text type="secondary">Đã bán</Text>
                    </Badge>
                  )}
                  <Text type="success" strong>
                    Còn lại: {stock}
                  </Text>
                </Space>

                {/* Màu sắc */}
                {uniqueColors.length > 0 && (
                  <div>
                    <Text strong>Màu sắc:</Text>
                    <div style={{ marginTop: 8 }}>
                      <Space wrap>
                        {uniqueColors.map((el, index) => (
                          <Tag
                            key={index}
                            color={selectedATT["color"] === el.attributes.color ? "blue" : "default"}
                            style={{ 
                              cursor: 'pointer',
                              padding: '4px 8px'
                            }}
                            onClick={() => handleSelectAttSku("color", el.attributes.color)}
                          >
                            {el.attributes.color}
                          </Tag>
                        ))}
                      </Space>
                    </div>
                  </div>
                )}

                {/* Kích thước */}
                {uniqueSizes.length > 0 && (
                  <div>
                    <Text strong>Kích thước:</Text>
                    <div style={{ marginTop: 8 }}>
                      <Space wrap>
                        {uniqueSizes.map((el, index) => (
                          <Tag
                            key={index}
                            color={selectedATT["size"] === el.attributes.size ? "blue" : "default"}
                            style={{ 
                              cursor: 'pointer',
                              padding: '4px 8px'
                            }}
                            onClick={() => handleSelectAttSku("size", el.attributes.size)}
                          >
                            {el.attributes.size}
                          </Tag>
                        ))}
                      </Space>
                    </div>
                  </div>
                )}

                <Divider />

                {/* Mô tả sản phẩm */}
                <div>
                  <Text strong>
                    <InfoCircleOutlined /> Mô tả sản phẩm
                  </Text>
                  <div 
                    style={{ 
                      maxHeight: '120px', 
                      overflowY: 'auto',
                      padding: '8px',
                      marginTop: '8px',
                      background: '#f5f5f5',
                      borderRadius: '4px'
                    }}
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(data?.description || 'Không có mô tả'),
                    }}
                  />
                </div>

                <Divider />

                {/* Số lượng và giá */}
                <div>
                  <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text strong>Số lượng:</Text>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Button 
                          icon={<MinusOutlined />} 
                          onClick={handleDecreaseQuantity}
                          disabled={quantity <= 1}
                        />
                        <InputNumber
                          min={1}
                          max={stock}
                          value={quantity}
                          onChange={handleQuantityChange}
                          style={{ width: '60px', margin: '0 8px' }}
                        />
                        <Button 
                          icon={<PlusOutlined />} 
                          onClick={handleIncreaseQuantity}
                          disabled={quantity >= stock}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text strong>Tổng tiền:</Text>
                      <Text style={{ fontSize: '18px', color: '#f5222d', fontWeight: 'bold' }}>
                        {totalPrice ? formatCurrency(`${totalPrice}`) : "Liên hệ"} VNĐ
                      </Text>
                    </div>
                  </Space>
                </div>

                <Button 
                  type="primary" 
                  icon={<ShoppingCartOutlined />} 
                  size="large" 
                  block
                  onClick={() => checkLoginBeforeAction ? checkLoginBeforeAction(handleAddCart) : handleAddCart()}
                >
                  Thêm vào đơn hàng
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>
      </Space>
    </Card>
  );
}

export default withBaseComponent(AddProductForm);
