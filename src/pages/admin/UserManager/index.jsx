import React, { useEffect, useState } from "react";
import { 
  Button, 
  Input, 
  Modal, 
  notification, 
  Select, 
  Tooltip, 
  Card, 
  Typography, 
  Table, 
  Space, 
  Avatar, 
  Tag,
  Popconfirm
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { changeLoading } from "store/slicers/common.slicer";
import Icons from "utils/icons";
import logo from "assets/images/logo.jpg";
import { deleteUsers, getUsers } from "apis/user.api";
import { faker } from "@faker-js/faker";
import UserForm from "./UserForm";
import useDebounce from "hooks/useDebounce";
import { getRoles } from "apis/role.api";

const { Title } = Typography;
const { Option } = Select;
const { Search } = Input;

// Mapping trạng thái người dùng sang màu của Tag
const STATUS_COLORS = {
  ACTIVED: "success",
  INACTIVE: "warning",
  BLOCKED: "error"
};

// Mapping tên hiển thị cho trạng thái
const STATUS_LABELS = {
  ACTIVED: "Đã xác thực",
  INACTIVE: "Chưa xác thực",
  BLOCKED: "Đã khóa"
};

function UserManager() {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
    }
  });
  
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [isShowModal, setIsShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState(null);
  const [roleOptions, setRoleOptions] = useState([]);
  const [roleFilter, setRoleFilter] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const searchDebounce = useDebounce(keyword, 600);

  const fetchUsers = async () => {
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
      if (statusFilter) {
        params.status = statusFilter;
      }
      if (roleFilter) {
        params.role = roleFilter;
      }

      const res = await getUsers(params);
      setUsers(res?.result?.content || []);
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          total: res?.result?.totalElements || 0,
        },
      });
    } catch (error) {
      notification.error({
        message: "Lỗi khi tải danh sách người dùng",
        description: error?.message || "Đã xảy ra lỗi, vui lòng thử lại sau",
        duration: 3,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await getRoles({ excludeFields: "users,modules" });
        setRoleOptions(res?.result?.content || []);
      } catch (error) {
        notification.error({
          message: "Lỗi khi tải vai trò",
          description: error?.message || "Đã xảy ra lỗi, vui lòng thử lại sau",
          duration: 3,
        });
      }
    };
    fetchRoles();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [JSON.stringify(tableParams.pagination)]);

  useEffect(() => {
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        current: 1,
      },
    });
    fetchUsers();
  }, [searchDebounce, statusFilter, roleFilter]);

  const handleTableChange = (pagination) => {
    setTableParams({
      ...tableParams,
      pagination,
    });
  };

  const openFormUpdate = (item) => {
    setEditUser(item);
    setIsShowModal(true);
  };

  const handleDelete = async (id) => {
    dispatch(changeLoading());
    try {
      await deleteUsers(id);
      notification.success({
        message: "Xóa người dùng thành công",
        duration: 2,
      });
      fetchUsers();
    } catch (error) {
      notification.error({
        message: "Lỗi khi xóa người dùng",
        description: error?.message || "Đã xảy ra lỗi, vui lòng thử lại sau",
        duration: 3,
      });
    } finally {
      dispatch(changeLoading());
    }
  };

  const columns = [
    {
      title: 'STT',
      key: 'index',
      width: 70,
      render: (text, record, index) => (tableParams.pagination.current - 1) * tableParams.pagination.pageSize + index + 1,
    },
    {
      title: 'Người dùng',
      key: 'user',
      render: (text, record) => (
        <Space>
          <Avatar 
            src={record?.avatar || faker.image.avatar()} 
            size="large"
          />
          <Space direction="vertical" size={0}>
            <span style={{ fontWeight: 'bold' }}>
              {record?.username || record?.email?.split("@")[0]}
            </span>
            <span>{record?.email}</span>
          </Space>
        </Space>
      ),
    },
    {
      title: 'Điểm',
      dataIndex: 'points',
      key: 'points',
      width: 100,
      render: (points) => (
        <Tag color="blue">{points || 0}</Tag>
      ),
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      width: 120,
      render: (role) => (
        <Tag color="purple">{role?.split(" ")?.[0]?.slice(5) || 'N/A'}</Tag>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (status) => (
        <Tag color={STATUS_COLORS[status] || 'default'}>
          {STATUS_LABELS[status] || status}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 150,
      render: (_, record) => (
        record.id !== userInfo.data?.id && (
          <Space>
            <Tooltip title="Chỉnh sửa">
              <Button
                type="primary"
                icon={<Icons.FaEdit />}
                onClick={() => openFormUpdate(record)}
              />
            </Tooltip>
            <Popconfirm
              title="Xóa người dùng"
              description="Bạn có chắc chắn muốn xóa người dùng này?"
              onConfirm={() => handleDelete(record.id)}
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
            >
              <Button
                danger
                type="primary"
                icon={<Icons.MdDeleteForever />}
              />
            </Popconfirm>
          </Space>
        )
      ),
    },
  ];

  return (
    <Card className="user-manager" style={{ margin: '16px' }}>
      <Modal
        title="Thông tin người dùng"
        width={800}
        open={isShowModal}
        onCancel={() => setIsShowModal(false)}
        footer={false}
        destroyOnClose
      >
        <UserForm
          closeModal={() => {
            setIsShowModal(false);
            setEditUser(null);
          }}
          fetchData={() => fetchUsers()}
          userCurrent={editUser}
        />
      </Modal>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <Space size="middle" align="center">
          <img
            src={logo}
            alt="logo"
            style={{ width: '60px', height: 'auto' }}
          />
          <Title level={3} style={{ margin: 0 }}>Quản lý người dùng</Title>
        </Space>
        
        <Button
          type="primary"
          icon={<Icons.FaPlus />}
          onClick={() => openFormUpdate()}
        >
          Tạo người dùng
        </Button>
      </div>

      <Card>
        <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: '16px' }}>
          <Space size="middle">
            <Select
              placeholder="Lọc theo vai trò"
              value={roleFilter}
              onChange={(value) => setRoleFilter(value)}
              style={{ width: "200px" }}
              allowClear
            >
              {roleOptions.map((role) => (
                <Option key={role.id} value={role.id}>
                  {role.name}
                </Option>
              ))}
            </Select>
            
            <Select
              placeholder="Lọc theo trạng thái"
              value={statusFilter}
              onChange={(value) => setStatusFilter(value)}
              style={{ width: "200px" }}
              allowClear
            >
              <Option value="ACTIVED">Đã xác thực</Option>
              <Option value="INACTIVE">Chưa xác thực</Option>
              <Option value="BLOCKED">Đã khóa</Option>
            </Select>
          </Space>
          
          <Search
            placeholder="Tìm kiếm người dùng"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            style={{ width: 300 }}
            allowClear
          />
        </Space>

        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          pagination={tableParams.pagination}
          loading={loading}
          onChange={handleTableChange}
          scroll={{ x: 800 }}
        />
      </Card>
    </Card>
  );
}

export default UserManager;
