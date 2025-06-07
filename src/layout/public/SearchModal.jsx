import React, { useEffect, useState } from "react";
import { Input, notification, Typography, Row, Col, Empty, Spin, Badge, Divider, Button } from "antd";
import { SearchOutlined, LoadingOutlined, ShoppingOutlined, RightOutlined } from '@ant-design/icons';
import { getProducts } from "apis/product.api";
import useDebounce from "hooks/useDebounce";
import Pagination from "pages/admin/components/Pagination";
import Product from "pages/public/Products/Product";

const { Title, Text } = Typography;

function SearchModal({ closeModal }) {
  const [keyword, setKeyword] = useState("");
  const keyDebounce = useDebounce(keyword, 600);
  const [productData, setProductData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const params = {
        limit,
        page,
        keyword: keyDebounce,
      };
      const res = await getProducts(params);
      setProductData(res?.result?.content || []);
      setTotalPages(res?.result?.totalPages || 0);
      setTotalElements(res?.result?.totalElements || 0);
    } catch (error) {
      notification.error({ 
        message: "Lỗi tìm kiếm", 
        description: error.message || "Không thể tìm kiếm sản phẩm", 
        duration: 3 
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchProducts();
  }, [keyDebounce, limit]);

  useEffect(() => {
    fetchProducts();
  }, [page]);

  return (
    <div className="search-modal py-6">
      {/* Header */}
      <div className="search-header mb-6">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={16} lg={18}>
            <Input
              size="large"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Tìm kiếm sản phẩm..."
              prefix={<SearchOutlined className="text-gray-400" />}
              allowClear
              autoFocus
              className="search-input rounded-full border-2 border-gray-200 hover:border-blue-400 focus:border-blue-500 py-2"
            />
          </Col>
          <Col xs={24} md={8} lg={6}>
            <div className="flex items-center">
              <Badge count={totalElements} showZero>
                <Title level={5} className="m-0 flex items-center">
                  <ShoppingOutlined className="mr-2" /> Sản phẩm
                </Title>
              </Badge>
            </div>
          </Col>
        </Row>
      </div>

      <Divider className="my-4" />

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-16">
          <Spin 
            indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />} 
            tip="Đang tìm kiếm..."
          />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && productData.length === 0 && (
        <Empty 
          description={
            <span className="text-gray-500">
              {keyword 
                ? `Không tìm thấy sản phẩm nào phù hợp với "${keyword}"` 
                : "Nhập từ khóa để tìm kiếm sản phẩm"}
            </span>
          }
          className="py-16"
        />
      )}

      {/* Results */}
      {!isLoading && productData.length > 0 && (
        <div className="search-results">
          <div className="flex justify-between items-center mb-4">
            <Text className="text-gray-600">
              Tìm thấy <span className="font-bold text-blue-600">{totalElements}</span> sản phẩm
            </Text>
            
            {productData.length > 1 && (
              <Pagination
                listLimit={[8, 12, 16, 24]}
                limitCurrent={limit}
                setLimit={setLimit}
                totalPages={totalPages}
                setPage={setPage}
                pageCurrent={page}
                totalElements={totalElements}
              />
            )}
          </div>

          <div className="results-grid">
            <Row gutter={[16, 24]}>
              {productData.map((product) => (
                <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                  <div 
                    onClick={closeModal}
                    className="transition-all duration-300 hover:shadow-lg rounded-lg overflow-hidden"
                  >
                    <Product data={product} />
                  </div>
                </Col>
              ))}
            </Row>
          </div>

          {!isLoading && page < totalPages && productData.length > 1 && (
            <div className="flex justify-center mt-8">
              <Button
                type="primary"
                ghost
                onClick={() => setLimit(prevLimit => prevLimit + 8)}
                className="rounded-full px-6 transition-all hover:shadow-md"
              >
                Xem thêm sản phẩm <RightOutlined />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Search tips */}
      {keyword && keyword.length < 3 && (
        <div className="search-tips bg-blue-50 p-4 rounded-lg mt-4">
          <Text className="text-blue-600">
            Mẹo: Nhập ít nhất 3 ký tự để có kết quả tìm kiếm chính xác hơn
          </Text>
        </div>
      )}

      <style jsx global>{`
        .search-modal .ant-input-affix-wrapper {
          transition: all 0.3s;
        }
        
        .search-modal .ant-input-affix-wrapper:hover {
          border-color: #40a9ff;
        }
        
        .search-modal .ant-input-affix-wrapper-focused {
          box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
        }
        
        .search-modal .ant-spin-text {
          margin-top: 8px;
          color: #1890ff;
        }
        
        .search-modal .ant-empty {
          padding: 40px 0;
        }
      `}</style>
    </div>
  );
}

export default SearchModal;
