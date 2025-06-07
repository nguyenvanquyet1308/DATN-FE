import React, { useEffect, useState } from "react";
import { Skeleton, Card, Typography, Row, Col, List, Divider, Tag, Badge, Rate, Button, Empty, Spin } from "antd";
import TopDealProduct from "pages/public/Home/TopDealProduct";
import { getProductCate } from "apis/productCate.api";
import { getProducts } from "apis/product.api";
import { formatCurrency } from "utils/formatCurrency";
import { fillUniqueATTSkus, trunCateText } from "utils/helper";
import paths from "constant/paths";
import { generatePath, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "pages/admin/components/Pagination";
import { changeLoading, setFilterParams } from "store/slicers/common.slicer";
import QueryString from "qs";
import { getProductListRequest } from "store/slicers/product.slicer";
import { AppstoreOutlined, MenuOutlined, FilterOutlined, ShoppingOutlined, FireOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Meta } = Card;

const TopProducts = () => {
  const { filterParams } = useSelector((state) => state.common);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [categories, setCategories] = useState([]);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    data: products,
    meta,
    loading,
    error,
  } = useSelector((state) => state.product.productList);

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const res = await getProductCate({ limit: 30 });
      setCategories(res?.result?.content || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchProducts = () => {
    dispatch(getProductListRequest({ page: page, limit: 20 }));
    setTotalPages(meta?.totalPage);
    setTotalElements(meta?.totalProduct);
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [page, limit]);

  const toggleShowCategories = () => {
    setShowAllCategories(!showAllCategories);
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(category.slug);
    dispatch(
      setFilterParams({
        ...filterParams,
        category: category.slug,
      })
    );
    navigate({
      pathname: paths.PRODUCTS,
      search: QueryString.stringify({
        ...filterParams,
        category: category.slug,
      }),
    });
  };

  return (
    <div className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <Row gutter={[24, 24]}>
          {/* Sidebar - Categories */}
          <Col 
            xs={24} 
            md={6} 
            lg={5} 
            className={`${isMobile ? 'order-2' : 'order-1'}`}
          >
            <div className="bg-white rounded-lg shadow-md p-5 sticky top-20 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <Title level={4} className="m-0 flex items-center">
                  <AppstoreOutlined className="mr-2 text-blue-500" /> 
                  Danh mục
                </Title>
                {isMobile && (
                  <Button 
                    type="link" 
                    onClick={toggleShowCategories}
                    className="text-blue-500"
                  >
                    {showAllCategories ? "Thu gọn" : "Xem thêm"}
                  </Button>
                )}
              </div>

              <Divider className="my-3" />

              {loadingCategories ? (
                <div className="space-y-4">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton.Button 
                      key={i} 
                      active 
                      block 
                      className="h-12" 
                    />
                  ))}
                </div>
              ) : categories?.length === 0 ? (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không có danh mục nào" />
              ) : (
                <List
                  className="category-list"
                  dataSource={showAllCategories || !isMobile ? categories : categories.slice(0, 6)}
                  renderItem={(item) => (
                    <List.Item 
                      className="p-0 border-0"
                      key={item.id}
                    >
                      <Button
                        block
                        className={`flex items-center justify-start text-left px-3 py-2.5 mb-2 hover:bg-blue-50 transition-all duration-200 ${
                          activeCategory === item.slug ? 'bg-blue-50 border-blue-500 shadow-sm' : ''
                        }`}
                        onClick={() => handleCategoryClick(item)}
                      >
                        <div className="w-8 h-8 overflow-hidden rounded-full bg-gray-100 mr-3 flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <Text 
                          className={`flex-grow truncate ${activeCategory === item.slug ? 'text-blue-500 font-medium' : ''}`}
                        >
                          {item.name}
                        </Text>
                      </Button>
                    </List.Item>
                  )}
                />
              )}
            </div>
          </Col>

          {/* Main Content */}
          <Col 
            xs={24} 
            md={18} 
            lg={19} 
            className={`${isMobile ? 'order-1' : 'order-2'}`}
          >
            <div className="mb-8">
              <TopDealProduct />
            </div>

            <div className="bg-white rounded-lg shadow-md p-5 mb-6">
              <div className="flex items-center justify-between mb-4">
                <Title level={3} className="flex items-center m-0">
                  <FireOutlined className="mr-2 text-red-500" />
                  <span>Gợi ý hôm nay</span>
                </Title>
                <Tag color="red" className="text-base px-3 py-1">
                  <ShoppingOutlined className="mr-1" /> Hot
                </Tag>
              </div>

              <Divider className="my-3" />

              {loading ? (
                <Row gutter={[16, 24]}>
                  {[...Array(8)].map((_, i) => (
                    <Col xs={12} sm={8} md={8} lg={6} key={i}>
                      <Card className="h-full">
                        <Skeleton.Image active className="w-full h-32" />
                        <Skeleton active paragraph={{ rows: 1 }} />
                      </Card>
                    </Col>
                  ))}
                </Row>
              ) : products?.length === 0 ? (
                <Empty description="Không có sản phẩm nào" />
              ) : (
                <Row gutter={[16, 24]}>
                  {products?.map((product) => (
                    <Col xs={12} sm={8} md={8} lg={6} key={product?.id}>
                      <Card
                        hoverable
                        className="product-card h-full transition-all duration-300 overflow-hidden"
                        cover={
                          <div className="relative overflow-hidden pt-[100%]">
                            <img
                              alt={product.name}
                              src={product.skus[0]?.images?.split(",")[0]}
                              className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                            />
                            {product.skus[0]?.discount > 0 && (
                              <Badge.Ribbon 
                                text={`-${product.skus[0]?.discount}%`} 
                                color="red"
                                className="opacity-90"
                              />
                            )}
                          </div>
                        }
                        onClick={() =>
                          navigate(
                            generatePath(paths.DETAIL_PRODUCT, {
                              id: product?.id,
                            }),
                            { state: { productData: product } }
                          )
                        }
                      >
                        <Meta
                          title={
                            <Text strong className="line-clamp-2 min-h-[3em]">
                              {trunCateText(product.name, 50)}
                            </Text>
                          }
                          description={
                            <div className="space-y-2 pt-2">
                              <Rate 
                                disabled 
                                defaultValue={product.stars || 0} 
                                className="text-xs"
                              />
                              <div className="flex flex-col">
                                <Text className="text-lg font-bold text-red-500">
                                  {formatCurrency(product.skus[0]?.price)}
                                </Text>
                                {product.skus[0]?.discount > 0 && (
                                  <Text delete type="secondary" className="text-sm">
                                    {formatCurrency(
                                      product.skus[0]?.price * (1 + product.skus[0]?.discount / 100)
                                    )}
                                  </Text>
                                )}
                              </div>
                            </div>
                          }
                        />
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}

              <div className="flex justify-center mt-8">
                <Pagination
                  listLimit={[10, 20, 40, 100]}
                  limitCurrent={limit}
                  setLimit={setLimit}
                  totalPages={totalPages}
                  setPage={setPage}
                  pageCurrent={page}
                  totalElements={totalElements}
                />
              </div>
            </div>
          </Col>
        </Row>
      </div>

      <style jsx global>{`
        .product-card .ant-card-body {
          padding: 16px;
        }
        
        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }
        
        .category-list .ant-list-item {
          padding: 0;
          margin-bottom: 4px;
        }
        
        @media (max-width: 768px) {
          .ant-card-body {
            padding: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default TopProducts;
