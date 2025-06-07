import React, { useEffect, useState } from "react";
import { Button, notification, Card, Tabs, Tag, Typography, Row, Col, Divider, Skeleton, Empty, Badge, Carousel, Space } from "antd";
import moment from "moment";
import img1 from "assets/images/bannerblack1.jpg";
import img2 from "assets/images/bannerblack2.jpg";
import { getVouchers, saveVoucherByCustomer } from "apis/voucher.api";
import { formatCurrency, formatMoney } from "utils/helper";
import withBaseComponent from "hocs";
import { useSelector } from "react-redux";
import logo from "assets/logo.png";
import { 
  ShoppingOutlined, 
  GiftOutlined, 
  TagOutlined, 
  ClockCircleOutlined, 
  ShoppingCartOutlined,
  CarOutlined,
  DollarOutlined,
  PercentageOutlined,
  CalendarOutlined,
  SaveOutlined,
  ThunderboltFilled,
  RocketOutlined
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

function Coupons({ checkLoginBeforeAction }) {
  const [shipVouchers, setShipVoucher] = useState([]);
  const [productVouchers, setProductVouchers] = useState([]);
  const [rentalVouchers, setRentalVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { logged } = useSelector((state) => state.auth);

  useEffect(() => {
    try {
      const fetchData = async () => {
        setLoading(true);
        const [shipData, productData, rentalData] = await Promise.all([
          getVouchers({ typeVoucher: "SHIPPING" }),
          getVouchers({ typeVoucher: "PRODUCT" }),
          getVouchers({ typeVoucher: "RENTAL" }),
        ]);

        setShipVoucher(shipData.result.content);
        setProductVouchers(productData.result.content);
        setRentalVouchers(rentalData.result.content);
        setLoading(false);
      };

      fetchData();
    } catch (error) {
      setLoading(false);
      notification.warning({
        message: error.message,
        duration: 2,
        placement: "top",
      });
    }
  }, []);

  const handleSaveVoucher = async (code) => {
    try {
      await saveVoucherByCustomer(code);

      notification.success({
        message: "Đã lưu mã khuyến mãi",
        duration: 1,
        placement: "top",
      });
    } catch (error) {
      notification.warning({
        message: "Vui lòng thử lại sau...",
        duration: 1,
        placement: "top",
      });
    }
  };

  const renderVoucherCard = (voucher, type) => {
    const isExpiringSoon = moment(voucher.expiry_date).diff(moment(), 'days') <= 3;
    
    let icon;
    let tagColor;
    let tagText;
    
    if (type === "shipping") {
      icon = <CarOutlined className="text-green-500" />;
      tagColor = "green";
      tagText = "Miễn phí vận chuyển";
    } else if (type === "product") {
      icon = <ShoppingOutlined className="text-blue-500" />;
      tagColor = "blue";
      tagText = "Giảm giá sản phẩm";
    } else {
      icon = <RocketOutlined className="text-purple-500" />;
      tagColor = "purple";
      tagText = "Giảm giá thuê";
    }

    return (
      <Card 
        className="voucher-card h-full transition-all duration-300 hover:shadow-lg" 
        bordered={false}
        hoverable
      >
        <div className="relative">
          {isExpiringSoon && (
            <Badge.Ribbon text="Sắp hết hạn" color="red" placement="start" />
          )}
          <div className="flex items-stretch">
            <div className={`w-1/4 flex items-center justify-center p-4 rounded-l-lg bg-${tagColor === "green" ? "green" : tagColor === "blue" ? "blue" : "purple"}-50`}>
              <div className="text-center">
                {icon}
                <Tag color={tagColor} className="mt-2 mx-auto">
                  {tagText}
                </Tag>
                {voucher.code && (
                  <div className="bg-gray-100 p-2 mt-2 rounded text-center">
                    <Text copyable strong className="text-xs">
                      {voucher.code}
                    </Text>
                  </div>
                )}
              </div>
            </div>
            
            <div className="w-3/4 p-4">
              <div className="mb-2">
                <Title level={5} className="m-0">
                  {voucher?.discount_type === "FIXED" ? (
                    <Space>
                      <DollarOutlined />
                      <span>Giảm {formatCurrency(voucher?.value)}</span>
                    </Space>
                  ) : (
                    <Space>
                      <PercentageOutlined />
                      <span>Giảm {voucher.value}%</span>
                    </Space>
                  )}
                </Title>
              </div>
              
              <div className="flex flex-col gap-1 text-gray-600">
                <div className="flex items-center">
                  <ShoppingCartOutlined className="mr-2" />
                  <Text type="secondary">Đơn từ {formatMoney(voucher.min_order)}đ</Text>
                </div>
                
                <div className="flex items-center">
                  <DollarOutlined className="mr-2" />
                  <Text type="secondary">Giảm tối đa {formatMoney(voucher.max_discount)}đ</Text>
                </div>
                
                <div className="flex items-center">
                  <CalendarOutlined className="mr-2" />
                  <Text type="secondary" className="text-xs">
                    HSD: {moment(new Date(voucher.expiry_date)).format("DD/MM/YYYY HH:mm")}
                  </Text>
                </div>
              </div>
              
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={() => checkLoginBeforeAction(() => handleSaveVoucher(voucher.code))}
                className="mt-4"
                block
              >
                Lưu voucher
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 5000
  };

  return (
    <div className="coupons-page bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Banner Section */}
        <div className="banner-section mb-8">
          <Carousel {...carouselSettings}>
            <div>
              <img src={img1} alt="Banner" className="w-full h-[350px] object-cover rounded-lg" />
            </div>
            <div>
              <img src={img2} alt="Banner" className="w-full h-[350px] object-cover rounded-lg" />
            </div>
          </Carousel>
        </div>

        {/* Vouchers Section */}
        <Card className="main-content shadow-md mb-8">
          <Title level={2} className="mb-6 text-center flex justify-center items-center">
            <TagOutlined className="mr-2" /> Mã Giảm Giá Hấp Dẫn
          </Title>
          
          <Tabs defaultActiveKey="1" centered className="voucher-tabs">
            <TabPane 
              tab={<span><CarOutlined /> Miễn phí vận chuyển</span>} 
              key="1"
            >
              {loading ? (
                <Row gutter={[16, 16]}>
                  {[1, 2, 3, 4].map(item => (
                    <Col xs={24} sm={24} md={12} key={item}>
                      <Skeleton active avatar paragraph={{ rows: 3 }} />
                    </Col>
                  ))}
                </Row>
              ) : shipVouchers.length > 0 ? (
                <Row gutter={[16, 16]}>
                  {shipVouchers.map((voucher) => (
                    <Col xs={24} sm={24} md={12} key={voucher.id}>
                      {renderVoucherCard(voucher, "shipping")}
                    </Col>
                  ))}
                </Row>
              ) : (
                <Empty description="Không có mã giảm giá vận chuyển" />
              )}
            </TabPane>
            
            <TabPane 
              tab={<span><ShoppingOutlined /> Giảm giá sản phẩm</span>} 
              key="2"
            >
              {loading ? (
                <Row gutter={[16, 16]}>
                  {[1, 2, 3, 4].map(item => (
                    <Col xs={24} sm={24} md={12} key={item}>
                      <Skeleton active avatar paragraph={{ rows: 3 }} />
                    </Col>
                  ))}
                </Row>
              ) : productVouchers.length > 0 ? (
                <Row gutter={[16, 16]}>
                  {productVouchers.map((voucher) => (
                    <Col xs={24} sm={24} md={12} key={voucher.id}>
                      {renderVoucherCard(voucher, "product")}
                    </Col>
                  ))}
                </Row>
              ) : (
                <Empty description="Không có mã giảm giá sản phẩm" />
              )}
            </TabPane>
            
            <TabPane 
              tab={<span><RocketOutlined /> Giảm giá thuê</span>} 
              key="3"
            >
              {loading ? (
                <Row gutter={[16, 16]}>
                  {[1, 2, 3, 4].map(item => (
                    <Col xs={24} sm={24} md={12} key={item}>
                      <Skeleton active avatar paragraph={{ rows: 3 }} />
                    </Col>
                  ))}
                </Row>
              ) : rentalVouchers.length > 0 ? (
                <Row gutter={[16, 16]}>
                  {rentalVouchers.map((voucher) => (
                    <Col xs={24} sm={24} md={12} key={voucher.id}>
                      {renderVoucherCard(voucher, "rental")}
                    </Col>
                  ))}
                </Row>
              ) : (
                <Empty description="Không có mã giảm giá thuê" />
              )}
            </TabPane>
          </Tabs>
        </Card>

        {/* Promotion Section */}
        <Card className="promo-section bg-black text-white">
          <div className="p-6 text-center">
            <Badge.Ribbon text="Hot Deal" color="red">
              <Title level={2} className="text-white mb-4 uppercase flex justify-center items-center">
                <ThunderboltFilled className="text-yellow-400 mr-2" /> PAYDAY ĐỘC QUYỀN
              </Title>
            </Badge.Ribbon>
            
            <Paragraph className="text-lg mb-4">
              Chào đón ưu đãi <Text strong className="text-yellow-400 underline">giảm ít nhất 25%</Text> ngay hôm nay!
            </Paragraph>
            
            <Paragraph className="text-lg mb-6">
              Tận hưởng các deal hấp dẫn dưới <Text strong className="text-yellow-400 underline">199K</Text>, chỉ có tại đây.
            </Paragraph>
            
            <Row gutter={[16, 16]} className="mt-6">
              <Col xs={24} sm={12}>
                <Card bordered={false} className="h-full hover:shadow-lg transition-all duration-300">
                  <img
                    src="https://img.pikbest.com/01/60/85/11npIkbEsTATm.jpg!w700wp"
                    alt="Deal Promotion 1"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12}>
                <Card bordered={false} className="h-full hover:shadow-lg transition-all duration-300">
                  <img
                    src="https://img.pikbest.com/01/60/85/11npIkbEsTATm.jpg!w700wp"
                    alt="Deal Promotion 2"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </Card>
              </Col>
            </Row>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default withBaseComponent(Coupons);
