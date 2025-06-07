import React, { useEffect, useState } from "react";
import { 
  Form, 
  Input, 
  Button, 
  notification, 
  Select, 
  Typography, 
  Space, 
  Divider 
} from "antd";
import { getRoles } from "apis/role.api";
import { createUser, updateUser } from "apis/user.api";
import { cleanEmptyDataObject } from "utils/helper";
import logo from "assets/images/logo.jpg";
import { UserOutlined, LockOutlined, PhoneOutlined, MailOutlined } from "@ant-design/icons";

const { Title } = Typography;
const { Option } = Select;

function UserForm({ closeModal, fetchData, userCurrent }) {
  const [form] = Form.useForm();
  const [userRoles, setUserRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Khởi tạo form với giá trị mặc định
    form.setFieldsValue({
      email: userCurrent?.email || "",
      password: userCurrent ? undefined : "123456",
      role: userCurrent?.role?.id || "1",
      phone_number: userCurrent?.phone_number || "",
      username: userCurrent?.username || "",
      avatar: userCurrent?.avatar || "",
    });

    const fetchRoles = async () => {
      try {
        const res = await getRoles();
        if (res?.result?.content) {
          setUserRoles(res.result.content);
        } else {
          setUserRoles([]);
        }
      } catch (error) {
        notification.error({
          message: "Lỗi khi tải vai trò",
          description: error.message || "Đã xảy ra lỗi, vui lòng thử lại sau",
          duration: 3,
        });
      }
    };

    fetchRoles();
  }, [form, userCurrent]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Nếu là cập nhật và không thay đổi mật khẩu, xóa trường password
      if (userCurrent && !values.password) {
        delete values.password;
      }

      const payloadFormat = cleanEmptyDataObject({
        ...values,
        role: { id: +values.role },
      });

      if (userCurrent) {
        await updateUser(userCurrent.id, payloadFormat);
        notification.success({
          message: "Cập nhật người dùng thành công",
          duration: 2,
        });
      } else {
        await createUser(payloadFormat);
        notification.success({
          message: "Tạo người dùng thành công",
          duration: 2,
        });
      }

      closeModal();
      fetchData();
    } catch (error) {
      notification.error({ 
        message: "Lỗi khi lưu thông tin người dùng",
        description: error.message || "Đã xảy ra lỗi, vui lòng thử lại sau",
        duration: 3 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Space align="center" style={{ marginBottom: '20px' }}>
        <img src={logo} alt="logo" style={{ width: '60px', height: 'auto' }} />
        <Title level={4} style={{ margin: 0 }}>
          {userCurrent ? "Chỉnh sửa thông tin người dùng" : "Tạo người dùng mới"}
        </Title>
      </Space>

      <Divider />

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Form.Item
          name="username"
          label="Tên người dùng"
          rules={[
            { 
              required: true, 
              message: "Vui lòng nhập tên người dùng" 
            },
            { 
              min: 3, 
              message: "Tên người dùng phải có ít nhất 3 ký tự" 
            },
            { 
              max: 20, 
              message: "Tên người dùng không được vượt quá 20 ký tự" 
            }
          ]}
        >
          <Input 
            prefix={<UserOutlined />} 
            placeholder="Nhập tên người dùng" 
          />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { 
              required: true, 
              message: "Vui lòng nhập email" 
            },
            { 
              type: "email", 
              message: "Email không hợp lệ" 
            }
          ]}
        >
          <Input 
            prefix={<MailOutlined />} 
            placeholder="Nhập email" 
          />
        </Form.Item>

        <Form.Item
          name="password"
          label="Mật khẩu"
          rules={[
            { 
              required: !userCurrent, 
              message: "Vui lòng nhập mật khẩu" 
            },
            { 
              min: 6, 
              message: "Mật khẩu phải có ít nhất 6 ký tự" 
            }
          ]}
        >
          <Input.Password 
            prefix={<LockOutlined />} 
            placeholder={userCurrent ? "Để trống nếu không thay đổi" : "Nhập mật khẩu"} 
          />
        </Form.Item>

        <Form.Item
          name="phone_number"
          label="Số điện thoại"
          rules={[
            { 
              pattern: /^(\+?\d{1,3}[-.\s]?)?(\(?\d{1,4}\)?[-.\s]?)?[\d\s.-]{7,15}$/, 
              message: "Số điện thoại không hợp lệ" 
            }
          ]}
        >
          <Input 
            prefix={<PhoneOutlined />} 
            placeholder="Nhập số điện thoại" 
          />
        </Form.Item>

        <Form.Item
          name="role"
          label="Vai trò"
          rules={[{ required: true, message: "Vui lòng chọn vai trò" }]}
        >
          <Select placeholder="Chọn vai trò">
            {userRoles.map((role) => (
              <Option key={role.id} value={role.id}>
                {role.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button onClick={closeModal}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {userCurrent ? "Cập nhật" : "Tạo mới"}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
}

export default UserForm;
