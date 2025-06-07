import React from "react";
import { Typography, Card, Row, Col, Space, Avatar, Divider } from "antd";
import {
  SettingOutlined,
  CheckCircleOutlined,
  StarOutlined,
  RocketOutlined,
  HeartOutlined,
  ThunderboltOutlined,
  GiftOutlined,
  ClockCircleOutlined,
  CustomerServiceOutlined,
  UsbOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

function Introduce() {
  return (
    <div className="bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Banner */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <Title level={1} className="text-center mb-8 text-blue-800">
            Fashion Shop
          </Title>
          <Title level={3} className="text-gray-800 text-xl font-semibold mb-4 text-center max-w-4xl mx-auto">
            Chào mừng đến với Fashion Shop, nơi chúng tôi định nghĩa lại phong
            cách thời trang với sự sang trọng đẳng cấp.
          </Title>
          <Paragraph className="text-gray-600 text-lg leading-relaxed max-w-4xl mx-auto text-center">
            Sứ mệnh của chúng tôi là mang đến cho bạn trải nghiệm thời trang
            tuyệt vời nhất, cung cấp những bộ trang phục cao cấp, chất lượng
            vượt trội, kết hợp sự thanh lịch, thoải mái và bền bỉ.
          </Paragraph>
          <Paragraph className="text-gray-600 text-lg leading-relaxed max-w-4xl mx-auto text-center">
            Tại Fashion Shop, chúng tôi chỉ sử dụng những chất liệu tốt nhất để
            đảm bảo các sản phẩm thời trang của chúng tôi có thể chịu được thử
            thách của thời gian và xu hướng.
          </Paragraph>
        </div>
      </section>

      {/* Vision, Mission, Values */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <Title level={2} className="text-center mb-16 text-blue-700 relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-1 after:bg-blue-500 after:rounded-full">
            Tầm nhìn, Sứ mệnh và Giá trị cốt lõi
          </Title>

          <Row gutter={[32, 32]} className="mt-12">
            <Col xs={24} md={8}>
              <Card 
                hoverable 
                className="h-full shadow-md border-0 hover:-translate-y-2 transition-all duration-300"
                cover={
                  <div className="text-center pt-8">
                    <Avatar size={64} icon={<StarOutlined />} className="bg-blue-500" />
                  </div>
                }
              >
                <Title level={3} className="text-center text-gray-800">Tầm nhìn</Title>
                <Paragraph className="text-gray-600 text-base">
                  Chúng tôi hướng tới việc nâng cao trải nghiệm thời trang, mang
                  đến cho khách hàng những trang phục cao cấp, sang trọng, kết
                  hợp giữa sự thoải mái, phong cách và chất lượng bền bỉ. Với
                  tầm nhìn này, chúng tôi mong muốn giúp mọi người tự tin thể
                  hiện phong cách riêng, biến mỗi bộ trang phục thành một trải
                  nghiệm đẳng cấp.
                </Paragraph>
              </Card>
            </Col>
            
            <Col xs={24} md={8}>
              <Card 
                hoverable 
                className="h-full shadow-md border-0 hover:-translate-y-2 transition-all duration-300"
                cover={
                  <div className="text-center pt-8">
                    <Avatar size={64} icon={<RocketOutlined />} className="bg-blue-500" />
                  </div>
                }
              >
                <Title level={3} className="text-center text-gray-800">Nhiệm vụ</Title>
                <Paragraph className="text-gray-600 text-base">
                  Sứ mệnh của chúng tôi là mang đến cho khách hàng các bộ sưu
                  tập thời trang độc đáo, kết hợp tay nghề thủ công tinh xảo với
                  thiết kế hiện đại. Chúng tôi cam kết tạo ra các sản phẩm không
                  chỉ đẹp mắt mà còn bền bỉ và thoải mái, đảm bảo rằng mỗi trang
                  phục đều đem lại sự tự tin và phong cách cho người mặc.
                </Paragraph>
              </Card>
            </Col>
            
            <Col xs={24} md={8}>
              <Card 
                hoverable 
                className="h-full shadow-md border-0 hover:-translate-y-2 transition-all duration-300"
                cover={
                  <div className="text-center pt-8">
                    <Avatar size={64} icon={<HeartOutlined />} className="bg-blue-500" />
                  </div>
                }
              >
                <Title level={3} className="text-center text-gray-800">Giá trị cốt lõi</Title>
                <Space direction="vertical" size="middle" className="w-full">
                  <Paragraph className="text-gray-600 text-base flex items-start">
                    <CheckCircleOutlined className="text-blue-500 mr-2 mt-1" /> 
                    Cam kết sử dụng chất liệu và kỹ thuật sản xuất tốt nhất để đảm bảo chất lượng vượt trội cho từng sản phẩm.
                  </Paragraph>
                  <Paragraph className="text-gray-600 text-base flex items-start">
                    <CheckCircleOutlined className="text-blue-500 mr-2 mt-1" /> 
                    Không ngừng sáng tạo và cải tiến thiết kế để đáp ứng và dẫn đầu xu hướng thời trang.
                  </Paragraph>
                  <Paragraph className="text-gray-600 text-base flex items-start">
                    <CheckCircleOutlined className="text-blue-500 mr-2 mt-1" /> 
                    Đặt khách hàng làm trung tâm, tạo ra những sản phẩm giúp họ tự tin, nổi bật và thể hiện cá tính riêng.
                  </Paragraph>
                </Space>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <Title level={2} className="text-center mb-16 text-blue-700 relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-1 after:bg-blue-500 after:rounded-full">
            Tại sao chọn chúng tôi?
          </Title>

          <Row gutter={[32, 32]} className="mt-12">
            <Col xs={24} sm={12} lg={6}>
              <Card 
                hoverable
                className="text-center h-full shadow-md border-0 hover:-translate-y-2 transition-all duration-300"
                cover={
                  <div className="py-8 bg-blue-50">
                    <SettingOutlined className="text-5xl text-blue-500" />
                  </div>
                }
              >
                <Title level={4}>Chất lượng cao cấp</Title>
                <Paragraph className="text-gray-600">
                  Các sản phẩm thời trang của chúng tôi được tạo nên từ những
                  chất liệu cao cấp nhất, đảm bảo độ bền vượt trội, khả năng giữ
                  dáng và cảm giác thoải mái.
                </Paragraph>
              </Card>
            </Col>
            
            <Col xs={24} sm={12} lg={6}>
              <Card 
                hoverable
                className="text-center h-full shadow-md border-0 hover:-translate-y-2 transition-all duration-300"
                cover={
                  <div className="py-8 bg-blue-50">
                    <UsbOutlined className="text-5xl text-blue-500" />
                  </div>
                }
              >
                <Title level={4}>Sang trọng và thoải mái</Title>
                <Paragraph className="text-gray-600">
                  Chúng tôi kết hợp sự thanh lịch với tính thực dụng, mang đến
                  những trang phục không chỉ phong cách mà còn thoải mái, phù
                  hợp với mọi hoàn cảnh.
                </Paragraph>
              </Card>
            </Col>
            
            <Col xs={24} sm={12} lg={6}>
              <Card 
                hoverable
                className="text-center h-full shadow-md border-0 hover:-translate-y-2 transition-all duration-300"
                cover={
                  <div className="py-8 bg-blue-50">
                    <ThunderboltOutlined className="text-5xl text-blue-500" />
                  </div>
                }
              >
                <Title level={4}>Thiết kế sáng tạo</Title>
                <Paragraph className="text-gray-600">
                  Các sản phẩm thời trang của chúng tôi được thiết kế với những
                  chi tiết độc đáo, từ đường cắt hiện đại đến những chi tiết tối
                  ưu giúp trang phục dễ dàng điều chỉnh.
                </Paragraph>
              </Card>
            </Col>
            
            <Col xs={24} sm={12} lg={6}>
              <Card 
                hoverable
                className="text-center h-full shadow-md border-0 hover:-translate-y-2 transition-all duration-300"
                cover={
                  <div className="py-8 bg-blue-50">
                    <CustomerServiceOutlined className="text-5xl text-blue-500" />
                  </div>
                }
              >
                <Title level={4}>Dịch vụ khách hàng đặc biệt</Title>
                <Paragraph className="text-gray-600">
                  Chúng tôi cam kết mang lại dịch vụ khách hàng xuất sắc. Từ các
                  gợi ý phong cách cá nhân hóa đến hỗ trợ sau mua hàng, chúng
                  tôi đảm bảo bạn sẽ có trải nghiệm mua sắm tốt nhất.
                </Paragraph>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <Title level={2} className="text-center mb-16 text-blue-700 relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-1 after:bg-pink-500 after:rounded-full">
            Đánh giá của khách hàng
          </Title>

          <Row gutter={[32, 32]} className="mt-12">
            <Col xs={24} md={8}>
              <Card 
                hoverable 
                className="h-full shadow-md border-0 hover:-translate-y-2 transition-all duration-300"
              >
                <div className="flex justify-center mb-6">
                  <Avatar 
                    size={100} 
                    src="https://trendxnest.com/wp-content/uploads/2024/10/danh-gia-150x150.png" 
                    className="border-4 border-blue-100"
                  />
                </div>
                <Title level={4} className="text-center mb-2">
                  "Đáng giá từng xu!"
                </Title>
                <div className="mb-4 text-center">
                  <Space>
                    <StarOutlined className="text-yellow-500" />
                    <StarOutlined className="text-yellow-500" />
                    <StarOutlined className="text-yellow-500" />
                    <StarOutlined className="text-yellow-500" />
                    <StarOutlined className="text-yellow-500" />
                  </Space>
                </div>
                <Paragraph className="text-gray-600 text-center italic">
                  "Giá có thể cao hơn so với các thương hiệu khác, nhưng chất
                  lượng và thiết kế thật sự xứng đáng. Chất liệu tuyệt vời, và
                  tôi thích cách trang phục của Fashion VN mang lại sự sang
                  trọng cho phong cách của tôi."
                </Paragraph>
                <Divider className="my-4" />
                <Text className="block text-center text-gray-500 font-medium">
                  Sophia G. - 10/02/2023
                </Text>
              </Card>
            </Col>
            
            <Col xs={24} md={8}>
              <Card 
                hoverable 
                className="h-full shadow-md border-0 hover:-translate-y-2 transition-all duration-300"
              >
                <div className="flex justify-center mb-6">
                  <Avatar 
                    size={100} 
                    src="https://trendxnest.com/wp-content/uploads/2024/10/danh-gia-3-150x150.png" 
                    className="border-4 border-blue-100"
                  />
                </div>
                <Title level={4} className="text-center mb-2">
                  "Thiết kế đẹp và dễ phối!"
                </Title>
                <div className="mb-4 text-center">
                  <Space>
                    <StarOutlined className="text-yellow-500" />
                    <StarOutlined className="text-yellow-500" />
                    <StarOutlined className="text-yellow-500" />
                    <StarOutlined className="text-yellow-500" />
                    <StarOutlined className="text-gray-300" />
                  </Space>
                </div>
                <Paragraph className="text-gray-600 text-center italic">
                  "Tôi rất bất ngờ vì các thiết kế của Fashion VN dễ phối đến
                  thế. Thêm vào đó, trông chúng rất thanh lịch! Gia đình và bạn
                  bè đều khen ngợi về phong cách hiện đại và chất lượng tổng thể
                  của các bộ trang phục này."
                </Paragraph>
                <Divider className="my-4" />
                <Text className="block text-center text-gray-500 font-medium">
                  Mark Adair - 07/06/2023
                </Text>
              </Card>
            </Col>
            
            <Col xs={24} md={8}>
              <Card 
                hoverable 
                className="h-full shadow-md border-0 hover:-translate-y-2 transition-all duration-300"
              >
                <div className="flex justify-center mb-6">
                  <Avatar 
                    size={100} 
                    src="https://trendxnest.com/wp-content/uploads/2024/10/danh-gia-2-150x150.png" 
                    className="border-4 border-blue-100"
                  />
                </div>
                <Title level={4} className="text-center mb-2">
                  "Thời trang đẳng cấp nhất!"
                </Title>
                <div className="mb-4 text-center">
                  <Space>
                    <StarOutlined className="text-yellow-500" />
                    <StarOutlined className="text-yellow-500" />
                    <StarOutlined className="text-yellow-500" />
                    <StarOutlined className="text-yellow-500" />
                    <StarOutlined className="text-yellow-500" />
                  </Space>
                </div>
                <Paragraph className="text-gray-600 text-center italic">
                  "Fashion VN mang đến mọi thứ tôi cần cho một phong cách thời
                  trang tinh tế. Từ chất liệu cao cấp đến các đường cắt sắc nét,
                  mỗi sản phẩm thực sự giống như một trải nghiệm thời trang đẳng
                  cấp giữa cuộc sống hàng ngày!"
                </Paragraph>
                <Divider className="my-4" />
                <Text className="block text-center text-gray-500 font-medium">
                  Simon Konecki - 05/10/2023
                </Text>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <Row gutter={[24, 24]} className="mt-12">
            <Col xs={24} sm={12} lg={6}>
              <Card className="text-center h-full border-0 shadow-md hover:shadow-lg transition-all">
                <div className="mb-4">
                  <Avatar 
                    size={64}
                    src="https://trendxnest.com/wp-content/uploads/2024/10/Qua-tang-2-300x300.png"
                    className="bg-white p-1"
                  />
                </div>
                <Title level={4}>Chất lượng cao</Title>
                <Text className="text-gray-600">Sản phẩm đã được thử nghiệm</Text>
              </Card>
            </Col>
            
            <Col xs={24} sm={12} lg={6}>
              <Card className="text-center h-full border-0 shadow-md hover:shadow-lg transition-all">
                <div className="mb-4">
                  <Avatar 
                    size={64}
                    src="https://trendxnest.com/wp-content/uploads/2024/10/giao-hang-300x300.png"
                    className="bg-white p-1"
                  />
                </div>
                <Title level={4}>Giao hàng nhanh</Title>
                <Text className="text-gray-600">Nhận trong vòng 3 ngày</Text>
              </Card>
            </Col>
            
            <Col xs={24} sm={12} lg={6}>
              <Card className="text-center h-full border-0 shadow-md hover:shadow-lg transition-all">
                <div className="mb-4">
                  <Avatar 
                    size={64}
                    src="https://trendxnest.com/wp-content/uploads/2024/10/Qua-tang-300x300.png"
                    className="bg-white p-1"
                  />
                </div>
                <Title level={4}>Quà tặng hấp dẫn</Title>
                <Text className="text-gray-600">Nhiều chương trình khuyến mãi hấp dẫn</Text>
              </Card>
            </Col>
            
            <Col xs={24} sm={12} lg={6}>
              <Card className="text-center h-full border-0 shadow-md hover:shadow-lg transition-all">
                <div className="mb-4">
                  <Avatar 
                    size={64}
                    src="https://trendxnest.com/wp-content/uploads/2024/10/Ho-tro-300x300.png"
                    className="bg-white p-1"
                  />
                </div>
                <Title level={4}>Hỗ trợ miễn phí</Title>
                <Text className="text-gray-600">Hỗ trợ 24/7</Text>
              </Card>
            </Col>
          </Row>
        </div>
      </section>
    </div>
  );
}

export default Introduce;
