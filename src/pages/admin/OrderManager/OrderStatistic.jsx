import React, { useEffect, useState } from "react";
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  notification, 
  Typography, 
  Select, 
  Button, 
  Space, 
  Divider 
} from "antd";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  YAxis,
  XAxis,
  Legend,
  CartesianGrid,
  Tooltip,
} from "recharts";
import {
  getOrderStatisticDaily,
  getOrderStatisticStatus,
  getOrderStatisticTotal,
} from "apis/order.api";

const { Title, Text } = Typography;
const { Option } = Select;

function OrderStatistic() {
  const [dataGeneral, setDataGeneral] = useState({});
  const [totalData, setTotalData] = useState({});
  const [chartData, setChartData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const fetchDaily = async () => {
    try {
      const response = await getOrderStatisticDaily({
        month: selectedMonth,
        year: selectedYear,
      });

      const processedData = Object.entries(response || {}).map(([key, value]) => ({
        name: `Ngày ${key}`,
        order: value,
      }));

      setChartData(processedData);
    } catch (error) {
      notification.warning({
        message: "Lỗi khi tải dữ liệu thống kê",
        description: error.message,
        duration: 2,
        placement: "top",
      });
    }
  };

  useEffect(() => {
    fetchDaily();
  }, [selectedMonth, selectedYear]);

  const handleFetchGeneralData = async () => {
    try {
      const [statusData, totalDataResponse, dailyData] = await Promise.all([
        getOrderStatisticStatus(),
        getOrderStatisticTotal(),
        getOrderStatisticDaily({
          month: selectedMonth,
          year: selectedYear,
        }),
      ]);
      
      setDataGeneral(statusData);
      setTotalData(totalDataResponse);

      const processedChartData = Object.entries(dailyData || {}).map(([key, value]) => ({
        name: `Ngày ${key}`,
        order: value,
      }));

      setChartData(processedChartData);
    } catch (error) {
      notification.warning({
        message: "Lỗi khi tải dữ liệu thống kê",
        description: error.message,
        duration: 2,
        placement: "top",
      });
    }
  };

  useEffect(() => {
    handleFetchGeneralData();
  }, []);

  const totalMonthlyOrders = chartData?.reduce((sum, item) => sum + item.order, 0) || 0;

  const statusCards = [
    {
      title: "Tất cả đơn hàng",
      value: totalData?.allTime || 0,
      color: "#1890ff",
      valueStyle: { color: "#1890ff" }
    },
    {
      title: "Chưa thanh toán",
      value: dataGeneral?.UNPAID || 0,
      color: "#ff4d4f",
      valueStyle: { color: "#ff4d4f" }
    },
    {
      title: "Chờ xử lý",
      value: dataGeneral?.PENDING || 0,
      color: "#faad14",
      valueStyle: { color: "#faad14" }
    },
    {
      title: "Đang giao hàng",
      value: dataGeneral?.SHIPPED || 0,
      color: "#722ed1",
      valueStyle: { color: "#722ed1" }
    },
    {
      title: "Đã giao hàng",
      value: dataGeneral?.DELIVERED || 0,
      color: "#52c41a",
      valueStyle: { color: "#52c41a" }
    },
    {
      title: "Đã hủy",
      value: dataGeneral?.CANCELLED || 0,
      color: "#f5222d",
      valueStyle: { color: "#f5222d" }
    }
  ];

  const timeFrameCards = [
    {
      title: "Hôm nay",
      value: totalData?.today || 0,
      color: "#108ee9"
    },
    {
      title: "Hôm qua",
      value: totalData?.yesterday || 0,
      color: "#87d068"
    },
    {
      title: "Tuần này",
      value: totalData?.thisWeek || 0,
      color: "#2db7f5"
    },
    {
      title: "Năm nay",
      value: totalData?.thisYear || 0,
      color: "#673ab7"
    }
  ];

  return (
    <div className="order-statistics">
      <Card>
        <Title level={2} style={{ textAlign: "center", marginBottom: 24 }}>
          Thống kê đơn hàng
        </Title>

        <Row gutter={[16, 16]}>
          {statusCards.map((card, index) => (
            <Col xs={24} sm={12} md={8} lg={8} xl={4} key={index}>
              <Card bordered>
                <Statistic
                  title={<Text strong>{card.title}</Text>}
                  value={card.value}
                  valueStyle={card.valueStyle}
                />
              </Card>
            </Col>
          ))}
        </Row>

        <Divider />

        <Row gutter={[16, 16]}>
          {timeFrameCards.map((card, index) => (
            <Col xs={24} sm={12} md={12} lg={6} key={index}>
              <Card bordered>
                <Statistic
                  title={<Text strong>{card.title}</Text>}
                  value={card.value}
                  valueStyle={{ color: card.color }}
                  suffix="đơn"
                />
              </Card>
            </Col>
          ))}
        </Row>

        <Divider />

        <Card 
          title="Biểu đồ thống kê đơn hàng theo ngày"
          extra={
            <Space>
              <Select
                value={selectedMonth}
                style={{ width: 120 }}
                onChange={(value) => setSelectedMonth(parseInt(value))}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <Option key={i + 1} value={i + 1}>
                    Tháng {i + 1}
                  </Option>
                ))}
              </Select>

              <Select
                value={selectedYear}
                style={{ width: 120 }}
                onChange={(value) => setSelectedYear(parseInt(value))}
              >
                {Array.from({ length: 5 }, (_, i) => (
                  <Option key={i} value={new Date().getFullYear() - i}>
                    {new Date().getFullYear() - i}
                  </Option>
                ))}
              </Select>
              <Button type="primary" onClick={handleFetchGeneralData}>
                Lọc
              </Button>
            </Space>
          }
        >
          <Text strong style={{ color: "#1890ff", marginBottom: 16, display: "block" }}>
            Tổng đơn tháng {selectedMonth} năm {selectedYear}: {totalMonthlyOrders} đơn hàng
          </Text>

          <div style={{ height: 400, marginTop: 20 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
                barSize={20}
              >
                <XAxis
                  dataKey="name"
                  scale="point"
                  padding={{ left: 10, right: 10 }}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <CartesianGrid strokeDasharray="3 3" />
                <Bar 
                  dataKey="order" 
                  fill="#1890ff" 
                  name="Số đơn hàng" 
                  background={{ fill: "#f5f5f5" }} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </Card>
    </div>
  );
}

export default OrderStatistic;
