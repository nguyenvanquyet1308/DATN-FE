import React, { useEffect, useState } from "react";
import { 
  Modal, 
  notification, 
  Table, 
  Button, 
  Space, 
  Card, 
  Typography, 
  Popconfirm,
  Row,
  Col
} from "antd";
import { 
  EditOutlined, 
  DeleteOutlined, 
  PlusOutlined 
} from "@ant-design/icons";
import { deleteCategoryBlog, getCategoryBlog } from "apis/categoryBlog.api";
import { useDispatch } from "react-redux";
import { changeLoading } from "store/slicers/common.slicer";
import CategoryBlogForm from "./CategoryBlogForm";
import moment from "moment";
import logo from "assets/images/logo.jpg";

const { Title } = Typography;

function CategoryBlogManager() {
  const dispatch = useDispatch();

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [categoryBlogs, setCategoryBlogs] = useState([]);
  const [editCategoryBlog, setEditCategoryBlog] = useState(null);
  const [isShowModal, setIsShowModal] = useState(false);

  const fetchCategoryBlogs = async (params = {}) => {
    dispatch(changeLoading());
    try {
      const requestParams = {
        limit: params.pageSize || pagination.pageSize,
        page: params.current || pagination.current
      };
      
      const res = await getCategoryBlog(requestParams);
      
      setCategoryBlogs(res?.result?.content || []);
      setPagination({
        ...pagination,
        current: params.current || pagination.current,
        pageSize: params.pageSize || pagination.pageSize,
        total: res?.result?.totalElements || 0
      });
    } catch (error) {
      notification.error({ 
        message: "Lỗi khi tải danh mục bài viết",
        description: error.message,
        duration: 2 
      });
    }
    dispatch(changeLoading());
  };

  useEffect(() => {
    fetchCategoryBlogs();
  }, []);

  const handleTableChange = (newPagination) => {
    fetchCategoryBlogs({
      current: newPagination.current,
      pageSize: newPagination.pageSize
    });
  };

  const openFormUpdate = (item) => {
    setEditCategoryBlog(item);
    setIsShowModal(true);
  };

  const handleDelete = async (id) => {
    dispatch(changeLoading());
    try {
      await deleteCategoryBlog(id);
      notification.success({ 
        message: "Xóa danh mục bài viết thành công",
        duration: 2 
      });
      fetchCategoryBlogs({ 
        current: pagination.current, 
        pageSize: pagination.pageSize 
      });
    } catch (error) {
      const message =
        error.code === 1009
          ? "Danh mục không tồn tại hoặc đã bị xóa"
          : "Lỗi khi xóa danh mục, vui lòng thử lại...";
      notification.error({
        message,
        duration: 2,
      });
    }
    dispatch(changeLoading());
  };

  const columns = [
    {
      title: 'STT',
      key: 'index',
      width: 80,
      align: 'center',
      render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: 'Tên danh mục',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (date) => date ? moment(date).format('DD/MM/YYYY') : 'N/A',
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 200,
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => openFormUpdate(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa danh mục này?"
            onConfirm={() => handleDelete(record.categoryBlogId)}
            okText="Có"
            cancelText="Không"
          >
            <Button
              type="primary" 
              danger
              icon={<DeleteOutlined />}
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card className="category-blog-manager">
      <Modal
        title={editCategoryBlog ? "Cập nhật danh mục" : "Thêm danh mục mới"}
        width={800}
        open={isShowModal}
        onCancel={() => setIsShowModal(false)}
        footer={null}
        destroyOnClose
      >
        <CategoryBlogForm
          closeModal={() => setIsShowModal(false)}
          fetchData={fetchCategoryBlogs}
          categoryBlogCurrent={editCategoryBlog}
        />
      </Modal>

      <Row 
        align="middle" 
        justify="space-between" 
        style={{ marginBottom: 16 }}
      >
        <Col>
          <Space align="center" size={16}>
            <img 
              src={logo} 
              alt="logo" 
              style={{ width: 50, height: 50, objectFit: "contain" }} 
            />
            <Title level={3} style={{ margin: 0 }}>
              Quản lý danh mục bài viết
            </Title>
          </Space>
        </Col>
        <Col>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => openFormUpdate()}
          >
            Thêm danh mục
          </Button>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={categoryBlogs}
        rowKey="categoryBlogId"
        pagination={{
          ...pagination,
          showSizeChanger: true,
          pageSizeOptions: [10, 25, 40, 100],
          showTotal: (total) => `Tổng cộng ${total} danh mục`
        }}
        onChange={handleTableChange}
        bordered
        size="middle"
      />
    </Card>
  );
}

export default CategoryBlogManager;
