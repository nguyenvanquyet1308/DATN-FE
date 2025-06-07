import { Button, Result, Spin, notification } from "antd";
import paths from "constant/paths";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { confirmRegisterRequest } from "store/slicers/auth.slicer";
import { resetMessageData, setMessageData } from "store/slicers/common.slicer";
import { CheckCircleFilled, WarningFilled } from "@ant-design/icons";

function ConfirmRegister() {
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [status, setStatus] = useState("loading"); // loading, success, error
  
  useEffect(() => {
    if (token) {
      dispatch(
        confirmRegisterRequest({
          token,
          onSuccess: () => {
            setStatus("success");
            notification.success({
              message: "Chúc mừng bạn đã đăng kí tài khoản thành công!",
              description: "Bạn có thể đăng nhập và trải nghiệm các dịch vụ của chúng tôi",
              duration: 4,
              placement: "top",
            });
            dispatch(
              setMessageData({
                isShow: true,
                typeEffect: {
                  particleCount: 100,
                  spread: 70,
                  origin: { y: 0.6 },
                },
              }),
            );
            setTimeout(() => {
              dispatch(resetMessageData());
              // Tự động chuyển hướng sau 3 giây
              setTimeout(() => navigate(paths.LOGIN), 3000);
            }, 2000);
          },
          onError: () => {
            setStatus("error");
            notification.error({
              message: "Xác nhận đăng ký thất bại",
              description: "Token không hợp lệ hoặc đã hết hạn",
              duration: 4,
              placement: "top",
            });
            // Tự động chuyển hướng sau 4 giây
            setTimeout(() => navigate(paths.LOGIN), 4000);
          },
        }),
      );
    } else navigate(paths.HOME);
  }, [token]);

  const renderContent = () => {
    switch (status) {
      case "loading":
        return (
          <div className="flex flex-col items-center justify-center h-96">
            <Spin size="large" tip="Đang xác thực đăng ký..." />
            <p className="mt-4 text-gray-500">Vui lòng chờ trong giây lát...</p>
          </div>
        );
        
      case "success":
        return (
          <Result
            status="success"
            icon={
              <div className="w-32 h-32 mx-auto flex items-center justify-center">
                <CheckCircleFilled className="text-6xl text-green-500 animate-bounce" />
              </div>
            }
            title="Đăng ký tài khoản thành công!"
            subTitle="Cảm ơn bạn đã đăng ký tài khoản. Bạn có thể đăng nhập và trải nghiệm các tính năng của ứng dụng ngay bây giờ."
            extra={[
              <Button type="primary" key="login" onClick={() => navigate(paths.LOGIN)}>
                Đăng nhập ngay
              </Button>,
              <Button key="home" onClick={() => navigate(paths.HOME)}>
                Về trang chủ
              </Button>,
            ]}
          />
        );
        
      case "error":
        return (
          <Result
            status="error"
            title="Đã xảy ra lỗi khi xác nhận đăng ký"
            subTitle="Token xác nhận không hợp lệ hoặc đã hết hạn. Vui lòng thử lại hoặc liên hệ hỗ trợ."
            extra={[
              <Button type="primary" key="login" onClick={() => navigate(paths.LOGIN)}>
                Đến trang đăng nhập
              </Button>,
              <Button key="home" onClick={() => navigate(paths.HOME)}>
                Về trang chủ
              </Button>,
            ]}
          />
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="confirm-register-container py-16 px-4 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 transition-all duration-500 ease-in-out">
        {renderContent()}
      </div>
    </div>
  );
}

export default ConfirmRegister;
