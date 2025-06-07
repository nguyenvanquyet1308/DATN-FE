import React, { useEffect, useState } from "react";
import { 
  Button, 
  notification, 
  Tooltip, 
  Card, 
  Typography, 
  Table, 
  Space, 
  Input, 
  Tag, 
  Popconfirm,
  Row,
  Col
} from "antd";
import { deleteVoucher, getVouchers } from "apis/voucher.api";
import useDebounce from "hooks/useDebounce";
import { useSelector } from "react-redux";
import { changeLoading } from "store/slicers/common.slicer";
import Icons from "utils/icons";
import moment from "moment";
import { formatMoney } from "utils/helper";
import withBaseComponent from "hocs";
import paths from "constant/paths";
import { generatePath } from "react-router-dom";
import logo from "assets/images/logo.jpg";

const { Title, Text } = Typography;
const { Search } = Input;

function VoucherManager({ dispatch, navigate }) {
  const { userInfo } = useSelector((state) => state.auth);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
    }
  });
  const [vouchers, setVouchers] = useState([]);
  const [keyword, setKeyword] = useState("");
  const searchDebounce = useDebounce(keyword, 600);
  const [loading, setLoading] = useState(false);

  const fetchVouchers = async () => {
    setLoading(true);
    try {
      const { current, pageSize } = tableParams.pagination;
      const params = {
        limit: pageSize,
        page: current,
      };
      if (searchDebounce) {
        params.keyword = searchDebounce;
      }

      const res = await getVouchers(params);
      setVouchers(res?.result?.content || []);
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          total: res?.result?.totalElements || 0,
        },
      });
    } catch (error) {
      notification.error({
        message: error?.message || "Đã xảy ra lỗi khi tải danh sách khuyến mãi",
        duration: 2,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, [JSON.stringify(tableParams.pagination)]);

  useEffect(() => {
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        current: 1,
      },
    });
    fetchVouchers();
  }, [searchDebounce]);

  const handleTableChange = (pagination) => {
    setTableParams({
      ...tableParams,
      pagination,
    });
  };

  const handleDelete = async (id) => {
    dispatch(changeLoading());
    try {
      await deleteVoucher(id);
      notification.success({
        message: "Xóa khuyến mãi thành công",
        duration: 1,
      });
      fetchVouchers();
    } catch (error) {
      notification.error({
        message: error?.message || "Lỗi khi xóa khuyến mãi",
        duration: 2,
      });
    }
    dispatch(changeLoading());
  };

  const columns = [
    {
      title: 'STT',
      key: 'index',
      width: 70,
      render: (text, record, index) => (tableParams.pagination.current - 1) * tableParams.pagination.pageSize + index + 1,
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <Text strong>{text}</Text>
    },
    {
      title: 'Loại',
      dataIndex: 'voucher_category',
      key: 'voucher_category',
      render: (category) => {
        let color = 'blue';
        let text = category;
        
        if (category === 'PRODUCT') {
          color = 'green';
          text = 'Sản phẩm';
        } else if (category === 'SHIPPING') {
          color = 'orange';
          text = 'Phí ship';
        } else if (category === 'RENTAL') {
          color = 'purple';
          text = 'Thuê';
        }
        
        return <Tag color={color}>{text}</Tag>
      }
    },
    {
      title: 'Mã',
      dataIndex: 'code',
      key: 'code',
      render: (code) => <Tag color="blue">{code}</Tag>
    },
    {
      title: 'Kiểu giảm',
      dataIndex: 'discount_type',
      key: 'discount_type',
      render: (type) => <Tag color={type === 'FIXED' ? 'volcano' : 'geekblue'}>{type === 'FIXED' ? 'Cố định' : 'Phần trăm'}</Tag>
    },
    {
      title: 'Giá trị giảm',
      key: 'value',
      render: (_, record) => (
        <Text strong>
          {record.discount_type === "FIXED"
            ? formatMoney(record.value) + "đ"
            : record.value + "%"}
        </Text>
      )
    },
    {
      title: 'Giảm tối đa',
      dataIndex: 'max_discount',
      key: 'max_discount',
      render: (value) => value ? formatMoney(value) + 'đ' : '-'
    },
    {
      title: 'Đơn tối thiểu',
      dataIndex: 'min_order',
      key: 'min_order',
      render: (value) => value ? formatMoney(value) + 'đ' : '-'
    },
    {
      title: 'Ngày hết hạn',
      dataIndex: 'expiry_date',
      key: 'expiry_date',
      render: (date) => moment(date).format("DD-MM-YYYY")
    },
    {
      title: 'Giới hạn dùng',
      dataIndex: 'usage_limit',
      key: 'usage_limit',
    },
    {
      title: 'Đã dùng',
      dataIndex: 'usageCount',
      key: 'usageCount',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isPublic',
      key: 'isPublic',
      render: (isPublic) => (
        <Tag color={isPublic ? 'success' : 'default'}>
          {isPublic ? 'Bật' : 'Tắt'}
        </Tag>
      )
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="primary"
              icon={<Icons.FaEdit />}
              onClick={() => navigate(generatePath(paths.ADMIN.UPDATE_VOUCHER, { id: record.id }))}
            />
          </Tooltip>
          <Popconfirm
            title="Xóa khuyến mãi"
            description="Bạn có chắc chắn muốn xóa khuyến mãi này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button danger type="primary" icon={<Icons.MdDeleteForever />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card className="voucher-manager" style={{ margin: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <Space size="middle" align="center">
          <img
            src={logo}
            alt="logo"
            style={{ width: '60px', height: 'auto' }}
          />
          <Title level={3} style={{ margin: 0 }}>Quản lý khuyến mãi</Title>
        </Space>
        
        <Button
          type="primary"
          icon={<Icons.FaPlus />}
          onClick={() => navigate(paths.ADMIN.CREATE_VOUCHER)}
        >
          Tạo khuyến mãi
        </Button>
      </div>

      <Card>
        <Row justify="end" style={{ marginBottom: '16px' }}>
          <Col>
            <Search
              placeholder="Tìm kiếm khuyến mãi"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              style={{ width: 300 }}
              allowClear
            />
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={vouchers}
          rowKey="id"
          pagination={tableParams.pagination}
          loading={loading}
          onChange={handleTableChange}
          scroll={{ x: 1000 }}
          size="middle"
        />
      </Card>
    </Card>
  );
}

export default withBaseComponent(VoucherManager);
