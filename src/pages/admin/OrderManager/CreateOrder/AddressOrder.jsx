import React, { useEffect, useState } from "react";
import { 
  Button, 
  Checkbox, 
  Input, 
  notification, 
  Select, 
  Form, 
  Space, 
  Typography, 
  Radio, 
  Row, 
  Col, 
  Card
} from "antd";
import { 
  HomeOutlined, 
  BankOutlined, 
  UserOutlined, 
  PhoneOutlined, 
  EnvironmentOutlined 
} from "@ant-design/icons";
import { getDistricts, getProvinces, getWards } from "apis/address.api";
import { createDelivery } from "apis/delivery.api";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const AddressOrder = ({ setDeliveryId, closeModal }) => {
  const [form] = Form.useForm();
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);
  const [isDefault, setIsDefault] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchProvinces = async () => {
    try {
      const res = await getProvinces();
      setProvinces(res.data.data.data);
    } catch (error) {
      notification.error({
        message: "Lỗi khi tải danh sách tỉnh/thành phố",
        description: error.message || "Đã xảy ra lỗi, vui lòng thử lại sau",
        duration: 3
      });
    }
  };

  const fetchDistricts = async () => {
    if (!selectedProvince) return;
    
    setSelectedDistrict(null);
    setSelectedWard(null);
    form.setFieldsValue({ district: undefined, ward: undefined });
    
    try {
      const res = await getDistricts(selectedProvince?.data?.code);
      setDistricts(res.data.data.data);
    } catch (error) {
      notification.warning({
        message: "Lỗi khi tải danh sách quận/huyện",
        description: "API giới hạn lượt gọi. Vui lòng thử lại sau 20 giây",
        duration: 3
      });
    }
  };

  const fetchWards = async () => {
    if (!selectedDistrict) return;
    
    setSelectedWard(null);
    form.setFieldsValue({ ward: undefined });
    
    try {
      const res = await getWards(selectedDistrict?.data?.code);
      setWards(res.data.data.data);
    } catch (error) {
      notification.warning({
        message: "Lỗi khi tải danh sách phường/xã",
        description: "API giới hạn lượt gọi. Vui lòng thử lại sau 20 giây",
        duration: 3
      });
    }
  };

  useEffect(() => {
    fetchProvinces();
  }, []);

  useEffect(() => {
    fetchDistricts();
  }, [selectedProvince]);

  useEffect(() => {
    fetchWards();
  }, [selectedDistrict]);

  const handleCreateDelivery = async (values) => {
    if (!selectedProvince || !selectedDistrict || !selectedWard) {
      notification.error({
        message: "Thông tin thiếu",
        description: "Vui lòng chọn đầy đủ thông tin địa chỉ",
        duration: 3
      });
      return;
    }

    setLoading(true);
    
    const payload = { 
      ...values, 
      isDefault,
      city_id: selectedProvince?.data?.code,
      city: selectedProvince?.data?.name,
      district_id: selectedDistrict?.data?.code,
      district: selectedDistrict?.data?.name,
      ward_id: selectedWard?.data?.code,
      ward: selectedWard?.data?.name
    };

    try {
      const response = await createDelivery(payload);
      setDeliveryId(response?.result?.id);
      closeModal();

      notification.success({
        message: "Thành công",
        description: "Đã thêm địa chỉ giao hàng mới",
        duration: 3
      });
    } catch (error) {
      notification.error({
        message: "Lỗi khi tạo địa chỉ",
        description: error?.message || "Đã xảy ra lỗi, vui lòng thử lại",
        duration: 3
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="address-order">
      <Title level={4}>Thêm địa chỉ giao hàng</Title>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={handleCreateDelivery}
        initialValues={{ typeAddress: "HOME" }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="username"
              label="Họ và tên"
              rules={[{ required: true, message: "Vui lòng nhập họ tên người nhận" }]}
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="Nhập họ tên người nhận" 
              />
            </Form.Item>
          </Col>
          
          <Col span={12}>
            <Form.Item
              name="company_name"
              label="Công ty"
            >
              <Input 
                prefix={<BankOutlined />}
                placeholder="Nhập tên công ty (nếu có)" 
              />
            </Form.Item>
          </Col>
        </Row>
        
        <Form.Item
          name="numberPhone"
          label="Số điện thoại"
          rules={[
            { required: true, message: "Vui lòng nhập số điện thoại" },
            { pattern: /^[0-9]{10,11}$/, message: "Số điện thoại không hợp lệ" }
          ]}
        >
          <Input 
            prefix={<PhoneOutlined />}
            placeholder="Nhập số điện thoại liên hệ" 
          />
        </Form.Item>
        
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="city"
              label="Tỉnh/Thành phố"
              rules={[{ required: true, message: "Vui lòng chọn tỉnh/thành phố" }]}
            >
              <Select
                showSearch
                placeholder="Chọn tỉnh/thành phố"
                optionFilterProp="children"
                value={selectedProvince?.index}
                onChange={(index) => {
                  setSelectedProvince({
                    index,
                    data: provinces[index]
                  });
                  form.setFieldsValue({ city: index });
                }}
              >
                {provinces?.map((province, index) => (
                  <Option key={province.code} value={index}>
                    {province.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          
          <Col span={8}>
            <Form.Item
              name="district"
              label="Quận/Huyện"
              rules={[{ required: true, message: "Vui lòng chọn quận/huyện" }]}
            >
              <Select
                showSearch
                placeholder="Chọn quận/huyện"
                optionFilterProp="children"
                value={selectedDistrict?.index}
                disabled={!selectedProvince}
                onChange={(index) => {
                  setSelectedDistrict({
                    index,
                    data: districts[index]
                  });
                  form.setFieldsValue({ district: index });
                }}
              >
                {districts?.map((district, index) => (
                  <Option key={district.code} value={index}>
                    {district.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          
          <Col span={8}>
            <Form.Item
              name="ward"
              label="Phường/Xã"
              rules={[{ required: true, message: "Vui lòng chọn phường/xã" }]}
            >
              <Select
                showSearch
                placeholder="Chọn phường/xã"
                optionFilterProp="children"
                value={selectedWard?.index}
                disabled={!selectedDistrict}
                onChange={(index) => {
                  setSelectedWard({
                    index,
                    data: wards[index]
                  });
                  form.setFieldsValue({ ward: index });
                }}
              >
                {wards?.map((ward, index) => (
                  <Option key={ward.code} value={index}>
                    {ward.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        
        <Form.Item
          name="street"
          label="Địa chỉ cụ thể"
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ cụ thể" }]}
        >
          <TextArea 
            prefix={<EnvironmentOutlined />}
            placeholder="Nhập số nhà, tên đường..." 
            rows={3}
          />
        </Form.Item>
        
        <Form.Item
          name="typeAddress"
          label="Loại địa chỉ"
          rules={[{ required: true, message: "Vui lòng chọn loại địa chỉ" }]}
        >
          <Radio.Group>
            <Space direction="horizontal" size="large">
              <Radio value="HOME">
                <Space>
                  <HomeOutlined />
                  <span>Nhà riêng / Chung cư</span>
                </Space>
              </Radio>
              <Radio value="COMPANY">
                <Space>
                  <BankOutlined />
                  <span>Cơ quan / Công ty</span>
                </Space>
              </Radio>
            </Space>
          </Radio.Group>
        </Form.Item>
        
        <Form.Item>
          <Checkbox 
            checked={isDefault}
            onChange={(e) => setIsDefault(e.target.checked)}
          >
            Đặt làm địa chỉ mặc định
          </Checkbox>
        </Form.Item>
        
        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            size="large"
            loading={loading}
            block
          >
            Thêm địa chỉ giao hàng
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default AddressOrder;
