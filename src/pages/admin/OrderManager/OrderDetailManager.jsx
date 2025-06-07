import React, { useEffect, useState, useCallback } from "react";
import { 
  Card, 
  notification, 
  Select, 
  Button, 
  Modal, 
  Typography, 
  Divider, 
  Space, 
  Row, 
  Col, 
  Tag, 
  InputNumber,
  Descriptions,
  Image,
  Avatar,
  Steps,
  Breadcrumb
} from "antd";
import { 
  ArrowLeftOutlined, 
  DeleteOutlined, 
  PlusOutlined, 
  MinusOutlined,
  ShoppingOutlined,
  UserOutlined,
  CheckCircleOutlined,
  CreditCardOutlined
} from "@ant-design/icons";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import moment from "moment";
import {
  deleteOrderDetail,
  getAllStatusOrder,
  getOrderById,
  updateOrder,
} from "apis/order.api";
import { changeLoading } from "store/slicers/common.slicer";
import { formatCurrency } from "utils/formatCurrency";
import { fillUniqueATTSkus } from "utils/helper";
import paths from "constant/paths";
import ShowProductInOrder from "./ShowProductInOrder";

const { Title, Text } = Typography;
const { Option } = Select;
const { Step } = Steps;

function OrderDetailManager() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [order, setOrder] = useState(null);
  const [quantity, setQuantity] = useState([]);
  const [statusOrder, setStatusOrder] = useState([]);
  const [selectedStatusOrder, setSelectedStatusOrder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Mapping of status to Step status and colors
  const statusConfig = {
    UNPAID: { color: '#ff4d4f', text: 'Chưa thanh toán', stepStatus: 'wait' },
    PENDING: { color: '#faad14', text: 'Chờ xác nhận', stepStatus: 'process' },
    CONFIRMED: { color: '#1890ff', text: 'Đã xác nhận', stepStatus: 'process' },
    SHIPPED: { color: '#722ed1', text: 'Đang giao hàng', stepStatus: 'process' },
    CANCELLED: { color: '#f5222d', text: 'Đã hủy', stepStatus: 'error' },
    DELIVERED: { color: '#52c41a', text: 'Đã giao hàng', stepStatus: 'finish' }
  };

  // Helper function to get payment method text
  const getPaymentMethodText = (method) => {
    switch (method) {
      case "CreditCard": return "Thanh toán bằng thẻ tín dụng";
      case "PayPal": return "Thanh toán bằng PayPal";
      case "VNPay": return "Thanh toán bằng VNPay";
      case "COD": return "Thanh toán bằng tiền mặt";
      default: return "Không xác định";
    }
  };

  // Modal handlers
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    fetchOrderDetail();
  };

  // CRUD Operations
  const fetchOrderDetail = async () => {
    dispatch(changeLoading());
    try {
      const res = await getOrderById(orderId);
      const quantities = res?.result?.orderDetails.map(item => item.quantity);
      setQuantity(quantities);
      setOrder(res?.result);
    } catch (error) {
      notification.error({
        message: "Lỗi khi tải đơn hàng",
        description: error.message || "Đã xảy ra lỗi, vui lòng thử lại sau"
      });
    }
    dispatch(changeLoading());
  };

  const getStatusOrder = async () => {
    try {
      const res = await getAllStatusOrder();
      setStatusOrder(res || []);
    } catch (error) {
      notification.error({
        message: "Lỗi khi tải trạng thái đơn hàng",
        description: error.message || "Đã xảy ra lỗi, vui lòng thử lại sau"
      });
    }
  };

  const handleDelete = async (id) => {
    dispatch(changeLoading());
    try {
      await deleteOrderDetail(id);
      notification.success({ 
        message: "Xóa thành công", 
        description: "Đã xóa sản phẩm khỏi đơn hàng" 
      });
      fetchOrderDetail();
    } catch (error) {
      notification.error({
        message: "Lỗi khi xóa sản phẩm",
        description: error.message || "Đã xảy ra lỗi, vui lòng thử lại sau"
      });
    }
    dispatch(changeLoading());
  };

  const handleUpdateStatus = useCallback(async () => {
    dispatch(changeLoading());
    try {
      if (orderId && selectedStatusOrder) {
        const requestData = { status: selectedStatusOrder };
        await updateOrder(orderId, requestData);
        notification.success({ 
          message: "Cập nhật thành công", 
          description: "Trạng thái đơn hàng đã được cập nhật" 
        });
        setOrder(prevOrder => ({
          ...prevOrder,
          status: selectedStatusOrder
        }));
      }
    } catch (error) {
      notification.error({ 
        message: "Cập nhật thất bại", 
        description: error.message || "Không thể cập nhật trạng thái đơn hàng" 
      });
    }
    dispatch(changeLoading());
  }, [orderId, selectedStatusOrder, dispatch]);

  const updateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) {
      notification.error({ 
        message: "Số lượng không hợp lệ", 
        description: "Số lượng phải lớn hơn 0" 
      });
      return;
    }
    
    setOrder(prevOrder => {
      const updatedOrderDetails = [...prevOrder.orderDetails];
      updatedOrderDetails[index].quantity = newQuantity;
      
      return {
        ...prevOrder,
        orderDetails: updatedOrderDetails
      };
    });
    
    handleUpdateOrderDetails(index, newQuantity);
  };

  const handleUpdateOrderDetails = async (index, newQuantity) => {
    dispatch(changeLoading());
    
    try {
      const updatedOrderDetails = order.orderDetails.map((detail, idx) => {
        if (!detail.id || !detail.product?.id || !detail.sku?.id) {
          throw new Error("Thông tin sản phẩm không đầy đủ");
        }
        
        return {
          id: detail?.id,
          productId: detail?.product?.id,
          skuid: detail?.sku?.id,
          quantity: idx === index ? newQuantity : detail?.quantity
        };
      });
      
      const payload = {
        totalAmount: order?.total_amount,
        status: order?.status,
        deliveryId: order?.delivery?.id,
        orderDetails: updatedOrderDetails
      };
      
      await updateOrder(orderId, payload);
      notification.success({ 
        message: "Cập nhật thành công", 
        description: "Đã cập nhật số lượng sản phẩm" 
      });
      fetchOrderDetail();
    } catch (error) {
      notification.error({ 
        message: "Cập nhật thất bại", 
        description: error.message || "Không thể cập nhật thông tin đơn hàng" 
      });
    }
    
    dispatch(changeLoading());
  };

  const handleChangeAtt = (key, value, index) => {
    dispatch(changeLoading());
    
    const updatedOrderDetails = [...order.orderDetails];
    const matchingSku = updatedOrderDetails[index]?.product?.skus.find(sku => 
      Object.entries({
        ...updatedOrderDetails[index]?.sku?.attributes,
        [key]: value
      }).every(([attrKey, attrValue]) => 
        sku.attributes[attrKey] === attrValue
      )
    );
    
    if (matchingSku) {
      updatedOrderDetails[index].sku = matchingSku;
      setOrder(prevOrder => ({
        ...prevOrder,
        orderDetails: updatedOrderDetails
      }));
      handleUpdateOrderDetails(index);
    } else {
      notification.error({ 
        message: "Lỗi cập nhật", 
        description: "Không tìm thấy SKU phù hợp" 
      });
    }
    
    dispatch(changeLoading());
  };

  // Initial data loading
  useEffect(() => {
    fetchOrderDetail();
    getStatusOrder();
  }, [orderId]);

  useEffect(() => {
    if (order) {
      setSelectedStatusOrder(order.status);
    }
  }, [order]);

  // Get current status index for Steps component
  const getCurrentStatusIndex = () => {
    if (!order?.status || !statusOrder.length) return 0;
    return statusOrder.findIndex(status => status === order.status) || 0;
  };

  // Loading state
  if (!order) {
    return (
      <Card loading={true} />
    );
  }

  return (
    <div className="order-detail-manager">
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Breadcrumb
            items={[
              {
                title: (
                  <Link to={paths.ADMIN.ORDER_MANAGEMENT}>
                    <Space>
                      <ArrowLeftOutlined />
                      <span>Quản lý đơn hàng</span>
                    </Space>
                  </Link>
                ),
              },
              {
                title: `Đơn hàng #${order?.id}`,
              },
            ]}
          />
        </Col>

        {/* Main content */}
        <Col xs={24} md={17}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Card>
              <Space style={{ width: "100%" }} direction="vertical">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <Title level={4}>Đơn hàng #{order?.id}</Title>
                    <Text type="secondary">
                      Thời gian: {order?.createdAt ? moment(order.createdAt).format("DD/MM/YYYY HH:mm") : "N/A"}
                    </Text>
                  </div>
                  
                  {order?.status === "PENDING" && (
                    <Button 
                      type="primary" 
                      icon={<PlusOutlined />} 
                      onClick={showModal}
                    >
                      Thêm sản phẩm
                    </Button>
                  )}
                </div>
                
                <Modal
                  title="Thêm sản phẩm vào đơn hàng"
                  open={isModalVisible}
                  onCancel={handleCancel}
                  footer={null}
                  width="80%"
                  destroyOnClose
                >
                  <ShowProductInOrder />
                </Modal>
              </Space>
            </Card>

            {/* Product list */}
            {order?.orderDetails.map((orderDetail, index) => (
              <Card key={index}>
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <Title level={5}>Sản phẩm</Title>
                  
                  <div style={{ display: "flex", gap: "16px" }}>
                    <Image
                      src={orderDetail?.sku?.images?.split(",")[0]}
                      alt={orderDetail.productName}
                      width={80}
                      height={80}
                      style={{ objectFit: "cover" }}
                    />
                    
                    <Space direction="vertical" style={{ flex: 1 }}>
                      <Text strong>{orderDetail?.productName}</Text>
                      
                      <Row gutter={16}>
                        {fillUniqueATTSkus(orderDetail?.product?.skus, "color").length > 1 && (
                          <Col>
                            <Space>
                              <Text strong>Màu:</Text>
                              <Select
                                style={{ width: 120 }}
                                value={orderDetail?.sku?.attributes["color"]}
                                onChange={(value) => handleChangeAtt("color", value, index)}
                                disabled={order?.status !== "PENDING"}
                              >
                                {fillUniqueATTSkus(orderDetail?.product.skus, "color").map((el, idx) => (
                                  <Option key={idx} value={el.attributes.color}>
                                    {el.attributes.color}
                                  </Option>
                                ))}
                              </Select>
                            </Space>
                          </Col>
                        )}
                        
                        {fillUniqueATTSkus(orderDetail?.product?.skus, "size").length > 1 && (
                          <Col>
                            <Space>
                              <Text strong>Kích thước:</Text>
                              <Select
                                style={{ width: 120 }}
                                value={orderDetail?.sku?.attributes["size"]}
                                onChange={(value) => handleChangeAtt("size", value, index)}
                                disabled={order?.status !== "PENDING"}
                              >
                                {fillUniqueATTSkus(orderDetail?.product.skus, "size").map((el, idx) => (
                                  <Option key={idx} value={el.attributes.size}>
                                    {el.attributes.size}
                                  </Option>
                                ))}
                              </Select>
                            </Space>
                          </Col>
                        )}
                        
                        <Col>
                          <Space>
                            <Text strong>Số lượng:</Text>
                            <div style={{ display: "flex", alignItems: "center" }}>
                              <Button 
                                icon={<MinusOutlined />} 
                                onClick={() => updateQuantity(index, quantity[index] - 1)}
                                disabled={order?.status !== "PENDING" || quantity[index] <= 1}
                                size="small"
                              />
                              <InputNumber
                                min={1}
                                style={{ width: 60, margin: "0 8px" }}
                                value={quantity[index]}
                                onChange={(value) => updateQuantity(index, Number(value))}
                                disabled={order?.status !== "PENDING"}
                                size="small"
                              />
                              <Button 
                                icon={<PlusOutlined />} 
                                onClick={() => updateQuantity(index, quantity[index] + 1)}
                                disabled={order?.status !== "PENDING"}
                                size="small"
                              />
                            </div>
                          </Space>
                        </Col>
                      </Row>
                      
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
                        <Text strong style={{ color: "#f5222d" }}>
                          {formatCurrency(orderDetail?.sku?.price * quantity[index])}
                        </Text>
                        
                        {order?.status === "PENDING" && (
                          <Button 
                            danger 
                            type="primary" 
                            icon={<DeleteOutlined />} 
                            onClick={() => handleDelete(orderDetail?.id)}
                          >
                            Xóa
                          </Button>
                        )}
                      </div>
                    </Space>
                  </div>
                </Space>
              </Card>
            ))}

            {/* Order summary */}
            <Card title="Thông tin đơn hàng">
              <Descriptions bordered column={1}>
                <Descriptions.Item label="Tổng tiền sản phẩm">
                  <Text strong style={{ color: "#f5222d" }}>
                    {formatCurrency(order?.total_amount)}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="Giảm giá">0 đ</Descriptions.Item>
                <Descriptions.Item label="Phí vận chuyển">25.000 đ</Descriptions.Item>
                <Descriptions.Item label="Phương thức thanh toán">
                  <Tag icon={<CreditCardOutlined />} color="blue">
                    {getPaymentMethodText(order?.payment?.method)}
                  </Tag>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Shipping info */}
            <Card 
              title={
                <Space>
                  <ShoppingOutlined />
                  <span>Thông tin vận chuyển</span>
                </Space>
              }
            >
              <Descriptions bordered column={1}>
                <Descriptions.Item label="Phương thức vận chuyển">
                  <Tag color="green">Giao hàng nhanh</Tag>
                  <div>Phí vận chuyển: 25.000 đ | Thời gian: 1-2 ngày</div>
                </Descriptions.Item>
                <Descriptions.Item label="Người nhận">{order?.delivery?.username}</Descriptions.Item>
                <Descriptions.Item label="Địa chỉ">
                  {order?.delivery?.street}, {order?.delivery?.district}, {order?.delivery?.city}
                </Descriptions.Item>
                <Descriptions.Item label="Số điện thoại">{order?.delivery?.numberPhone}</Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Customer info */}
            <Card 
              title={
                <Space>
                  <UserOutlined />
                  <span>Thông tin khách hàng</span>
                </Space>
              }
            >
              <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
                <Avatar size={64} icon={<UserOutlined />} />
                <div style={{ marginLeft: 16 }}>
                  <Text strong style={{ fontSize: 16 }}>{order?.user?.username}</Text>
                  <div>
                    <Text type="secondary">10 đơn đặt hàng trước đó</Text>
                  </div>
                </div>
              </div>
              
              <Descriptions bordered column={1}>
                <Descriptions.Item label="Email">{order?.user?.email}</Descriptions.Item>
                <Descriptions.Item label="Số điện thoại">{order?.user?.phone_number}</Descriptions.Item>
              </Descriptions>
            </Card>
          </Space>
        </Col>

        {/* Sidebar */}
        <Col xs={24} md={7}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* Status update */}
            <Card title="Cập nhật trạng thái">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Select
                  style={{ width: '100%' }}
                  value={selectedStatusOrder}
                  onChange={(value) => setSelectedStatusOrder(value)}
                >
                  {statusOrder?.map((status) => (
                    <Option key={status} value={status}>
                      <Tag 
                        color={statusConfig[status]?.color || 'default'}
                      >
                        {statusConfig[status]?.text || status}
                      </Tag>
                    </Option>
                  ))}
                </Select>
                
                <Button 
                  type="primary" 
                  icon={<CheckCircleOutlined />} 
                  style={{ marginTop: 16 }} 
                  onClick={handleUpdateStatus}
                  block
                >
                  Cập nhật trạng thái
                </Button>
              </Space>
            </Card>
            
            {/* Status timeline */}
            <Card title="Tiến trình đơn hàng">
              <Steps
                direction="vertical"
                current={getCurrentStatusIndex()}
                items={statusOrder.map(status => ({
                  title: statusConfig[status]?.text || status,
                  status: status === order.status 
                    ? 'process' 
                    : statusOrder.indexOf(status) < statusOrder.indexOf(order.status)
                      ? 'finish'
                      : 'wait'
                }))}
              />
            </Card>
          </Space>
        </Col>
      </Row>
    </div>
  );
}

export default OrderDetailManager;
