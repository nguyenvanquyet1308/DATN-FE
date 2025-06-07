import { useEffect, useState } from "react";
import { 
  notification, 
  Table, 
  Card, 
  Typography, 
  Descriptions, 
  Image, 
  Tag, 
  Skeleton, 
  Divider, 
  Row, 
  Col, 
  Statistic, 
  Space 
} from "antd";
import { 
  ShoppingOutlined, 
  EnvironmentOutlined, 
  PhoneOutlined, 
  ClockCircleOutlined, 
  CarOutlined, 
  CreditCardOutlined,
  DollarOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { getOrderById } from "apis/order.api";
import { useParams } from "react-router-dom";
import { convertStatusOrder } from "utils/covertDataUI";
import { formatMoney } from "utils/helper";
import moment from "moment";

const { Title, Text } = Typography;

function DetailOrder() {
  const [detailOrder, setDetailOrder] = useState({
    isLoading: true,
    data: null,
  });
  const params = useParams();

  useEffect(() => {
    const fetchDetailOrder = async () => {
      setDetailOrder((prev) => ({ ...prev, isLoading: true }));
      try {
        const res = await getOrderById(params.id);
        setDetailOrder((prev) => ({ ...prev, data: res.result }));
      } catch (error) {
        notification.error({
          message: "Lỗi tải thông tin",
          description: error.message || "Không thể tải thông tin đơn hàng",
          duration: 3,
        });
      } finally {
        setDetailOrder((prev) => ({ ...prev, isLoading: false }));
      }
    };
    if (params.id) fetchDetailOrder();
  }, [params.id]);

  const orderStatus = detailOrder.data ? convertStatusOrder(detailOrder.data.status) : null;

  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: "product",
      key: "product",
      width: "45%",
      render: (text, record) => (
        <div className="flex gap-4">
          <div className="overflow-hidden rounded-md">
            <Image
              src={record.sku.images.split(",")[0]}
              alt={record.productName}
              width={80}
              height={80}
              className="object-cover"
              preview={false}
            />
          </div>
          <div className="flex flex-col">
            <Text strong className="mb-1 text-blue-600 hover:text-blue-800">{record.productName}</Text>
            <Tag color="green" className="w-fit mb-1">
              <CheckCircleOutlined /> Đảm bảo hoàn tiền
            </Tag>
          </div>
        </div>
      ),
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
      width: "15%",
      render: (_, record) => (
        <Text className="font-medium">{formatMoney(record.sku.price)}đ</Text>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      width: "15%",
      render: (text) => (
        <Tag color="blue" className="py-1 px-3 text-center">
          {text}
        </Tag>
      ),
    },
    {
      title: "Thành tiền",
      dataIndex: "subtotal",
      key: "subtotal",
      width: "25%",
      render: (_, record) => (
        <Text strong className="text-red-500 text-lg">
          {formatMoney(record.price * record.quantity)}đ
        </Text>
      ),
    },
  ];

  return (
    <div className="order-detail-container">
      {detailOrder.isLoading ? (
        <div className="loading-state">
          <Card className="mb-4">
            <Skeleton active paragraph={{ rows: 2 }} />
          </Card>
          <Row gutter={16}>
            <Col span={24} md={8}>
              <Card>
                <Skeleton active paragraph={{ rows: 3 }} />
              </Card>
            </Col>
            <Col span={24} md={8} className="my-4 md:my-0">
              <Card>
                <Skeleton active paragraph={{ rows: 3 }} />
              </Card>
            </Col>
            <Col span={24} md={8}>
              <Card>
                <Skeleton active paragraph={{ rows: 3 }} />
              </Card>
            </Col>
          </Row>
          <Card className="mt-4">
            <Skeleton active paragraph={{ rows: 6 }} />
          </Card>
        </div>
      ) : (
        <>
          <Card className="mb-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
              <div>
                <Space size="large" align="center" className="mb-2 md:mb-0">
                  <Title level={4} className="m-0">
                    Chi tiết đơn hàng #{detailOrder.data?.orderCode}
                  </Title>
                  {orderStatus && (
                    <Tag color={orderStatus.color} className="text-base px-3 py-1">
                      {orderStatus.text}
                    </Tag>
                  )}
                </Space>
              </div>
              <Text type="secondary">
                <ClockCircleOutlined className="mr-2" />
                Ngày đặt hàng: {moment(detailOrder.data?.createdAt).format("HH:mm DD/MM/YYYY")}
              </Text>
            </div>
          </Card>

          <Row gutter={[16, 16]} className="mb-6">
            {/* Thông tin người nhận */}
            <Col span={24} lg={8}>
              <Card
                title={<Title level={5} className="m-0"><EnvironmentOutlined /> Địa chỉ người nhận</Title>}
                className="h-full shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="min-h-[150px]">
                  {detailOrder.data?.delivery ? (
                    <>
                      <Text strong className="text-lg block mb-2">
                        {detailOrder.data.delivery.username}
                      </Text>
                      <Text className="text-gray-600 block mb-2">
                        <EnvironmentOutlined className="mr-2" />
                        {detailOrder.data.delivery.street}
                        {detailOrder.data.delivery.ward && `, ${detailOrder.data.delivery.ward}`}
                        {detailOrder.data.delivery.district && `, ${detailOrder.data.delivery.district}`}
                        {detailOrder.data.delivery.city && `, ${detailOrder.data.delivery.city}`}
                      </Text>
                      <Text className="text-gray-600">
                        <PhoneOutlined className="mr-2" />
                        {detailOrder.data.delivery.numberPhone}
                      </Text>
                    </>
                  ) : (
                    <Text type="secondary">Không có thông tin giao hàng</Text>
                  )}
                </div>
              </Card>
            </Col>

            {/* Hình thức giao hàng */}
            <Col span={24} lg={8}>
              <Card
                title={<Title level={5} className="m-0"><CarOutlined /> Hình thức giao hàng</Title>}
                className="h-full shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="min-h-[150px]">
                  <Text strong className="text-lg block mb-2">Giao hàng tiết kiệm</Text>
                  <Text className="text-gray-600 block mb-2">
                    <ClockCircleOutlined className="mr-2" />
                    Giao thứ 6, trước 19h, 29/11
                  </Text>
                  <Text className="text-gray-600 block mb-2">Được giao bởi Fashion Shop</Text>
                  <Tag color="volcano" className="text-base">Phí vận chuyển: 17.700đ</Tag>
                </div>
              </Card>
            </Col>

            {/* Hình thức thanh toán */}
            <Col span={24} lg={8}>
              <Card
                title={<Title level={5} className="m-0"><CreditCardOutlined /> Hình thức thanh toán</Title>}
                className="h-full shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="min-h-[150px] flex items-center">
                  <Tag icon={<CreditCardOutlined />} color="green" className="text-lg px-3 py-2">
                    {detailOrder.data?.payment?.method === "COD"
                      ? "Thanh toán bằng tiền mặt khi nhận hàng"
                      : "Thanh toán bằng Zalo Pay"}
                  </Tag>
                </div>
              </Card>
            </Col>
          </Row>

          {/* Thông tin sản phẩm */}
          <Card className="shadow-sm hover:shadow-md transition-all duration-300">
            <Title level={5} className="mb-4">
              <ShoppingOutlined className="mr-2" />
              Sản phẩm đã đặt
            </Title>
            
            <Table
              columns={columns}
              dataSource={detailOrder.data?.orderDetails}
              pagination={false}
              rowKey="id"
              className="mb-4"
            />
            
            <Divider />
            
            <div className="flex justify-end">
              <div className="w-full md:w-80">
                <Descriptions column={1} bordered className="order-summary">
                  <Descriptions.Item label="Tạm tính">
                    <Text>{formatMoney(detailOrder.data?.total_amount + detailOrder.data?.discountValue)}đ</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Giảm giá">
                    <Text className="text-green-500 font-medium">
                      -{formatMoney(detailOrder.data?.discountValue || 0)}đ
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Tổng cộng">
                    <Text className="text-xl text-red-500 font-bold">
                      {formatMoney(detailOrder.data?.total_amount)}đ
                    </Text>
                  </Descriptions.Item>
                </Descriptions>
              </div>
            </div>
          </Card>
        </>
      )}

      <style jsx global>{`
        .order-detail-container .ant-table-thead > tr > th {
          background-color: #f0f5ff;
          font-weight: 600;
        }
        
        .order-detail-container .ant-descriptions-item-label {
          width: 100px;
          font-weight: 500;
          color: #5c5c5c;
        }
        
        .order-summary .ant-descriptions-item-content {
          text-align: right;
        }
        
        @media (max-width: 768px) {
          .order-detail-container .ant-table {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
}

export default DetailOrder;
