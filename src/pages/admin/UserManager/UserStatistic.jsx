import React, { useEffect, useState } from "react";
import { 
  Card, 
  notification, 
  Typography, 
  Select, 
  Space, 
  Avatar, 
  Divider, 
  Row, 
  Col, 
  Statistic,
  List,
  Tag,
  Spin
} from "antd";
import { getRoles } from "apis/role.api";
import {
  getStatisticUserByRole,
  getStatisticUserByStatus,
  getStatisticUserTopPayment,
  getTopReactUsers,
  getUserStatisticDaily,
} from "apis/user.api";
import { formatMoney } from "utils/helper";
import Icons from "utils/icons";
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
import { faker } from "@faker-js/faker";

const { Title, Text } = Typography;
const { Option } = Select;

function UserStatistic() {
  const [userRoles, setUserRoles] = useState({});
  const [userStatus, setUserStatus] = useState({});
  const [userTopReaction, setUserTopReaction] = useState([]);
  const [userTopPayment, setUserTopPayment] = useState([]);
  const [dataChart, setDataChart] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState({
    roles: false,
    status: false,
    reaction: false,
    payment: false,
    chart: false
  });

  const fetchUserRoleStatistic = async () => {
    setLoading(prev => ({ ...prev, roles: true }));
    try {
      const res = await getStatisticUserByRole();
      setUserRoles(res || {});
    } catch (error) {
      notification.error({
        message: "Lỗi khi tải thống kê vai trò",
        description: error.message || "Đã xảy ra lỗi, vui lòng thử lại sau",
        duration: 3,
      });
    } finally {
      setLoading(prev => ({ ...prev, roles: false }));
    }
  };

  const fetchUserStatusStatistic = async () => {
    setLoading(prev => ({ ...prev, status: true }));
    try {
      const res = await getStatisticUserByStatus();
      setUserStatus(res || {});
    } catch (error) {
      notification.error({
        message: "Lỗi khi tải thống kê trạng thái",
        description: error.message || "Đã xảy ra lỗi, vui lòng thử lại sau",
        duration: 3,
      });
    } finally {
      setLoading(prev => ({ ...prev, status: false }));
    }
  };

  const fetchUserReactionStatistic = async () => {
    setLoading(prev => ({ ...prev, reaction: true }));
    try {
      const res = await getTopReactUsers();
      setUserTopReaction(res || []);
    } catch (error) {
      notification.error({
        message: "Lỗi khi tải thống kê tương tác",
        description: error.message || "Đã xảy ra lỗi, vui lòng thử lại sau",
        duration: 3,
      });
    } finally {
      setLoading(prev => ({ ...prev, reaction: false }));
    }
  };

  const fetchUserStatisticDaily = async () => {
    setLoading(prev => ({ ...prev, chart: true }));
    try {
      const dataChar = await getUserStatisticDaily({
        month: selectedMonth,
        year: selectedYear,
      });

      const chartData = Object.entries(dataChar || {}).map(([key, value]) => ({
        name: `Ngày ${key}`,
        users: value,
      }));

      setDataChart(chartData);
    } catch (error) {
      notification.error({
        message: "Lỗi khi tải thống kê đăng ký",
        description: error.message || "Đã xảy ra lỗi, vui lòng thử lại sau",
        duration: 3,
      });
    } finally {
      setLoading(prev => ({ ...prev, chart: false }));
    }
  };

  const fetchUserPaymentStatistic = async () => {
    setLoading(prev => ({ ...prev, payment: true }));
    try {
      const res = await getStatisticUserTopPayment();
      setUserTopPayment(res || []);
    } catch (error) {
      notification.error({
        message: "Lỗi khi tải thống kê thanh toán",
        description: error.message || "Đã xảy ra lỗi, vui lòng thử lại sau",
        duration: 3,
      });
    } finally {
      setLoading(prev => ({ ...prev, payment: false }));
    }
  };

  useEffect(() => {
    fetchUserStatusStatistic();
    fetchUserRoleStatistic();
    fetchUserReactionStatistic();
    fetchUserPaymentStatistic();
    fetchUserStatisticDaily();
  }, []);

  useEffect(() => {
    fetchUserStatisticDaily();
  }, [selectedMonth, selectedYear]);

  const convertRoleUserUI = (role) => {
    if (!role) return {};

    if (role === "USER")
      return {
        text: "Khách hàng",
        icon: <Icons.FaUserTag />,
        color: "blue"
      };
    if (role === "SUPERADMIN")
      return {
        text: "Super admin",
        icon: <Icons.FaUserShield />,
        color: "red"
      };

    if (role.toUpperCase().includes("STAFF"))
      return {
        text: "Nhân viên",
        icon: <Icons.FaUserTie />,
        color: "purple"
      };

    return {
      text: "Nhân viên",
      icon: <Icons.FaUserCog />,
      color: "orange"
    };
  };

  const convertStatusUserUI = (status) => {
    if (!status) return {};

    if (status === "INACTIVE")
      return {
        text: "Chưa kích hoạt",
        icon: <Icons.TbLockOff />,
        color: "default"
      };

    if (status === "BLOCKED")
      return {
        text: "Đã bị khóa",
        icon: <Icons.TbLockOpenOff />,
        color: "error"
      };

    return {
      text: "Kích hoạt",
      icon: <Icons.FaCheck />,
      color: "success"
    };
  };

  const totalUsers = Object.values(userRoles).reduce((sum, curr) => sum + curr, 0);

  return (
    <Card style={{ margin: '16px' }}>
      <Title level={2} style={{ textAlign: 'center', color: '#1890ff' }}>
        Thống kê người dùng
      </Title>

      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card title="Người dùng hiện tại" loading={loading.roles}>
            <List
              dataSource={Object.entries(userRoles)}
              renderItem={([role, userNumber]) => {
                const roleInfo = convertRoleUserUI(role);
                return (
                  <List.Item>
                    <Space>
                      {roleInfo.icon}
                      <Tag color={roleInfo.color}>{roleInfo.text}</Tag>
                    </Space>
                    <Text strong>{userNumber} tài khoản</Text>
                  </List.Item>
                );
              }}
              footer={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Space>
                    <Icons.MdOutlineClearAll />
                    <Text strong>Tổng số</Text>
                  </Space>
                  <Text strong>{totalUsers} người</Text>
                </div>
              }
            />
          </Card>
        </Col>

        <Col span={6}>
          <Card title="Trạng thái người dùng" loading={loading.status}>
            <List
              dataSource={Object.entries(userStatus)}
              renderItem={([status, userNumber]) => {
                const statusInfo = convertStatusUserUI(status);
                return (
                  <List.Item>
                    <Space>
                      {statusInfo.icon}
                      <Tag color={statusInfo.color}>{statusInfo.text}</Tag>
                    </Space>
                    <Text strong>{userNumber} tài khoản</Text>
                  </List.Item>
                );
              }}
            />
          </Card>
        </Col>

        <Col span={6}>
          <Card title="Top tương tác" loading={loading.reaction}>
            <List
              dataSource={userTopReaction}
              renderItem={(user, index) => (
                <List.Item>
                  <Space>
                    <Tag color="blue">Top {index + 1}</Tag>
                    <Avatar src={user.avatar || faker.image.avatar()} />
                    <Text>{user.username || user.email?.split("@")[0]}</Text>
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col span={6}>
          <Card title="Top khách hàng tiềm năng" loading={loading.payment}>
            <List
              dataSource={userTopPayment}
              renderItem={(user, index) => (
                <List.Item>
                  <Space direction="vertical" size={0} style={{ width: '100%' }}>
                    <Space>
                      <Tag color="blue">Top {index + 1}</Tag>
                      <Avatar src={user.avatar || faker.image.avatar()} />
                      <Text>{user.username || user.email?.split("@")[0]}</Text>
                    </Space>
                    <Space style={{ marginLeft: '58px', marginTop: '4px' }}>
                      <Tag color="green">{formatMoney(user?.totalPaymentAmount)}đ</Tag>
                      <Tag color="orange">{user?.totalOrder} đơn</Tag>
                    </Space>
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      <Card 
        title="Thống kê người dùng đăng ký" 
        style={{ marginTop: '16px' }}
        extra={
          <Space>
            <Select
              value={selectedMonth}
              onChange={(value) => setSelectedMonth(value)}
              style={{ width: 120 }}
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
            >
              {Array.from({ length: 5 }, (_, i) => (
                <Option key={i} value={new Date().getFullYear() - i}>
                  {new Date().getFullYear() - i}
                </Option>
              ))}
            </Select>
          </Space>
        }
      >
        <Spin spinning={loading.chart}>
          <Text type="secondary" strong>
            Tổng người dùng đăng ký tháng {selectedMonth} năm {selectedYear}: {' '}
            <Text type="danger" strong>
              {dataChart?.reduce((sum, item) => sum + item.users, 0) || 0} người dùng
            </Text>
          </Text>

          <div style={{ height: 400, marginTop: 20 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dataChart}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                barSize={20}
              >
                <XAxis dataKey="name" scale="point" padding={{ left: 10, right: 10 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <CartesianGrid strokeDasharray="3 3" />
                <Bar dataKey="users" name="Người dùng" fill="#1890ff" background={{ fill: "#eee" }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Spin>
      </Card>
    </Card>
  );
}

export default UserStatistic;
