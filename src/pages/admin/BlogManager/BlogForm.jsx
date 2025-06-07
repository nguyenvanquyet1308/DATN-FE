import React, { useEffect, useState } from "react";
import { 
  Form, 
  Input, 
  Button, 
  Select, 
  notification, 
  Typography, 
  Upload, 
  Space, 
  Divider 
} from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { createBlog, updateBlog } from "apis/blog.api";
import { getCategoryBlog } from "apis/categoryBlog.api";
import { convertBase64ToImage, convertImageToBase64 } from "utils/helper";
import { changeLoading } from "store/slicers/common.slicer";
import MarkdownEditor from "components/MarkdownEditor";
import logo from "assets/images/logo.jpg";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

function BlogForm({ closeModal, fetchData, blogCurrent }) {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  
  const [previewImg, setPreviewImg] = useState(null);
  const [imgUpload, setImageUpload] = useState(null);
  const [categoryBlog, setCategoryBlog] = useState([]);
  const [content, setContent] = useState("");
  const userInfo = useSelector((state) => state.auth.userInfo.data);

  const fetchCategoryBlog = async () => {
    try {
      const params = { limit: 30 };
      const res = await getCategoryBlog(params);
      setCategoryBlog(res?.result?.content || []);
    } catch (error) {
      notification.error({ 
        message: "Không thể tải danh mục bài viết", 
        description: error.message 
      });
    }
  };

  useEffect(() => {
    fetchCategoryBlog();
    resetForm();
    
    if (blogCurrent?.blogId) {
      fillFormData();
    }
  }, [blogCurrent]);

  const fillFormData = async () => {
    form.setFieldsValue({
      title: blogCurrent.title,
      categoryBlogId: blogCurrent.categoryBlogId
    });
    
    setContent(blogCurrent?.content || "");

    if (blogCurrent?.image) {
      setPreviewImg(blogCurrent.image);
      try {
        const file = await convertBase64ToImage(blogCurrent.image);
        setImageUpload(file);
      } catch (error) {
        notification.error({ 
          message: "Lỗi khi tải hình ảnh", 
          description: error.message 
        });
      }
    }
  };

  const resetForm = () => {
    form.resetFields();
    setImageUpload(null);
    setPreviewImg(null);
    setContent("");
  };

  const handleSubmit = async (values) => {
    if (!imgUpload) {
      notification.error({ 
        message: "Vui lòng tải lên một hình ảnh cho bài viết" 
      });
      return;
    }

    const blogData = {
      ...values,
      content,
      userId: userInfo.id,
    };

    const formData = new FormData();
    formData.append("image", imgUpload);
    formData.append("blogData", JSON.stringify(blogData));

    dispatch(changeLoading());
    try {
      if (blogCurrent?.blogId) {
        await updateBlog(blogCurrent.blogId, formData);
        notification.success({ 
          message: "Cập nhật bài viết thành công" 
        });
      } else {
        await createBlog(formData);
        notification.success({ 
          message: "Tạo bài viết mới thành công" 
        });
      }
      await fetchData();
      closeModal();
    } catch (error) {
      notification.error({
        message: `${blogCurrent?.blogId ? "Cập nhật" : "Tạo"} bài viết không thành công`,
        description: error.message
      });
    } finally {
      dispatch(changeLoading());
    }
  };

  const handleImageChange = async (file) => {
    if (!file) return;
    
    if (file.type !== "image/png" && file.type !== "image/jpeg") {
      notification.error({ 
        message: "Chỉ hỗ trợ định dạng PNG và JPEG" 
      });
      return;
    }

    try {
      const base64 = await convertImageToBase64(file);
      setPreviewImg(base64);
      setImageUpload(file);
    } catch (error) {
      notification.error({ 
        message: "Lỗi khi xử lý hình ảnh", 
        description: error.message 
      });
    }
  };

  return (
    <div className="blog-form">
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <Space direction="vertical" align="center">
          <img src={logo} alt="logo" style={{ width: 80, height: 'auto' }} />
          <Title level={4}>
            {blogCurrent ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}
          </Title>
        </Space>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          title: "",
          categoryBlogId: categoryBlog?.[0]?.categoryBlogId || null
        }}
      >
        <Form.Item label="Hình ảnh bài viết">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div 
              style={{ 
                width: 200, 
                height: 200, 
                border: '1px dashed #d9d9d9', 
                borderRadius: 8, 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                overflow: 'hidden',
                marginBottom: 16
              }}
            >
              {previewImg ? (
                <img 
                  src={previewImg} 
                  alt="Thumbnail" 
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '100%', 
                    objectFit: 'contain' 
                  }} 
                />
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <PlusOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                  <div style={{ marginTop: 8 }}>Chọn hình ảnh</div>
                </div>
              )}
            </div>

            <Upload
              beforeUpload={(file) => {
                handleImageChange(file);
                return false;
              }}
              showUploadList={false}
              accept=".jpg,.jpeg,.png"
            >
              <Button icon={<UploadOutlined />}>
                {previewImg ? "Thay đổi hình ảnh" : "Tải hình ảnh lên"}
              </Button>
            </Upload>
          </div>
        </Form.Item>

        <Divider />

        <Form.Item
          name="categoryBlogId"
          label="Danh mục bài viết"
          rules={[{ required: true, message: 'Vui lòng chọn danh mục bài viết' }]}
        >
          <Select
            showSearch
            placeholder="Chọn danh mục bài viết"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {categoryBlog?.map((category) => (
              <Option key={category.categoryBlogId} value={category.categoryBlogId}>
                {category.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="title"
          label="Tiêu đề bài viết"
          rules={[{ required: true, message: 'Vui lòng nhập tiêu đề bài viết' }]}
        >
          <Input placeholder="Nhập tiêu đề bài viết" />
        </Form.Item>

        <Form.Item label="Nội dung bài viết">
          <MarkdownEditor
            height={400}
            value={content}
            setValue={setContent}
          />
        </Form.Item>

        <Form.Item>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <Button onClick={closeModal}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit">
              {blogCurrent ? "Cập nhật" : "Tạo mới"}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
}

export default BlogForm;
