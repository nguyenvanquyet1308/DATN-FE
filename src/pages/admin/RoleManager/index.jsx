import { faker } from "@faker-js/faker";
import { Avatar, Modal, notification, Tooltip, Card, Typography, Row, Col, Button as AntButton, Popconfirm, Empty, Badge, Tag } from "antd";
import { deleteRole, getRoles } from "apis/role.api";
import logo from "assets/images/logo.jpg";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeLoading } from "store/slicers/common.slicer";
import { PlusOutlined, EditOutlined, DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons';
import RoleForm from "./RoleForm";

const { Title, Text, Paragraph } = Typography;

function RoleManager() {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [roles, setRoles] = useState([]);
  const [roleEdit, setRoleEdit] = useState(null);
  const [isShowModal, setIsShowModal] = useState(false);

  const fetchRoles = async () => {
    dispatch(changeLoading());
    try {
      const params = {
        limit,
        page,
      };
      const res = await getRoles(params);
      setRoles(res?.result?.content);
      setTotalPages(res?.result?.totalPages);
      setTotalElements(res?.result?.totalElements);
    } catch (error) {
      notification.error({
        message: error?.message || "Something's went wrong...",
        duration: 2,
      });
    }
    dispatch(changeLoading());
  };

  useEffect(() => {
    fetchRoles();
  }, [page, limit]);

  const openFormUpdate = (item) => {
    setRoleEdit(item);
    setIsShowModal(true);
  };

  const handleDelete = async (id) => {
    dispatch(changeLoading());
    try {
      await deleteRole(id);
      notification.success({
        message: "Xóa thành công",
        duration: 1,
      });
      fetchRoles();
    } catch (error) {
      notification.error({
        message: error,
        duration: 2,
      });
    }
    dispatch(changeLoading());
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <Modal
        title={roleEdit ? "Chỉnh sửa vai trò" : "Tạo vai trò mới"}
        width={800}
        open={isShowModal}
        onCancel={() => {
          setIsShowModal(false);
          setRoleEdit(null);
        }}
        footer={null}
        destroyOnClose
      >
        <RoleForm
          closeModal={() => {
            setIsShowModal(false);
            setRoleEdit(null);
          }}
          fetchData={() => fetchRoles()}
          roleCurrent={roleEdit}
        />
      </Modal>

      <Card className="shadow-sm mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <img
              src={logo}
              alt="logo"
              className="w-12 h-12 object-contain"
            />
            <Title level={3} className="m-0">Quản lý vai trò</Title>
          </div>
          
          <AntButton
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => openFormUpdate()}
            className="bg-green-600 hover:bg-green-700"
          >
            Thêm mới
          </AntButton>
        </div>
      </Card>

      {roles?.length === 0 ? (
        <Empty description="Chưa có vai trò nào" className="my-8" />
      ) : (
        <Row gutter={[16, 16]} className="mt-4">
          {roles?.map((role) => (
            <Col xs={24} sm={12} lg={8} key={role.id}>
              <Card 
                hoverable 
                className="h-full transition-shadow duration-300 role-card" 
                title={
                  <div className="flex justify-between items-center">
                    <Text strong className="text-primary">{role.name}</Text>
                    <div className="flex gap-2">
                      <Tooltip title="Chỉnh sửa">
                        <EditOutlined 
                          className="text-blue-500 cursor-pointer hover:text-blue-700 transition-colors text-lg"
                          onClick={() => openFormUpdate(role)}
                        />
                      </Tooltip>
                      <Popconfirm
                        title="Bạn có chắc chắn muốn xóa vai trò này?"
                        onConfirm={() => handleDelete(role?.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                        placement="left"
                      >
                        <DeleteOutlined className="text-red-500 cursor-pointer hover:text-red-700 transition-colors text-lg" />
                      </Popconfirm>
                    </div>
                  </div>
                }
              >
                <div className="mb-4">
                  {role.modules.length > 0 ? (
                    <div className="mb-4">
                      <Text strong className="text-gray-700 mb-2 block">
                        Phân quyền:
                      </Text>
                      <div className="flex flex-col gap-2">
                        {role.modules.map((module) => (
                          <Card 
                            key={module.id} 
                            size="small" 
                            className="border border-gray-200 hover:border-blue-300 transition-colors"
                          >
                            <Tooltip
                              placement="topLeft"
                              title={
                                <div className="flex flex-wrap gap-1">
                                  {module.permissions.map((permission) => (
                                    <Tag key={permission.id} color="blue">
                                      {permission.name}
                                    </Tag>
                                  ))}
                                </div>
                              }
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <InfoCircleOutlined className="mr-2 text-gray-500" />
                                  <Text>{module.name}</Text>
                                </div>
                                <Badge 
                                  count={module.permissions.length} 
                                  className="ml-2"
                                  style={{backgroundColor: '#108ee9'}}
                                />
                              </div>
                            </Tooltip>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Text type="secondary" italic>Chưa có phân quyền</Text>
                  )}
                </div>

                <div className="mb-4">
                  <Text strong className="text-gray-700 block mb-1">Mô tả:</Text>
                  <Paragraph className="bg-gray-50 p-2 rounded border border-gray-200" ellipsis={{ rows: 2, expandable: true }}>
                    {role.description || "Không có mô tả"}
                  </Paragraph>
                </div>

                <div className="flex justify-end">
                  <Tooltip title="Người dùng có vai trò này">
                    <Avatar.Group
                      size="large"
                      maxCount={3}
                      maxStyle={{
                        color: "#f56a00",
                        backgroundColor: "#fde3cf",
                        cursor: "pointer",
                      }}
                    >
                      {role?.users?.map((user) => (
                        <Tooltip
                          key={user?.id}
                          title={
                            <div className="flex flex-col gap-2 items-center">
                              <Text className="text-blue-500 font-bold">
                                {user?.username || user?.email?.split("@")[0]}
                              </Text>
                              <Text className="text-blue-500">
                                {user?.email}
                              </Text>
                            </div>
                          }
                        >
                          <Avatar src={user?.avatar || faker.image.avatar()} />
                        </Tooltip>
                      ))}
                    </Avatar.Group>
                  </Tooltip>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <style jsx global>{`
        .role-card {
          transition: all 0.3s ease;
        }
        
        .role-card:hover {
          box-shadow: 0 8px 16px rgba(0,0,0,0.1);
        }
        
        .ant-card-head {
          border-bottom: 2px solid #f0f0f0;
        }
      `}</style>
    </div>
  );
}

export default RoleManager;
