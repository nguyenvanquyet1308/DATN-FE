import { useEffect, useState } from "react";
import { 
  Button, 
  DatePicker, 
  Modal, 
  notification, 
  Skeleton, 
  Tabs, 
  Card, 
  Typography, 
  Input, 
  Space, 
  Tag, 
  Empty, 
  Image, 
  Badge, 
  Divider 
} from "antd";
import { 
  SearchOutlined, 
  ShoppingOutlined, 
  CalendarOutlined, 
  HistoryOutlined, 
  ShopOutlined, 
  FileTextOutlined,
  FileDoneOutlined,
  ClockCircleOutlined,
  RedoOutlined,
  EyeOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import { changeOrderStatus, getOrders } from "apis/order.api";
import paths from "constant/paths";
import useDebounce from "hooks/useDebounce";
import moment from "moment";
import Pagination from "pages/admin/components/Pagination";
import { generatePath, useNavigate } from "react-router-dom";
import { convertStatusOrder } from "utils/covertDataUI";
import { formatMoney, trunCateText } from "utils/helper";
import Icons from "utils/icons";
import OrderReviewForm from "./OrderReviewForm";
import { setSelectedCart } from "store/slicers/cart.slicer";
import { useDispatch } from "react-redux";

const { confirm } = Modal;
const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;

function OrderHistory() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [orderData, setOrderData] = useState({
    isLoading: false,
    data: [],
  });
  const [reviewFormModalData, setReviewFormModalData] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const keyDebounce = useDebounce(searchKeyword, 400);
  const dispatch = useDispatch();

  const fetchOrders = async () => {
    setOrderData((prev) => ({ ...prev, isLoading: true }));
    try {
      const params = {
        page,
        limit,
      };

      if (selectedStatus) params.status = selectedStatus;
      if (keyDebounce) params.keyword = keyDebounce;
      else {
        delete params.keyword;
      }
      if (startDate)
        params.startDate = moment(new Date(startDate)).format("YYYY-MM-DD");

      if (endDate)
        params.endDate = moment(new Date(endDate)).format("YYYY-MM-DD");

      const res = await getOrders(params);
      setOrderData((prev) => ({ ...prev, data: res?.result }));
    } catch (error) {
      notification.warning({
        message: "Lỗi khi tải dữ liệu",
        description: error.message,
        duration: 3,
        placement: "top",
      });
    }
    setOrderData((prev) => ({ ...prev, isLoading: false }));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [page, limit]);

  useEffect(() => {
    setPage(1);
    fetchOrders();
  }, [keyDebounce, selectedStatus, startDate, endDate]);

  const tabItems = [
    {
      key: "All",
      label: (
        <Space>
          <ShoppingOutlined />
          Tất cả đơn
        </Space>
      ),
    },
    {
      key: "UNPAID",
      label: (
        <Space>
          <ClockCircleOutlined />
          Chờ thanh toán
        </Space>
      ),
    },
    {
      key: "PENDING",
      label: (
        <Space>
          <HistoryOutlined />
          Đang xử lí
        </Space>
      ),
    },
    {
      key: "SHIPPED",
      label: (
        <Space>
          <ShopOutlined />
          Đang vận chuyển
        </Space>
      ),
    },
    {
      key: "DELIVERED",
      label: (
        <Space>
          <FileDoneOutlined />
          Đã giao
        </Space>
      ),
    },
    {
      key: "CANCELLED",
      label: (
        <Space>
          <CloseCircleOutlined />
          Đã hủy
        </Space>
      ),
    },
  ];

  const OrderItemSkeleton = () => (
    <Card className="mb-4">
      <Skeleton.Input active size="small" style={{ width: 200, marginBottom: 16 }} />
      <div className="flex justify-between mb-4">
        <div className="flex gap-4">
          <Skeleton.Image active style={{ width: 96, height: 96 }} />
          <div className="flex flex-col gap-3">
            <Skeleton.Input active size="small" style={{ width: 200 }} />
            <Skeleton.Input active size="small" style={{ width: 120 }} />
          </div>
        </div>
        <div>
          <Skeleton.Input active size="small" style={{ width: 100 }} />
        </div>
      </div>
      <div className="flex justify-end">
        <div className="flex flex-col items-end gap-2">
          <Skeleton.Input active size="small" style={{ width: 150 }} />
          <div className="flex gap-2">
            <Skeleton.Button active size="small" style={{ width: 90 }} />
            <Skeleton.Button active size="small" style={{ width: 90 }} />
          </div>
        </div>
      </div>
    </Card>
  );

  const handleCancelOrder = (id) => {
    confirm({
      title: "Xác nhận hủy đơn",
      content: "Bạn có chắc chắn muốn hủy đơn hàng này không?",
      okText: "Đồng ý",
      okButtonProps: { danger: true },
      cancelText: "Không hủy",
      async onOk() {
        try {
          await changeOrderStatus(id, "CANCELLED");
          notification.success({
            message: "Hủy đơn hàng thành công",
            duration: 2,
            placement: "top",
          });
          fetchOrders();
        } catch (error) {
          notification.error({
            message: "Lỗi khi hủy đơn hàng",
            description: error.message,
            duration: 3,
            placement: "top",
          });
        }
      },
    });
  };

  const handlePayment = (data) => {
    dispatch(setSelectedCart(data));
    navigate(paths.CHECKOUT.PAYMENT);
  };

  const handleRangePickerChange = (dates) => {
    if (dates) {
      setStartDate(dates[0]);
      setEndDate(dates[1]);
    } else {
      setStartDate(null);
      setEndDate(null);
    }
  };

  return (
    <div className="order-history-container">
      <Modal
        title={<Title level={4}>Đánh giá sản phẩm</Title>}
        width={1000}
        open={reviewFormModalData}
        onCancel={() => setReviewFormModalData(null)}
        destroyOnClose
        footer={false}
        centered
      >
        <OrderReviewForm
          data={reviewFormModalData}
          closeModal={() => setReviewFormModalData(null)}
          fetchData={() => fetchOrders()}
        />
      </Modal>

      <div className="mb-6">
        <Title level={2} className="mb-1">Đơn Hàng Của Bạn</Title>
        <Text type="secondary">Quản lý và theo dõi tất cả đơn hàng của bạn</Text>
      </div>

      <Card 
        className="mb-4 shadow-sm"
        tabList={tabItems}
        activeTabKey={selectedStatus || "All"}
        onTabChange={(key) => {
          if (key === "All") setSelectedStatus(null);
          else setSelectedStatus(key);
        }}
      >
        <div className="flex flex-col md:flex-row gap-4">
          <Input.Search
            placeholder="Tìm kiếm đơn hàng theo mã đơn hoặc tên sản phẩm..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onSearch={(value) => setSearchKeyword(value)}
            enterButton={<SearchOutlined />}
            allowClear
            className="flex-grow"
          />
          
          <RangePicker
            placeholder={['Từ ngày', 'Đến ngày']}
            value={startDate && endDate ? [startDate, endDate] : null}
            onChange={handleRangePickerChange}
            className="w-full md:w-auto"
          />
        </div>
      </Card>

      <div className="orders-list">
        {orderData.isLoading ? (
          <>
            <OrderItemSkeleton />
            <OrderItemSkeleton />
            <OrderItemSkeleton />
          </>
        ) : orderData.data?.content?.length === 0 ? (
          <Card className="text-center py-8">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Không tìm thấy đơn hàng nào"
            />
          </Card>
        ) : (
          orderData.data?.content?.map((el) => {
            const status = convertStatusOrder(el.status);
            
            return (
              <Card 
                key={el.id} 
                className="mb-4 hover:shadow-md transition-all duration-300"
                title={
                  <div className="flex justify-between items-center">
                    <Badge status={status?.badgeStatus || "default"} text={status?.text} />
                    <Text type="secondary">
                      <CalendarOutlined className="mr-2" />
                      Đặt lúc: {moment(new Date(el?.createdAt)).format("HH:mm:ss DD/MM/YYYY")}
                    </Text>
                  </div>
                }
              >
                {el.orderDetails?.map((orderDetail) => (
                  <div 
                    key={orderDetail.id}
                    className="border-b py-4 flex flex-col md:flex-row justify-between"
                  >
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 overflow-hidden rounded">
                        <Image
                          src={orderDetail.sku.images.split(",")[0]}
                          alt={orderDetail.productName}
                          width={96}
                          height={96}
                          className="object-cover rounded"
                          preview={false}
                        />
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <Text strong className="text-blue-600 hover:text-blue-800">
                          {trunCateText(orderDetail.productName, 44)}
                        </Text>
                        
                        <Space>
                          <Text type="secondary">Số lượng:</Text>
                          <Tag color="blue">{orderDetail.quantity}</Tag>
                        </Space>
                        
                        <img
                          src="https://salt.tikicdn.com/ts/ta/b1/3f/4e/cc3d0a2dd751a7b06dd97d868d6afa56.png"
                          className="w-40 h-6 object-cover"
                          alt="Đảm bảo hoàn tiền"
                        />
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end mt-4 md:mt-0">
                      <Text strong className="text-red-500 text-lg">
                        {formatMoney(orderDetail.quantity * orderDetail.price)} đ
                      </Text>
                      
                      {!orderDetail.isReview && el.status === "DELIVERED" && (
                        <Button
                          type="primary"
                          icon={<FileTextOutlined />}
                          onClick={() => setReviewFormModalData(orderDetail)}
                          className="mt-2"
                        >
                          Đánh giá
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                
                <div className="flex flex-col md:flex-row justify-between mt-4 pt-2">
                  <div></div>
                  <div className="flex flex-col items-end gap-2">
                    {el?.discountValue > 0 && (
                      <div>
                        <Text type="secondary">Giảm từ voucher: </Text>
                        <Text className="text-green-600 font-medium">
                          -{formatMoney(el.discountValue)} đ
                        </Text>
                      </div>
                    )}
                    
                    <div>
                      <Text type="secondary">Tổng tiền: </Text>
                      <Text strong className="text-xl text-red-600">
                        {formatMoney(el.total_amount)} đ
                      </Text>
                    </div>
                    
                    <Space className="mt-2">
                      {(el.status === "CANCELLED" ||
                        el.status === "DELIVERED" ||
                        el.status === "UNPAID") && (
                        <Button
                          type="default"
                          icon={<RedoOutlined />}
                          onClick={() => handlePayment(el?.orderDetails)}
                        >
                          Mua lại
                        </Button>
                      )}

                      {el.status === "PENDING" &&
                        el?.payment?.method === "COD" && (
                          <Button
                            danger
                            icon={<CloseCircleOutlined />}
                            onClick={() => handleCancelOrder(el.id)}
                          >
                            Hủy
                          </Button>
                        )}

                      <Button
                        type="primary"
                        icon={<EyeOutlined />}
                        onClick={() =>
                          navigate(
                            generatePath(paths.MEMBER.DETAIL_ORDER, {
                              id: el.id,
                            }),
                          )
                        }
                      >
                        Chi tiết
                      </Button>
                    </Space>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
      
      {orderData.data?.content && orderData.data.content.length > 0 && (
        <div className="flex justify-end mt-4">
          <Pagination
            listLimit={[10, 25, 40, 100]}
            limitCurrent={limit}
            setLimit={setLimit}
            totalPages={orderData.data.totalPages}
            setPage={setPage}
            pageCurrent={page}
            totalElements={orderData.data.totalElements}
          />
        </div>
      )}

      <style jsx global>{`
        .order-history-container .ant-card {
          border-radius: 8px;
          overflow: hidden;
        }
        
        .order-history-container .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
          font-weight: 600;
        }
        
        @media (max-width: 768px) {
          .orders-list .ant-card-body {
            padding: 16px;
          }
        }
      `}</style>
    </div>
  );
}

export default OrderHistory;
