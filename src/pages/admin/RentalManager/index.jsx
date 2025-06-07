import {
  Button,
  DatePicker,
  Input,
  Modal,
  notification,
  Select,
  Tooltip,
  Card,
  Table,
  Tag,
  Space,
  Typography,
  Avatar,
  Breadcrumb,
  Row,
  Col,
  Divider,
} from "antd";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeLoading } from "store/slicers/common.slicer";
import Icons from "utils/icons";
import moment from "moment";
import Pagination from "pages/admin/components/Pagination";
import logo from "assets/images/logo.jpg";
import { deleteUsers, getUsers } from "apis/user.api";
import { faker } from "@faker-js/faker";
import useDebounce from "hooks/useDebounce";
import {
  changeRentalRentedStatus,
  changeRentalStatus,
  getRentals,
} from "apis/rental.api";
import { formatMoney } from "utils/helper";
import { convertVI } from "utils/covertDataUI";
import { generatePath, useNavigate } from "react-router-dom";
import paths from "constant/paths";
import { HashLoader } from "react-spinners";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

function RentalManager() {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [rentals, setRentals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [keyword, setKeyword] = useState("");
  const searchDebounce = useDebounce(keyword, 600);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const fetchRentals = async () => {
    setIsLoading(true);
    try {
      const params = {
        limit,
        page,
      };
      if (searchDebounce) {
        params.keyword = searchDebounce;
      }
      if (statusFilter) {
        params.status = statusFilter;
      }

      if (startDate)
        params.startDate = moment(new Date(startDate)).format("YYYY-MM-DD");

      if (endDate)
        params.endDate = moment(new Date(endDate)).format("YYYY-MM-DD");

      const res = await getRentals(params);
      setRentals(res?.result?.content);
      setTotalPages(res?.result?.totalPages);
      setTotalElements(res?.result?.totalElements);
    } catch (error) {
      notification.error({
        message: error?.message || "Something's went wrong...",
        duration: 2,
      });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchRentals();
  }, [page, limit]);

  const handleDelete = async (id) => {
    dispatch(changeLoading());
    try {
      await deleteUsers(id);
      notification.success({
        message: "Delete Successfully",
        duration: 1,
      });
      fetchRentals();
    } catch (error) {
      notification.error({
        message: error?.message,
        duration: 2,
      });
    }
    dispatch(changeLoading());
  };

  useEffect(() => {
    setPage(1);
    fetchRentals();
  }, [searchDebounce, statusFilter, startDate, endDate]);

  const handleConfirmOrder = async (id) => {
    try {
      await changeRentalStatus(id, "SHIPPED");
      fetchRentals();
      notification.success({
        message: "Đã xác nhận đơn hàng",
        duration: 1,
        placement: "top",
      });
    } catch (error) {
      notification.error({
        message: error?.message,
        duration: 2,
        placement: "top",
      });
    }
  };

  const handleConfirmRented = async (id) => {
    setIsLoading(true);
    try {
      await changeRentalRentedStatus(id);
      fetchRentals();
      notification.success({
        message: "Đã xác nhận giao",
        duration: 1,
        placement: "top",
      });
    } catch (error) {
      notification.error({
        message: error?.message,
        duration: 2,
        placement: "top",
      });
    }
    setIsLoading(false);
  };

  const renderStatus = (status, id) => {
    const convertedStatus = convertVI(status, id);

    if (convertedStatus === "Đang xử lí") {
      return (
        <Tooltip title="Xác nhận ngay">
          <Button
            type="primary"
            className="bg-orange-500 hover:bg-orange-600"
            onClick={() => handleConfirmOrder(id)}
            size="middle"
          >
            Đang chờ xác nhận
          </Button>
        </Tooltip>
      );
    }

    if (convertedStatus === "Đang giao") {
      return (
        <Tooltip title="Xác nhận đã giao">
          <Button
            type="primary"
            className="bg-green-600 hover:bg-green-700"
            onClick={() => handleConfirmRented(id)}
            size="middle"
          >
            Xác nhận đã giao
          </Button>
        </Tooltip>
      );
    }
    if (convertedStatus === "Chưa thanh toán")
      return <Tag color="orange">{convertedStatus}</Tag>;

    if (convertedStatus === "Đã hủy")
      return <Tag color="red">{convertedStatus}</Tag>;

    if (convertedStatus === "Hết hạn")
      return <Tag color="default">{convertedStatus}</Tag>;

    return <Tag color="blue">{convertedStatus}</Tag>;
  };

  const columns = [
    {
      title: 'STT',
      key: 'index',
      width: 60,
      render: (_, __, index) => index + 1,
      align: 'center',
    },
    {
      title: 'Mã đơn',
      dataIndex: 'rentalCode',
      key: 'rentalCode',
      render: (text) => <span className="font-medium">#{text}</span>,
    },
    {
      title: 'Người dùng',
      dataIndex: 'user',
      key: 'user',
      render: (user) => (
        <Space>
          <Avatar src={user?.avatar || faker.image.avatar()} />
          <div className="flex flex-col">
            <Text strong>{user?.username || user?.email?.split("@")[0]}</Text>
            <Text type="secondary" className="text-xs">{user?.email}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount) => <Text strong>{formatMoney(amount)}đ</Text>,
    },
    {
      title: 'Phương thức thanh toán',
      dataIndex: 'payment',
      key: 'payment',
      render: (payment) => <span>{payment?.method}</span>,
    },
    {
      title: 'Số lượng SP',
      dataIndex: 'rentalDetails',
      key: 'rentalDetails',
      render: (details) => <span>Thuê {details.length} sản phẩm</span>,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'startAt',
      key: 'startAt',
      render: (date) => <span>{moment(date).format("DD/MM/YYYY HH:mm:ss")}</span>,
    },
    {
      title: 'Trạng thái',
      key: 'status',
      dataIndex: 'status',
      render: (status, record) => renderStatus(status, record.id),
      align: 'center',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<Icons.FaEdit />}
            className="bg-blue-500 hover:bg-blue-600"
            size="middle"
            onClick={() => navigate(generatePath(paths.ADMIN.EDIT_RENTAL_MANAGEMENT, { id: record.id }))}
            title="Chỉnh sửa"
          />
          <Button
            type="primary"
            icon={<Icons.FaEye />}
            className="bg-cyan-500 hover:bg-cyan-600"
            size="middle"
            onClick={() => navigate(generatePath(paths.ADMIN.RENTAL_DETAIL_MANAGEMENT, { rentalId: record.id }))}
            title="Xem chi tiết"
          />
          <Button
            type="primary"
            danger
            icon={<Icons.MdDeleteForever />}
            size="middle"
            onClick={() => handleDelete(record.id)}
            title="Xóa"
          />
        </Space>
      ),
      align: 'center',
      width: 180,
    },
  ];

  const statusOptions = [
    { value: "PENDING", label: "Đang xử lí" },
    { value: "RENTED", label: "Đang thuê" },
    { value: "SHIPPED", label: "Đang ship" },
    { value: "RETURNED", label: "Đang trả" },
    { value: "CANCELLED", label: "Đã hủy" },
    { value: "UNPAID", label: "Chưa thanh toán" },
  ];

  const handleDateChange = (dates) => {
    if (dates) {
      setStartDate(dates[0]);
      setEndDate(dates[1]);
    } else {
      setStartDate(null);
      setEndDate(null);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Card className="shadow-sm mb-6 overflow-hidden">
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <img
                src={logo}
                alt="logo"
                className="w-12 h-12 object-contain rounded-md"
              />
              <div>
                <Breadcrumb
                  items={[
                    { title: 'Admin' },
                    { title: 'Quản lí đơn thuê' }
                  ]}
                  className="mb-1"
                />
                <Title level={3} className="m-0">Quản lí đơn thuê</Title>
              </div>
            </div>
          </div>
          <Button
            type="primary"
            icon={<Icons.FaPlus />}
            size="large"
            className="bg-green-500 hover:bg-green-600"
            onClick={() => navigate(paths.ADMIN.UPDATE_RENTAL_MANAGEMENT)}
          >
            Tạo đơn thuê
          </Button>
        </div>
      </Card>

      <Card className="shadow-sm mb-6" title="Bộ lọc">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <Space wrap className="w-full">
            <div className="flex items-center gap-2">
              <Text strong>Trạng thái:</Text>
              <Select
                placeholder="Lọc trạng thái"
                value={statusFilter}
                onChange={(value) => setStatusFilter(value)}
                style={{ width: "180px" }}
                allowClear
                options={statusOptions}
                className="min-w-[180px]"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Text strong>Thời gian:</Text>
              <RangePicker
                value={startDate && endDate ? [startDate, endDate] : null}
                onChange={handleDateChange}
                format="DD/MM/YYYY"
                placeholder={['Từ ngày', 'Đến ngày']}
              />
            </div>
          </Space>
          
          <Input.Search
            placeholder="Tìm kiếm (mã đơn, người dùng, sản phẩm)"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            allowClear
            enterButton={<Icons.IoIosSearch />}
            style={{ maxWidth: "350px" }}
            className="w-full md:w-auto"
            size="middle"
          />
        </div>
      </Card>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <HashLoader size={60} color="#00ADB5" />
        </div>
      ) : (
        <Card className="shadow-sm">
          <Table
            dataSource={rentals}
            columns={columns}
            rowKey="id"
            pagination={false}
            className="overflow-x-auto"
            size="middle"
            bordered
            rowClassName="hover:bg-gray-50 transition-colors"
            locale={{
              emptyText: (
                <div className="py-8 text-center">
                  <Icons.FaBoxOpen size={40} className="mx-auto text-gray-300 mb-2" />
                  <Text type="secondary">Không có đơn hàng nào</Text>
                </div>
              )
            }}
          />
          
          {rentals.length > 1 && (
            <div className="flex justify-end mt-4">
              <Pagination
                listLimit={[10, 25, 40, 100]}
                limitCurrent={limit}
                setLimit={setLimit}
                totalPages={totalPages}
                setPage={setPage}
                pageCurrent={page}
                totalElements={totalElements}
              />
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

export default RentalManager;
