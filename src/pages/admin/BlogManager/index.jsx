import React, { useEffect, useState } from "react";
import { 
  Modal, 
  notification, 
  Tooltip, 
  Table, 
  Space, 
  Button, 
  Card, 
  Typography, 
  Popconfirm, 
  Image,
  PageHeader
} from "antd";
import { deleteBlog, getBlog } from "apis/blog.api";
import moment from "moment";
import { useDispatch } from "react-redux";
import { changeLoading } from "store/slicers/common.slicer";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import logo from "assets/images/logo.jpg";
import BlogForm from "./BlogForm";

const { Title } = Typography;

function BlogManager() {
  const dispatch = useDispatch();

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [blogs, setBlogs] = useState([]);
  const [editBlog, setEditBlog] = useState(null);
  const [isShowModal, setIsShowModal] = useState(false);

  const fetchBlogs = async (params = {}) => {
    dispatch(changeLoading());
    try {
      const requestParams = {
        limit: params.pageSize || pagination.pageSize,
        page: params.current || pagination.current,
      };
      
      const res = await getBlog(requestParams);
      
      setBlogs(res?.result?.content || []);
      setPagination({
        ...pagination,
        current: params.current || pagination.current,
        pageSize: params.pageSize || pagination.pageSize,
        total: res?.result?.totalElements || 0
      });
    } catch (error) {
      notification.error({ 
        message: "Lỗi khi tải dữ liệu",
        description: error?.message,
        duration: 2 
      });
    }
    dispatch(changeLoading());
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleTableChange = (newPagination) => {
    fetchBlogs({
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    });
  };

  const openFormUpdate = (blog) => {
    setEditBlog(blog);
    setIsShowModal(true);
  };

  const handleDelete = async (id) => {
    dispatch(changeLoading());
    try {
      await deleteBlog(id);
      notification.success({ 
        message: "Xóa bài viết thành công",
        duration: 2
      });
      fetchBlogs({ current: pagination.current, pageSize: pagination.pageSize });
    } catch (error) {
      const message =
        error.code === 1009
          ? "Bài viết không tồn tại trong danh mục này"
          : "Lỗi khi xóa bài viết, vui lòng thử lại...";

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
      width: 70,
      render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: 'Danh mục',
      dataIndex: 'categoryBlogName',
      key: 'categoryBlogName',
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: 'Tác giả',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => date ? moment(date).format('DD/MM/YYYY') : 'N/A',
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 200,
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
            title="Bạn có chắc chắn muốn xóa bài viết này?"
            onConfirm={() => handleDelete(record.blogId)}
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
    <Card className="blog-manager-container">
      <Modal
        title={editBlog ? "Cập nhật bài viết" : "Thêm bài viết mới"}
        width={800}
        open={isShowModal}
        onCancel={() => setIsShowModal(false)}
        footer={null}
        destroyOnClose
      >
        <BlogForm
          closeModal={() => setIsShowModal(false)}
          fetchData={fetchBlogs}
          blogCurrent={editBlog}
        />
      </Modal>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <img
            src={logo}
            alt="logo"
            style={{ width: 50, height: 50, objectFit: 'contain' }}
          />
          <Title level={3} style={{ margin: 0 }}>Quản lý bài viết</Title>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => openFormUpdate()}
        >
          Thêm bài viết
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={blogs}
        rowKey="blogId"
        pagination={pagination}
        onChange={handleTableChange}
        bordered
        scroll={{ x: 800 }}
        onRow={(record) => ({
          onMouseEnter: () => {
            // Xử lý khi hover vào dòng nếu cần
          }
        })}
      />
    </Card>
  );
}

export default BlogManager;
