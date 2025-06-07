import React from "react";
import BannerImg from "assets/women/women2.jpg";
import { GrSecure } from "react-icons/gr";
import { IoFastFood } from "react-icons/io5";
import { GiFoodTruck } from "react-icons/gi";
import { FaRegCreditCard } from "react-icons/fa";
import { Typography, Card, Row, Col, Button } from "antd";

const { Title, Paragraph } = Typography;

const FeatureBox = ({ icon: Icon, title, bgColor }) => {
  return (
    <div
      className="flex items-center gap-4 p-4 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
      data-aos="fade-up"
    >
      <div className={`${bgColor} rounded-full p-4 shadow-md transition-all duration-300 hover:shadow-lg`}>
        <Icon className="text-2xl text-gray-800" />
      </div>
      <Paragraph className="text-gray-700 font-medium m-0">{title}</Paragraph>
    </div>
  );
};

const Banner = () => {
  return (
    <div className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <Row 
          gutter={[32, 32]} 
          align="middle" 
          className="flex flex-col md:flex-row"
        >
          {/* Hình ảnh phần */}
          <Col 
            xs={24} 
            md={12} 
            className="mb-8 md:mb-0 order-2 md:order-1"
            data-aos="zoom-in"
            data-aos-duration="1000"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 rounded-3xl transform translate-x-4 translate-y-4 -z-10"></div>
              <img
                src={BannerImg}
                alt="Banner"
                className="w-full h-auto object-cover rounded-3xl shadow-2xl transition-transform duration-700 hover:scale-[1.02]"
              />
              <div className="absolute top-0 left-0 bg-red-500 text-white font-bold py-2 px-6 rounded-tl-3xl rounded-br-3xl">
                -30%
              </div>
            </div>
          </Col>

          {/* Nội dung phần */}
          <Col 
            xs={24} 
            md={12}
            className="order-1 md:order-2"
          >
            <div className="space-y-6 md:pl-8">
              <div 
                className="inline-block bg-blue-100 text-blue-600 px-4 py-1 rounded-full font-medium text-sm mb-2"
                data-aos="fade-right"
              >
                Thời trang cao cấp
              </div>
              <Title 
                level={1} 
                className="text-4xl md:text-5xl font-bold mb-4"
                data-aos="fade-up"
              >
                Mua sắm mùa tết thả ga
              </Title>
              <Paragraph 
                className="text-lg text-gray-600 mb-8"
                data-aos="fade-up" 
                data-aos-delay="100"
              >
                Đặt hàng ngay hôm nay để nhận nhiều ưu đãi hấp dẫn cùng với những trải nghiệm mua sắm tiện lợi và an toàn.
              </Paragraph>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FeatureBox 
                  icon={GrSecure} 
                  title="Sản phẩm chất lượng" 
                  bgColor="bg-violet-100" 
                />
                <FeatureBox 
                  icon={IoFastFood} 
                  title="Giao hàng nhanh" 
                  bgColor="bg-orange-100" 
                />
                <FeatureBox 
                  icon={GiFoodTruck} 
                  title="Dễ dàng thanh toán" 
                  bgColor="bg-green-100" 
                />
                <FeatureBox 
                  icon={FaRegCreditCard} 
                  title="Dịch vụ nhanh chóng" 
                  bgColor="bg-yellow-100" 
                />
              </div>

              <Button 
                type="primary" 
                size="large"
                className="mt-6 bg-blue-500 hover:bg-blue-600 border-0 rounded-full h-12 px-8 font-medium text-lg shadow-lg transition-all duration-300 hover:transform hover:scale-105"
                data-aos="fade-up"
                data-aos-delay="300"
              >
                Khám phá ngay
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Banner;
