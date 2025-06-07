import React from "react";
import {
  Typography,
  Form,
  Input,
  Button,
  Card,
  Row,
  Col,
  Divider,
  Space,
  Tag,
  Collapse,
  Tooltip
} from "antd";
import {
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  SendOutlined,
  FacebookOutlined,
  LinkedinOutlined,
  InstagramOutlined,
  CheckCircleOutlined,
  QuestionCircleOutlined,
  MessageOutlined
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Panel } = Collapse;

const Contact = () => {
  return (
    <div className="contact-page bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card bordered={false} className="shadow-md overflow-hidden">
          <Row gutter={[32, 32]}>
            <Col xs={24} lg={8}>
              <div className="contact-info p-4">
                {/* Phần Header */}
                <Title level={2} className="text-blue-700 font-bold flex items-center gap-2 mb-6">
                  <MessageOutlined />
                  HỎI ĐÁP
                </Title>
                
                <Paragraph className="text-gray-600 mb-8">
                  Nền tảng này giúp mọi người trao đổi kinh nghiệm, tìm kiếm lời
                  khuyên từ cộng đồng và các chuyên gia thời trang. Các chủ đề
                  đa dạng như streetwear, thời trang công sở, phụ kiện được cập
                  nhật liên tục. Người dùng có thể bình chọn câu trả lời hay và
                  khám phá các xu hướng mới nhất. Đây là không gian kết nối
                  những ai yêu thích thời trang, tạo cảm hứng và cải thiện gu
                  thẩm mỹ cá nhân.
                </Paragraph>

                {/* Thông tin liên hệ */}
                <div className="contact-details mb-8">
                  <Title level={4} className="text-gray-800 mb-4">
                    Thông tin liên hệ
                  </Title>
                  
                  <Space direction="vertical" size="middle" className="w-full">
                    <Card 
                      size="small" 
                      className="border border-blue-100 hover:shadow-md transition-shadow"
                      bodyStyle={{ padding: '12px' }}
                    >
                      <Space>
                        <div className="bg-blue-50 h-10 w-10 rounded-full flex items-center justify-center">
                          <MailOutlined className="text-blue-500 text-lg" />
                        </div>
                        <div>
                          <Text type="secondary" className="block text-xs">Email</Text>
                          <Text strong className="text-blue-600">info@example.com</Text>
                        </div>
                      </Space>
                    </Card>
                    
                    <Card 
                      size="small" 
                      className="border border-blue-100 hover:shadow-md transition-shadow"
                      bodyStyle={{ padding: '12px' }}
                    >
                      <Space>
                        <div className="bg-blue-50 h-10 w-10 rounded-full flex items-center justify-center">
                          <PhoneOutlined className="text-blue-500 text-lg" />
                        </div>
                        <div>
                          <Text type="secondary" className="block text-xs">Điện thoại</Text>
                          <Text strong className="text-blue-600">+84 123 456 789</Text>
                        </div>
                      </Space>
                    </Card>
                    
                    <Card 
                      size="small" 
                      className="border border-blue-100 hover:shadow-md transition-shadow"
                      bodyStyle={{ padding: '12px' }}
                    >
                      <Space>
                        <div className="bg-blue-50 h-10 w-10 rounded-full flex items-center justify-center">
                          <EnvironmentOutlined className="text-blue-500 text-lg" />
                        </div>
                        <div>
                          <Text type="secondary" className="block text-xs">Địa chỉ</Text>
                          <Text strong className="text-blue-600">Đà Nẵng, Việt Nam</Text>
                        </div>
                      </Space>
                    </Card>
                  </Space>
                </div>

                {/* Mạng xã hội */}
                <div className="social-links mb-8">
                  <Title level={4} className="text-gray-800 mb-4">
                    Kết nối
                  </Title>
                  
                  <Space size="middle" className="flex">
                    <Tooltip title="Facebook">
                      <Button 
                        shape="circle" 
                        size="large"
                        type="primary"
                        icon={<FacebookOutlined />} 
                        className="flex items-center justify-center"
                      />
                    </Tooltip>
                    <Tooltip title="LinkedIn">
                      <Button 
                        shape="circle" 
                        size="large"
                        icon={<LinkedinOutlined />} 
                        className="flex items-center justify-center bg-blue-500 text-white border-blue-500 hover:bg-blue-600 hover:border-blue-600"
                      />
                    </Tooltip>
                    <Tooltip title="Instagram">
                      <Button 
                        shape="circle" 
                        size="large"
                        icon={<InstagramOutlined />} 
                        className="flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-500 hover:from-purple-600 hover:to-pink-600"
                      />
                    </Tooltip>
                  </Space>
                </div>
              </div>
            </Col>

            <Col xs={24} lg={16}>
              <div className="contact-content">
                {/* Form liên hệ */}
                <Card 
                  title={
                    <Title level={3} className="text-blue-700 m-0">
                      Gửi thông tin liên hệ
                    </Title>
                  } 
                  className="mb-8 shadow-sm"
                >
                  <Form layout="vertical" className="contact-form">
                    <Row gutter={16}>
                      <Col xs={24} sm={12}>
                        <Form.Item 
                          name="name"
                          label="Họ và tên"
                          rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                        >
                          <Input size="large" placeholder="Nhập họ tên" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item 
                          name="email"
                          label="Email"
                          rules={[
                            { required: true, message: 'Vui lòng nhập email!' },
                            { type: 'email', message: 'Email không hợp lệ!' }
                          ]}
                        >
                          <Input size="large" placeholder="example@email.com" />
                        </Form.Item>
                      </Col>
                    </Row>
                    
                    <Form.Item 
                      name="subject"
                      label="Tiêu đề"
                      rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
                    >
                      <Input size="large" placeholder="Tiêu đề liên hệ" />
                    </Form.Item>
                    
                    <Form.Item 
                      name="message"
                      label="Nội dung"
                      rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
                    >
                      <TextArea 
                        rows={5} 
                        placeholder="Nhập nội dung liên hệ..."
                        maxLength={500}
                        showCount
                      />
                    </Form.Item>
                    
                    <Form.Item>
                      <Button 
                        type="primary" 
                        size="large"
                        icon={<SendOutlined />}
                        className="px-8 h-11"
                      >
                        Gửi liên hệ
                      </Button>
                    </Form.Item>
                  </Form>
                </Card>
                
                {/* Bản đồ */}
                <Card 
                  title={
                    <Title level={4} className="text-blue-700 m-0 flex items-center">
                      <EnvironmentOutlined className="mr-2" />
                      Địa chỉ của chúng tôi
                    </Title>
                  } 
                  className="mb-8 shadow-sm"
                >
                  <Paragraph className="mb-4">
                    Địa chỉ của chúng tôi là nơi lý tưởng để khám phá xu hướng
                    thời trang mới nhất, phục vụ mọi nhu cầu mua sắm của bạn.
                  </Paragraph>
                  
                  <div className="map-container h-80 rounded-lg overflow-hidden">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15336.706634704848!2d108.15406080000001!3d16.05632000000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2s!4v1729952347309!5m2!1sen!2s"
                      className="w-full h-full"
                      frameBorder="0"
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                </Card>
                
                {/* FAQ */}
                <Card 
                  title={
                    <Title level={3} className="text-blue-700 m-0 flex items-center">
                      <QuestionCircleOutlined className="mr-2" />
                      Những câu hỏi thường gặp
                    </Title>
                  } 
                  className="mb-8 shadow-sm"
                >
                  <Collapse 
                    defaultActiveKey={['1']}
                    expandIconPosition="end"
                    className="bg-white"
                  >
                    <Panel 
                      header={
                        <Space>
                          <CheckCircleOutlined className="text-blue-500" />
                          <Text strong>Làm thế nào để chọn nền tảng thương mại điện tử phù hợp?</Text>
                        </Space>
                      } 
                      key="1"
                    >
                      <Paragraph className="text-gray-600 pl-6">
                        Để chọn nền tảng thương mại điện tử phù hợp, bạn nên xem
                        xét các yếu tố như tính năng, chi phí, khả năng tùy
                        chỉnh, hỗ trợ khách hàng và tính dễ sử dụng. Một số nền
                        tảng phổ biến cho ngành thời trang bao gồm Shopify,
                        WooCommerce và BigCommerce.
                      </Paragraph>
                    </Panel>
                    
                    <Panel 
                      header={
                        <Space>
                          <CheckCircleOutlined className="text-blue-500" />
                          <Text strong>Làm thế nào để tăng cường trải nghiệm mua sắm trực tuyến?</Text>
                        </Space>
                      } 
                      key="2"
                    >
                      <Paragraph className="text-gray-600 pl-6">
                        Để nâng cao trải nghiệm mua sắm trực tuyến, bạn có thể
                        tối ưu hóa giao diện trang web, đảm bảo tốc độ tải trang
                        nhanh và dễ dàng điều hướng. Cung cấp mô tả sản phẩm chi
                        tiết, hình ảnh chất lượng cao và chính sách đổi trả rõ
                        ràng cũng rất quan trọng.
                      </Paragraph>
                    </Panel>
                    
                    <Panel 
                      header={
                        <Space>
                          <CheckCircleOutlined className="text-blue-500" />
                          <Text strong>Xu hướng thời trang nào đang nổi bật trong năm nay?</Text>
                        </Space>
                      } 
                      key="3"
                    >
                      <Paragraph className="text-gray-600 pl-6">
                        Năm nay, một số xu hướng nổi bật bao gồm thời trang bền
                        vững, trang phục oversized, và việc kết hợp giữa phong
                        cách cổ điển và hiện đại. Màu sắc tươi sáng và họa tiết
                        độc đáo cũng đang trở thành xu hướng, cùng với sự gia
                        tăng của các thương hiệu độc lập và thiết kế tùy chỉnh.
                      </Paragraph>
                    </Panel>
                    
                    <Panel 
                      header={
                        <Space>
                          <CheckCircleOutlined className="text-blue-500" />
                          <Text strong>Làm thế nào để tối ưu hóa SEO cho cửa hàng thời trang?</Text>
                        </Space>
                      } 
                      key="4"
                    >
                      <Paragraph className="text-gray-600 pl-6">
                        Để tối ưu hóa SEO cho cửa hàng thời trang, hãy bắt đầu
                        bằng cách nghiên cứu từ khóa liên quan đến sản phẩm của
                        bạn và sử dụng chúng trong tiêu đề, mô tả và thẻ alt của
                        hình ảnh. Nội dung chất lượng và blog liên quan đến thời
                        trang cũng giúp cải thiện thứ hạng tìm kiếm.
                      </Paragraph>
                    </Panel>
                  </Collapse>
                </Card>
                
                {/* Fashion Q&A */}
                <Card 
                  title={
                    <Title level={3} className="text-blue-700 m-0">
                      Câu hỏi về xu hướng thời trang
                    </Title>
                  } 
                  bordered={false}
                  className="shadow-sm"
                >
                  <Paragraph className="text-gray-600 mb-6">
                    Khám phá Câu hỏi thường gặp toàn diện của chúng tôi để tìm
                    câu trả lời cho các truy vấn chung.
                  </Paragraph>
                  
                  <Row gutter={[16, 16]}>
                    <Col xs={24} md={8}>
                      <Card
                        className="h-full bg-blue-50 border-blue-200 hover:shadow-md transition-all"
                      >
                        <Title level={5} className="text-blue-700">
                          Màu sắc nào đang thịnh hành trong mùa này?
                        </Title>
                        <Text className="text-gray-600">
                          Các màu sắc nổi bật của mùa này bao gồm xanh cobalt, hồng
                          phấn, xanh pastel và màu cam cháy.
                        </Text>
                      </Card>
                    </Col>
                    
                    <Col xs={24} md={8}>
                      <Card
                        className="h-full bg-blue-50 border-blue-200 hover:shadow-md transition-all"
                      >
                        <Title level={5} className="text-blue-700">
                          Phong cách thời trang bền vững đang trở thành xu hướng thế nào?
                        </Title>
                        <Text className="text-gray-600">
                          Phong cách thời trang bền vững ngày càng được nhiều người
                          lựa chọn, với các thương hiệu và người tiêu dùng chú trọng
                          đến chất liệu tái chế, thời trang "second-hand", và sản
                          phẩm từ những nguồn nguyên liệu hữu cơ.
                        </Text>
                      </Card>
                    </Col>
                    
                    <Col xs={24} md={8}>
                      <Card
                        className="h-full bg-blue-50 border-blue-200 hover:shadow-md transition-all"
                      >
                        <Title level={5} className="text-blue-700">
                          Làm thế nào để tạo điểm nhấn trong trang phục hàng ngày?
                        </Title>
                        <Text className="text-gray-600">
                          Một cách đơn giản là chọn một phụ kiện nổi bật như khăn
                          quàng cổ sáng màu, túi xách statement, hoặc một đôi giày
                          độc đáo.
                        </Text>
                      </Card>
                    </Col>
                  </Row>
                </Card>
              </div>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
};

export default Contact;
