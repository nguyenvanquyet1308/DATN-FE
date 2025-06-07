import { Modal, notification, Tooltip, Table, Card, Typography, Space, Button as AntButton, Popconfirm, Input } from "antd";
import { deleteProductCate, getProductCate } from "apis/productCate.api";
import Button from "components/Button";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { changeLoading } from "store/slicers/common.slicer";
import Icons from "utils/icons";
import Pagination from "../components/Pagination";
import ProductCateForm from "./ProductCateForm";
import moment from "moment";
import logo from "assets/images/logo.jpg";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

function ProductCategoryManager() {
  const dispatch = useDispatch();

  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [categories, setCategories] = useState([]);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [dataEdit, setDataEdit] = useState(null);
  const [isShowModal, setIsShowModal] = useState(false);
  const [searchText, setSearchText] = useState("");

  const fetchCategories = async () => {
    dispatch(changeLoading());
    try {
      const params = {
        limit,
        page,
      };
      const res = await getProductCate(params);
      setCategories(res?.result?.content);
      setTotalPages(res?.result?.totalPages);
      setTotalElements(res?.result?.totalElements);
    } catch (message) {
      notification.error({ message, duration: 2 });
    }
    dispatch(changeLoading());
  };

  useEffect(() => {
    fetchCategories();
  }, [page, limit]);

  const handleMouseEnter = (index) => {
    if (hoveredRow != index) setHoveredRow(index);
  };

  const handleMouseLeave = () => {
    setHoveredRow(null);
  };

  const handleDelete = async (id) => {
    dispatch(changeLoading());
    try {
      await deleteProductCate(id);
      notification.success({ message: "Xóa thành công" });
      fetchCategories();
    } catch (error) {
      const message =
        error.code == 1009
          ? "Sản phẩm tồn tại trong loại này"
          : "Lỗi vui lòng thử lại...";

      notification.error({
        message,
        duration: 2,
      });
    }
    dispatch(changeLoading());
  };

  const openFormUpdate = (data) => {
    setDataEdit(data);
    setIsShowModal(true);
  };

  // Filter data based on search text
  const filteredData = categories.filter(category => 
    category.name.toLowerCase().includes(searchText.toLowerCase()) || 
    category.slug.toLowerCase().includes(searchText.toLowerCase())
  );

  // Table columns definition
  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      render: (_, __, index) => index + 1,
      width: 70,
    },
    {
      title: 'Tên loại sản phẩm',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Text strong>{text}</Text>
      ),
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
    },
    {
      title: 'Cập nhật vào',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (date) => date ? moment(date).format("DD/MM/YYYY") : 'N/A',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <AntButton 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={() => openFormUpdate(record)}
            className="flex items-center"
          >
            Sửa
          </AntButton>
          <Popconfirm
            title="Bạn có chắc muốn xóa loại sản phẩm này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            placement="left"
          >
            <AntButton 
              danger 
              icon={<DeleteOutlined />}
              className="flex items-center"
            >
              Xóa
            </AntButton>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <Modal
        title={dataEdit ? "Cập nhật loại sản phẩm" : "Thêm loại sản phẩm mới"}
        width={800}
        open={isShowModal}
        onCancel={() => setIsShowModal(false)}
        footer={null}
        destroyOnClose
      >
        <ProductCateForm
          closeModal={() => setIsShowModal(false)}
          fetchData={fetchCategories}
          categoryCurrent={dataEdit}
        />
      </Modal>

      <Card className="shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <img
              src={logo}
              alt="logo"
              className="w-12 h-12 object-contain"
            />
            <Title level={3} className="m-0">Quản lý loại sản phẩm</Title>
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
            <Input 
              placeholder="Tìm kiếm theo tên hoặc slug" 
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="md:w-64"
              allowClear
            />
            <AntButton
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => openFormUpdate()}
              className="flex items-center bg-green-600 hover:bg-green-700"
            >
              Thêm mới
            </AntButton>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          pagination={false}
          bordered
          className="category-table"
          onRow={(record) => ({
            onMouseEnter: () => handleMouseEnter(record.id),
            onMouseLeave: handleMouseLeave,
          })}
          size="middle"
        />
        
        <div className="flex justify-end mt-4">
          <Pagination
            listLimit={[10, 25, 40, 100]}
            limitCurrent={limit}
            setLimit={setLimit}
            totalPages={totalPages}
            setPage={setPage}
            pageCurrent={page}
            totalElements={totalElements}
          />
        </div>
      </Card>

      <style jsx global>{`
        .category-table .ant-table-cell {
          vertical-align: middle;
        }
        
        .ant-table-row:hover {
          background-color: #f0f7ff !important;
          transition: all 0.3s ease;
        }
        
        @media (max-width: 768px) {
          .ant-table {
            overflow-x: auto;
          }
        }
      `}</style>
    </div>
  );
}

export default ProductCategoryManager;
