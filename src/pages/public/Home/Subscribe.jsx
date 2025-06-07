import React, { useState } from "react";
import Banner from "assets/website/orange-pattern.jpg";
import { Input, Button, Typography, notification, Form } from "antd";
import { SendOutlined, MailOutlined, BellOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const Subscribe = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSubscribe = (values) => {
    setLoading(true);
    setTimeout(() => {
      notification.success({
        message: 'Đăng ký thành công!',
        description: `Chúng tôi sẽ gửi thông tin mới nhất đến ${values.email}`,
        placement: 'bottomRight',
      });
      form.resetFields();
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="py-16 relative overflow-hidden" data-aos="fade-up">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{ 
          backgroundImage: `url(${Banner})`,
          filter: 'blur(2px)',
        }}
      ></div>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-indigo-900/80 z-10"></div>
      
      {/* Content */}
      <div className="container mx-auto px-6 relative z-20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center p-2 rounded-full bg-blue-500/30 mb-6 backdrop-blur-sm">
            <BellOutlined className="text-yellow-400 text-2xl animate-pulse" />
          </div>
          
          <Title 
            level={2}
            className="text-white text-3xl md:text-4xl font-bold mb-4" 
            data-aos="fade-up"
          >
            Nhận thông báo về sản phẩm mới
          </Title>
          
          <Paragraph 
            className="text-blue-100 text-lg mb-8 max-w-xl mx-auto"
            data-aos="fade-up" 
            data-aos-delay="100"
          >
            Đăng ký để nhận thông báo về các sản phẩm mới, khuyến mãi đặc biệt và sự kiện giảm giá
          </Paragraph>
          
          <Form
            form={form}
            onFinish={handleSubscribe}
            className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto"
            data-aos="fade-up" 
            data-aos-delay="200"
          >
            <Form.Item 
              name="email"
              className="flex-grow m-0"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' }
              ]}
            >
              <Input
                size="large"
                placeholder="Nhập email của bạn"
                prefix={<MailOutlined className="text-gray-400 mr-2" />}
                className="rounded-full border-2 border-white/20 bg-white/10 backdrop-blur-md text-white placeholder-gray-300 h-12 px-5"
              />
            </Form.Item>
            
            <Form.Item className="m-0">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                icon={<SendOutlined />}
                size="large"
                className="rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 border-0 h-12 px-8 font-medium text-base hover:from-blue-600 hover:to-indigo-700 hover:shadow-lg transition-all duration-300"
              >
                Đăng ký
              </Button>
            </Form.Item>
          </Form>
          
          <Paragraph 
            className="text-blue-200/80 text-sm mt-4"
            data-aos="fade-up" 
            data-aos-delay="300"
          >
            Chúng tôi cam kết bảo mật thông tin của bạn. Kiểm tra email để xác nhận.
          </Paragraph>
        </div>
      </div>
      
      {/* Decorative circles */}
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full -ml-20 -mb-20 z-10"></div>
      <div className="absolute top-0 right-0 w-60 h-60 bg-blue-500/10 rounded-full -mr-20 -mt-20 z-10"></div>
    </div>
  );
};

export default Subscribe;
