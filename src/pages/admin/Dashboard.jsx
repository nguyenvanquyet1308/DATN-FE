import React, { useEffect, useState } from "react";
import { 
  Card, 
  Row, 
  Col, 
  Typography, 
  Select, 
  notification, 
  Statistic, 
  Avatar, 
  List, 
  Divider, 
  Space, 
  Tag,
  Spin
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
import {
  getStatisticUserByStatus,
  getStatisticUserTopPayment,
} from "apis/user.api";
import { getOrderStatisticStatus } from "apis/order.api";
import { getRentalStatisticStatus } from "apis/rental.api";
import { convertVI } from "utils/covertDataUI";
import { formatCurrency, formatMoney } from "utils/helper";
import { faker } from "@faker-js/faker";
import Icons from "utils/icons";

const { Title, Text } = Typography;
const { Option } = Select;

const STATUS_COLORS = {
  "Đã giao": "success",
  "Đã hủy": "error",
  "Đang xử lí": "warning",
  "Chưa thanh toán": "orange",
  "Đang giao": "processing",
  "Đã hoàn thành": "success",
  "Đang thuê": "blue",
  "Quá hạn": "red"
};

const USER_STATUS_CONFIG = {
  "INACTIVE": {
    text: "Chưa kích hoạt",
    icon: <Icons.TbLockOff color="gray" />,
    textColor: "text-gray-400",
    color: "default",
  },
  "BLOCKED": {
    text: "Đã bị khóa",
    icon: <Icons.TbLockOpenOff color="red" />,
    textColor: "text-red-500",
    color: "error",
  },
  "ACTIVE": {
    text: "Kích hoạt",
    icon: <Icons.FaCheck color="green" />,
    textColor: "text-green-600",
    color: "success",
  }
};

function Dashboard() {
  const [revenueGeneralData, setRevenueGeneralData] = useState({});
  const [dataCharRevenue, setDataCharRevenue] = useState([]);
  const [userStatus, setUserStatus] = useState({});
  const [orderStatus, setOrderStatus] = useState({});
  const [rentalStatus, setRentalStatus] = useState({});
  const [userTopPayment, setUserTopPayment] = useState([]);
  const [loading, setLoading] = useState({
    revenue: false,
    chart: false,
    userStatus: false,
    orderStatus: false,
    rentalStatus: false,
    userTopPayment: false
  });

  const [selectedMonthRevenue, setSelectedMonthRevenue] = useState(
    new Date().getMonth() + 1,
  );
  const [selectedYearRevenue, setSelectedYearRevenue] = useState(
    new Date().getFullYear(),
  );

  const fetchRevenueGeneralData = async () => {
    try {
      setLoading(prev => ({ ...prev, revenue: true }));
      const dataGeneral = await getPaymentStatistics();
      setRevenueGeneralData(dataGeneral);
    } catch (error) {
      notification.warning({
        message: "Lỗi khi tải dữ liệu doanh thu",
        description: error.message || "Đã xảy ra lỗi, vui lòng thử lại sau",
        duration: 3,
        placement: "top",
      });
    } finally {
      setLoading(prev => ({ ...prev, revenue: false }));
    }
  };

  const fetchDataCharRevenue = async () => {
    try {
      setLoading(prev => ({ ...prev, chart: true }));
      const dataChar = await getPaymentDailyStatistics(
        selectedMonthRevenue,
        selectedYearRevenue,
      );

      if (dataChar) {
        const chartData = Object.entries(dataChar || {}).map(([day, data]) => ({
          name: day,
          revenue: data?.revenue || 0,
          order: data?.count || 0,
        }));

        setDataCharRevenue(chartData);
      }
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

  const fetchUserStatusStatistic = async () => {
    try {
      setLoading(prev => ({ ...prev, userStatus: true }));
      const res = await getStatisticUserByStatus();
      setUserStatus(res || {});
    } catch (error) {
      notification.warning({
        message: "Lỗi khi tải dữ liệu người dùng",
        description: error.message || "Đã xảy ra lỗi, vui lòng thử lại sau",
        duration: 3,
        placement: "top",
      });
    } finally {
      setLoading(prev => ({ ...prev, userStatus: false }));
    }
  };

  const handleFetchOrderStatus = async () => {
    try {
      setLoading(prev => ({ ...prev, orderStatus: true }));
      const orderStatusData = await getOrderStatisticStatus();
      setOrderStatus(orderStatusData || {});
    } catch (error) {
      notification.warning({
        message: "Lỗi khi tải dữ liệu đơn hàng",
        description: error.message || "Đã xảy ra lỗi, vui lòng thử lại sau",
        duration: 3,
        placement: "top",
      });
    } finally {
      setLoading(prev => ({ ...prev, orderStatus: false }));
    }
  };

  const handleFetchRentalStatus = async () => {
    try {
      setLoading(prev => ({ ...prev, rentalStatus: true }));
      const rentalStatusData = await getRentalStatisticStatus();
      setRentalStatus(rentalStatusData || {});
    } catch (error) {
      notification.warning({
        message: "Lỗi khi tải dữ liệu đơn thuê",
        description: error.message || "Đã xảy ra lỗi, vui lòng thử lại sau",
        duration: 3,
        placement: "top",
      });
    } finally {
      setLoading(prev => ({ ...prev, rentalStatus: false }));
    }
  };

  const fetchUserPaymentStatistic = async () => {
    try {
      setLoading(prev => ({ ...prev, userTopPayment: true }));
      const res = await getStatisticUserTopPayment();
      setUserTopPayment(res || []);
    } catch (error) {
      notification.warning({
        message: "Lỗi khi tải dữ liệu khách hàng",
        description: error.message || "Đã xảy ra lỗi, vui lòng thử lại sau",
        duration: 3,
        placement: "top",
      });
    } finally {
      setLoading(prev => ({ ...prev, userTopPayment: false }));
    }
  };

  useEffect(() => {
    fetchDataCharRevenue();
  }, [selectedMonthRevenue, selectedYearRevenue]);

  useEffect(() => {
    fetchRevenueGeneralData();
    fetchDataCharRevenue();
    fetchUserStatusStatistic();
    handleFetchOrderStatus();
    handleFetchRentalStatus();
    fetchUserPaymentStatistic();
  }, []);

  const convertStatusUserUI = (status) => {
    return USER_STATUS_CONFIG[status] || USER_STATUS_CONFIG.ACTIVE;
  };

  const getStatusColor = (status) => {
    return STATUS_COLORS[status] || "default";
  };

  const totalUsers = Object.values(userStatus).reduce(
    (sum, curr) => (sum + (curr || 0)), 0
  );
  
  const totalOrders = Object.values(orderStatus).reduce(
    (sum, curr) => (sum + (curr || 0)), 0
  );
  
  const totalRentals = Object.values(rentalStatus).reduce(
    (sum, curr) => (sum + (curr || 0)), 0
  );

  const revenueTimeFrames = [
    { 
      title: "Hôm nay", 
      icon: <Icons.LiaCalendarDaySolid size={20} />,
      color: "green",
      data: revenueGeneralData?.today 
    },
    { 
      title: "Hôm qua", 
      icon: <Icons.LiaCalendarDaySolid size={20} />,
      color: "orange",
      data: revenueGeneralData?.yesterday 
    },
    { 
      title: "Tuần này", 
      icon: <Icons.FaCalendarWeek size={20} />,
      color: "blue",
      data: revenueGeneralData?.thisWeek 
    },
    { 
      title: "Tháng này", 
      icon: <Icons.MdCalendarMonth size={20} />,
      color: "#722ed1",
      data: revenueGeneralData?.thisMonth 
    },
    { 
      title: "Năm này", 
      icon: <Icons.MdSelectAll size={20} />,
      color: "green",
      data: revenueGeneralData?.thisYear 
    }
  ];

  const renderStatisticCard = (title, total, suffix, data, renderItem, isLoading) => (
    <Card 
      title={<Title level={4}>{title}</Title>}
      bordered={true}
      className="h-100"
    >
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Spin />
        </div>
      ) : (
        <>
          <Statistic 
            title="Tổng số" 
            value={total} 
            suffix={suffix}
            valueStyle={{ color: "#1890ff" }}
            prefix={<Icons.MdOutlineClearAll />}
          />
          <Divider />
          <List
            itemLayout="horizontal"
            dataSource={Object.entries(data)}
            renderItem={renderItem}
            locale={{ emptyText: "Không có dữ liệu" }}
          />
        </>
      )}
    </Card>
  );

  return (
    <div className="dashboard-container" style={{ padding: "24px" }}>
      <Row gutter={[16, 16]}>
        {/* Thống kê người dùng */}
        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
          {renderStatisticCard(
            "Tổng số người dùng",
            totalUsers,
            "người",
            userStatus,
            ([status, userNumber]) => {
              const statusInfo = convertStatusUserUI(status);
              return (
                <List.Item>
                  <List.Item.Meta
                    avatar={statusInfo.icon}
                    title={<Tag color={statusInfo.color}>{statusInfo.text}</Tag>}
                  />
                  <div>{userNumber} tài khoản</div>
                </List.Item>
              );
            },
            loading.userStatus
          )}
        </Col>

        {/* Thống kê đơn mua */}
        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
          {renderStatisticCard(
            "Tổng số đơn mua",
            totalOrders,
            "đơn",
            orderStatus,
            ([status, number]) => (
              <List.Item>
                <List.Item.Meta
                  title={<Tag color={getStatusColor(convertVI(status))}>{convertVI(status)}</Tag>}
                />
                <div>{number}</div>
              </List.Item>
            ),
            loading.orderStatus
          )}
        </Col>

        {/* Thống kê đơn thuê */}
        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
          {renderStatisticCard(
            "Tổng số đơn thuê",
            totalRentals,
            "đơn",
            rentalStatus,
            ([status, number]) => (
              <List.Item>
                <List.Item.Meta
                  title={<Tag color={getStatusColor(convertVI(status))}>{convertVI(status)}</Tag>}
                />
                <div>{number}</div>
              </List.Item>
            ),
            loading.rentalStatus
          )}
        </Col>

        {/* Top khách hàng */}
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <Card 
            title={<Title level={4}>Top khách hàng tiềm năng</Title>}
            bordered={true}
          >
            {loading.userTopPayment ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <Spin />
              </div>
            ) : (
              <List
                grid={{ 
                  gutter: 16, 
                  xs: 1, 
                  sm: 2, 
                  md: 3, 
                  lg: 4, 
                  xl: 4, 
                  xxl: 5 
                }}
                dataSource={userTopPayment}
                locale={{ emptyText: "Không có dữ liệu" }}
                renderItem={(user, index) => (
                  <List.Item>
                    <Card>
                      <List.Item.Meta
                        avatar={<Avatar src={user.avatar || faker.image.avatar()} size="large" />}
                        title={
                          <Space>
                            <Tag color="blue">Top {index + 1}</Tag>
                            <Text strong>{user.username || user.email?.split("@")[0] || "Người dùng"}</Text>
                          </Space>
                        }
                        description={
                          <Space split={<Divider type="vertical" />}>
                            <Text>{formatMoney(user?.totalPaymentAmount || 0)}đ</Text>
                            <Text>{user?.totalOrder || 0} đơn</Text>
                          </Space>
                        }
                      />
                    </Card>
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>

        {/* Biểu đồ doanh thu */}
        <Col xs={24}>
          <Card 
            title={<Title level={4}>Doanh thu</Title>}
            extra={
              <Space>
                <Select
                  value={selectedMonthRevenue}
                  style={{ width: 120 }}
                  onChange={(value) => setSelectedMonthRevenue(parseInt(value))}
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <Option key={i + 1} value={i + 1}>
                      Tháng {i + 1}
                    </Option>
                  ))}
                </Select>

                <Select
                  value={selectedYearRevenue}
                  style={{ width: 120 }}
                  onChange={(value) => setSelectedYearRevenue(parseInt(value))}
                >
                  {Array.from({ length: 5 }, (_, i) => (
                    <Option key={i} value={new Date().getFullYear() - i}>
                      {new Date().getFullYear() - i}
                    </Option>
                  ))}
                </Select>
              </Space>
            }
            bordered={true}
          >
            {loading.revenue || loading.chart ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <Spin size="large" />
              </div>
            ) : (
              <Row gutter={16}>
                <Col xs={24} sm={24} md={18} lg={18} xl={18}>
                  <div style={{ width: "100%", height: 400 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={dataCharRevenue}
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
                        <Tooltip formatter={(value) => formatMoney(value) + (value === dataCharRevenue?.[0]?.revenue ? " đ" : "")} />
                        <Legend />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Bar
                          dataKey="revenue"
                          fill="#8884d8"
                          name="Doanh thu"
                          activeBar={<Rectangle fill="pink" stroke="blue" />}
                        />
                        <Bar
                          dataKey="order"
                          fill="#82ca9d"
                          name="Số đơn"
                          activeBar={<Rectangle fill="gold" stroke="purple" />}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Col>
                
                <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                  <Statistic
                    title="Tổng doanh thu"
                    value={Object.values(revenueGeneralData || {})?.reduce(
                      (sum, value) => (sum + (value?.revenue || 0)), 0
                    )}
                    formatter={(value) => `${formatMoney(value)} vnđ`}
                    valueStyle={{ color: "#3f8600" }}
                  />
                  
                  <Statistic
                    title="Tổng đơn hàng"
                    value={Object.values(revenueGeneralData || {})?.reduce(
                      (sum, value) => (sum + (value?.count || 0)), 0
                    )}
                    suffix="đơn"
                    valueStyle={{ color: "#1890ff" }}
                  />
                  
                  <Divider />
                  
                  <List
                    size="small"
                    dataSource={revenueTimeFrames}
                    locale={{ emptyText: "Không có dữ liệu" }}
                    renderItem={(item) => (
                      <List.Item>
                        <Card style={{ width: "100%" }} size="small">
                          <List.Item.Meta
                            avatar={<div style={{ color: item.color }}>{item.icon}</div>}
                            title={item.title}
                            description={
                              <Space direction="vertical">
                                <Text>{item.data?.count || 0} đơn</Text>
                                <Text>{formatMoney(item.data?.revenue || 0)} vnđ</Text>
                              </Space>
                            }
                          />
                        </Card>
                      </List.Item>
                    )}
                  />
                </Col>
              </Row>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;
