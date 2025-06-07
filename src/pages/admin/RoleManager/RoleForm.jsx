import { Checkbox, Input, notification, Form, Button, Typography, Card, Divider, Collapse, Switch, Tooltip, Space } from "antd";
import {
  createRole,
  getModules,
  getPermissions,
  updateRole,
} from "apis/role.api";
import logo from "assets/images/logo.jpg";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { SaveOutlined, InfoCircleOutlined } from '@ant-design/icons';

const CheckboxGroup = Checkbox.Group;
const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

function RoleForm({ closeModal, fetchData, roleCurrent }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm();

  const [modules, setModules] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [checkedList, setCheckedList] = useState({});
  const [indeterminate, setIndeterminate] = useState({});
  const [checkAll, setCheckAll] = useState({});
  const [globalCheckAll, setGlobalCheckAll] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [modulesRes, permissionsRes] = await Promise.all([
          getModules(),
          getPermissions(),
        ]);
        if (modulesRes?.result) setModules(modulesRes.result);
        if (permissionsRes?.result) setPermissions(permissionsRes.result);
      } catch (error) {
        notification.error({ 
          message: "Lỗi khi tải dữ liệu", 
          description: error.message 
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (roleCurrent) {
      if (permissions.length > 0) {
        const initCheckedList = {};
        const initIndeterminate = {};
        const initCheckAll = {};

        roleCurrent.modules.forEach((module) => {
          const selectedPermissions = module.permissions.map((perm) => perm.id);
          initCheckedList[module.id] = selectedPermissions;
          initIndeterminate[module.id] =
            selectedPermissions.length > 0 &&
            selectedPermissions.length < permissions.length;
          initCheckAll[module.id] =
            selectedPermissions.length === permissions.length;
        });
        setCheckedList(initCheckedList);
        setIndeterminate(initIndeterminate);
        setCheckAll(initCheckAll);
      }
      setValue("name", roleCurrent.name);
      setValue("description", roleCurrent.description);
    } else {
      setCheckedList({});
      setIndeterminate({});
      setCheckAll({});
      setValue("name", "");
      setValue("description", "");
    }
  }, [roleCurrent, permissions, setValue]);

  const handlePermissionChange = (moduleId, list) => {
    const allPermissions = permissions.map((perm) => perm.id);
    const isAllSelected = list.length === allPermissions.length;

    setCheckedList((prev) => ({ ...prev, [moduleId]: list }));
    setIndeterminate((prev) => ({
      ...prev,
      [moduleId]: list.length > 0 && !isAllSelected,
    }));
    setCheckAll((prev) => ({ ...prev, [moduleId]: isAllSelected }));
  };

  const handleCheckAllChange = (moduleId, checked) => {
    const allPermissions = permissions.map((perm) => perm.id);

    setCheckedList((prev) => ({
      ...prev,
      [moduleId]: checked ? allPermissions : [],
    }));
    setIndeterminate((prev) => ({ ...prev, [moduleId]: false }));
    setCheckAll((prev) => ({ ...prev, [moduleId]: checked }));
  };

  const handleGlobalCheckBoxChange = () => {
    const allPermissions = permissions.map((perm) => perm.id);
    const newCheckedList = {};
    const newCheckAll = {};
    const newIndeterminate = {};

    modules.forEach((module) => {
      newCheckedList[module.id] = globalCheckAll ? [] : allPermissions;
      newCheckAll[module.id] = !globalCheckAll;
      newIndeterminate[module.id] = false;
    });

    setCheckedList(newCheckedList);
    setCheckAll(newCheckAll);
    setIndeterminate(newIndeterminate);
    setGlobalCheckAll(!globalCheckAll);
  };

  const handleSubmitForm = async (data) => {
    const payload = {
      ...data,
      modules: modules.map((module) => ({
        id: module.id,
        permissions: checkedList[module.id] || [],
      })),
    };

    setIsLoading(true);
    try {
      if (roleCurrent) {
        await updateRole(roleCurrent?.id, payload);
        notification.success({ 
          message: "Cập nhật vai trò thành công",
          placement: "top" 
        });
      } else {
        await createRole(payload);
        notification.success({ 
          message: "Tạo vai trò thành công", 
          placement: "top" 
        });
      }

      closeModal();
      fetchData();
    } catch (error) {
      notification.error({ 
        message: error.message, 
        duration: 2,
        placement: "top" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="role-form">
      <Card className="mb-4">
        <div className="flex items-center gap-4 mb-2">
          <img src={logo} alt="logo" className="w-10 h-10 object-contain" />
          <Title level={4} className="m-0">
            {roleCurrent ? "Chỉnh sửa vai trò" : "Tạo vai trò mới"}
          </Title>
        </div>
        <Divider />

        <Form
          layout="vertical"
          onFinish={handleSubmit(handleSubmitForm)}
          className="mt-4"
        >
          <Form.Item 
            label="Tên vai trò" 
            required 
            validateStatus={errors.name ? "error" : ""}
            help={errors.name?.message}
          >
            <Input
              placeholder="Nhập tên vai trò"
              {...register("name", {
                required: "Vui lòng nhập tên vai trò",
              })}
            />
          </Form.Item>

          <div className="flex justify-between items-center mb-4">
            <Title level={5} className="m-0">Phân quyền module</Title>
            <Tooltip title={globalCheckAll ? "Bỏ chọn tất cả quyền" : "Chọn tất cả quyền"}>
              <Switch
                checkedChildren="Bỏ chọn tất cả"
                unCheckedChildren="Chọn tất cả"
                checked={globalCheckAll}
                onChange={handleGlobalCheckBoxChange}
                className={globalCheckAll ? "bg-red-500" : "bg-green-600"}
              />
            </Tooltip>
          </div>

          <Collapse 
            className="mb-6 permission-collapse" 
            bordered={false}
            defaultActiveKey={modules.map(m => m.id)}
          >
            {modules.map((module) => (
              <Panel
                key={module.id}
                header={
                  <div className="flex justify-between items-center w-full">
                    <Text strong>{module.name}</Text>
                    <Checkbox
                      indeterminate={indeterminate[module.id] || false}
                      checked={checkAll[module.id] || false}
                      onChange={(e) => handleCheckAllChange(module.id, e.target.checked)}
                      onClick={(e) => e.stopPropagation()}
                      className={`module-checkbox ${
                        checkAll[module.id] ? "text-red-500" : "text-green-600"
                      }`}
                    >
                      {checkAll[module.id] ? "Bỏ chọn tất cả" : "Chọn tất cả"}
                    </Checkbox>
                  </div>
                }
              >
                <div className="p-2 bg-gray-50 rounded">
                  <CheckboxGroup
                    options={permissions.map((perm) => ({
                      label: perm.name,
                      value: perm.id,
                    }))}
                    value={checkedList[module.id] || []}
                    onChange={(list) => handlePermissionChange(module.id, list)}
                    className="permission-checkboxes"
                  />
                </div>
              </Panel>
            ))}
          </Collapse>

          <Form.Item label="Mô tả">
            <Input.TextArea
              rows={4}
              placeholder="Nhập mô tả về vai trò này..."
              {...register("description")}
              className="resize-none"
            />
          </Form.Item>

          <Divider />
          
          <div className="flex justify-end gap-3">
            <Button onClick={closeModal}>
              Hủy
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {roleCurrent ? "Cập nhật" : "Tạo mới"}
            </Button>
          </div>
        </Form>
      </Card>

      <style jsx global>{`
        .permission-collapse .ant-collapse-header {
          align-items: center !important;
        }
        
        .module-checkbox {
          margin-right: 8px;
          transition: all 0.3s;
        }
        
        .permission-checkboxes .ant-checkbox-wrapper {
          margin: 6px 8px 6px 0;
          padding: 2px 4px;
          border-radius: 4px;
          transition: all 0.2s;
        }
        
        .permission-checkboxes .ant-checkbox-wrapper:hover {
          background-color: #e6f7ff;
        }
        
        @media (max-width: 768px) {
          .permission-checkboxes {
            display: flex;
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}

export default RoleForm;
