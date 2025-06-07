import React from "react";
import { Card, Tag, Button, Space, Typography, Badge } from "antd";
import { PercentageOutlined, DollarOutlined } from "@ant-design/icons";

const { Text, Paragraph } = Typography;

function Coupon({ data }) {
  if (!data) return null;
  
  const isExpired = data.expiry_date && new Date(data.expiry_date) < new Date();
  
  return (
    <Badge.Ribbon 
      text={isExpired ? "Hết hạn" : "Có hiệu lực"} 
      color={isExpired ? "red" : "green"}
    >
      <Card 
        hoverable
        className="coupon-card"
        bordered
      >
        <Space direction="vertical" size="small">
          <Text strong>{data.code}</Text>
          
          <div>
            {data.discount_type === "FIXED" ? (
              <Tag icon={<DollarOutlined />} color="blue">
                Giảm {data.value.toLocaleString('vi-VN')}đ
              </Tag>
            ) : (
              <Tag icon={<PercentageOutlined />} color="purple">
                Giảm {data.value}%
              </Tag>
            )}
          </div>
          
          <Paragraph type="secondary" className="text-sm">
            {data.description || "Mã giảm giá cho đơn hàng của bạn"}
          </Paragraph>
        </Space>
      </Card>
    </Badge.Ribbon>
  );
}

export default Coupon;
