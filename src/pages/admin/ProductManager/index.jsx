import React, { useEffect, useState } from "react";
import { 
  Button, 
  Input, 
  notification, 
  Select, 
  Tooltip, 
  Table, 
  Space, 
  Card, 
  Typography, 
  Image, 
  Tag,
  Popconfirm
} from "antd";
import { deleteProduct, getProducts } from "apis/product.api";
import { getProductCate } from "apis/productCate.api";
import moment from "moment";
import { useDispatch } from "react-redux";
import { changeLoading } from "store/slicers/common.slicer";
import Icons from "utils/icons";
import logo from "assets/images/logo.jpg";
import { generatePath, useNavigate } from "react-router-dom";
import paths from "constant/paths";
import { trunCateText } from "utils/helper";
import useDebounce from "hooks/useDebounce";
import { getProductBrands } from "apis/productBrand.api";
import ReactStars from "react-stars";

const { Title, Text } = Typography;
const { Option } = Select;
const { Search } = Input;

function ProductManager() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
    }
  });
  
  const [products, setProducts] = useState([]);
  const [keyword, setKeyword] = useState("");
  const searchDebounce = useDebounce(keyword, 600);
  const [filterCategories, setFilterCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filterBrands, setFilterBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedSort, setSelectedSort] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await getProductCate();
      setFilterCategories(res.result.content || []);
    } catch (error) {
      notification.error({
        message: "Lỗi khi tải danh mục sản phẩm",
        description: error.message || "Đã xảy ra lỗi, vui lòng thử lại sau",
        duration: 3
      });
    }
  };

  const fetchBrands = async () => {
    try {
      const res = await getProductBrands();
      setFilterBrands(res.result.content || []);
    } catch (error) {
      notification.error({
        message: "Lỗi khi tải thương hiệu",
        description: error.message || "Đã xảy ra lỗi, vui lòng thử lại sau",
        duration: 3
      });
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { current, pageSize } = tableParams.pagination;
      const params = {
        limit: pageSize,
        page: current,
      };

      if (searchDebounce) params.keyword = searchDebounce;
      if (selectedCategory) params.category = selectedCategory;
      if (selectedBrand) params.brand = selectedBrand;

      if (selectedSort) {
        params.sortBy = selectedSort.split(".")[0];
        params.orderBy = selectedSort.split(".")[1];
      }

      const res = await getProducts(params);
      setProducts(res?.result?.content || []);
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          total: res?.result?.totalElements || 0,
        },
      });
    } catch (error) {
      notification.error({ 
        message: "Lỗi khi tải danh sách sản phẩm", 
        description: error.message || "Đã xảy ra lỗi, vui lòng thử lại sau",
        duration: 3 
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [JSON.stringify(tableParams.pagination)]);

  useEffect(() => {
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        current: 1,
      },
    });
    fetchProducts();
  }, [searchDebounce, selectedCategory, selectedBrand, selectedSort]);

  const handleTableChange = (pagination) => {
    setTableParams({
      ...tableParams,
      pagination,
    });
  };

  const handleDelete = async (id) => {
    dispatch(changeLoading());
    try {
      await deleteProduct(id);
      notification.success({ 
        message: "Xóa sản phẩm thành công",
        duration: 3
      });
      fetchProducts();
    } catch (error) {
      const message = error.code == 1009
        ? "Sản phẩm đang được sử dụng và không thể xóa"
        : "Lỗi khi xóa sản phẩm, vui lòng thử lại sau";

      notification.error({
        message,
        description: error.message,
        duration: 3,
      });
    } finally {
      dispatch(changeLoading());
    }
  };

  const columns = [
    {
      title: '#',
      key: 'index',
      width: 60,
      render: (text, record, index) => (tableParams.pagination.current - 1) * tableParams.pagination.pageSize + index + 1,
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          <Image 
            src={record.skus?.[0]?.images?.split(",")?.[0] || "error"} 
            alt={text}
            width={40}
            height={40}
            style={{ objectFit: 'cover' }}
            fallback="data:image/png;base64,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"
          />
          <span>{trunCateText(text, 24)}</span>
        </Space>
      ),
    },
    {
      title: 'Thương hiệu',
      dataIndex: 'brand',
      key: 'brand',
      render: (brand) => <Tag color="blue">{brand?.name || "N/A"}</Tag>,
    },
    {
      title: 'Loại',
      dataIndex: 'category',
      key: 'category',
      render: (category) => <Tag color="green">{category?.name || "N/A"}</Tag>,
    },
    {
      title: 'Biến thể',
      key: 'variations',
      render: (text, record) => <Tag color="purple">{record.skus?.length || 0}</Tag>,
    },
    {
      title: 'Số lượng',
      key: 'stock',
      render: (text, record) => (
        <Tag color={getTotalStock(record) > 0 ? "success" : "error"}>
          {getTotalStock(record)}
        </Tag>
      ),
    },
    {
      title: 'Đánh giá',
      dataIndex: 'stars',
      key: 'stars',
      render: (stars) => (
        <ReactStars
          value={stars || 0}
          size={20}
          half={true}
          edit={false}
        />
      ),
    },
    {
      title: 'Đã bán',
      dataIndex: 'totalSold',
      key: 'totalSold',
      render: (totalSold) => <Tag color="orange">{totalSold || 0}</Tag>,
    },
    {
      title: 'Cập nhật lúc',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (updatedAt) => updatedAt ? moment(updatedAt).format("DD/MM/YYYY") : "N/A",
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Chỉnh sửa">
            <Button
              type="primary"
              icon={<Icons.FaEdit />}
              onClick={() => navigate(paths.ADMIN.UPDATE_PRODUCT + `?id=${record?.id}`)}
            />
          </Tooltip>
          <Tooltip title="Nhân bản">
            <Button
              type="primary"
              style={{ backgroundColor: '#722ed1' }}
              icon={<Icons.IoDuplicateOutline />}
              onClick={() => navigate(generatePath(paths.ADMIN.DUPLICATE_PRODUCT, { id: record?.id }))}
            />
          </Tooltip>
          <Popconfirm
            title="Xóa sản phẩm"
            description="Bạn có chắc chắn muốn xóa sản phẩm này?"
            onConfirm={() => handleDelete(record?.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button
              danger
              type="primary"
              icon={<Icons.MdDeleteForever />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Hàm tính tổng số lượng sản phẩm từ tất cả các SKU
  const getTotalStock = (product) => {
    return product?.skus?.reduce((prev, cur) => prev + (cur?.stock || 0), 0) || 0;
  };

  const sortOptions = [
    { value: "sold.desc", label: "Phổ biến" },
    { value: "stars.desc", label: "Đánh giá cao" },
    { value: "price.asc", label: "Giá thấp đến cao" },
    { value: "price.desc", label: "Giá cao đến thấp" }
  ];

  return (
    <Card className="product-manager" style={{ margin: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <Space size="middle" align="center">
          <img
            src={logo}
            alt="logo"
            style={{ width: '60px', height: 'auto' }}
          />
          <Title level={3} style={{ margin: 0 }}>Danh sách sản phẩm</Title>
        </Space>
        
        <Button
          type="primary"
          icon={<Icons.FaPlus />}
          onClick={() => navigate(paths.ADMIN.UPDATE_PRODUCT)}
        >
          Tạo sản phẩm
        </Button>
      </div>

      <Card>
        <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: '16px' }}>
          <Space size="middle">
            <Select
              placeholder="Lọc theo loại"
              value={selectedCategory}
              onChange={(value) => setSelectedCategory(value)}
              style={{ width: "200px" }}
              allowClear
            >
              {filterCategories.map((category) => (
                <Option key={category.id} value={category.slug}>
                  {category.name}
                </Option>
              ))}
            </Select>
            
            <Select
              placeholder="Lọc theo thương hiệu"
              value={selectedBrand}
              onChange={(value) => setSelectedBrand(value)}
              style={{ width: "200px" }}
              allowClear
            >
              {filterBrands.map((brand) => (
                <Option key={brand.id} value={brand.slug}>
                  {brand.name}
                </Option>
              ))}
            </Select>
            
            <Select
              placeholder="Sắp xếp"
              style={{ width: 180 }}
              onChange={(value) => setSelectedSort(value)}
              allowClear
              value={selectedSort}
            >
              {sortOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Space>
          
          <Search
            placeholder="Tìm kiếm sản phẩm"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            style={{ width: 300 }}
            allowClear
          />
        </Space>

        <Table
          columns={columns}
          dataSource={products}
          rowKey="id"
          pagination={tableParams.pagination}
          loading={loading}
          onChange={handleTableChange}
          scroll={{ x: 1200 }}
        />
      </Card>
    </Card>
  );
}

export default ProductManager;
