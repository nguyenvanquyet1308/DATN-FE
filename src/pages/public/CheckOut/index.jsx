import React, { useState } from "react";
import {
  Row,
  Col,
  Card,
  Typography,
  Form,
  Input,
  Button,
  Divider,
  Steps,
  Space,
  Badge,
  List,
  Avatar,
  InputNumber,
  Tag,
} from "antd";
import {
  ShoppingOutlined,
  CreditCardOutlined,
  CheckCircleOutlined,
  UserOutlined,
  HomeOutlined,
  PhoneOutlined,
  MailOutlined,
  ShoppingCartOutlined,
  ArrowLeftOutlined,
  RightOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const products = [
  {
    id: 1,
    name: "Split Sneakers",
    size: 37,
    quantity: 2,
    totalPrice: 40,
    image: "https://readymadeui.com/images/product10.webp",
  },
  {
    id: 2,
    name: "Velvet Boots",
    size: 37,
    quantity: 2,
    totalPrice: 40,
    image: "https://readymadeui.com/images/product11.webp",
  },
  {
    id: 3,
    name: "Echo Elegance",
    size: 37,
    quantity: 2,
    totalPrice: 40,
    image: "https://readymadeui.com/images/product14.webp",
  },
  {
    id: 4,
    name: "Pumps",
    size: 37,
    quantity: 2,
    totalPrice: 40,
    image: "https://readymadeui.com/images/product13.webp",
  },
  {
    id: 4,
    name: "Pumps",
    size: 37,
    quantity: 2,
    totalPrice: 40,
    image: "https://readymadeui.com/images/product13.webp",
  },
  {
    id: 4,
    name: "Pumps",
    size: 37,
    quantity: 2,
    totalPrice: 40,
    image: "https://readymadeui.com/images/product13.webp",
  },
  {
    id: 4,
    name: "Pumps",
    size: 37,
    quantity: 2,
    totalPrice: 40,
    image: "https://readymadeui.com/images/product13.webp",
  },
];

const CheckOut = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalAmount = products.reduce((acc, product) => acc + product.totalPrice, 0);
  
  return (
    <div className="checkout-container bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Checkout Steps */}
        <Card className="mb-6" bordered={false}>
          <Steps
            current={currentStep}
            items={[
              {
                title: "Giỏ hàng",
                icon: <ShoppingOutlined />,
              },
              {
                title: "Thanh toán",
                icon: <CreditCardOutlined />,
              },
              {
                title: "Hoàn tất",
                icon: <CheckCircleOutlined />,
              },
            ]}
          />
        </Card>

        <Row gutter={[24, 24]}>
          {/* Order Summary */}
          <Col xs={24} lg={8} order={{ xs: 2, lg: 1 }}>
            <Card
              title={
                <div className="flex items-center justify-between">
                  <span>Đơn hàng của bạn</span>
                  <Badge count={products.length} showZero color="#108ee9" />
                </div>
              }
              bordered={false}
              className="order-summary h-full sticky top-6"
              bodyStyle={{ 
                maxHeight: "calc(100vh - 220px)",
                overflowY: "auto",
                padding: "16px"
              }}
            >
              <List
                itemLayout="horizontal"
                dataSource={products}
                renderItem={(item) => (
                  <List.Item 
                    key={item.id}
                    className="py-2 hover:bg-gray-50 transition-all duration-300"
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar 
                          shape="square" 
                          size={64} 
                          src={item.image}
                          className="bg-gray-100 p-1"
                        />
                      }
                      title={item.name}
                      description={
                        <Space direction="vertical" size={0}>
                          <Text type="secondary">Size: {item.size}</Text>
                          <div className="flex justify-between">
                            <Text>SL: {item.quantity}</Text>
                            <Text strong>${item.totalPrice}</Text>
                          </div>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
              
              <Divider />
              
              <div className="summary-footer">
                <div className="flex justify-between mb-2">
                  <Text>Tạm tính:</Text>
                  <Text>${totalAmount}</Text>
                </div>
                <div className="flex justify-between mb-2">
                  <Text>Phí vận chuyển:</Text>
                  <Text>$0</Text>
                </div>
                <Divider className="my-2" />
                <div className="flex justify-between">
                  <Text strong>Tổng tiền:</Text>
                  <Text strong className="text-xl text-red-500">${totalAmount}</Text>
                </div>
                
                <div className="mt-4">
                  <Tag color="green" icon={<SafetyCertificateOutlined />} className="mb-2">Bảo mật thanh toán</Tag>
                  <Tag color="blue" icon={<SafetyCertificateOutlined />}>Giao hàng nhanh</Tag>
                </div>
              </div>
            </Card>
          </Col>

          {/* Checkout Form */}
          <Col xs={24} lg={16} order={{ xs: 1, lg: 2 }}>
            <Card bordered={false} className="checkout-form">
              <Title level={3} className="mb-6">Thông tin thanh toán</Title>
              
              <Form layout="vertical">
                <Title level={4} className="mb-4">
                  <UserOutlined className="mr-2" />
                  Thông tin cá nhân
                </Title>
                
                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item 
                      label="Họ" 
                      name="firstName"
                      rules={[{ required: true, message: 'Vui lòng nhập họ!' }]}
                    >
                      <Input 
                        placeholder="Nhập họ" 
                        size="large"
                        prefix={<UserOutlined className="text-gray-400" />}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item 
                      label="Tên" 
                      name="lastName"
                      rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
                    >
                      <Input 
                        placeholder="Nhập tên" 
                        size="large" 
                        prefix={<UserOutlined className="text-gray-400" />}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                
                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item 
                      label="Email" 
                      name="email"
                      rules={[
                        { required: true, message: 'Vui lòng nhập email!' },
                        { type: 'email', message: 'Email không hợp lệ!' }
                      ]}
                    >
                      <Input 
                        placeholder="example@email.com" 
                        size="large"
                        prefix={<MailOutlined className="text-gray-400" />}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item 
                      label="Số điện thoại" 
                      name="phone"
                      rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                    >
                      <Input 
                        placeholder="Nhập số điện thoại" 
                        size="large"
                        prefix={<PhoneOutlined className="text-gray-400" />}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                
                <Divider />
                
                <Title level={4} className="mb-4">
                  <HomeOutlined className="mr-2" />
                  Địa chỉ giao hàng
                </Title>
                
                <Form.Item 
                  label="Địa chỉ" 
                  name="address"
                  rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                >
                  <Input 
                    placeholder="Số nhà, tên đường" 
                    size="large"
                    prefix={<HomeOutlined className="text-gray-400" />}
                  />
                </Form.Item>
                
                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item 
                      label="Thành phố" 
                      name="city"
                      rules={[{ required: true, message: 'Vui lòng nhập thành phố!' }]}
                    >
                      <Input placeholder="Thành phố" size="large" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item 
                      label="Tỉnh/Thành" 
                      name="state"
                      rules={[{ required: true, message: 'Vui lòng nhập tỉnh/thành!' }]}
                    >
                      <Input placeholder="Tỉnh/Thành" size="large" />
                    </Form.Item>
                  </Col>
                </Row>
                
                <Divider />
                
                <div className="flex justify-between mt-8">
                  <Button 
                    icon={<ArrowLeftOutlined />}
                    size="large"
                    className="flex items-center"
                  >
                    Quay lại
                  </Button>
                  
                  <Button 
                    type="primary" 
                    size="large"
                    icon={<RightOutlined />}
                    className="flex items-center"
                  >
                    Tiếp tục
                  </Button>
                </div>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default CheckOut;
