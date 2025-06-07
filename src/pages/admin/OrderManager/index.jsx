import React, { useEffect, useState } from "react";
import { 
  Card, 
  notification, 
  Tooltip, 
  Table, 
  Tabs, 
  Tag, 
  Button, 
  Image, 
  Space,
  Typography
} from "antd";
import { EyeOutlined } from "@ant-design/icons";
import moment from "moment";
import { useDispatch } from "react-redux";
import { changeLoading } from "store/slicers/common.slicer";
import { getOrders } from "apis/order.api";
import { Link } from "react-router-dom";

const { Title } = Typography;
const { TabPane } = Tabs;

function OrderManager() {
  const dispatch = useDispatch();

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("");

  const fetchOrders = async (params = {}) => {
    dispatch(changeLoading());
    try {
      const requestParams = {
        limit: params.pageSize || pagination.pageSize,
        page: params.current || pagination.current,
        ...(status ? { status } : {}),
      };
      
      const res = await getOrders(requestParams);
      
      setOrders(res?.result?.content || []);
      setPagination({
        ...pagination,
        current: params.current || pagination.current,
        pageSize: params.pageSize || pagination.pageSize,
        total: res?.result?.totalElements || 0
      });
    } catch (error) {
      notification.error({
        message: "Lỗi khi tải danh sách đơn hàng",
        description: error.message || "Đã xảy ra lỗi, vui lòng thử lại",
        duration: 2,
      });
    }
    dispatch(changeLoading());
  };

  useEffect(() => {
    fetchOrders();
  }, [status]);

  const handleTableChange = (newPagination) => {
    fetchOrders({
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    });
  };

  const handleTabChange = (newStatus) => {
    setStatus(newStatus);
    setPagination({
      ...pagination,
      current: 1
    });
  };

  const getStatusTag = (statusValue) => {
    const statusConfig = {
      UNPAID: { color: 'red', text: 'Chưa thanh toán' },
      PENDING: { color: 'gold', text: 'Chờ xác nhận' },
      CONFIRMED: { color: 'blue', text: 'Đã xác nhận' },
      SHIPPED: { color: 'green', text: 'Đang giao hàng' },
      CANCELLED: { color: 'volcano', text: 'Đã hủy' },
      DELIVERED: { color: 'cyan', text: 'Đã giao hàng' }
    };

    const config = statusConfig[statusValue] || { color: 'default', text: 'Không xác định' };
    
    return (
      <Tag color={config.color} key={statusValue}>
        {config.text}
      </Tag>
    );
  };

  const columns = [
    {
      title: 'STT',
      key: 'index',
      width: 70,
      render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: 'Họ và tên',
      dataIndex: ['delivery', 'username'],
      key: 'username',
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: 'Địa chỉ',
      dataIndex: ['delivery', 'city'],
      key: 'city',
      render: (text) => <span>{text}</span>,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => date ? moment(date).format('DD/MM/YYYY HH:mm') : 'N/A',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusTag(status),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Link to={`/admin/order-management/${record.id}`}>
          <Button 
            type="primary" 
            icon={<EyeOutlined />}
          >
            Chi tiết
          </Button>
        </Link>
      ),
    },
  ];

  // Tạo các tab cho từng trạng thái
  const tabItems = [
    { key: "", label: "Tất cả đơn" },
    { key: "UNPAID", label: "Chưa thanh toán" },
    { key: "PENDING", label: "Chờ xác nhận" },
    { key: "CONFIRMED", label: "Đã xác nhận" },
    { key: "SHIPPED", label: "Đang giao hàng" },
    { key: "CANCELLED", label: "Đã hủy" },
    { key: "DELIVERED", label: "Đã giao hàng" }
  ];

  return (
    <Card className="order-manager" title={<Title level={3}>Quản lý đơn hàng</Title>}>
      <Tabs 
        activeKey={status} 
        onChange={handleTabChange}
        type="card"
        items={tabItems.map(item => ({
          key: item.key,
          label: (
            <span style={{ 
              color: item.key === "UNPAID" ? "#ff4d4f" : 
                    item.key === "PENDING" ? "#faad14" :
                    item.key === "CONFIRMED" ? "#1890ff" :
                    item.key === "SHIPPED" ? "#52c41a" :
                    item.key === "CANCELLED" ? "#f5222d" :
                    item.key === "DELIVERED" ? "#13c2c2" : "inherit"
            }}>
              {item.label}
            </span>
          )
        }))}
      />

      <Table
        columns={columns}
        dataSource={orders}
        rowKey="id"
        pagination={{
          ...pagination,
          showSizeChanger: true,
          pageSizeOptions: [10, 25, 40, 100],
          showTotal: (total) => `Tổng cộng ${total} đơn hàng`
        }}
        onChange={handleTableChange}
        bordered
        scroll={{ x: 800 }}
        expandable={{
          expandedRowRender: record => (
            record.orderDetails && record.orderDetails[0]?.sku?.images ? (
              <div style={{ padding: "12px" }}>
                <Image
                  width={200}
                  src={record.orderDetails[0].sku.images.split(",")[0]}
                  alt={record.orderDetails[0].productName || "Sản phẩm"}
        />
      </div>
            ) : null
          )
        }}
      />
    </Card>
  );
}

export default OrderManager;
