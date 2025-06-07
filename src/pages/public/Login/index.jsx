import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import LoginIMG from "assets/images/log1.png";
import RegisterIMG from "assets/images/register1.png";
import paths from "constant/paths";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import FacebookLogin from "react-facebook-login";
import withBaseComponent from "hocs";
import { loginRequest, registerRequest } from "store/slicers/auth.slicer";
import { useSelector } from "react-redux";
import { 
  notification, 
  Card, 
  Form, 
  Input, 
  Button, 
  Typography, 
  Divider, 
  Space, 
  Row, 
  Col, 
  Spin 
} from "antd";
import { 
  UserOutlined, 
  LockOutlined, 
  MailOutlined, 
  ArrowLeftOutlined,
  LoginOutlined,
  UserAddOutlined
} from '@ant-design/icons';
import TypingText from "components/TypingText";
import { resetMessageData, setMessageData } from "store/slicers/common.slicer";

const { Title, Text, Paragraph } = Typography;

const Login = ({ dispatch, navigate }) => {
  const [signUpMode, setSignUpMode] = useState(false);
  const { error, loading } = useSelector((state) => state.auth.authInfo);
  const { messageSystem } = useSelector((state) => state.common);
  
  useEffect(() => {
    dispatch(resetMessageData());
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      confirm_password: ''
    }
  });
  
  const password = watch("password");

  const onSubmit = (data) => {
    if (signUpMode) {
      dispatch(
        registerRequest({
          data,
          onSuccess: (message) => {
            dispatch(
              setMessageData({
                isShow: true,
                message,
              }),
            );
          },
          onError: (message) => {
            notification.warning({
              message,
              duration: 3,
              placement: "top"
            });
          },
        }),
      );
    } else {
      handleLogin(data);
    }
  };

  const handleLogin = (dataLogin) => {
    dispatch(
      loginRequest({
        dataLogin,
        onSuccess: () => {
          notification.success({
            message: "Chào mừng quay trở lại.",
            duration: 2,
            placement: "top"
          });
          navigate("/");
        },
        onError: () => {
          notification.warning({
            message: "Tài khoản hoặc mật khẩu sai...",
            duration: 3,
            placement: "top"
          });
        },
      }),
    );
  };

  const responseFacebook = (response) => {
    console.log(response);
  };

  return (
    <GoogleOAuthProvider clientId="1092538276024-m6skkb7i3lhdmilk6mssvnjs0r5egolm.apps.googleusercontent.com">
      <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 flex justify-center items-center p-4">
        {messageSystem.isShow ? (
          <Card
            className="w-full max-w-lg shadow-lg animate__animated animate__fadeIn"
            bordered={false}
            data-aos="zoom-out-down"
          >
            <Link to={paths.HOME}>
              <Button 
                type="text" 
                icon={<ArrowLeftOutlined />} 
                className="text-blue-500 hover:text-blue-700 mb-4"
              >
                Trang chủ
              </Button>
            </Link>
            
            <div className="flex justify-between items-center mb-6">
              <Title level={4} className="text-blue-600 m-0">
                Cảm ơn bạn đã tham gia dịch vụ!
              </Title>
              <Button 
                type="link" 
                className="font-medium"
                onClick={() => dispatch(resetMessageData())}
              >
                Đăng kí với mail khác
              </Button>
            </div>
            
            {messageSystem.message && (
              <Card className="bg-blue-50 border-blue-200">
                <TypingText text={messageSystem.message} typeSpeed={10} className="text-gray-700" />
              </Card>
            )}
          </Card>
        ) : (
          <Row 
            gutter={[24, 0]} 
            className="w-full max-w-5xl"
            data-aos={signUpMode ? "flip-right" : "flip-left"}
          >
            <Col xs={24} md={14}>
              <Card 
                bordered={false}
                className="shadow-lg h-full transition-all duration-300 hover:shadow-xl"
                bodyStyle={{ padding: '30px' }}
              >
                <Link to={paths.HOME}>
                  <Button 
                    type="text" 
                    icon={<ArrowLeftOutlined />} 
                    className="text-blue-500 hover:text-blue-700 mb-4"
                  >
                    Trang chủ
                  </Button>
                </Link>
                
                <div className="text-center mb-6">
                  <Title level={2} className={signUpMode ? "text-orange-500" : "text-blue-500"}>
                    {signUpMode ? "Đăng ký" : "Đăng nhập"}
                  </Title>
                  <Paragraph className="text-gray-500">
                    {signUpMode 
                      ? "Tạo tài khoản mới để trải nghiệm dịch vụ của chúng tôi" 
                      : "Đăng nhập để tiếp tục mua sắm"}
                  </Paragraph>
                </div>

                <Form
                  layout="vertical"
                  onFinish={handleSubmit(onSubmit)}
                  className="max-w-md mx-auto"
                >
                  <Form.Item 
                    label="Email"
                    validateStatus={errors.email ? "error" : ""}
                    help={errors.email?.message}
                  >
                    <Controller
                      name="email"
                      control={control}
                      rules={{
                        required: "Email là bắt buộc",
                        pattern: {
                          value: /\S+@\S+\.\S+/,
                          message: "Email không đúng định dạng",
                        },
                      }}
                      render={({ field }) => (
                        <Input
                          {...field}
                          prefix={<MailOutlined className="text-gray-400" />}
                          placeholder="Nhập email của bạn"
                          size="large"
                        />
                      )}
                    />
                  </Form.Item>

                  <Form.Item 
                    label="Mật khẩu"
                    validateStatus={errors.password ? "error" : ""}
                    help={errors.password?.message}
                  >
                    <Controller
                      name="password"
                      control={control}
                      rules={{
                        required: "Mật khẩu là bắt buộc",
                        minLength: {
                          value: 6,
                          message: "Mật khẩu phải có ít nhất 6 ký tự",
                        },
                      }}
                      render={({ field }) => (
                        <Input.Password
                          {...field}
                          prefix={<LockOutlined className="text-gray-400" />}
                          placeholder="Nhập mật khẩu"
                          size="large"
                        />
                      )}
                    />
                  </Form.Item>

                  {signUpMode && (
                    <Form.Item 
                      label="Xác nhận mật khẩu"
                      validateStatus={errors.confirm_password ? "error" : ""}
                      help={errors.confirm_password?.message}
                    >
                      <Controller
                        name="confirm_password"
                        control={control}
                        rules={{
                          validate: (value) =>
                            value === password || "Mật khẩu không khớp",
                        }}
                        render={({ field }) => (
                          <Input.Password
                            {...field}
                            prefix={<LockOutlined className="text-gray-400" />}
                            placeholder="Xác nhận mật khẩu"
                            size="large"
                          />
                        )}
                      />
                    </Form.Item>
                  )}

                  <Form.Item className="mt-6">
                    <Button
                      type="primary"
                      htmlType="submit"
                      block
                      size="large"
                      className={`h-12 ${signUpMode ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-500 hover:bg-blue-600'}`}
                      icon={signUpMode ? <UserAddOutlined /> : <LoginOutlined />}
                      loading={loading}
                    >
                      {loading
                        ? "Đang xử lý..."
                        : signUpMode
                          ? "Đăng ký"
                          : "Đăng nhập"}
                    </Button>
                  </Form.Item>

                  <Divider plain><Text type="secondary">hoặc đăng nhập với</Text></Divider>
                  
                  <div className="flex flex-col md:flex-row justify-center gap-3 mt-4">
                    <FacebookLogin
                      textButton={
                        <span className="text-sm">Đăng nhập bằng Facebook</span>
                      }
                      cssClass="flex items-center justify-center gap-2 border rounded-md py-2 px-3 bg-white hover:bg-gray-50 transition text-gray-700 w-full md:flex-grow"
                      appId="2041983982905103"
                      autoLoad={false}
                      fields="name,email,picture"
                      callback={responseFacebook}
                      icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#1877f2"><path d="M12.001 2.002c-5.522 0-9.999 4.477-9.999 9.999 0 4.99 3.656 9.126 8.437 9.879v-6.988h-2.54v-2.891h2.54V9.798c0-2.508 1.493-3.891 3.776-3.891 1.094 0 2.24.195 2.24.195v2.459h-1.264c-1.24 0-1.628.772-1.628 1.563v1.875h2.771l-.443 2.891h-2.328v6.988C18.344 21.129 22 16.992 22 12.001c0-5.522-4.477-9.999-9.999-9.999z"></path></svg>}
                    />
                    
                    <GoogleLogin
                      size="large"
                      theme="outline"
                      shape="rectangular"
                      width="100%"
                      text="signin_with"
                      onSuccess={(credentialResponse) => {
                        console.log(jwtDecode(credentialResponse.credential));
                      }}
                      onError={() => {
                        console.log("Login Failed");
                      }}
                    />
                  </div>
                </Form>
              </Card>
            </Col>
            
            <Col xs={24} md={10} className="hidden md:flex flex-col items-center justify-center p-4">
              <div className="text-center mb-6" data-aos="fade-up">
                <Title level={3} className={`text-gray-700`}>
                  {signUpMode
                    ? "Đã có tài khoản?"
                    : "Chưa có tài khoản?"}
                </Title>
                <Button
                  type={signUpMode ? "primary" : "default"}
                  size="large"
                  onClick={() => setSignUpMode(!signUpMode)}
                  className={`mt-2 px-8 ${signUpMode ? 'bg-blue-500' : 'border-orange-500 text-orange-500 hover:border-orange-600 hover:text-orange-600'}`}
                >
                  {signUpMode ? "Đăng nhập ngay" : "Đăng ký ngay"}
                </Button>
              </div>
              <img
                src={signUpMode ? RegisterIMG : LoginIMG}
                className="w-full max-w-xs mt-4 transition-all duration-500 transform hover:scale-105"
                alt={signUpMode ? "Register" : "Login"}
                data-aos="zoom-in"
              />
            </Col>
            
            <Col xs={24} className="md:hidden mt-8 text-center">
              <Space direction="vertical" align="center" className="w-full">
                <Text className="text-gray-600">
                  {signUpMode ? "Đã có tài khoản?" : "Chưa có tài khoản?"}
                </Text>
                <Button 
                  type="link" 
                  onClick={() => setSignUpMode(!signUpMode)}
                  className={signUpMode ? "text-blue-500" : "text-orange-500"}
                >
                  {signUpMode ? "Đăng nhập ngay" : "Đăng ký ngay"}
                </Button>
              </Space>
            </Col>
          </Row>
        )}
      </div>
    </GoogleOAuthProvider>
  );
};

export default withBaseComponent(Login);
