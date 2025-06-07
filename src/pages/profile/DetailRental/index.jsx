import { useEffect, useState } from "react";
import { 
  notification, 
  Table, 
  Card, 
  Typography, 
  Tag, 
  Badge, 
  Row, 
  Col, 
  Image, 
  Descriptions, 
  Divider, 
  Skeleton, 
  Space, 
  Tooltip, 
  Progress 
} from "antd";
import { 
  ClockCircleOutlined, 
  EnvironmentOutlined, 
  PhoneOutlined, 
  CarOutlined, 
  CreditCardOutlined, 
  CalendarOutlined, 
  HistoryOutlined,
  FieldTimeOutlined,
  ShoppingOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { getRentalById } from "apis/rental.api";
import moment from "moment";
import { useParams } from "react-router-dom";
import { convertStatusOrder } from "utils/covertDataUI";
import { formatMoney } from "utils/helper";

const { Title, Text, Paragraph } = Typography;

function DetailRental() {
  const [detailOrder, setDetailOrder] = useState({
    isLoading: true,
    data: null,
  });
  const params = useParams();

  useEffect(() => {
    const fetchDetailOrder = async () => {
      setDetailOrder((prev) => ({ ...prev, isLoading: true }));
      try {
        const res = await getRentalById(params.id);
        setDetailOrder((prev) => ({ ...prev, data: res.result }));
      } catch (error) {
        notification.error({
          message: "Lỗi tải thông tin",
          description: error.message || "Vui lòng thử lại sau...",
          duration: 3,
          placement: "top",
        });
      } finally {
        setDetailOrder((prev) => ({ ...prev, isLoading: false }));
      }
    };
    if (params.id) fetchDetailOrder();
  }, [params.id]);

  const orderStatus = detailOrder.data ? convertStatusOrder(detailOrder.data.status) : null;

  // Tính toán thời gian còn lại
  const getRemainingTimeInfo = (endTime) => {
    if (!endTime) return { color: "default", text: "Chưa nhận", timeLeft: null };

    const currentTime = moment();
    const endMoment = moment(endTime);
    const diffHours = endMoment.diff(currentTime, "hours");
    const diffMinutes = endMoment.diff(currentTime, "minutes") % 60;

    // Nếu thời gian đã quá hạn
    if (endMoment.isBefore(currentTime)) {
      return { 
        color: "error", 
        text: "Đã quá hạn", 
        timeLeft: `Quá hạn ${Math.abs(diffHours)} giờ ${Math.abs(diffMinutes)} phút`,
        percentage: 100
      };
    }

    // Nếu còn dưới 2 giờ
    if (diffHours < 2) {
      return { 
        color: "warning", 
        text: "Sắp hết hạn", 
        timeLeft: `Còn ${diffHours} giờ ${diffMinutes} phút`,
        percentage: 90
      };
    }

    // Còn nhiều thời gian
    return { 
      color: "success", 
      text: "Còn hạn", 
      timeLeft: `Còn ${diffHours} giờ ${diffMinutes} phút`,
      percentage: 50
    };
  };

  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: "productName",
      key: "productName",
      width: "40%",
      render: (value, record) => (
        <div className="flex gap-4">
          <div className="overflow-hidden rounded-md">
            <Image
              src={record.sku.images.split(",")[0]}
              alt={value}
              width={80}
              height={80}
              className="object-cover"
              preview={false}
            />
          </div>
          <div className="flex flex-col">
            <Text strong className="mb-1 text-blue-600 hover:text-blue-800">
              {value}
            </Text>
            
            <Space wrap className="mb-2">
              {record.quantity > 0 && (
                <Tag color="blue">Số lượng: {record.quantity}</Tag>
              )}
              {record.sku?.attributes["color"] && (
                <Tag color="cyan">
                  Màu: {record.sku?.attributes["color"]}
                </Tag>
              )}
              {record.sku?.attributes["size"] && (
                <Tag color="purple">
                  Size: {record.sku?.attributes["size"]}
                </Tag>
              )}
              {record.sku?.attributes["material"] && (
                <Tag color="geekblue">
                  Chất liệu: {record.sku?.attributes["material"]}
                </Tag>
              )}
            </Space>
            
            {detailOrder.data?.rentalPackage && (
              <Tag color="green" className="w-fit">
                {detailOrder.data?.rentalPackage?.name}
              </Tag>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Thời gian thuê",
      dataIndex: "duration",
      key: "duration",
      width: "30%",
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <div>
            <Badge status="processing" color="blue" />
            <Text strong className="ml-2">Thời hạn: </Text>
            {!detailOrder.data?.rentalPackage ? (
              <Text>
                {record.day > 0 && <span>{record.day} ngày </span>}
                {record.hour > 0 && <span>{record.hour} giờ</span>}
              </Text>
            ) : (
              <Text>
                {detailOrder.data?.rentalPackage?.durationDays} ngày
              </Text>
            )}
          </div>
          
          <div>
            <Badge status="success" color="green" />
            <Text strong className="ml-2">Nhận: </Text>
            <Text>
              {record.startAt ? moment(new Date(record.startAt)).format("HH:mm DD/MM/YYYY") : "Chưa nhận"}
            </Text>
          </div>
          
          <div>
            <Badge status="error" color="red" />
            <Text strong className="ml-2">Trả: </Text>
            <Text>
              {record.endAt ? moment(new Date(record.endAt)).format("HH:mm DD/MM/YYYY") : "Chưa xác định"}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "30%",
      render: (_, record) => {
        const timeInfo = getRemainingTimeInfo(record.endAt);
        
        return (
          <div>
            {record.endAt ? (
              <div className="flex flex-col gap-2">
                <Tag color={timeInfo.color} className="w-fit px-2 py-1 mb-1 text-center">
                  {timeInfo.text}
                </Tag>
                
                <div className="flex items-center">
                  <ClockCircleOutlined className="mr-2" />
                  <Text>{timeInfo.timeLeft}</Text>
                </div>
                
                {timeInfo.percentage !== undefined && (
                  <Tooltip title={`${timeInfo.text}: ${timeInfo.timeLeft}`}>
                    <Progress 
                      percent={timeInfo.percentage} 
                      size="small" 
                      status={timeInfo.color === "error" ? "exception" : 
                              timeInfo.color === "warning" ? "normal" : "success"} 
                      showInfo={false}
                    />
                  </Tooltip>
                )}
              </div>
            ) : (
              <Tag color="default">Chưa nhận sản phẩm</Tag>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="rental-detail-container">
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
                    Chi tiết đơn thuê #{detailOrder.data?.rentalCode}
                  </Title>
                  {orderStatus && (
                    <Tag color={orderStatus.color} className="text-base px-3 py-1">
                      {orderStatus.text}
                    </Tag>
                  )}
                </Space>
              </div>
              <Text type="secondary">
                <CalendarOutlined className="mr-2" />
                Ngày đặt: {moment(detailOrder.data?.createdAt).format("HH:mm DD/MM/YYYY")}
              </Text>
            </div>
          </Card>

          <Row gutter={[16, 16]} className="mb-6">
            {/* Địa chỉ người nhận */}
            <Col span={24} lg={8}>
              <Card
                title={<Title level={5} className="m-0"><EnvironmentOutlined /> Địa chỉ người thuê</Title>}
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
              Sản phẩm đã thuê
              {detailOrder.data?.rentalPackage && (
                <Tag color="green" className="ml-2">
                  {detailOrder.data?.rentalPackage?.name} - {detailOrder.data?.rentalPackage?.durationDays} ngày
                </Tag>
              )}
            </Title>
            
            <Table
              columns={columns}
              dataSource={detailOrder.data?.rentalItems}
              pagination={false}
              rowKey="id"
              className="mb-4"
              expandable={{
                expandedRowRender: (record) => (
                  <div className="py-2 px-4">
                    <Space>
                      <InfoCircleOutlined className="text-blue-500" />
                      <Text type="secondary">
                        Chi tiết thêm về sản phẩm thuê {record.productName}
                      </Text>
                    </Space>
                  </div>
                )
              }}
            />
            
            <Divider />
            
            <div className="flex justify-end">
              <div className="w-full md:w-80">
                <Descriptions column={1} bordered className="rental-summary">
                  <Descriptions.Item label="Tạm tính">
                    <Text>{formatMoney(detailOrder.data?.totalPrice || 0)}đ</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Giảm giá">
                    <Text className="text-green-500 font-medium">
                      -{formatMoney(detailOrder.data?.discount || 0)}đ
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Tổng cộng">
                    <Text className="text-xl text-red-500 font-bold">
                      {formatMoney(detailOrder.data?.finalPrice || 0)}đ
                    </Text>
                  </Descriptions.Item>
                  {detailOrder.data?.deposit > 0 && (
                    <Descriptions.Item label="Cọc">
                      <Text className="text-orange-500 font-medium">
                        {formatMoney(detailOrder.data?.deposit)}đ
                      </Text>
                    </Descriptions.Item>
                  )}
                </Descriptions>
              </div>
            </div>
          </Card>
          
          {/* Thông tin chính sách */}
          <Card className="mt-4 shadow-sm hover:shadow-md transition-all duration-300">
            <Title level={5}>
              <InfoCircleOutlined className="mr-2" />
              Lưu ý khi thuê sản phẩm
            </Title>
            <Paragraph>
              <ul className="list-disc pl-5 text-gray-600">
                <li>Vui lòng trả sản phẩm đúng thời hạn đã thỏa thuận</li>
                <li>Tiền cọc sẽ được hoàn trả sau khi sản phẩm được trả lại trong tình trạng tốt</li>
                <li>Phí phạt có thể phát sinh nếu sản phẩm bị hư hỏng hoặc trả muộn</li>
                <li>Liên hệ hotline 1900 1234 nếu có bất kỳ câu hỏi nào về đơn thuê</li>
              </ul>
            </Paragraph>
          </Card>
        </>
      )}

      <style jsx global>{`
        .rental-detail-container .ant-table-thead > tr > th {
          background-color: #f0f5ff;
          font-weight: 600;
        }
        
        .rental-detail-container .ant-descriptions-item-label {
          width: 100px;
          font-weight: 500;
          color: #5c5c5c;
        }
        
        .rental-summary .ant-descriptions-item-content {
          text-align: right;
        }
        
        @media (max-width: 768px) {
          .rental-detail-container .ant-table {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
}

export default DetailRental;
