import { faker } from "@faker-js/faker";
import { Button, notification, Table, Card, Typography, Avatar, Space, Tag, Row, Col, Image, Descriptions, Badge, Breadcrumb } from "antd";
import { getRentalById } from "apis/rental.api";
import logo from "assets/images/logo.jpg";
import paths from "constant/paths";
import moment from "moment";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HashLoader } from "react-spinners";
import { convertVI } from "utils/covertDataUI";
import { formatMoney } from "utils/helper";
import Icons from "utils/icons";

const { Title, Text } = Typography;

function DetailRental() {
  const params = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchDetailRental = async () => {
      if (!params.rentalId) navigate(paths.ADMIN.RENTAL_MANAGEMENT);

      setIsLoading(true);
      try {
        const res = await getRentalById(params.rentalId);
        setData(res.result);
      } catch (error) {
        notification.warning({
          message: error.message,
          duration: 2,
          placement: "top",
        });
        navigate(paths.ADMIN.RENTAL_MANAGEMENT);
      }

      setIsLoading(false);
    };

    fetchDetailRental();
  }, []);

  const getStatusColor = (status) => {
    const statusMap = {
      "Đang xử lí": "processing",
      "Đang thuê": "success",
      "Đang giao": "warning",
      "Đang trả": "warning",
      "Đã hủy": "error",
      "Chưa thanh toán": "warning",
      "Đã hoàn thành": "success",
      "Hết hạn": "default",
    };
    return statusMap[convertVI(status)] || "default";
  };

  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: "productName",
      key: "productName",
      render: (value, record) => (
        <Space size="middle" align="start">
          <Image
            src={record.sku.images.split(",")[0]}
            alt={value}
            width={80}
            height={80}
            className="object-cover rounded border border-gray-200"
            preview={{
              mask: <div className="flex items-center justify-center"><Icons.FaEye /></div>
            }}
          />
          <div className="flex flex-col gap-1">
            <Text strong className="text-primary">{value}</Text>
            {record?.endAt && (
              <Text type="secondary">
                {moment(new Date(record?.endAt)).format("HH:mm:ss DD-MM-YYYY")}
              </Text>
            )}
            <Space wrap>
              <Text>SL: x{record.quantity}</Text>
              
              {record.sku?.attributes["color"] && (
                <Tag color={record.sku?.attributes["color"].toLowerCase()}>
                  Màu: {record.sku?.attributes["color"]}
                </Tag>
              )}
              
              {record.sku?.attributes["size"] && (
                <Tag>Kích thước: {record.sku?.attributes["size"]}</Tag>
              )}
              
              {record.sku?.attributes["material"] && (
                <Tag>Chất liệu: {record.sku?.attributes["material"]}</Tag>
              )}
            </Space>
            
            {data?.rentalPackage && (
              <Tag color="blue" className="mt-1">
                {data?.rentalPackage?.name}
              </Tag>
            )}
          </div>
        </Space>
      ),
    },
    {
      title: "Giá thuê",
      dataIndex: "price",
      key: "price",
      render: (value) => <Text strong>{formatMoney(value)}đ</Text>,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (value) => <Badge count={value} showZero style={{ backgroundColor: "#00ADB5" }} />,
    },
    {
      title: "Tạm tính",
      dataIndex: "price",
      key: "price",
      render: (value) => (
        <Text strong className="text-primary">{formatMoney(value)}đ</Text>
      ),
    },
    {
      title: "Nhận vào lúc",
      dataIndex: "startAt",
      key: "startAt",
      render: (value) => (
        <div>
          {value ? (
            <Text>{moment(new Date(value)).format("HH:mm:ss DD/MM/YYYY")}</Text>
          ) : (
            <Text type="secondary">Chưa nhận</Text>
          )}
        </div>
      ),
    },
    {
      title: "Trả vào",
      dataIndex: "endAt",
      key: "endAt",
      render: (value) => {
        const currentTime = moment();
        const endTime = moment(value);

        const diffHours = endTime.diff(currentTime, "hours");
        const diffMinutes = endTime.diff(currentTime, "minutes");

        let tagColor = "default";
        let remainingTimeText = "";

        if (diffHours > 2) {
          tagColor = "green";
          remainingTimeText = `${Math.abs(diffHours)} giờ nữa`;
        } else if (diffHours < 0) {
          tagColor = "red";
          remainingTimeText = "Đã quá giờ";
        } else if (diffHours <= 2) {
          tagColor = "orange";
          if (diffMinutes > 0) {
            remainingTimeText = `${Math.abs(diffMinutes)} phút nữa`;
          } else {
            remainingTimeText = `${Math.abs(diffHours)} giờ nữa`;
          }
        }

        return (
          <div>
            {value ? (
              <Space direction="vertical" size={1}>
                <Text>{moment(new Date(value)).format("HH:mm:ss DD/MM/YYYY")}</Text>
                <Tag color={tagColor}>Còn {remainingTimeText}</Tag>
              </Space>
            ) : (
              <Text type="secondary">Chưa nhận</Text>
            )}
          </div>
        );
      },
    },
    {
      title: "Thời hạn",
      dataIndex: "duration",
      key: "duration",
      render: (_, record) => (
        <Space>
          <Icons.MdTimer size={20} className="text-green-600" />
          {!data?.rentalPackage ? (
            <Space>
              {record.day > 0 && <Tag color="cyan">{record.day} ngày</Tag>}
              {record.hour > 0 && <Tag color="blue">{record.hour} giờ</Tag>}
            </Space>
          ) : (
            <Tag color="green">{data?.rentalPackage?.durationDays} ngày</Tag>
          )}
        </Space>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <HashLoader size={60} color="#00ADB5" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Card className="mb-6 shadow-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img
              src={logo}
              alt="logo"
              className="w-12 h-12 object-contain rounded-md"
            />
            <div>
              <Breadcrumb
                items={[
                  { 
                    title: 'Admin',
                    href: paths.ADMIN.DASHBOARD
                  },
                  { 
                    title: 'Quản lí đơn thuê',
                    href: paths.ADMIN.RENTAL_MANAGEMENT
                  },
                  { 
                    title: `Đơn thuê #${data?.rentalCode || ''}` 
                  }
                ]}
                className="mb-1"
              />
              <Title level={3} className="m-0 flex items-center gap-2">
                Đơn thuê #{data?.rentalCode}
              </Title>
            </div>
          </div>
          
          <Button 
            type="primary"
            onClick={() => navigate(paths.ADMIN.RENTAL_MANAGEMENT)}
            className="bg-primary hover:bg-primary/90"
            icon={<Icons.FaList />}
            size="large"
          >
            Danh sách đơn thuê
          </Button>
        </div>
      </Card>

      {data && (
        <div className="space-y-6">
          <Card className="shadow-sm">
            <div className="mb-3">
              <Space>
                <Text type="secondary">Ngày tạo đơn:</Text>
                <Text strong className="text-yellow-700">
                  {moment(new Date(data.createdAt)).format("HH:mm:ss DD/MM/YYYY")}
                </Text>

                <Text type="secondary" className="ml-6">Trạng thái:</Text>
                <Badge status={getStatusColor(data.status)} text={convertVI(data.status)} />

                <Text type="secondary" className="ml-6">Thanh toán:</Text>
                <Tag color="blue">{data?.payment?.method}</Tag>
              </Space>
            </div>

            <Row gutter={[16, 16]}>
              <Col xs={24} md={8}>
                <Card 
                  title="Thông tin khách hàng" 
                  size="small"
                  className="h-full"
                  bordered
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar 
                      size={64} 
                      src={data?.user?.avatar || faker.image.avatar()} 
                      className="border-2 border-primary" 
                    />
                    <div>
                      <Text strong className="text-lg block">
                        {data?.user?.username || data?.user?.email.split("@")[0]}
                      </Text>
                      <Text type="secondary">{data?.user?.email}</Text>
                    </div>
                  </div>
                </Card>
              </Col>
              
              <Col xs={24} md={16}>
                <Card 
                  title="Thông tin giao hàng" 
                  size="small"
                  className="h-full"
                  bordered
                >
                  <Descriptions column={{ xs: 1, sm: 2 }} layout="horizontal">
                    <Descriptions.Item label="Người nhận">
                      <Text strong>{data.delivery.username}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Số điện thoại">
                      <Text strong>{data.delivery.numberPhone}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Loại địa chỉ" span={1}>
                      <Tag color="green">{data.delivery.typeAddress}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Địa chỉ" span={2}>
                      <Text>
                        {data?.delivery?.street}
                        {data?.delivery?.ward && (
                          <span>, {data?.delivery?.ward}</span>
                        )}
                        {data?.delivery?.district && (
                          <span>, {data?.delivery?.district}</span>
                        )}
                        {data?.delivery?.city && (
                          <span>, {data?.delivery?.city}</span>
                        )}
                      </Text>
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
            </Row>
          </Card>

          <Card 
            title={
              <div className="flex items-center gap-2">
                <Icons.FaBoxOpen />
                <span>Danh sách hàng đã thuê</span>
              </div>
            }
            className="shadow-sm"
          >
            <Table 
              columns={columns} 
              dataSource={data?.rentalDetails}
              rowKey="id"
              bordered
              pagination={false}
              className="overflow-x-auto"
            />
          </Card>
        </div>
      )}
    </div>
  );
}

export default DetailRental;
