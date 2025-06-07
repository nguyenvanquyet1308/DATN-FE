import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { 
  Input, 
  Pagination, 
  Card, 
  Empty, 
  Spin, 
  Row, 
  Col, 
  Typography, 
  Space,
  Alert
} from "antd";
import AddProductToOrder from "./AddProductToOrder";

const { Title, Text } = Typography;
const { Search } = Input;

const ShowProductInOrder = () => {
  const {
    data: productList,
    loading,
    error,
  } = useSelector((state) => state.product.productList);

  const [keyword, setKeyword] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  useEffect(() => {
    if (Array.isArray(productList)) {
      const filtered = productList.filter((product) =>
        product.name.toLowerCase().includes(keyword.toLowerCase()),
      );
      setFilteredData(filtered);
      setCurrentPage(1); // Reset to first page on new search
    } else {
      setFilteredData([]);
    }
  }, [productList, keyword]);

  const handleSearch = (value) => {
    setKeyword(value);
  };

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  // Calculate pagination
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = Array.isArray(filteredData)
    ? filteredData.slice(startIndex, endIndex)
    : [];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" tip="Đang tải sản phẩm..." />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Lỗi khi tải dữ liệu"
        description={error.message || "Không thể tải danh sách sản phẩm"}
        type="error"
        showIcon
      />
    );
  }

  return (
    <Card>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Title level={4}>Thêm sản phẩm vào đơn hàng</Title>
        
        <Search
          placeholder="Tìm kiếm sản phẩm theo tên"
          allowClear
          enterButton="Tìm kiếm"
          size="large"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onSearch={handleSearch}
        />
        
        {filteredData.length === 0 ? (
          <Empty 
            description="Không tìm thấy sản phẩm nào" 
            image={Empty.PRESENTED_IMAGE_SIMPLE} 
          />
        ) : (
          <>
            <Text type="secondary">
              Tìm thấy {filteredData.length} sản phẩm
            </Text>
            
            <Row gutter={[16, 16]}>
              {paginatedData.map((product) => (
                <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                  <AddProductToOrder data={product} />
                </Col>
              ))}
            </Row>
            
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={filteredData.length}
                onChange={handlePageChange}
                showSizeChanger
                pageSizeOptions={[4, 8, 12, 16]}
                showTotal={(total) => `Tổng cộng ${total} sản phẩm`}
              />
            </div>
          </>
        )}
      </Space>
    </Card>
  );
};

export default ShowProductInOrder;
