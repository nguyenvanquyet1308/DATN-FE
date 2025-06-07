import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  Typography,
  notification,
  Select,
  Button,
  Space,
  Statistic,
  Spin,
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
  Rectangle,
} from "recharts";
import {
  getPaymentDailyStatistics,
  getPaymentStatistics,
} from "apis/revenue.api";
import { formatMoney } from "utils/helper";
import { CalendarOutlined, DollarOutlined, ShoppingOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;

function RevenueStatistic() {
  const [dataGeneral, setDataGeneral] = useState({});
  const [dataChar, setDataChar] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState({
    general: false,
    chart: false
  });

  const fetchDaily = async () => {
    try {
      setLoading(prev => ({ ...prev, chart: true }));
      const dataChar = await getPaymentDailyStatistics(
        selectedMonth,
        selectedYear,
      );

      const chartData = Object.entries(dataChar || {}).map(([day, data]) => ({
        name: `Ngày ${day}`,
        revenue: data?.revenue || 0,
        order: data?.count || 0,
      }));

      setDataChar(chartData);
    } catch (error) {
      notification.warning({
        message: "Lỗi khi tải dữ liệu biểu đồ",
        description: error.message || "Đã xảy ra lỗi, vui lòng thử lại sau",
        duration: 3,
        placement: "top",
      });
    } finally {
      setLoading(prev => ({ ...prev, chart: false }));
    }
  };

  useEffect(() => {
    fetchDaily();
  }, [selectedMonth, selectedYear]);

  const handleFetchGeneral = async () => {
    try {
      setLoading(prev => ({ ...prev, general: true }));
      const dataGeneral = await getPaymentStatistics();
      setDataGeneral(dataGeneral || {});
    } catch (error) {
      notification.warning({
        message: "Lỗi khi tải dữ liệu doanh thu",
        description: error.message || "Đã xảy ra lỗi, vui lòng thử lại sau",
        duration: 3,
        placement: "top",
      });
    } finally {
      setLoading(prev => ({ ...prev, general: false }));
    }
  };

  useEffect(() => {
    handleFetchGeneral();
  }, []);

  // Tính tổng số đơn hàng từ dữ liệu biểu đồ
  const totalOrders = dataChar?.reduce((sum, item) => sum + (item.order || 0), 0);

  const statisticItems = [
    {
      title: "Tổng doanh thu",
      data: dataGeneral?.allTime,
      icon: <DollarOutlined style={{ fontSize: 24 }} />
    },
    {
      title: "Hôm nay",
      data: dataGeneral?.today,
      icon: <CalendarOutlined style={{ fontSize: 24 }} />
    },
    {
      title: "Hôm qua",
      data: dataGeneral?.yesterday,
      icon: <CalendarOutlined style={{ fontSize: 24 }} />
    },
    {
      title: "Tuần này",
      data: dataGeneral?.thisWeek,
      icon: <CalendarOutlined style={{ fontSize: 24 }} />
    },
    {
      title: "Tháng này",
      data: dataGeneral?.thisMonth,
      icon: <CalendarOutlined style={{ fontSize: 24 }} />
    },
    {
      title: "Năm này",
      data: dataGeneral?.thisYear,
      icon: <CalendarOutlined style={{ fontSize: 24 }} />
    }
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: "24px", color: "#1890ff" }}>
        Thống kê doanh thu
      </Title>

      {loading.general ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          {statisticItems.map((item, index) => (
            <Col key={index} xs={24} sm={12} md={8} lg={8} xl={4}>
              <Card 
                hoverable
                style={{ height: '100%' }}
                className={index === 0 ? "border-primary" : ""}
              >
                <Statistic 
                  title={<Text strong>{item.title}</Text>} 
                  value={item.data?.revenue || 0}
                  formatter={(value) => `${formatMoney(value)} vnđ`}
                  valueStyle={{ color: '#3f8600' }}
                  prefix={item.icon}
                />
                <Divider style={{ margin: '12px 0' }} />
                <Statistic
                  value={item.data?.count || 0}
                  suffix="đơn"
                  valueStyle={{ color: '#1890ff', fontSize: '16px' }}
                  prefix={<ShoppingOutlined />}
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Card style={{ marginTop: 24 }}>
        <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 16 }}>
          <Text strong>
            {!loading.chart && (
              <>Tổng đơn tháng {selectedMonth} năm {selectedYear}: {totalOrders} đơn</>
            )}
          </Text>

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
            
            <Button 
              type="primary" 
              onClick={fetchDaily}
              loading={loading.chart}
            >
              Lọc
            </Button>
          </Space>
        </Space>

        {loading.chart ? (
          <div style={{ textAlign: 'center', padding: '40px', height: '400px' }}>
            <Spin size="large" />
          </div>
        ) : (
          <div style={{ height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dataChar}
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
                <Tooltip formatter={(value) => formatMoney(value)} />
                <Legend />
                <CartesianGrid strokeDasharray="3 3" />
                <Bar
                  name="Doanh thu"
                  dataKey="revenue"
                  fill="#8884d8"
                  activeBar={<Rectangle fill="pink" stroke="blue" />}
                />
                <Bar
                  name="Số đơn"
                  dataKey="order"
                  fill="#82ca9d"
                  activeBar={<Rectangle fill="gold" stroke="purple" />}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>
    </div>
  );
}

export default RevenueStatistic;
