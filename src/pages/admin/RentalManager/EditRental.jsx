import { Button, Checkbox, Input, notification, Select, Card, Spin, Tag, Typography, Space, Divider, Badge, Row, Col, Drawer, Radio } from "antd";
import { getProducts } from "apis/product.api";
import logo from "assets/images/logo.jpg";
import paths from "constant/paths";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HashLoader } from "react-spinners";
import {
  fillUniqueATTSkus,
  findSkuByMultipleAttributes,
  formatMoney,
} from "utils/helper";
import Pagination from "../components/Pagination";
import { getProductCate } from "apis/productCate.api";
import { getVouchers } from "apis/voucher.api";
import CouponCard from "pages/checkout/VoucherForm/Coupon";
import { useSelector } from "react-redux";
import { createRental, getRentalById, updateRental } from "apis/rental.api";
import { getDistricts, getProvinces, getWards } from "apis/address.api";
import { useForm } from "react-hook-form";
import useDebounce from "hooks/useDebounce";
import { ShoppingCartOutlined, EditOutlined, HomeOutlined, BankOutlined, PlusOutlined, MinusOutlined, SearchOutlined, TagOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

function EditRental() {
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdateDelivery, setIsUpdateDelivery] = useState(false);
  const navigate = useNavigate();
  const [productData, setProductData] = useState({
    isLoading: false,
    data: [],
  });
  const { selectedVouchers } = useSelector((state) => state.voucher);
  const [limit, setLimit] = useState(8);
  const [page, setPage] = useState(1);
  const [detailRentals, setDetailRentals] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [totalDiscountVoucher, setTotalDiscountVoucher] = useState(0);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [mobileDrawerVisible, setMobileDrawerVisible] = useState(false);
  
  let keywordDebounce = useDebounce(keyword, 400);
  const params = useParams();
  const [rentalCurrent, setRentalCurrent] = useState({});
  const [statusRentalCurrent, setStatusRentalCurrent] = useState("PENDING");

  const statusColors = {
    "PENDING": "orange",
    "RENTED": "blue",
    "RETURNED": "green",
    "CANCELLED": "red",
    "EXPIRED": "grey",
    "UNPAID": "volcano",
    "SHIPPED": "purple"
  };
  
  const statusLabels = {
    "PENDING": "Đang xử lí",
    "RENTED": "Đang thuê",
    "RETURNED": "Đã trả",
    "CANCELLED": "Đã hủy",
    "EXPIRED": "Hết hạn",
    "UNPAID": "Chưa thanh toán",
    "SHIPPED": "Đang ship"
  };

  useEffect(() => {
    const fetchInfoRentalUpdate = async () => {
      if (!params.id) throw new Error("not found data ");
      try {
        const res = await getRentalById(params.id);
        setRentalCurrent(res?.result);
        setStatusRentalCurrent(res?.result?.status);
      } catch (error) {
        notification.warning({
          message: "Không thể tải dữ liệu. Vui lòng thử lại.",
          duration: 1,
          placement: "top",
        });
        navigate(paths.ADMIN.RENTAL_MANAGEMENT);
      }
    };
    fetchInfoRentalUpdate();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm({
    values: {
      typeAddress: "HOME",
      street: "",
    },
  });

  const fetchProvinces = async () => {
    try {
      const res = await getProvinces();
      setProvinces(res.data.data.data);
    } catch (error) {
      console.log("🚀 ~ fetchProvinces ~ error:", error);
    }
  };

  const fetchDistricts = async () => {
    if (!selectedProvince) return;
    setSelectedDistrict(null);
    setSelectedWard(null);
    try {
      const res = await getDistricts(selectedProvince?.data?.code);
      setDistricts(res.data.data.data);
    } catch (error) {
      notification.warning({
        message:
          "Api get địa chỉ đã giới hạn. Xin lỗi vì bất tiện này vui lòng thử lại sau 20s",
        duration: 1,
        placement: "top",
      });
    }
  };

  const fetchWards = async () => {
    if (!selectedDistrict) return;
    try {
      const res = await getWards(selectedDistrict?.data?.code);
      setWards(res.data.data.data);
      setSelectedWard(null);
    } catch (error) {
      notification.warning({
        message:
          "Api get địa chỉ đã giới hạn. Xin lỗi vì bất tiện này vui lòng thử lại sau 20s",
        duration: 5,
        placement: "top",
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

  const calTotalRental = (sku) => {
    let total = 0;

    if (sku.hour) total += sku.hourlyRentPrice * sku.hour;

    if (sku.day) {
      total += sku.dailyRentPrice * sku.day;
    }

    return total * sku.quantity;
  };

  const selectedItems =
    detailRentals.flatMap((rental) =>
      rental.skus.filter((sku) => sku.isChoose),
    ) || [];

  const totalOrder = selectedItems.reduce(
    (sum, el) => (sum += calTotalRental(el)),
    0,
  );

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const params = { limit: 30 };
      const res = await getProductCate(params);
      setCategories(res?.result?.content);
    };
    const fetchVouchers = async () => {
      const params = { limit: 30 };
      const res = await getVouchers(params);
      setVouchers(res?.result?.content);
    };
    fetchCategories();
    fetchVouchers();
  }, []);

  useEffect(() => {
    console.log(
      "🚀 ~ calculateDiscount ~ selectedVouchers.length:",
      selectedVouchers.length,
    );
    const calculateDiscount = () => {
      if (selectedVouchers.data.length >= 1)
        setTotalDiscountVoucher(
          selectedVouchers.data?.reduce((sum, prev) => {
            if (prev.discount_type === "PERCENT") {
              let value = sum + (prev.value / 100) * totalOrder;
              return (
                sum + (value < prev.max_discount ? value : prev.max_discount)
              );
            } else return sum + prev.value;
          }, 0),
        );
    };

    calculateDiscount();
  }, [selectedVouchers, totalOrder]);

  const fetchProducts = async () => {
    setProductData((prev) => ({ ...prev, isLoading: true }));
    try {
      const params = {
        limit,
        page,
        canBeRented: true,
      };

      if (selectedCategory) {
        params.category = selectedCategory;
      }

      if (keywordDebounce) {
        params.keyword = keywordDebounce;
      }

      const res = await getProducts(params);
      setProductData((prev) => ({ ...prev, ...res?.result }));
    } catch (error) {
      notification.error({
        message: error.message,
        duration: 2,
        placement: "top",
      });
    }
    setProductData((prev) => ({ ...prev, isLoading: false }));
  };

  useEffect(() => {
    if (Array.isArray(productData?.content)) {
      setDetailRentals(
        productData?.content?.reduce((acc, p, index) => {
          const converted = convertRentalSku(p, index);
          return acc.concat(converted);
        }, []),
      );
    } else {
      console.error(
        "productData.content is not an array:",
        productData?.content,
      );
    }
  }, [productData?.content, rentalCurrent?.rentalDetails]);

  const convertRentalSku = (data, indexProduct) => {
    const convertRentalSkus = data?.skus?.reduce(
      (acc, current) => {
        if (
          !acc.seen.has(current?.attributes["color"]) &&
          !!current.attributes["color"] &&
          current.canBeRented
        ) {
          acc.seen.add(current?.attributes["color"]);
          acc.result.push({
            ...current,
            quantity: 1,
            hour: 1,
            day: 0,
            isChoose: false,
            productId: data.id,
            productName: data.name,
          });
        }
        return acc;
      },
      { seen: new Set(), result: [] },
    ).result;

    if (convertRentalSkus.length > 1) {
      return { indexProduct, skus: convertRentalSkus };
    }

    return {
      indexProduct,
      skus: [
        {
          ...data.skus[0],
          quantity: 1,
          hour: 1,
          day: 0,
          isChoose: false,
          productId: data.id,
          productName: data.name,
        },
      ],
    };
  };

  useEffect(() => {
    fetchProducts();
  }, [page, limit, selectedCategory, keywordDebounce]);

  const handleChangeConvertedSkus = (
    keyAtt,
    valueAtt,
    indexProduct,
    indexCV,
    indexSKU,
  ) => {
    setDetailRentals((prev) => {
      const updatedRentals = [...prev];

      const currentRental = updatedRentals[indexCV];

      const updatedAttributes = {
        ...detailRentals[indexCV].skus[indexSKU].attributes,
        [keyAtt]: valueAtt,
      };

      const updatedSku = findSkuByMultipleAttributes(
        productData.content[indexProduct]?.skus || [],
        Object.entries(updatedAttributes)?.map(([key, value]) => ({
          key,
          value,
        })),
      );

      if (updatedSku) {
        updatedRentals[indexCV].skus[indexSKU] = {
          ...currentRental.skus[indexSKU],
          ...updatedSku,
        };
      }

      return updatedRentals;
    });
  };

  const handleCheckboxChange = (checked, indexCV, indexSKU) => {
    setDetailRentals((prev) => {
      const updatedRentals = [...prev];
      updatedRentals[indexCV].skus[indexSKU].isChoose = checked;
      return updatedRentals;
    });
  };

  const handleIncreaseQuantity = (indexCV, indexSKU) => {
    setDetailRentals((prev) => {
      const updatedRentals = [...prev];
      const sku = updatedRentals[indexCV].skus[indexSKU];
      sku.quantity += 1;
      return updatedRentals;
    });
  };

  const handleDecreaseQuantity = (indexCV, indexSKU) => {
    setDetailRentals((prev) => {
      const updatedRentals = [...prev];
      const sku = updatedRentals[indexCV].skus[indexSKU];
      if (sku.quantity > 1) sku.quantity -= 1;
      return updatedRentals;
    });
  };

  const handleQuantityChange = (value, indexCV, indexSKU) => {
    const parsedValue = Math.max(1, parseInt(value) || 1);
    setDetailRentals((prev) => {
      const updatedRentals = [...prev];
      updatedRentals[indexCV].skus[indexSKU].quantity = parsedValue;
      return updatedRentals;
    });
  };

  const handleHourChange = (value, indexCV, indexSKU) => {
    setDetailRentals((prev) => {
      const updatedRentals = [...prev];
      updatedRentals[indexCV].skus[indexSKU].hour = value;
      return updatedRentals;
    });
  };

  const handleDayChange = (value, indexCV, indexSKU) => {
    const parsedValue = Math.max(0, parseInt(value) || 0);
    setDetailRentals((prev) => {
      const updatedRentals = [...prev];
      updatedRentals[indexCV].skus[indexSKU].day = parsedValue;
      return updatedRentals;
    });
  };

  const handleRental = async (delivery) => {
    try {
      const dataPayload = {
        id: rentalCurrent.id,
        status: statusRentalCurrent,
      };

      if (isUpdateDelivery) {
        dataPayload.delivery = { ...delivery, isDefault: false };
      }

      if (totalOrder) {
        dataPayload.detailRentals = selectedItems.map((el) => ({
          quantity: el.quantity,
          productId: el.productId,
          price: calTotalRental(el),
          hour: el.hour,
          day: el.day,
          skuId: el.id,
        }));
        dataPayload.discountValue = totalDiscountVoucher;
        dataPayload.totalAmount = totalOrder - totalDiscountVoucher;
      }

      await updateRental(dataPayload);
      notification.success({
        message: "Sửa đơn thuê thành công!",
        duration: 2,
        placement: "top",
      });
      navigate(paths.ADMIN.RENTAL_MANAGEMENT);
    } catch (error) {
      notification.warning({
        message: error.message,
        duration: 2,
        placement: "top",
      });
    }
  };

  const toggleMobileDrawer = () => {
    setMobileDrawerVisible(!mobileDrawerVisible);
  };

  const renderProductItem = (sku, indexCV, indexSKU, cvData) => (
    <Card 
      key={`${indexCV}-${indexSKU}`}
      className="product-card mb-3 transition-all hover:shadow-md"
      bodyStyle={{ padding: '12px' }}
    >
      <div className="flex items-start">
        <Checkbox
          checked={sku.isChoose}
          onChange={(e) => handleCheckboxChange(e.target.checked, indexCV, indexSKU)}
          className="mt-2 mr-3"
        />
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <div className="flex-shrink-0">
            <img
              src={sku?.images?.split(",")[0]}
              alt={sku?.productName}
              className="w-28 h-32 rounded-lg object-cover border border-gray-200"
            />
          </div>
          <div className="flex-grow">
            <Title level={5} className="text-primary mb-1">{sku?.productName}</Title>
            
            {sku?.attributes?.color && (
              <div className="flex gap-2 mb-2">
                <Text strong>Màu:</Text>
                <Tag color="blue">{sku.attributes?.color}</Tag>
              </div>
            )}

            {sku.attributes?.size && productData?.content && (
              <div className="mb-2">
                <Text strong className="text-blue-600 mr-2">Kích thước:</Text>
                <Space wrap className="mt-1">
                  {fillUniqueATTSkus(
                    productData?.content[detailRentals[indexCV]?.indexProduct]?.skus,
                    "size",
                  ).map((el, i) => (
                    <Tag
                      key={i}
                      className="cursor-pointer transition-all"
                      color={sku.attributes.size === el.attributes.size ? "blue" : "default"}
                      onClick={() => handleChangeConvertedSkus(
                        "size",
                        el.attributes.size,
                        detailRentals[indexCV]?.indexProduct,
                        indexCV,
                        indexSKU,
                      )}
                    >
                      {el.attributes.size}
                    </Tag>
                  ))}
                </Space>
              </div>
            )}

            {sku.attributes?.material && productData?.content && (
              <div className="mb-2">
                <Text strong className="text-blue-600 mr-2">Chất liệu:</Text>
                <Space wrap className="mt-1">
                  {fillUniqueATTSkus(
                    productData?.content[detailRentals[indexCV]?.indexProduct]?.skus,
                    "material",
                  ).map((el, i) => (
                    <Tag
                      key={i}
                      className="cursor-pointer transition-all"
                      color={sku.attributes.material === el.attributes.material ? "blue" : "default"}
                      onClick={() => handleChangeConvertedSkus(
                        "material",
                        el.attributes.material,
                        detailRentals[indexCV]?.indexProduct,
                        indexCV,
                        indexSKU,
                      )}
                    >
                      {el.attributes.material}
                    </Tag>
                  ))}
                </Space>
              </div>
            )}

            <div className="flex flex-wrap gap-3 items-center mt-3">
              <div className="flex items-center">
                <Button 
                  icon={<MinusOutlined />} 
                  size="small"
                  onClick={() => handleDecreaseQuantity(indexCV, indexSKU)}
                  className="border-blue-500 text-blue-500"
                />
                <Input
                  type="number"
                  className="w-14 mx-1 text-center"
                  value={sku.quantity}
                  onChange={(e) => handleQuantityChange(e.target.value, indexCV, indexSKU)}
                />
                <Button 
                  icon={<PlusOutlined />} 
                  size="small"
                  onClick={() => handleIncreaseQuantity(indexCV, indexSKU)}
                  className="border-blue-500 text-blue-500"
                />
              </div>

              <div className="flex items-center gap-1">
                <Text>Giờ:</Text>
                <Select
                  className="w-20"
                  value={sku.hour}
                  onChange={(value) => handleHourChange(value, indexCV, indexSKU)}
                  options={Array.from(
                    { length: 24 },
                    (_, value) => ({
                      label: `${value} Giờ`,
                      value,
                    }),
                  )}
                  size="small"
                />
              </div>

              <div className="flex items-center gap-1">
                <Text>Ngày:</Text>
                <Input
                  type="number"
                  className="w-16"
                  value={sku.day}
                  onChange={(e) => handleDayChange(e.target.value, indexCV, indexSKU)}
                  size="small"
                />
              </div>
            </div>

            <div className="flex justify-end mt-2">
              <Text strong className="text-orange-600">
                {formatMoney(calTotalRental(sku))} vnđ
              </Text>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  const renderOrderSummary = () => (
    <div className="order-summary">
      {!isUpdateDelivery ? (
        <div className="mb-4">
          <Card className="bg-gray-50">
            <Space direction="vertical" size="small" className="w-full">
              <Title level={5} className="m-0">Địa chỉ</Title>
              <Text>
                {rentalCurrent?.delivery?.street}
                {rentalCurrent?.delivery?.ward && <span>, {rentalCurrent?.delivery?.ward}</span>}
                {rentalCurrent?.delivery?.district && <span>, {rentalCurrent?.delivery?.district}</span>}
                {rentalCurrent?.delivery?.city && <span>, {rentalCurrent?.delivery?.city}</span>}
              </Text>
              <Button 
                type="primary" 
                icon={<EditOutlined />} 
                onClick={() => setIsUpdateDelivery(true)}
                className="mt-2"
              >
                Sửa địa chỉ
              </Button>
            </Space>
          </Card>

          <div className="mt-4">
            <Space direction="vertical" className="w-full">
              <div className="flex justify-between items-center">
                <Text strong>Trạng thái:</Text>
                <Select
                  value={statusRentalCurrent}
                  onChange={(value) => setStatusRentalCurrent(value)}
                  style={{ width: '180px' }}
                  dropdownMatchSelectWidth={false}
                >
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <Select.Option key={value} value={value}>
                      <Tag color={statusColors[value]}>{label}</Tag>
                    </Select.Option>
                  ))}
                </Select>
              </div>
            </Space>
          </div>
        </div>
      ) : (
        <div className="mb-4">
          <Card title="Cập nhật địa chỉ" className="bg-gray-50" extra={
            <Button onClick={() => setIsUpdateDelivery(false)}>
              Hủy
            </Button>
          }>
            <form
              onSubmit={handleSubmit(handleRental)}
              className="flex flex-col gap-3"
            >
              <div className="form-group">
                <Text strong>Họ và tên:</Text>
                <Input
                  placeholder="Nhập tên"
                  {...register("username", {
                    required: isUpdateDelivery
                      ? "Yêu cầu nhập tên người dùng"
                      : false,
                  })}
                  status={errors.username ? "error" : ""}
                  className="mt-1"
                />
                {errors["username"] && (
                  <Text type="danger" className="text-xs mt-1">
                    {errors?.username?.message}
                  </Text>
                )}
              </div>

              <div className="form-group">
                <Text strong>Công ty:</Text>
                <Input
                  placeholder="Nhập công ty"
                  {...register("company_name")}
                  className="mt-1"
                />
              </div>

              <div className="form-group">
                <Text strong>Số điện thoại:</Text>
                <Input
                  placeholder="Nhập số điện thoại"
                  {...register("numberPhone", {
                    required: isUpdateDelivery
                      ? "Yêu cầu nhập số điện thoại"
                      : false,
                  })}
                  status={errors.numberPhone ? "error" : ""}
                  className="mt-1"
                />
                {errors["numberPhone"] && (
                  <Text type="danger" className="text-xs mt-1">
                    {errors?.numberPhone?.message}
                  </Text>
                )}
              </div>

              <div className="form-group">
                <Text strong>Tỉnh/Thành phố:</Text>
                <Select
                  showSearch
                  id="city"
                  allowClear
                  placeholder="Chọn thành phố"
                  className="w-full mt-1"
                  value={selectedProvince?.index}
                  optionFilterProp="label"
                  options={provinces?.map((el, index) => ({
                    label: el?.name,
                    value: index,
                  }))}
                  onChange={(index) => {
                    setSelectedProvince({
                      index,
                      data: provinces[index],
                    });
                  }}
                />
              </div>

              <div className="form-group">
                <Text strong>Quận huyện:</Text>
                <Select
                  showSearch
                  id="district"
                  allowClear
                  placeholder="Chọn quận huyện"
                  className="w-full mt-1"
                  value={selectedDistrict?.index}
                  optionFilterProp="label"
                  options={districts?.map((el, index) => ({
                    label: el?.name,
                    value: index,
                  }))}
                  onChange={(index) => {
                    setSelectedDistrict({
                      index,
                      data: districts[index],
                    });
                  }}
                />
              </div>

              <div className="form-group">
                <Text strong>Phường xã:</Text>
                <Select
                  showSearch
                  id="ward"
                  allowClear
                  placeholder="Nhập phường"
                  className="w-full mt-1"
                  value={selectedWard?.index}
                  optionFilterProp="label"
                  options={wards?.map((el, index) => ({
                    label: el?.name,
                    value: index,
                  }))}
                  onChange={(index) => {
                    setSelectedWard({
                      index,
                      data: wards[index],
                    });
                  }}
                />
              </div>

              <div className="form-group">
                <Text strong>Địa chỉ:</Text>
                <Input.TextArea
                  placeholder="Nhập địa chỉ"
                  {...register("street", {
                    required: isUpdateDelivery
                      ? "Yêu cầu nhập địa chỉ"
                      : false,
                  })}
                  status={errors.street ? "error" : ""}
                  className="mt-1"
                  rows={3}
                />
                {errors["street"] && (
                  <Text type="danger" className="text-xs mt-1">
                    {errors?.street?.message}
                  </Text>
                )}
              </div>

              <div className="form-group">
                <Text strong>Loại Địa chỉ:</Text>
                <Radio.Group 
                  {...register("typeAddress", {
                    required: "Chọn loại địa chỉ",
                  })}
                  className="mt-2"
                  defaultValue="HOME"
                >
                  <Space>
                    <Radio value="HOME">
                      <Space>
                        <HomeOutlined />
                        <Text>Nhà riêng / Chung cư</Text>
                      </Space>
                    </Radio>
                    <Radio value="COMPANY">
                      <Space>
                        <BankOutlined />
                        <Text>Cơ quan / Công ty</Text>
                      </Space>
                    </Radio>
                  </Space>
                </Radio.Group>
              </div>

              <Button 
                type="primary" 
                htmlType="submit" 
                className="mt-3" 
                size="large"
                block
              >
                Cập nhật địa chỉ
              </Button>
            </form>
          </Card>
        </div>
      )}

      <Card title="Tổng đơn hàng" className="mt-4">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <Text>Tổng sản phẩm:</Text>
            <Text strong>{selectedItems.length} sản phẩm</Text>
          </div>
          
          {totalDiscountVoucher > 0 && selectedItems.length > 0 && (
            <div className="flex justify-between text-orange-600">
              <Text>Giảm giá:</Text>
              <Text strong>{formatMoney(totalDiscountVoucher)} vnđ</Text>
            </div>
          )}
          
          <Divider className="my-2" />
          
          {selectedItems.length > 0 ? (
            <div className="flex justify-between">
              <Text>Tổng tiền:</Text>
              <Text strong className="text-xl text-primary">
                {formatMoney(totalOrder - totalDiscountVoucher)}đ
              </Text>
            </div>
          ) : (
            <Text className="text-primary text-center">
              {isUpdateDelivery ? "Chọn sản phẩm muốn sửa" : "Vui lòng chọn sản phẩm thuê"}
            </Text>
          )}
          
          <Button
            type="primary"
            size="large"
            icon={<ShoppingCartOutlined />}
            className="mt-3"
            block
            onClick={() => !isUpdateDelivery && handleRental()}
          >
            Hoàn thành
          </Button>
        </div>
      </Card>

      <Divider orientation="left">
        <Space>
          <TagOutlined />
          <span>Mã giảm giá</span>
        </Space>
      </Divider>
      
      <div className="vouchers-container overflow-auto max-h-[400px] pr-1">
        <div className="flex justify-between mb-2 text-sm text-gray-500">
          <span>Áp dụng mã giảm giá</span>
          <span>Chỉ áp dụng được 2</span>
        </div>
        
        <div className="flex flex-col gap-2">
          {vouchers.map((el, index) => (
            <CouponCard
              key={index}
              data={el}
              Unused={el?.min_order > totalOrder}
              isAnimation={false}
            />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="rental-edit-page bg-gray-100 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="logo"
              className="w-12 h-12 object-contain"
              data-aos="fade"
            />
            <div className="flex flex-col">
              <Title level={4} className="m-0" data-aos="fade">
                Cập nhật Đơn thuê #{rentalCurrent.rentalCode}
              </Title>
              <Badge status={statusColors[statusRentalCurrent] === "orange" ? "processing" : "default"} 
                color={statusColors[statusRentalCurrent]} 
                text={statusLabels[statusRentalCurrent]} 
              />
            </div>
          </div>
          
          <Space>
            <Button
              type="primary"
              ghost
              onClick={toggleMobileDrawer}
              className="md:hidden"
            >
              {mobileDrawerVisible ? "Đóng" : "Thông tin đơn"}
            </Button>
            
            <Button 
              onClick={() => navigate(paths.ADMIN.RENTAL_MANAGEMENT)}
              className="flex items-center"
              type="default"
            >
              Quay lại danh sách
            </Button>
          </Space>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <Row gutter={[24, 24]}>
          {/* Product Listing Section */}
          <Col xs={24} md={16}>
            <Card 
              title="Danh sách sản phẩm" 
              className="product-list-card h-full"
              extra={
                <div className="flex flex-wrap gap-2">
                  <Select
                    placeholder="Lọc theo loại"
                    style={{ width: 150 }}
                    onChange={(value) => setSelectedCategory(value)}
                    allowClear
                  >
                    {categories.map((el, index) => (
                      <Select.Option key={index} value={el.slug}>{el.name}</Select.Option>
                    ))}
                  </Select>

                  <Input
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Tìm kiếm bằng từ khóa"
                    prefix={<SearchOutlined className="text-gray-400" />}
                    allowClear
                  />
                </div>
              }
            >
              <div className="product-list max-h-[70vh] overflow-y-auto pr-1">
                {productData.isLoading ? (
                  <div className="flex justify-center p-10">
                    <Spin size="large" />
                  </div>
                ) : detailRentals.length > 0 ? (
                  detailRentals.map((cvData, indexCV) => 
                    cvData.skus.map((sku, indexSKU) => 
                      renderProductItem(sku, indexCV, indexSKU, cvData)
                    )
                  )
                ) : (
                  <div className="text-center p-10">
                    <Text type="secondary">Không tìm thấy sản phẩm</Text>
                  </div>
                )}
              </div>
              
              {productData?.content?.length > 1 && (
                <div className="pagination-container mt-4 flex justify-center">
                  <Pagination
                    listLimit={[8, 16, 24, 32]}
                    limitCurrent={limit}
                    setLimit={setLimit}
                    totalPages={productData?.totalPages}
                    setPage={setPage}
                    pageCurrent={page}
                    totalElements={productData?.totalElements}
                  />
                </div>
              )}
            </Card>
          </Col>

          {/* Order Summary Section - Desktop */}
          <Col xs={0} md={8}>
            {renderOrderSummary()}
          </Col>
        </Row>
      </div>

      {/* Mobile Drawer for Order Summary */}
      <Drawer
        title="Thông tin đơn hàng"
        placement="right"
        onClose={toggleMobileDrawer}
        open={mobileDrawerVisible}
        width={320}
      >
        {renderOrderSummary()}
      </Drawer>

      {/* Full Page Loading */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <HashLoader size={100} color="#b683df" />
        </div>
      )}

      {/* Global styles */}
      <style jsx global>{`
        .product-card:hover {
          transform: translateY(-2px);
        }
        
        .vouchers-container::-webkit-scrollbar {
          width: 5px;
        }
        
        .vouchers-container::-webkit-scrollbar-thumb {
          background-color: #d1d5db;
          border-radius: 10px;
        }
        
        .product-list::-webkit-scrollbar {
          width: 5px;
        }
        
        .product-list::-webkit-scrollbar-thumb {
          background-color: #d1d5db;
          border-radius: 10px;
        }
        
        @media (max-width: 768px) {
          .ant-drawer-body {
            padding: 12px;
          }
        }
      `}</style>
    </div>
  );
}

export default EditRental;
