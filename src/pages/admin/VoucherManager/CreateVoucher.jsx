import { Button, notification, Select } from "antd";
import { createVoucher } from "apis/voucher.api";
import paths from "constant/paths";
import moment from "moment";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { cleanEmptyDataObject } from "utils/helper";
import Icons from "utils/icons";

const CreateVoucher = () => {
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState("PRODUCT");
  const [selectedApplyType, setSelectedApplyType] = useState("true");

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
        message: "Tạo thành công.",
        duration: 1,
      });
    } catch (error) {
      notification.error({ message: error.message, duration: 1 });
    }
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
      }}
      className="py-2 px-4 flex flex-col gap-2"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Icons.FaArrowLeft
            className="cursor-pointer"
            onClick={() => navigate(paths.ADMIN.VOUCHER_MANAGEMENT)}
          />
          <div className="text-lg font-bold">Tạo khuyến mãi</div>
        </div>
      </div>

      <div className="bg-white p-4 rounded">
        <form
          onSubmit={handleSubmit(handleSubmitForm)}
          className="flex flex-col gap-4 mt-4 w-full"
        >
          <div className="flex gap-2 items-center mb-2">
            {/* name */}
            <div className="flex-1">
              <label
                htmlFor="name"
                className="text-lg font-bold text-nowrap text-primary"
              >
                Tên khuyến mãi :
              </label>
              <input
                className="w-full py-2 px-2 border rounded-lg focus:outline-none focus:border-indigo-500"
                type="text"
                placeholder="Tên khuyến hiển thị cho khách hàng"
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
              {errors.name && (
                <p className="text-red-500">{errors.name.message}</p>
              )}
            </div>
            {/*category*/}
            <div className="flex flex-col  flex-1">
              <label
                htmlFor="category"
                className="text-lg font-bold text-nowrap text-primary"
              >
                Loại khuyến mãi :
              </label>
              <Select
                showSearch
                id="category"
                title="Loại Khuyến Mãi"
                placeholder={
                  errors?.category
                    ? "Vui lòng chọn loại khuyến mãi"
                    : "Chọn loại khuyến mãi"
                }
                className={`w-full text-lg font-bold ${
                  errors["category"]
                    ? "shadow-md  shadow-red-500 rounded-lg text-red-500"
                    : ""
                }`}
                value={selectedCategory}
                optionFilterProp="label"
                options={CATEGORY_VOUCHER}
                onChange={(value) => {
                  if (errors.category) {
                    clearErrors("category");
                  }
                  setSelectedCategory(value);
                }}
              />
            </div>
            <div className="flex flex-col  flex-1">
              <label className="text-lg font-bold text-nowrap text-primary">
                Kiểu áp dụng :
              </label>
              <Select
                showSearch
                id="applyType"
                title="Kiểu áp dụng"
                placeholder={
                  errors?.applyType
                    ? "Vui lòng chọn kiểu áp dụng"
                    : "Chọn cách áp dụng cho khách hàng"
                }
                className={`w-full text-lg font-bold ${
                  errors["applyType"]
                    ? "shadow-md  shadow-red-500 rounded-lg text-red-500"
                    : ""
                }`}
                value={selectedApplyType}
                optionFilterProp="label"
                options={APPLY_TYPE_OPTIONS}
                onChange={(value) => {
                  if (errors.applyType) {
                    clearErrors("applyType");
                  }
                  console.log("🚀 ~ CreateVoucher ~ value:", value);

                  setSelectedApplyType(value);
                }}
              />
            </div>
          </div>

          {/* Promotion Period */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "bold",
              }}
            >
              Thời hạn
            </label>
            <div className="flex gap-2">
              <div className="flex flex-col flex-1">
                <label>Ngày bắt đầu : </label>
                <input
                  type="datetime-local"
                  {...register("start_date", {
                    required: "Ngày bắt đầu là bắt buộc",
                  })}
                  style={{
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    flex: "1",
                  }}
                />
                {errors.start_date && (
                  <p className="text-red-500">{errors.start_date.message}</p>
                )}
              </div>
              <div className="flex flex-col flex-1">
                <label>Ngày kết thúc : </label>
                <input
                  type="datetime-local"
                  {...register("expiry_date", {
                    required: "Ngày kết thúc là bắt buộc",
                    validate: (value) =>
                      new Date(value) >= new Date(watch("start_date")) ||
                      "Ngày kết thúc không được nhỏ hơn ngày bắt đầu",
                  })}
                  style={{
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    flex: "1",
                  }}
                />
                {errors.expiry_date && (
                  <p className="text-red-500">{errors.expiry_date.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex">
            <div className="flex-1">
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: "bold",
                }}
              >
                Kiểu Giảm
              </label>
              <div style={{ display: "flex", gap: "20px" }}>
                <label>
                  <input
                    type="radio"
                    value="PERCENT"
                    {...register("discount_type", {
                      required: "Loại giảm giá là bắt buộc",
                    })}
                    style={{ marginRight: "10px" }}
                  />
                  Phần trăm
                </label>
                <label>
                  <input
                    type="radio"
                    value="FIXED"
                    {...register("discount_type", {
                      required: "Loại giảm giá là bắt buộc",
                    })}
                    style={{ marginRight: "10px" }}
                  />
                  Giảm cố định
                </label>
              </div>
              {errors.discount_type && (
                <p className="text-red-500">{errors.discount_type.message}</p>
              )}
            </div>

            <div className="flex-1">
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: "bold",
                }}
              >
                Công khai
              </label>
              <div style={{ display: "flex", gap: "20px" }}>
                <label>
                  <input
                    type="radio"
                    value="true"
                    {...register("isPublic", {
                      required: "Chọn chế độ ...",
                    })}
                    style={{ marginRight: "10px" }}
                  />
                  Có
                </label>
                <label>
                  <input
                    type="radio"
                    value="false"
                    {...register("isPublic", {
                      required: "Chọn chế độ ...",
                    })}
                    style={{ marginRight: "10px" }}
                  />
                  Không
                </label>
              </div>
              {errors.isPublic && (
                <p className="text-red-500">{errors.isPublic.message}</p>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label>Giá trị giảm:</label>
              <input
                type="number"
                className="w-full py-2 px-2 border rounded-lg focus:outline-none focus:border-indigo-500"
                {...register("value", {
                  required: "Vui lòng nhập giá trị giảm",
                  validate: (value) =>
                    watch("discount_type") === "PERCENT" && value > 100
                      ? "Giá trị phần trăm không được lớn hơn 100"
                      : true,
                })}
              />
              {errors.value && (
                <p className="text-red-500">{errors.value.message}</p>
              )}
            </div>
            <div className="flex-1">
              <label>Giới hạn lượt dùng :</label>
              <input
                type="number"
                className="w-full py-2 px-2 border rounded-lg focus:outline-none focus:border-indigo-500"
                {...register("usage_limit", {
                  required: "Vui lòng nhập giới hạn lượt dùng",
                  min: {
                    value: 1,
                    message: "Giới hạn lượt dùng không được nhỏ hơn 0",
                  },
                })}
              />
              {errors.usage_limit && (
                <p className="text-red-500">{errors.usage_limit.message}</p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label>Giảm tối đa:</label>
              <input
                type="number"
                className="w-full py-2 px-2 border rounded-lg focus:outline-none focus:border-indigo-500"
                {...register("max_discount", {
                  min: {
                    value: 0,
                    message: "Giảm tối đa không được nhỏ hơn 0",
                  },
                })}
              />
              {errors.max_discount && (
                <p className="text-red-500">{errors.max_discount.message}</p>
              )}
            </div>
            <div className="flex-1">
              <label>Đơn hàng tối thiểu:</label>
              <input
                type="number"
                className="w-full py-2 px-2 border rounded-lg focus:outline-none focus:border-indigo-500"
                {...register("min_order", {
                  min: {
                    value: 0,
                    message: "Đơn hàng tối thiểu không được nhỏ hơn 0",
                  },
                })}
              />
              {errors.min_order && (
                <p className="text-red-500">{errors.min_order.message}</p>
              )}
            </div>
          </div>
          {/* Submit Button */}
          <Button
            htmlType="submit"
            className="bg-light text-lg font-bold text-white "
          >
            Tạo ngay
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateVoucher;
