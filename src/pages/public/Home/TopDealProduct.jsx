import React, { useEffect, useState, useRef } from "react";
import { Carousel, Card, Typography, Button, Tag, Badge, Skeleton, Empty, Row, Col, Avatar } from "antd";
import { RightOutlined, LeftOutlined, FireOutlined, ShoppingCartOutlined, StarFilled } from '@ant-design/icons';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getProducts } from "apis/product.api";
import { getProductBrands } from "apis/productBrand.api";
import QueryString from "qs";
import { useDispatch, useSelector } from "react-redux";
import { generatePath, useNavigate } from "react-router-dom";
import { setFilterParams } from "store/slicers/common.slicer";
import paths from "constant/paths";

// Banner images
import img1 from "assets/images/bn2.jpg";
import img2 from "assets/images/10.jpg";
import img3 from "assets/images/13.jpg";
import img4 from "assets/images/bn4.jpg";
import img5 from "assets/images/bn3.jpg";
import img6 from "assets/images/bn1.jpg";
import img7 from "assets/images/sale1.jpg";
import img8 from "assets/images/sale2.jpg";
import img9 from "assets/images/sale3.jpg";

const { Title, Text, Paragraph } = Typography;
const { Meta } = Card;

const TopDealProduct = () => {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const carouselRef = useRef();
  const productListRef = useRef();
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { filterParams } = useSelector((state) => state.common);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const params = {
        limit,
        page,
      };
      const res = await getProducts(params);
      setProducts(res?.result?.content || []);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchBrand = async () => {
    try {
      const params = {
        limit,
        page,
      };
      const res = await getProductBrands(params);
      setBrands(res?.result?.content || []);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchProduct();
    fetchBrand();
  }, []);

  const handleBrandClick = (brand) => {
    dispatch(
      setFilterParams({
        ...filterParams,
        brand: brand.name,
      })
    );
    navigate({
      pathname: paths.PRODUCTS,
      search: QueryString.stringify({
        ...filterParams,
        category: brand.name,
      }),
    });
  };

  const navigateToProduct = (product) => {
    navigate(
      generatePath(paths.DETAIL_PRODUCT, {
        id: product?.id,
      }),
      { state: { productData: product } }
    );
  };

  const scrollProductList = (direction) => {
    if (productListRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      productListRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="mb-10">
      {/* Hero Carousel */}
      <div className="relative mb-8">
        <Carousel
          autoplay
          effect="fade"
          ref={carouselRef}
          className="rounded-xl overflow-hidden shadow-lg"
          dots={{ className: "custom-dots" }}
        >
          {[img6, img1, img5, img4].map((image, index) => (
            <div key={index}>
              <div className="relative h-[300px] md:h-[400px] lg:h-[500px] w-full">
                <img
                  src={image}
                  alt={`Banner ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center p-8 md:p-16">
                  <div className="max-w-lg">
                    <Badge.Ribbon text="Hot Deal" color="red">
                      <Title level={2} className="text-white mb-4 transition-all duration-500">
                        Khuyến mãi đặc biệt
                      </Title>
                    </Badge.Ribbon>
                    <Paragraph className="text-white text-base md:text-lg mb-6 transition-all duration-500 delay-100">
                      Cơ hội sở hữu sản phẩm với giá ưu đãi và nhiều phần quà hấp dẫn.
                    </Paragraph>
                    <Button
                      type="primary"
                      size="large"
                      className="bg-red-500 hover:bg-red-600 border-0 rounded-full"
                      onClick={() => navigate(paths.PRODUCTS)}
                    >
                      Khám phá ngay
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Carousel>

        {/* Navigation Buttons */}
        <Button 
          type="primary"
          shape="circle"
          icon={<LeftOutlined />}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/70 text-gray-800 hover:bg-white border-0 shadow-lg"
          onClick={() => carouselRef.current.prev()}
        />
        <Button 
          type="primary"
          shape="circle"
          icon={<RightOutlined />}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/70 text-gray-800 hover:bg-white border-0 shadow-lg"
          onClick={() => carouselRef.current.next()}
        />
      </div>

      {/* Brands and Promo Section */}
      <div className="mb-8">
        <Card className="shadow-md hover:shadow-xl transition-shadow duration-300">
          <Row gutter={[24, 24]} className="items-center">
            {/* Sale Banner */}
            <Col xs={24} md={12} className="mb-6 md:mb-0">
              <div className="bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl p-6 text-white relative overflow-hidden h-full">
                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white/10 rounded-full -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-white/5 rounded-full -ml-24 -mb-24"></div>
                
                <div className="relative z-10">
                  <Tag color="red" className="mb-4 text-sm">Còn 2 Ngày</Tag>
                  <Title level={3} className="text-white mb-4">
                    Siêu Ưu Đãi Giảm Giá Đến <span className="text-yellow-300">70%</span>
                  </Title>
                  <Paragraph className="text-white/90 mb-6">
                    Đặc biệt: Giảm 50% toàn bộ sản phẩm từ ngày 7/7 đến 21/7. Không thể bỏ qua!
                  </Paragraph>
                  
                  <Row gutter={[12, 12]} className="mt-4">
                    {[img7, img8, img9].map((img, i) => (
                      <Col span={8} key={i}>
                        <div className="overflow-hidden rounded-lg shadow-lg">
                          <img
                            src={img}
                            alt={`Promotion ${i+1}`}
                            className="w-full h-28 object-cover transition-transform duration-500 hover:scale-110"
                          />
                        </div>
                      </Col>
                    ))}
                  </Row>
                </div>
              </div>
            </Col>

            {/* Brands Scroll */}
            <Col xs={24} md={12}>
              <Title level={5} className="mb-4 flex items-center">
                <img src={img6} className="w-6 h-6 rounded-full object-cover mr-2" />
                Thương hiệu nổi bật
              </Title>
              
              <div className="relative">
                <div className="flex overflow-x-auto pb-4 hide-scrollbar">
                  <div className="flex space-x-4">
                    {loading ? (
                      Array(6).fill(0).map((_, i) => (
                        <div key={i} className="flex-shrink-0 w-28">
                          <Skeleton.Avatar active size={64} shape="circle" className="mb-2 mx-auto" />
                          <Skeleton.Input active size="small" className="w-full" />
                        </div>
                      ))
                    ) : brands.length === 0 ? (
                      <Empty description="Không có thương hiệu nào" />
                    ) : (
                      brands.map((brand, index) => (
                        <div
                          key={index}
                          className="flex-shrink-0 text-center w-28 p-2 cursor-pointer transition-all duration-300 transform hover:scale-105"
                          onClick={() => handleBrandClick(brand)}
                        >
                          <div className="w-16 h-16 mx-auto mb-2 rounded-full border-2 border-blue-500 p-1 bg-white shadow-md">
                            <Avatar
                              src={brand.image}
                              className="w-full h-full object-cover"
                              size={56}
                            />
                          </div>
                          <Text strong className="block text-sm truncate">
                            {brand.name}
                          </Text>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Card>
      </div>

      {/* Top Deal Products */}
      <Card
        className="shadow-md hover:shadow-xl transition-shadow duration-300"
        title={
          <div className="flex justify-between items-center">
            <Title level={4} className="m-0 flex items-center">
              <FireOutlined className="mr-2 text-red-500" />
              Top Deal • Siêu Rẻ
            </Title>
            <Button
              type="link"
              className="text-blue-500 hover:text-blue-700"
              onClick={() => navigate(paths.PRODUCTS)}
            >
              Xem tất cả
            </Button>
          </div>
        }
      >
        <div className="relative">
          <div 
            className="flex space-x-4 overflow-x-auto py-4 hide-scrollbar scroll-smooth"
            ref={productListRef}
          >
            {loading ? (
              Array(5).fill(0).map((_, i) => (
                <div key={i} className="flex-shrink-0 w-48 md:w-56">
                  <Card className="w-full h-full">
                    <Skeleton.Image active className="w-full h-40 mb-4" />
                    <Skeleton active paragraph={{ rows: 1 }} />
                  </Card>
                </div>
              ))
            ) : products.length === 0 ? (
              <Empty description="Không có sản phẩm nào" />
            ) : (
              products
                .filter(product => product.stars === 5)
                .map((product, index) => (
                  <Card
                    key={index}
                    hoverable
                    className="flex-shrink-0 w-48 md:w-56 transition-all duration-300 hover:-translate-y-2"
                    cover={
                      <div className="h-48 overflow-hidden relative">
                        {product?.skus[0]?.images && (
                          <img
                            src={product.skus[0].images.split(",")[0]}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                          />
                        )}
                        <Badge.Ribbon
                          text="Chính hãng"
                          color="blue"
                          className="opacity-80"
                        />
                        {product.skus[0]?.discount > 0 && (
                          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            -{product.skus[0].discount}%
                          </div>
                        )}
                      </div>
                    }
                    onClick={() => navigateToProduct(product)}
                  >
                    <Meta
                      title={
                        <Text strong className="line-clamp-2 min-h-[3em]">
                          {product.name}
                        </Text>
                      }
                      description={
                        <div className="mt-2">
                          <div className="flex items-center text-yellow-500 mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <StarFilled
                                key={star}
                                className={star <= product.stars ? "text-yellow-500" : "text-gray-300"}
                              />
                            ))}
                          </div>
                          {product.skus[0]?.discount && product.skus[0]?.price ? (
                            <div className="flex flex-col">
                              <Text className="text-lg font-bold text-red-500">
                                {((product.skus[0].price * (100 - product.skus[0].discount)) / 100).toLocaleString()}đ
                              </Text>
                              <Text delete type="secondary" className="text-sm">
                                {product.skus[0].price.toLocaleString()}đ
                              </Text>
                            </div>
                          ) : (
                            <Text className="text-lg font-bold text-red-500">
                              {product.skus[0]?.price ? `${product.skus[0].price.toLocaleString()}đ` : "Liên hệ"}
                            </Text>
                          )}
                        </div>
                      }
                    />
                  </Card>
                ))
            )}
          </div>

          {/* Scroll Buttons */}
          <Button
            type="primary"
            shape="circle"
            icon={<LeftOutlined />}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-200/80 text-gray-800 hover:bg-gray-300 border-0 shadow-lg"
            onClick={() => scrollProductList('left')}
          />
          <Button
            type="primary" 
            shape="circle"
            icon={<RightOutlined />}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-200/80 text-gray-800 hover:bg-gray-300 border-0 shadow-lg"
            onClick={() => scrollProductList('right')}
          />
        </div>
      </Card>

      <style jsx global>{`
        .custom-dots li button {
          background: rgba(255, 255, 255, 0.5) !important;
          height: 8px !important;
          width: 8px !important;
          border-radius: 50% !important;
        }
        
        .custom-dots li.slick-active button {
          background: white !important;
        }
        
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default TopDealProduct;
