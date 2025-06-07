import React from "react";
import { Typography, Row, Col, Card, Divider, Steps, Button, Badge } from "antd";
import {
  ShoppingOutlined,
  RocketOutlined,
  CustomerServiceOutlined,
  SafetyCertificateOutlined,
  CarOutlined,
  CheckCircleOutlined,
  TeamOutlined
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;

function OurService() {
  const services = [
    {
      icon: <RocketOutlined style={{ fontSize: '32px', color: '#1890ff' }} />,
      title: "Giao Hàng Nhanh Chóng",
      description: "Giao hàng nhanh chóng trong vòng 24h nội thành và 2-3 ngày cho các tỉnh thành khác trên toàn quốc.",
      features: ["Miễn phí giao hàng cho đơn hàng từ 500.000đ", "Theo dõi đơn hàng trực tuyến", "Đối tác giao hàng uy tín"]
    },
    {
      icon: <CustomerServiceOutlined style={{ fontSize: '32px', color: '#52c41a' }} />,
      title: "Tư Vấn Chuyên Nghiệp",
      description: "Đội ngũ tư vấn viên chuyên nghiệp, nhiệt tình hỗ trợ khách hàng lựa chọn sản phẩm phù hợp.",
      features: ["Tư vấn trực tuyến 24/7", "Đội ngũ chuyên viên giàu kinh nghiệm", "Tư vấn cá nhân hóa theo nhu cầu"]
    },
    {
      icon: <ShoppingOutlined style={{ fontSize: '32px', color: '#722ed1' }} />,
      title: "Dịch Vụ Cho Thuê",
      description: "Dịch vụ cho thuê trang phục với nhiều ưu đãi hấp dẫn, phù hợp cho các sự kiện đặc biệt.",
      features: ["Đa dạng mẫu mã", "Giá thuê cạnh tranh", "Bảo quản và vệ sinh chuyên nghiệp"]
    },
    {
      icon: <SafetyCertificateOutlined style={{ fontSize: '32px', color: '#fa8c16' }} />,
      title: "Bảo Hành & Đổi Trả",
      description: "Chính sách bảo hành và đổi trả linh hoạt, bảo vệ quyền lợi khách hàng tối đa.",
      features: ["Đổi trả trong vòng 7 ngày", "Bảo hành sản phẩm lên đến 30 ngày", "Quy trình xử lý nhanh chóng"]
    }
  ];

  const shippingProcess = [
    {
      title: "Đặt hàng",
      description: "Khách hàng đặt hàng trên website hoặc qua hotline"
    },
    {
      title: "Xác nhận",
      description: "Nhân viên liên hệ xác nhận thông tin đơn hàng"
    },
    {
      title: "Đóng gói",
      description: "Sản phẩm được đóng gói cẩn thận, bảo quản đúng tiêu chuẩn"
    },
    {
      title: "Vận chuyển",
      description: "Giao cho đơn vị vận chuyển tin cậy"
    },
    {
      title: "Giao hàng",
      description: "Giao đến tận tay khách hàng"
    }
  ];

  return (
    <div className="service-page bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge.Ribbon text="Premium" color="gold">
            <Title level={1} className="mb-4">Dịch Vụ Của Chúng Tôi</Title>
          </Badge.Ribbon>
          <Paragraph className="text-lg text-gray-600 max-w-3xl mx-auto">
            Chúng tôi cung cấp các dịch vụ chất lượng cao nhằm mang đến cho khách hàng trải nghiệm mua sắm tuyệt vời nhất. Khám phá các dịch vụ độc đáo dưới đây.
          </Paragraph>
        </div>

        {/* Services Overview */}
        <Row gutter={[24, 24]} className="mb-16">
          {services.map((service, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <Card 
                hoverable 
                className="h-full service-card"
                cover={
                  <div className="text-center py-6 bg-gray-50">
                    {service.icon}
                  </div>
                }
              >
                <Title level={4} className="text-center mb-3">{service.title}</Title>
                <Paragraph className="text-gray-600 text-center mb-4">
                  {service.description}
                </Paragraph>
                <Divider dashed />
                <ul className="feature-list pl-0 mb-0">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start mb-2">
                      <CheckCircleOutlined className="mr-2 text-green-500 mt-1" />
                      <Text>{feature}</Text>
                    </li>
                  ))}
                </ul>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Shipping Process */}
        <Card className="shadow-md mb-12">
          <Title level={2} className="mb-8 flex items-center">
            <CarOutlined className="mr-2 text-blue-500" /> Quy Trình Vận Chuyển
          </Title>
          <Steps 
            current={-1}
            className="shipping-steps mb-8"
            responsive
          >
            {shippingProcess.map((step, index) => (
              <Step 
                key={index} 
                title={step.title} 
                description={step.description}
              />
            ))}
          </Steps>

          <div className="flex justify-center">
            <Button type="primary" size="large" icon={<CarOutlined />}>
              Theo Dõi Đơn Hàng
            </Button>
          </div>
        </Card>

        {/* Team Members */}
        <Card className="shadow-md mb-12">
          <Title level={2} className="mb-8 flex items-center">
            <TeamOutlined className="mr-2 text-orange-500" /> Đội Ngũ Chuyên Viên
          </Title>
          <Row gutter={[24, 24]} justify="center">
            <Col xs={24} sm={12} md={8} lg={6}>
              <Card cover={<img alt="Chuyên viên tư vấn" src="https://randomuser.me/api/portraits/women/44.jpg" />}>
                <Card.Meta 
                  title="Nguyễn Thị Hương" 
                  description="Trưởng phòng chăm sóc khách hàng" 
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Card cover={<img alt="Chuyên viên tư vấn" src="https://randomuser.me/api/portraits/men/32.jpg" />}>
                <Card.Meta 
                  title="Trần Minh Quân" 
                  description="Chuyên viên tư vấn sản phẩm" 
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Card cover={<img alt="Chuyên viên tư vấn" src="https://randomuser.me/api/portraits/women/68.jpg" />}>
                <Card.Meta 
                  title="Phạm Thu Trang" 
                  description="Chuyên viên hỗ trợ đặt hàng" 
                />
              </Card>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
}

export default OurService;
