import { notification, Card, Row, Col, Select, Button, Statistic, Typography, DatePicker, Breadcrumb, Space, Spin } from "antd";
import {
  getRentalStatisticDaily,
  getRentalStatisticStatus,
  getRentalStatisticTotal,
} from "apis/rental.api";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  YAxis,
  XAxis,
  Legend,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  AreaChart, 
  Area
} from "recharts";
import Icons from "utils/icons";
import logo from "assets/images/logo.jpg";

const { Title, Text } = Typography;
const { Option } = Select;

function RentalStatistic() {
  const [dataGeneral, setDataGeneral] = useState({});
  const [totalData, setTotalData] = useState({});
  const [dataChar, setDataChar] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);

  const fetchDaily = async () => {
    try {
      setLoading(true);
      const dataChar = await getRentalStatisticDaily({
        month: selectedMonth,
        year: selectedYear,
      });

      const chartData = Object.entries(dataChar || {}).map(([key, value]) => ({
        name: `Ngày ${key}`,
        order: value,
      }));

      setDataChar(chartData);
      setLoading(false);
    } catch (error) {
      notification.warning({
        message: error.message,
        duration: 2,
        placement: "top",
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDaily();
  }, [selectedMonth, selectedYear]);

  const handleFetchGeneral = async () => {
    try {
      setLoading(true);
      const [statusData, totalData, dataChar] = await Promise.all([
        getRentalStatisticStatus(),
        getRentalStatisticTotal(),
        getRentalStatisticDaily({
          month: selectedMonth,
          year: selectedYear,
        }),
      ]);
      setDataGeneral(statusData);
      setTotalData(totalData);

      const chartData = Object.entries(dataChar || {}).map(([key, value]) => ({
        name: `Ngày ${key}`,
        order: value,
      }));

      setDataChar(chartData);
      setLoading(false);
    } catch (error) {
      notification.warning({
        message: error.message,
        duration: 2,
        placement: "top",
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchGeneral();
  }, []);

  const totalOrders = dataChar?.reduce((sum, prev) => (sum += prev.order), 0) || 0;

  const statusCards = [
    { title: "Tất cả đơn", value: totalData?.allTime || 0, color: "#00ADB5" },
    { title: "Đơn chưa thanh toán", value: dataGeneral?.UNPAID || 0, color: "#FF9800" },
    { title: "Đơn đang chờ xử lí", value: dataGeneral?.PENDING || 0, color: "#FFCC00" },
    { title: "Đơn đang ship", value: dataGeneral?.SHIPPED || 0, color: "#673AB7" },
    { title: "Đơn đã giao", value: dataGeneral?.DELIVERED || 0, color: "#4CAF50" },
    { title: "Đơn đã hủy", value: dataGeneral?.CANCELLED || 0, color: "#F44336" },
  ];

  const timeCards = [
    { title: "Hôm nay", value: totalData?.today || 0, icon: <Icons.FaCalendarDay /> },
    { title: "Hôm qua", value: totalData?.yesterday || 0, icon: <Icons.FaCalendarAlt /> },
    { title: "Tuần này", value: totalData?.thisWeek || 0, icon: <Icons.FaCalendarWeek /> },
    { title: "Năm nay", value: totalData?.thisYear || 0, icon: <Icons.FaCalendarCheck /> },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Card className="mb-6 shadow-sm">
        <div className="flex items-center gap-4">
          <img
            src={logo}
            alt="logo"
            className="w-12 h-12 object-contain rounded-md"
          />
          <div>
            <Breadcrumb
              items={[
                { title: 'Admin' },
                { title: 'Thống kê đơn thuê' }
              ]}
              className="mb-1"
            />
            <Title level={3} className="m-0">Thống kê đơn thuê</Title>
          </div>
        </div>
      </Card>

      <Row gutter={[16, 16]} className="mb-6">
        {statusCards.map((card, index) => (
          <Col xs={24} sm={12} lg={8} xl={4} key={index}>
            <Card 
              className="h-full shadow-sm hover:shadow-md transition-shadow duration-300"
              bordered={false}
              style={{ borderTop: `4px solid ${card.color}`}}
            >
              <Statistic
                title={<Text strong className="text-gray-600">{card.title}</Text>}
                value={card.value}
                valueStyle={{ color: card.color, fontWeight: 'bold' }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]} className="mb-6">
        {timeCards.map((card, index) => (
          <Col xs={24} sm={12} md={6} key={index}>
            <Card className="h-full shadow-sm hover:shadow-md transition-shadow duration-300">
              <Statistic
                title={
                  <Space>
                    {card.icon}
                    <Text strong>{card.title}</Text>
                  </Space>
                }
                value={card.value}
                valueStyle={{ color: "#00ADB5", fontWeight: 'bold' }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Card 
        className="shadow-sm"
        title={
          <Space>
            <Icons.FaChartBar />
            <span>Thống kê đơn theo ngày</span>
          </Space>
        }
        extra={
          <Space>
            <Select
              value={selectedMonth}
              onChange={(value) => setSelectedMonth(value)}
              style={{ width: 120 }}
              placeholder="Chọn tháng"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <Option key={i + 1} value={i + 1}>
                  Tháng {i + 1}
                </Option>
              ))}
            </Select>

            <Select
              value={selectedYear}
              onChange={(value) => setSelectedYear(value)}
              style={{ width: 120 }}
              placeholder="Chọn năm"
            >
              {Array.from({ length: 5 }, (_, i) => (
                <Option key={i} value={new Date().getFullYear() - i}>
                  {new Date().getFullYear() - i}
                </Option>
              ))}
            </Select>
            
            <Button 
              type="primary" 
              onClick={handleFetchGeneral}
              icon={<Icons.FaFilter />}
              className="bg-primary"
              loading={loading}
            >
              Lọc
            </Button>
          </Space>
        }
      >
        <div className="mb-4">
          <Text strong className="text-lg text-primary">
            Tổng đơn tháng {selectedMonth} năm {selectedYear}: 
            <span className="ml-2 text-xl">{totalOrders}</span>
          </Text>
        </div>

        <div className="h-[60vh]">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <Spin size="large" tip="Đang tải dữ liệu..." />
            </div>
          ) : (
            <Row gutter={[0, 24]}>
              <Col span={24} className="h-[calc(60vh-150px)]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dataChar}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    barSize={30}
                  >
                    <XAxis
                      dataKey="name"
                      scale="point"
                      padding={{ left: 10, right: 10 }}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }} 
                    />
                    <Legend />
                    <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                    <Bar 
                      dataKey="order" 
                      name="Số đơn" 
                      fill="#00ADB5" 
                      radius={[4, 4, 0, 0]}
                      animationDuration={1500}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Col>
              
              <Col span={24} className="h-[90px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={dataChar}
                    margin={{ top: 0, right: 30, left: 20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorOrder" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00ADB5" stopOpacity={0.6} />
                        <stop offset="95%" stopColor="#00ADB5" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" hide />
                    <YAxis hide />
                    <Area 
                      type="monotone" 
                      dataKey="order" 
                      stroke="#00ADB5" 
                      strokeWidth={2} 
                      fillOpacity={1} 
                      fill="url(#colorOrder)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Col>
            </Row>
          )}
        </div>
      </Card>
    </div>
  );
}

export default RentalStatistic;
