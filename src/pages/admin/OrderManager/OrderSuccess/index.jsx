import React, { useEffect, useState } from "react";
import { 
  notification, 
  Skeleton, 
  Card, 
  Typography, 
  Space, 
  Button, 
  Divider, 
  Result, 
  Descriptions
} from "antd";
import { 
  CheckCircleOutlined, 
  ShoppingOutlined, 
  HomeOutlined 
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import moment from "moment";
import paths from "constant/paths";
import { getPaymentByTransId } from "apis/payment";
import { formatCurrency } from "utils/formatCurrency";

const { Title, Text, Paragraph } = Typography;

const OrderSuccess = ({ data, closeModal }) => {
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await getPaymentByTransId(data?.result);
        setPaymentData(res?.result);
      } catch (error) {
        notification.warning({
          message: "Không tìm thấy thông tin đơn hàng",
          description: error.message || "Đã xảy ra lỗi, vui lòng thử lại sau",
          duration: 3,
          placement: "top",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrder();
  }, [data?.result]);

  if (loading) {
    return (
      <Card>
        <Skeleton active paragraph={{ rows: 6 }} />
      </Card>
    );
  }

  return (
    <Card className="order-success">
      <Result
        status="success"
        title="Thanh toán thành công!"
        subTitle="Cảm ơn bạn đã mua sắm tại cửa hàng của chúng tôi."
        icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
      />
      
      <Divider />
      
      <Title level={5}>Thông tin đơn hàng</Title>
      <Descriptions column={1} bordered>
        <Descriptions.Item label="Mã đơn hàng">
          {paymentData?.order?.orderCode || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày đặt hàng">
          {paymentData?.createdAt
            ? moment(paymentData?.createdAt).format("DD/MM/YYYY")
            : "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Người nhận">
          {paymentData?.order.delivery?.username || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Số điện thoại">
          {paymentData?.order.delivery?.numberPhone || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Địa chỉ giao hàng">
          {paymentData?.order.delivery ? 
            `${paymentData?.order.delivery?.street || ""}, 
             ${paymentData?.order.delivery?.ward || ""}, 
             ${paymentData?.order.delivery?.city || ""}` : 
            "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Tổng tiền">
          <Text strong style={{ color: '#f5222d' }}>
            {formatCurrency(paymentData?.order?.total_amount) || "0"} đ
          </Text>
        </Descriptions.Item>
      </Descriptions>

      <Divider />
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '16px' }}>
        <Link to={`/admin/order-management/${paymentData?.order?.id}`}>
          <Button 
            type="primary" 
            icon={<ShoppingOutlined />}
          >
            Xem đơn hàng
          </Button>
        </Link>

        <Button 
          onClick={closeModal}
          icon={<HomeOutlined />}
        >
          Tiếp tục mua sắm
        </Button>
      </div>
    </Card>
  );
};

export default OrderSuccess;
