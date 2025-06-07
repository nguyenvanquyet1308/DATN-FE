import React, { useState } from "react";
import { 
  Form, 
  Input, 
  Button, 
  notification, 
  Card, 
  Typography, 
  Divider, 
  Space, 
  Alert
} from "antd";
import { 
  LockOutlined, 
  EyeOutlined, 
  EyeInvisibleOutlined, 
  KeyOutlined,
  SaveOutlined
} from '@ant-design/icons';
import { updateChangePassword } from "apis/user.api";
import { useDispatch, useSelector } from "react-redux";
import { changeLoading } from "store/slicers/common.slicer";

const { Title, Text, Paragraph } = Typography;

const ChangePasswordForm = () => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const userInfo = useSelector((state) => state.auth.userInfo.data);
  const dispatch = useDispatch();

  const handleSubmit = async (values) => {
    if (values.newPassword !== values.confirmPassword) {
      notification.error({ 
        message: "Lỗi xác nhận mật khẩu",
        description: "Mật khẩu xác nhận không khớp với mật khẩu mới.",
        placement: "top"
      });
      return;
    }

    setSubmitting(true);
    dispatch(changeLoading());

    try {
      await updateChangePassword({
        email: userInfo.email,
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      });
      
      notification.success({ 
        message: "Thành công", 
        description: "Cập nhật mật khẩu thành công!", 
        placement: "top" 
      });
      
      form.resetFields();
    } catch (error) {
      notification.error({
        message: "Lỗi khi đổi mật khẩu",
        description: error.response?.data?.message || "Mật khẩu cũ không chính xác!",
        placement: "top"
      });
    } finally {
      dispatch(changeLoading());
      setSubmitting(false);
    }
  };

  // Quy tắc mật khẩu mạnh
  const validatePassword = (_, value) => {
    if (!value) {
      return Promise.reject("Vui lòng nhập mật khẩu mới");
    }
    if (value.length < 6) {
      return Promise.reject("Mật khẩu phải có ít nhất 6 ký tự");
    }
    return Promise.resolve();
  };

  return (
    <div className="change-password-container max-w-lg mx-auto">
      <Card 
        className="shadow-md hover:shadow-lg transition-all duration-300"
        bordered={false}
      >
        <div className="text-center mb-6">
          <Title level={2} className="text-blue-600 mb-2">Đổi mật khẩu</Title>
          <Paragraph type="secondary">
            Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu với người khác
          </Paragraph>
        </div>

        <Alert
          message="Lưu ý về bảo mật"
          description="Mật khẩu mạnh nên bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt. Nên đổi mật khẩu 3 tháng/lần."
          type="info"
          showIcon
          className="mb-6"
        />

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark="optional"
          className="password-form"
        >
          <Form.Item
            name="oldPassword"
            label="Mật khẩu hiện tại"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu hiện tại" }]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Nhập mật khẩu hiện tại"
              iconRender={(visible) =>
                visible ? 
                <EyeOutlined className="text-blue-500" /> : 
                <EyeInvisibleOutlined className="text-gray-400" />
              }
              className="py-2"
            />
          </Form.Item>

          <Divider plain>
            <Text type="secondary">Mật khẩu mới</Text>
          </Divider>

          <Form.Item
            name="newPassword"
            label="Mật khẩu mới"
            rules={[{ validator: validatePassword }]}
            extra="Mật khẩu phải có ít nhất 6 ký tự"
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Nhập mật khẩu mới"
              iconRender={(visible) =>
                visible ? 
                <EyeOutlined className="text-blue-500" /> : 
                <EyeInvisibleOutlined className="text-gray-400" />
              }
              className="py-2"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu mới"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu mới" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject("Mật khẩu xác nhận không khớp");
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Nhập lại mật khẩu mới"
              iconRender={(visible) =>
                visible ? 
                <EyeOutlined className="text-blue-500" /> : 
                <EyeInvisibleOutlined className="text-gray-400" />
              }
              className="py-2"
            />
          </Form.Item>

          <Form.Item className="mt-6">
            <Button
              type="primary"
              htmlType="submit"
              loading={submitting}
              icon={<SaveOutlined />}
              className="w-full h-10 text-base font-medium rounded-md"
              size="large"
            >
              Cập nhật mật khẩu
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <style jsx global>{`
        .change-password-container .ant-form-item-label > label {
          font-weight: 500;
        }
        
        .change-password-container .ant-input-affix-wrapper:hover,
        .change-password-container .ant-input-affix-wrapper:focus {
          border-color: #4096ff;
          box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
        }
        
        .change-password-container .ant-input-affix-wrapper-focused {
          border-color: #4096ff;
          box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
        }
        
        .password-form .ant-form-item-extra {
          color: #52c41a;
          font-size: 0.8rem;
        }
      `}</style>
    </div>
  );
};

export default ChangePasswordForm;
