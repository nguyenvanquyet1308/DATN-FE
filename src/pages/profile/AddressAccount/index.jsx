import { useState, useEffect } from "react";
import { 
  Button, 
  notification, 
  Skeleton, 
  Card, 
  Typography, 
  Space, 
  Tag, 
  Divider, 
  Empty, 
  Popconfirm, 
  Row, 
  Col 
} from "antd";
import { 
  PlusOutlined, 
  HomeOutlined, 
  PhoneOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  CheckCircleOutlined, 
  EnvironmentOutlined 
} from '@ant-design/icons';
import { deleteDelivery, getDeliveries } from "apis/delivery.api";
import paths from "constant/paths";
import { generatePath, useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

function AddressAccount() {
  const [deliveries, setDeliveries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleFetchDeliveries = async () => {
    setIsLoading(true);
    try {
      const res = await getDeliveries({ limit: 20 });
      setDeliveries(res?.result?.content || []);
    } catch (error) {
      notification.error({
        message: "Lỗi khi tải địa chỉ",
        description: error.message || "Không thể tải địa chỉ. Vui lòng thử lại.",
        duration: 3,
      });
    }
    setIsLoading(false);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDelivery(id);
      notification.success({
        message: "Đã xóa địa chỉ",
        description: "Địa chỉ đã được xóa thành công",
        duration: 2,
      });
      handleFetchDeliveries();
    } catch (error) {
      notification.error({
        message: "Lỗi khi xóa địa chỉ",
        description: error.message || "Không thể xóa địa chỉ. Vui lòng thử lại.",
        duration: 3,
      });
    }
  };

  useEffect(() => {
    handleFetchDeliveries();
  }, []);

  return (
    <div className="address-account">
      <div className="mb-6">
        <Title level={2} className="mb-1">Sổ địa chỉ</Title>
        <Text type="secondary">Quản lý địa chỉ giao hàng của bạn</Text>
      </div>

      <Card
        className="mb-4 hover:shadow-md transition-shadow duration-300"
        onClick={() => navigate(paths.MEMBER.CREATE_ADDRESS_ACCOUNT)}
        hoverable
      >
        <div className="flex items-center justify-center py-6 cursor-pointer text-blue-600">
          <Space size="middle" direction="vertical" align="center">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-full">
              <PlusOutlined style={{ fontSize: '24px' }} className="text-blue-500" />
            </div>
            <Text strong className="text-lg">Thêm địa chỉ mới</Text>
          </Space>
        </div>
      </Card>

      <div className="address-list">
        {isLoading ? (
          <Row gutter={[0, 16]}>
            {[1, 2, 3].map((_, index) => (
              <Col key={index} span={24}>
                <Card className="w-full">
                  <Skeleton active paragraph={{ rows: 3 }} />
                </Card>
              </Col>
            ))}
          </Row>
        ) : deliveries.length === 0 ? (
          <Empty 
            description="Bạn chưa có địa chỉ nào" 
            image={Empty.PRESENTED_IMAGE_SIMPLE} 
          />
        ) : (
          <Row gutter={[0, 16]}>
            {deliveries
              ?.sort((a, b) => (b.isDefault === true) - (a.isDefault === true))
              .map((address) => (
                <Col key={address.id} span={24}>
                  <Card 
                    className="w-full hover:shadow-md transition-all duration-300"
                    bordered={true}
                  >
                    <div className="flex flex-col md:flex-row justify-between md:items-center">
                      <div className="flex-grow mb-4 md:mb-0">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <Title level={5} className="m-0">{address?.username}</Title>
                          {address?.isDefault && (
                            <Tag color="success" icon={<CheckCircleOutlined />}>
                              Địa chỉ mặc định
                            </Tag>
                          )}
                        </div>
                        
                        <Space direction="vertical" size="small" className="w-full">
                          <div className="flex items-start">
                            <EnvironmentOutlined className="text-gray-500 mr-2 mt-1" />
                            <Text>
                              {address?.street}
                              {address?.ward && <span>, {address?.ward}</span>}
                              {address?.district && <span>, {address?.district}</span>}
                              {address?.city && <span>, {address?.city}</span>}
                            </Text>
                          </div>
                          <div className="flex items-center">
                            <PhoneOutlined className="text-gray-500 mr-2" />
                            <Text>{address?.numberPhone}</Text>
                          </div>
                        </Space>
                      </div>
                      
                      <Space>
                        <Button 
                          type="primary" 
                          icon={<EditOutlined />}
                          onClick={() => navigate(generatePath(paths.MEMBER.UPDATE_ADDRESS_ACCOUNT, { id: address?.id }))}
                        >
                          Chỉnh sửa
                        </Button>
                        
                        {!address?.isDefault && (
                          <Popconfirm
                            title="Xóa địa chỉ"
                            description="Bạn có chắc chắn muốn xóa địa chỉ này không?"
                            onConfirm={() => handleDelete(address?.id)}
                            okText="Xóa"
                            cancelText="Hủy"
                            okButtonProps={{ danger: true }}
                          >
                            <Button 
                              danger 
                              icon={<DeleteOutlined />}
                            >
                              Xóa
                            </Button>
                          </Popconfirm>
                        )}
                      </Space>
                    </div>
                  </Card>
                </Col>
              ))}
          </Row>
        )}
      </div>

      <style jsx global>{`
        .address-account .ant-card-body {
          padding: 24px;
        }
        
        @media (max-width: 768px) {
          .address-account .ant-card-body {
            padding: 16px;
          }
        }
      `}</style>
    </div>
  );
}

export default AddressAccount;
