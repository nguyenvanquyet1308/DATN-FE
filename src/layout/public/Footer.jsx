import React from "react";
import { Link } from "react-router-dom";
import { Layout, Row, Col, Typography, Divider, Input, Button, Space, List, Avatar } from "antd";
import {
  FacebookOutlined,
  InstagramOutlined,
  LinkedinOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  SendOutlined,
  HeartOutlined,
  RightOutlined
} from '@ant-design/icons';
import footerLogo from "assets/logo.png";

const { Footer: AntFooter } = Layout;
const { Title, Text, Paragraph } = Typography;

const footerLinks = [
  { title: "Trang chủ", link: "/" },
  { title: "Sản phẩm", link: "/products" },
  { title: "Giới thiệu", link: "/introduce" },
  { title: "Liên hệ", link: "/contact" },
  { title: "Tin tức", link: "/blogs" },
  { title: "Câu hỏi thường gặp", link: "/fqa" },
];

const quickLinks = [
  { title: "Chính sách đổi trả", link: "/return-policy" },
  { title: "Chính sách bảo mật", link: "/privacy-policy" },
  { title: "Điều khoản dịch vụ", link: "/terms-of-service" },
  { title: "Phương thức thanh toán", link: "/payment-methods" },
];

const Footer = () => {
  return (
    <AntFooter className="bg-gray-900 text-gray-300 pt-12 pb-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Row gutter={[24, 36]}>
          {/* Company Information */}
          <Col xs={24} sm={24} md={8} lg={8}>
            <div className="flex items-center mb-4 transform transition-transform duration-300 hover:translate-x-1">
              <img src={footerLogo} alt="Fashion Shop" className="w-10 h-10 mr-3" />
              <Title level={3} className="text-white m-0">Fashion Shop</Title>
            </div>
            <Paragraph className="text-gray-400 mb-6">
              Chào mừng đến với Fashion Shop - điểm đến lý tưởng cho những tín
              đồ yêu thích thời trang! Tại đây, chúng tôi cung cấp một bộ sưu
              tập đa dạng các sản phẩm thời trang từ trang phục, giày dép đến
              phụ kiện, phù hợp với mọi phong cách và dịp.
            </Paragraph>
            
            <Title level={5} className="text-white mb-4">Nhận thông báo</Title>
            <div className="flex mb-6">
              <Input 
                placeholder="Email của bạn" 
                className="rounded-l-md rounded-r-none border-gray-700 bg-gray-800 text-gray-300"
              />
              <Button 
                type="primary" 
                icon={<SendOutlined />} 
                className="rounded-r-md rounded-l-none border-0 bg-blue-500 hover:bg-blue-600"
              />
            </div>
            
            <Space className="mb-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <FacebookOutlined className="text-2xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <InstagramOutlined className="text-2xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <LinkedinOutlined className="text-2xl" />
              </a>
            </Space>
          </Col>
          
          {/* Navigation Links */}
          <Col xs={24} sm={12} md={8} lg={8}>
            <Title level={4} className="text-white mb-4">Liên kết nhanh</Title>
            <Row gutter={[16, 0]}>
              <Col span={12}>
                <List
                  dataSource={footerLinks}
                  renderItem={item => (
                    <List.Item className="border-0 p-0 mb-3">
                      <Link 
                        to={item.link} 
                        className="text-gray-400 hover:text-white flex items-center transition-all duration-300 hover:translate-x-1"
                      >
                        <RightOutlined className="mr-2 text-xs" />
                        {item.title}
                      </Link>
                    </List.Item>
                  )}
                />
              </Col>
              <Col span={12}>
                <List
                  dataSource={quickLinks}
                  renderItem={item => (
                    <List.Item className="border-0 p-0 mb-3">
                      <Link 
                        to={item.link} 
                        className="text-gray-400 hover:text-white flex items-center transition-all duration-300 hover:translate-x-1"
                      >
                        <RightOutlined className="mr-2 text-xs" />
                        {item.title}
                      </Link>
                    </List.Item>
                  )}
                />
              </Col>
            </Row>
          </Col>
          
          {/* Contact Information */}
          <Col xs={24} sm={12} md={8} lg={8}>
            <Title level={4} className="text-white mb-4">Liên hệ với chúng tôi</Title>
            <List
              itemLayout="horizontal"
              dataSource={[
                {
                  icon: <EnvironmentOutlined />,
                  title: "Địa chỉ",
                  description: "Liên chiểu, TP Đà Nẵng"
                },
                {
                  icon: <PhoneOutlined />,
                  title: "Điện thoại",
                  description: "+84 345 204 733"
                },
                {
                  icon: <MailOutlined />,
                  title: "Email",
                  description: "info@fashionshop.com"
                }
              ]}
              renderItem={item => (
                <List.Item className="border-0 px-0 py-2">
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        icon={item.icon} 
                        className="bg-blue-500 flex items-center justify-center"
                      />
                    }
                    title={<Text className="text-gray-300">{item.title}</Text>}
                    description={<Text className="text-gray-400">{item.description}</Text>}
                  />
                </List.Item>
              )}
            />
          </Col>
        </Row>
        
        <Divider className="bg-gray-800 my-6" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <Text className="text-gray-400 mb-2 md:mb-0">
            &copy; {new Date().getFullYear()} Fashion Shop. Tất cả các quyền được bảo lưu.
          </Text>
          <Text className="text-gray-400 flex items-center">
            Thiết kế với <HeartOutlined className="text-red-500 mx-1" /> bởi Fashion Shop Team
          </Text>
        </div>
      </div>
    </AntFooter>
  );
};

export default Footer;
