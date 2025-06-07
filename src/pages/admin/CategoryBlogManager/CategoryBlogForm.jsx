import React, { useEffect, useState } from "react";
import { 
  Form, 
  Input, 
  Button, 
  notification, 
  Typography, 
  Space, 
  Divider 
} from "antd";
import { createCategoryBlog, updateCategoryBlog } from "apis/categoryBlog.api";
import { useDispatch } from "react-redux";
import { changeLoading } from "store/slicers/common.slicer";
import logo from "assets/images/logo.jpg";
import MarkdownEditor from "components/MarkdownEditor";

const { Title } = Typography;
const { TextArea } = Input;

function CategoryBlogForm({ closeModal, fetchData, categoryBlogCurrent }) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [description, setDescription] = useState("");

  useEffect(() => {
    // Reset form khi component mount
    form.resetFields();
    setDescription("");

    // Fill dữ liệu vào form nếu đang edit
    if (categoryBlogCurrent) {
      form.setFieldsValue({
        name: categoryBlogCurrent.name,
      });
      setDescription(categoryBlogCurrent.description || "");
    }
  }, [categoryBlogCurrent, form]);

  const handleSubmit = async (values) => {
    dispatch(changeLoading());

    try {
      const categoryBlogData = { 
        ...values, 
        description 
      };

      if (categoryBlogCurrent) {
        await updateCategoryBlog(
          categoryBlogCurrent.categoryBlogId,
          categoryBlogData,
        );
        notification.success({
          message: "Cập nhật danh mục thành công",
          description: `Danh mục ${values.name} đã được cập nhật`
        });
      } else {
        await createCategoryBlog(categoryBlogData);
        notification.success({
          message: "Tạo danh mục thành công",
          description: `Danh mục ${values.name} đã được tạo`
        });
      }
      fetchData();
      closeModal();
    } catch (error) {
      notification.error({
        message: "Thao tác không thành công",
        description: error.message || "Đã xảy ra lỗi, vui lòng thử lại"
      });
    } finally {
      dispatch(changeLoading());
    }
  };

  return (
    <div className="category-blog-form">
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <Space direction="vertical" align="center">
          <img src={logo} alt="logo" style={{ width: 80, height: "auto" }} />
          <Title level={4}>
            {categoryBlogCurrent ? "Chỉnh sửa danh mục" : "Tạo danh mục mới"}
          </Title>
        </Space>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ name: "" }}
      >
        <Form.Item
          name="name"
          label="Tên danh mục"
          rules={[
            { 
              required: true, 
              message: "Vui lòng nhập tên danh mục" 
            },
            {
              min: 2,
              message: "Tên danh mục phải có ít nhất 2 ký tự"
            }
          ]}
        >
          <Input placeholder="Nhập tên danh mục" />
        </Form.Item>

        <Divider orientation="left">Mô tả</Divider>

        <Form.Item label="Mô tả danh mục">
          <MarkdownEditor
            height={300}
            value={description}
            setValue={setDescription}
          />
        </Form.Item>

        <Form.Item>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 16 }}>
            <Button onClick={closeModal}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit">
              {categoryBlogCurrent ? "Cập nhật" : "Tạo mới"}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
}

export default CategoryBlogForm;
