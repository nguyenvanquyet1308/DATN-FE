import React, { useState } from "react";
import { 
  Button, 
  notification, 
  Select, 
  Form, 
  Input, 
  Card, 
  Typography, 
  Space, 
  DatePicker, 
  Radio, 
  InputNumber,
  Divider,
  Row,
  Col
} from "antd";
import { createVoucher } from "apis/voucher.api";
import paths from "constant/paths";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { cleanEmptyDataObject } from "utils/helper";
import Icons from "utils/icons";
import { Controller, useForm } from "react-hook-form";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const CreateVoucher = () => {
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState("PRODUCT");
  const [selectedApplyType, setSelectedApplyType] = useState("true");
  const [loading, setLoading] = useState(false);

  const CATEGORY_VOUCHER = [
    { label: "Giảm phí ship", value: "SHIPPING" },
    { label: "Giảm giá sản phẩm", value: "PRODUCT" },
    { label: "Giảm giá thuê", value: "RENTAL" },
  ];

  const APPLY_TYPE_OPTIONS = [
    { label: "Mọi đơn hàng", value: "true" },
    { label: "Dành cho sản phẩm", value: "false" },
  ];

  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      start_date: new Date().toISOString().slice(0, 16),
      discount_type: "FIXED",
      isPublic: "true",
      category: "PRODUCT",
      applyAll: "true",
    },
  });

  const handleSubmitForm = async (data) => {
    if (!selectedCategory) {
      setError("category", {
        type: "manual",
        message: "Chọn loại khuyến mãi",
      });
    }

    if (!selectedApplyType) {
      setError("applyAll", {
        type: "manual",
        message: "Chọn kiểu áp dụng cho khách hàng",
      });
    }

    if (!(selectedCategory && selectedApplyType)) return;

    setLoading(true);
    
    const transformedData = {
      ...data,
      value: Number(data?.value),
      usage_limit: Number(data?.usage_limit),
      expiry_date: moment(data?.expiry_date).format("YYYY-MM-DD HH:mm:ss"),
      start_date: moment(data?.start_date).format("YYYY-MM-DD HH:mm:ss"),
      max_discount: data.max_discount ? Number(data.max_discount) : undefined,
      min_order: data.min_order ? Number(data.min_order) : undefined,
      isPublic: data.isPublic === "true",
      voucher_category: selectedCategory,
      applyAll: selectedApplyType === "true",
    };

    try {
      await createVoucher(cleanEmptyDataObject(transformedData));
      notification.success({
        message: "Tạo khuyến mãi thành công",
        duration: 1,
      });
      navigate(paths.ADMIN.VOUCHER_MANAGEMENT);
    } catch (error) {
      notification.error({ 
        message: "Lỗi khi tạo khuyến mãi", 
        description: error.message, 
        duration: 2 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="create-voucher" style={{ margin: '16px' }}>
      <Space 
        style={{ 
          marginBottom: '16px', 
          display: 'flex', 
          justifyContent: 'space-between' 
        }}
      >
        <Space>
          <Button 
            icon={<Icons.FaArrowLeft />} 
            onClick={() => navigate(paths.ADMIN.VOUCHER_MANAGEMENT)}
          />
          <Title level={3} style={{ margin: 0 }}>Tạo khuyến mãi mới</Title>
        </Space>
      </Space>

      <Card>
        <Form layout="vertical" onFinish={handleSubmit(handleSubmitForm)}>
          <Row gutter={[16, 0]}>
            <Col span={8}>
              <Form.Item 
                label="Tên khuyến mãi" 
                validateStatus={errors.name ? "error" : ""}
                help={errors.name?.message}
                required
              >
                <Input
                  placeholder="Tên khuyến mãi hiển thị cho khách hàng"
                  {...register("name", {
                    required: "Tên khuyến mãi là bắt buộc",
                    minLength: {
                      value: 10,
                      message: "Tên khuyến mãi phải có ít nhất 10 ký tự",
                    },
                    maxLength: {
                      value: 50,
                      message: "Tên khuyến mãi không được vượt quá 50 ký tự",
                    },
                  })}
                />
              </Form.Item>
            </Col>
            
            <Col span={8}>
              <Form.Item 
                label="Loại khuyến mãi" 
                validateStatus={errors.category ? "error" : ""}
                help={errors.category?.message}
                required
              >
                <Select
                  showSearch
                  placeholder="Chọn loại khuyến mãi"
                  value={selectedCategory}
                  options={CATEGORY_VOUCHER}
                  onChange={(value) => {
                    if (errors.category) {
                      clearErrors("category");
                    }
                    setSelectedCategory(value);
                  }}
                />
              </Form.Item>
            </Col>
            
            <Col span={8}>
              <Form.Item 
                label="Kiểu áp dụng" 
                validateStatus={errors.applyAll ? "error" : ""}
                help={errors.applyAll?.message}
                required
              >
                <Select
                  showSearch
                  placeholder="Chọn cách áp dụng cho khách hàng"
                  value={selectedApplyType}
                  options={APPLY_TYPE_OPTIONS}
                  onChange={(value) => {
                    if (errors.applyType) {
                      clearErrors("applyType");
                    }
                    setSelectedApplyType(value);
                  }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Thời gian hiệu lực</Divider>
          
          <Row gutter={[16, 0]}>
            <Col span={12}>
              <Form.Item 
                label="Ngày bắt đầu" 
                validateStatus={errors.start_date ? "error" : ""}
                help={errors.start_date?.message}
                required
              >
                <Controller
                  name="start_date"
                  control={control}
                  rules={{ required: "Ngày bắt đầu là bắt buộc" }}
                  render={({ field }) => (
                    <DatePicker
                      showTime
                      format="YYYY-MM-DD HH:mm"
                      placeholder="Chọn ngày bắt đầu"
                      style={{ width: '100%' }}
                      value={field.value ? moment(field.value) : null}
                      onChange={(date, dateString) => field.onChange(date ? date.format('YYYY-MM-DDTHH:mm') : null)}
                    />
                  )}
                />
              </Form.Item>
            </Col>
            
            <Col span={12}>
              <Form.Item 
                label="Ngày kết thúc" 
                validateStatus={errors.expiry_date ? "error" : ""}
                help={errors.expiry_date?.message}
                required
              >
                <Controller
                  name="expiry_date"
                  control={control}
                  rules={{
                    required: "Ngày kết thúc là bắt buộc",
                    validate: value =>
                      new Date(value) >= new Date(watch("start_date")) ||
                      "Ngày kết thúc không được nhỏ hơn ngày bắt đầu"
                  }}
                  render={({ field }) => (
                    <DatePicker
                      showTime
                      format="YYYY-MM-DD HH:mm"
                      placeholder="Chọn ngày kết thúc"
                      style={{ width: '100%' }}
                      value={field.value ? moment(field.value) : null}
                      onChange={(date, dateString) => field.onChange(date ? date.format('YYYY-MM-DDTHH:mm') : null)}
                    />
                  )}
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Cấu hình giảm giá</Divider>
          
          <Row gutter={[16, 0]}>
            <Col span={12}>
              <Form.Item 
                label="Kiểu giảm giá" 
                validateStatus={errors.discount_type ? "error" : ""}
                help={errors.discount_type?.message}
                required
              >
                <Controller
                  name="discount_type"
                  control={control}
                  rules={{ required: "Loại giảm giá là bắt buộc" }}
                  render={({ field }) => (
                    <Radio.Group {...field}>
                      <Radio value="PERCENT">Phần trăm (%)</Radio>
                      <Radio value="FIXED">Cố định (đ)</Radio>
                    </Radio.Group>
                  )}
                />
              </Form.Item>
            </Col>
            
            <Col span={12}>
              <Form.Item 
                label="Trạng thái khuyến mãi" 
                validateStatus={errors.isPublic ? "error" : ""}
                help={errors.isPublic?.message}
                required
              >
                <Controller
                  name="isPublic"
                  control={control}
                  rules={{ required: "Trạng thái là bắt buộc" }}
                  render={({ field }) => (
                    <Radio.Group {...field}>
                      <Radio value="true">Công khai</Radio>
                      <Radio value="false">Không công khai</Radio>
                    </Radio.Group>
                  )}
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={[16, 0]}>
            <Col span={12}>
              <Form.Item 
                label="Giá trị giảm" 
                validateStatus={errors.value ? "error" : ""}
                help={errors.value?.message}
                required
              >
                <Controller
                  name="value"
                  control={control}
                  rules={{
                    required: "Vui lòng nhập giá trị giảm",
                    validate: value =>
                      watch("discount_type") === "PERCENT" && value > 100
                        ? "Giá trị phần trăm không được lớn hơn 100"
                        : true
                  }}
                  render={({ field }) => (
                    <InputNumber
                      placeholder="Nhập giá trị giảm"
                      style={{ width: '100%' }}
                      min={0}
                      addonAfter={watch("discount_type") === "PERCENT" ? "%" : "đ"}
                      {...field}
                    />
                  )}
                />
              </Form.Item>
            </Col>
            
            <Col span={12}>
              <Form.Item 
                label="Giới hạn lượt dùng" 
                validateStatus={errors.usage_limit ? "error" : ""}
                help={errors.usage_limit?.message}
                required
              >
                <Controller
                  name="usage_limit"
                  control={control}
                  rules={{
                    required: "Vui lòng nhập giới hạn lượt dùng",
                    min: {
                      value: 1,
                      message: "Giới hạn lượt dùng phải lớn hơn hoặc bằng 1"
                    }
                  }}
                  render={({ field }) => (
                    <InputNumber
                      placeholder="Nhập giới hạn lượt dùng"
                      style={{ width: '100%' }}
                      min={1}
                      {...field}
                    />
                  )}
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={[16, 0]}>
            <Col span={12}>
              <Form.Item 
                label="Giảm tối đa (chỉ áp dụng cho giảm phần trăm)" 
                validateStatus={errors.max_discount ? "error" : ""}
                help={errors.max_discount?.message}
              >
                <Controller
                  name="max_discount"
                  control={control}
                  rules={{
                    min: {
                      value: 0,
                      message: "Giảm tối đa không được nhỏ hơn 0"
                    }
                  }}
                  render={({ field }) => (
                    <InputNumber
                      placeholder="Nhập giá trị giảm tối đa"
                      style={{ width: '100%' }}
                      min={0}
                      addonAfter="đ"
                      {...field}
                    />
                  )}
                />
              </Form.Item>
            </Col>
            
            <Col span={12}>
              <Form.Item 
                label="Đơn hàng tối thiểu" 
                validateStatus={errors.min_order ? "error" : ""}
                help={errors.min_order?.message}
              >
                <Controller
                  name="min_order"
                  control={control}
                  rules={{
                    min: {
                      value: 0,
                      message: "Đơn hàng tối thiểu không được nhỏ hơn 0"
                    }
                  }}
                  render={({ field }) => (
                    <InputNumber
                      placeholder="Nhập giá trị đơn hàng tối thiểu"
                      style={{ width: '100%' }}
                      min={0}
                      addonAfter="đ"
                      {...field}
                    />
                  )}
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              style={{ marginTop: '16px' }}
            >
              Tạo khuyến mãi
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Card>
  );
};

export default CreateVoucher;
