import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  notification, 
  Form, 
  Input, 
  Button, 
  Avatar, 
  Typography, 
  Card, 
  Upload, 
  Space, 
  Divider, 
  message,
  Tooltip 
} from "antd";
import { 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  EditOutlined, 
  SaveOutlined, 
  CloseOutlined,
  UploadOutlined,
  CameraOutlined
} from '@ant-design/icons';
import { convertImageToBase64 } from "utils/helper";
import { updateInfoUser } from "apis/user.api";
import { getUserInfoRequest } from "store/slicers/auth.slicer";
import { useForm, Controller } from "react-hook-form";
import { changeLoading } from "store/slicers/common.slicer";

const { Title, Text } = Typography;

function EditAccount() {
  const userInfo = useSelector((state) => state.auth.userInfo.data);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm();

  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(userInfo?.avatar);
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    if (userInfo) {
      setValue("username", userInfo.username);
      setValue("email", userInfo.email);
      setValue("phone_number", userInfo.phone_number);
    }
  }, [userInfo, setValue]);

  const toggleEdit = () => setIsEditing((prev) => !prev);

  const handleAvatarChange = async (file) => {
    if (file.type !== "image/png" && file.type !== "image/jpeg") {
      notification.error({ 
        message: "File không được hỗ trợ",
        description: "Chỉ hỗ trợ file PNG hoặc JPEG",
        placement: "top" 
      });
      return;
    }
    const base64 = await convertImageToBase64(file);
    setAvatarPreview(base64);
    setAvatarFile(file);
    message.success("Ảnh đại diện đã được tải lên");
  };

  const onSubmit = async (data) => {
    dispatch(changeLoading());
    const updatedData = new FormData();
    Object.keys(data).forEach((key) => {
      if (data[key]) updatedData.append(key, data[key]);
    });
    if (avatarFile) updatedData.append("avatar", avatarFile);
    updatedData.append("userData", JSON.stringify(data));

    try {
      await updateInfoUser(userInfo.id, updatedData);
      notification.success({ 
        message: "Cập nhật thành công!", 
        placement: "top",
        duration: 3 
      });
      dispatch(getUserInfoRequest());
      setIsEditing(false);
    } catch (error) {
      notification.error({ 
        message: "Cập nhật thất bại!",
        description: error?.message || "Đã có lỗi xảy ra",
        placement: "top" 
      });
    }
    dispatch(changeLoading());
  };

  return (
    <div className="profile-edit-container">
      <Card 
        className="shadow-sm hover:shadow-md transition-shadow duration-300"
        bordered={false}
      >
        <div className="text-center mb-6">
          <Title level={2} className="text-blue-600 mb-0">Thông Tin Tài Khoản</Title>
          <Text type="secondary">Quản lý thông tin cá nhân của bạn</Text>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Avatar Section */}
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <Avatar 
                size={120} 
                src={avatarPreview}
                icon={!avatarPreview && <UserOutlined />}
                className="border-2 border-blue-200"
              />
              {isEditing && (
                <Tooltip title="Thay đổi ảnh đại diện">
                  <Upload
                    accept=".jpg,.jpeg,.png"
                    showUploadList={false}
                    beforeUpload={(file) => {
                      handleAvatarChange(file);
                      return false;
                    }}
                    className="absolute bottom-0 right-0"
                  >
                    <Button 
                      type="primary" 
                      shape="circle"
                      icon={<CameraOutlined />}
                      size="large"
                      className="bg-blue-500 hover:bg-blue-600"
                    />
                  </Upload>
                </Tooltip>
              )}
            </div>
            
            {isEditing ? (
              <Text type="secondary" className="text-center">
                Nhấn vào biểu tượng camera để thay đổi ảnh đại diện
              </Text>
            ) : (
              <Text strong className="text-lg">
                {userInfo?.username}
              </Text>
            )}
          </div>
          
          {/* Form Section */}
          <div className="flex-1">
            <Form
              layout="vertical"
              onFinish={handleSubmit(onSubmit)}
              className="profile-form"
            >
              <div className="mb-4">
                <Form.Item 
                  label={<Text strong>Họ và tên</Text>}
                  validateStatus={errors.username ? "error" : ""}
                  help={errors.username?.message}
                >
                  <Controller
                    name="username"
                    control={control}
                    rules={{
                      required: "Vui lòng nhập tên",
                      minLength: { value: 6, message: "Tên ít nhất 6 ký tự" }
                    }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        prefix={<UserOutlined className="text-gray-400" />}
                        disabled={!isEditing}
                        className="py-2"
                      />
                    )}
                  />
                </Form.Item>
                
                <Form.Item 
                  label={<Text strong>Email</Text>}
                  validateStatus={errors.email ? "error" : ""}
                  help={errors.email?.message}
                >
                  <Controller
                    name="email"
                    control={control}
                    rules={{ required: "Vui lòng nhập email" }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        prefix={<MailOutlined className="text-gray-400" />}
                        disabled={!isEditing}
                        className="py-2"
                      />
                    )}
                  />
                </Form.Item>
                
                <Form.Item 
                  label={<Text strong>Số điện thoại</Text>}
                  validateStatus={errors.phone_number ? "error" : ""}
                  help={errors.phone_number?.message}
                >
                  <Controller
                    name="phone_number"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        prefix={<PhoneOutlined className="text-gray-400" />}
                        disabled={!isEditing}
                        className="py-2"
                      />
                    )}
                  />
                </Form.Item>
              </div>
              
              <Divider />
              
              <div className="flex justify-end gap-3">
                {isEditing ? (
                  <Space>
                    <Button
                      onClick={toggleEdit}
                      icon={<CloseOutlined />}
                      className="px-4"
                    >
                      Hủy
                    </Button>
                    <Button
                      type="primary"
                      htmlType="submit"
                      icon={<SaveOutlined />}
                      className="px-4"
                    >
                      Lưu thông tin
                    </Button>
                  </Space>
                ) : (
                  <Button
                    type="primary"
                    onClick={toggleEdit}
                    icon={<EditOutlined />}
                    className="px-4"
                  >
                    Chỉnh sửa thông tin
                  </Button>
                )}
              </div>
            </Form>
          </div>
        </div>
      </Card>
      
      <style jsx global>{`
        .profile-edit-container .ant-form-item-label > label {
          font-weight: 500;
        }
        
        .profile-edit-container .ant-input-affix-wrapper:hover,
        .profile-edit-container .ant-input-affix-wrapper:focus {
          border-color: #4096ff;
          box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
        }
        
        .profile-edit-container .ant-input-affix-wrapper-focused {
          border-color: #4096ff;
          box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
        }
        
        @media (max-width: 768px) {
          .profile-edit-container .ant-form {
            margin-top: 2rem;
          }
        }
      `}</style>
    </div>
  );
}

export default EditAccount;
