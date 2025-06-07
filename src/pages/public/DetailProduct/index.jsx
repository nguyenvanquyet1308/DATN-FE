import { useEffect, useState } from "react";
import RelatedProducts from "../RelatedProducts/index";
import { useLocation, useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import { changeLoading } from "store/slicers/common.slicer";
import { createCartRequest, setSelectedCart } from "store/slicers/cart.slicer";
import { fillUniqueATTSkus } from "utils/helper";
import { 
  Input, 
  Modal, 
  notification, 
  Tooltip, 
  Typography, 
  Row, 
  Col, 
  Card, 
  Divider, 
  Button, 
  Image, 
  Rate,
  Badge, 
  InputNumber,
  Tabs,
  Tag,
  Space
} from "antd";
import {
  ShoppingCartOutlined,
  DollarOutlined,
  MinusOutlined,
  PlusOutlined,
  TagOutlined,
  RightOutlined,
  EnvironmentOutlined,
  SyncOutlined,
  CheckCircleOutlined,
  GiftOutlined
} from '@ant-design/icons';
import { formatCurrency } from "utils/formatCurrency";
import withBaseComponent from "hocs";
import CommentProduct from "./CommentProduct";
import { COLOR_DATA_OPTIONS_PANEL } from "constant/filterData";
import paths from "constant/paths";
import { useSelector } from "react-redux";
import RentalForm from "components/RentalForm";

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const DetailProduct = ({ checkLoginBeforeAction, dispatch, navigate }) => {
  const location = useLocation();
  const { productData } = location?.state || {};
  const [selectedATT, setSelectedATT] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [selectedSku, setSelectedSku] = useState(productData?.skus[0] || {});
  const { isLogged } = useSelector((state) => state.auth);
  const [selectedImage, setSelectedImage] = useState(
    selectedSku?.images?.split(",")[0],
  );
  const [price, setPrice] = useState(selectedSku?.price);
  const [stock, setStock] = useState(999);
  const [isOpenRentalForm, setIsOpenRentalForm] = useState(false);
  const category = productData?.category;

  const totalPrice = quantity * price;

  const handleImageClick = (img) => {
    setSelectedImage(img);
  };

  useEffect(() => {
    let stockCal = 0;
    let selectedPrice = price;
    productData?.skus.forEach((sku, index) => {
      const isMatch = Object.entries(selectedATT).every(
        ([key, value]) => sku?.attributes[key] === value,
      );
      if (isMatch) {
        setSelectedSku(sku);
        setSelectedImage(sku?.images?.split(",")[0]);
        stockCal += sku?.stock;
        selectedPrice = sku?.price;
      }
    });
    setStock(stockCal);
    setPrice(selectedPrice);
  }, [selectedATT, productData?.skus, price]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (productData?.skus[0]?.attributes) {
      setSelectedATT(productData?.skus[0]?.attributes);
    }
  }, [productData]);

  const handleSelectAttSku = (key, value) => {
    const att = { [key]: value };
    setSelectedATT((prev) => ({ ...prev, ...att }));
  };

  const handleAddCart = () => {
    dispatch(changeLoading(true));
    dispatch(
      createCartRequest({
        data: {
          quantity,
          productId: productData.id,
          skuId: selectedSku.id,
        },
        onSuccess: () => {
          notification.success({
            message: "Thêm vào giỏ hàng thành công",
            duration: 1,
            placement: "top"
          });
        },
        onError: (error) => {
          notification.error({
            message: "Thêm vào giỏ hàng thất bại: " + error,
            description: "Vui lòng kiểm tra lại thông tin đã nhập",
            placement: "top"
          });
        },
      }),
    );
    dispatch(changeLoading(false));
  };

  const handleRedirectBuyNow = () => {
    dispatch(
      setSelectedCart([
        {
          product: productData,
          sku: selectedSku,
          quantity,
        },
      ]),
    );

    navigate(paths.CHECKOUT.PAYMENT);
  };

  return (
    <div className="bg-gray-50 py-6 px-4">
      <div className="max-w-7xl mx-auto">
        {productData && (
          <>
            <Row gutter={[24, 24]} className="mb-6">
              {/* Product Image Gallery */}
              <Col xs={24} md={10}>
                <Card bordered={false} className="h-full overflow-hidden shadow-sm">
                  {selectedSku.images ? (
                    <Row gutter={[12, 12]}>
                      <Col span={4}>
                        <div className="flex flex-col gap-2 h-96 overflow-y-auto pr-1 scrollbar-thin">
                          {selectedSku?.images?.split(",").map((img, index) => (
                            <div 
                              key={index}
                              onClick={() => handleImageClick(img)}
                              className={`aspect-square border rounded-md overflow-hidden cursor-pointer transition-all duration-300 hover:border-blue-500 ${selectedImage === img ? 'border-blue-500 shadow-md' : 'border-gray-200'}`}
                            >
                              <Image 
                                src={img}
                                alt={`${productData.name} - thumbnail ${index+1}`}
                                className="object-cover w-full h-full"
                                preview={false}
                              />
                            </div>
                          ))}
                        </div>
                      </Col>

                      <Col span={20}>
                        <div className="product-main-image">
                          <Image
                            src={selectedImage}
                            alt={productData.name}
                            className="object-contain w-full rounded-md"
                            style={{ maxHeight: '400px' }}
                            preview={{ 
                              mask: <div className="flex items-center justify-center gap-2">Xem <RightOutlined /></div>
                            }}
                          />
                        </div>
                      </Col>
                    </Row>
                  ) : (
                    <div className="flex items-center justify-center bg-gray-100 rounded-md h-96">
                      <Text type="secondary">Không có hình ảnh</Text>
                    </div>
                  )}
                </Card>
              </Col>
              
              {/* Product Details */}
              <Col xs={24} md={14}>
                <Card bordered={false} className="h-full shadow-sm">
                  {category && (
                    <div className="mb-3">
                      <Tag color="blue" className="text-xs">
                        {category.name}
                      </Tag>
                    </div>
                  )}
                  
                  <Title level={2} className="mb-2 text-gray-800">
                    {productData.name}
                  </Title>
                  
                  <Row className="mb-4" align="middle">
                    <Col>
                      <Rate disabled defaultValue={productData.stars || 0} className="text-yellow-500 text-sm" />
                    </Col>
                    <Col className="ml-2">
                      <Text type="secondary" className="text-sm">({productData.stars || 0}/5)</Text>
                    </Col>
                  </Row>
                  
                  <div className="mb-4">
                    <Title level={3} className="text-red-600 font-bold m-0">
                      {price ? formatCurrency(`${price}`) : "Liên hệ"}
                    </Title>
                    {price && price > 100000 && (
                      <Text className="text-gray-400 line-through mr-2">
                        {formatCurrency(`${price * 1.2}`)}
                      </Text>
                    )}
                  </div>
                  
                  <Divider />
                  
                  {/* Product Attributes */}
                  <div className="mb-4">
                    {fillUniqueATTSkus(productData?.skus, "color").length > 0 && (
                      <div className="mb-4">
                        <Text strong className="mb-2 block">Màu sắc:</Text>
                        <Space size={[8, 8]} wrap>
                          {fillUniqueATTSkus(productData?.skus, "color").map(
                            (sku, idx) => (
                              <Tooltip key={idx} title={sku?.attributes?.color}>
                                <div
                                  className={`w-9 h-9 rounded-full cursor-pointer flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                                    selectedATT["color"] === sku?.attributes?.color 
                                      ? 'ring-2 ring-offset-2 ring-blue-500' 
                                      : 'border border-gray-300'
                                  }`}
                                  onClick={() => handleSelectAttSku("color", sku.attributes.color)}
                                  style={{
                                    backgroundColor: COLOR_DATA_OPTIONS_PANEL.find(
                                      (dataColor) => sku?.attributes?.color?.toLowerCase().includes(dataColor.key)
                                    )?.color || '#f0f0f0'
                                  }}
                                >
                                  {selectedATT["color"] === sku?.attributes?.color && (
                                    <CheckCircleOutlined className="text-white" />
                                  )}
                                </div>
                              </Tooltip>
                            )
                          )}
                        </Space>
                      </div>
                    )}

                    {fillUniqueATTSkus(productData?.skus, "size").length > 0 && (
                      <div className="mb-4">
                        <Text strong className="mb-2 block">Size:</Text>
                        <Space size={[8, 8]} wrap>
                          {fillUniqueATTSkus(productData?.skus, "size").map(
                            (el, index) => (
                              <Button
                                key={index}
                                size="middle"
                                type={selectedATT["size"] === el.attributes.size ? "primary" : "default"}
                                onClick={() => handleSelectAttSku("size", el.attributes.size)}
                                shape="round"
                                className="min-w-[40px] transition-all duration-300"
                              >
                                {el.attributes.size}
                              </Button>
                            )
                          )}
                        </Space>
                      </div>
                    )}
                    
                    {/* Quantity Selector */}
                    <div className="mb-4">
                      <Text strong className="mb-2 block">Số lượng:</Text>
                      <div className="flex items-center">
                        <Button
                          icon={<MinusOutlined />}
                          onClick={() => setQuantity((prev) => (prev > 1 ? prev - 1 : prev))}
                          disabled={quantity <= 1}
                        />
                        <InputNumber
                          min={1}
                          max={stock}
                          value={quantity}
                          onChange={(value) => setQuantity(value)}
                          className="mx-2 w-16 text-center"
                        />
                        <Button
                          icon={<PlusOutlined />}
                          onClick={() => setQuantity((prev) => (prev < stock ? prev + 1 : prev))}
                          disabled={quantity >= stock}
                        />
                        <Text type="secondary" className="ml-4">
                          Còn {stock} sản phẩm có sẵn
                        </Text>
                      </div>
                    </div>
                    
                    <Divider />
                    
                    {/* Action Buttons */}
                    <Row gutter={[16, 16]}>
                      <Col span={12}>
                        <Button
                          type="primary"
                          danger
                          size="large"
                          icon={<DollarOutlined />}
                          block
                          onClick={() => checkLoginBeforeAction(() => handleRedirectBuyNow())}
                          className="h-12"
                          disabled={!isLogged}
                        >
                          MUA NGAY
                        </Button>
                      </Col>
                      <Col span={12}>
                        <Button
                          type="primary"
                          size="large"
                          icon={<ShoppingCartOutlined />}
                          block
                          onClick={() => checkLoginBeforeAction(() => handleAddCart())}
                          className="h-12"
                          disabled={!isLogged}
                        >
                          THÊM VÀO GIỎ HÀNG
                        </Button>
                      </Col>
                      
                      {productData.skus.some((el) => el.canBeRented) && (
                        <Col span={24}>
                          <Button
                            type="default"
                            size="large"
                            icon={<SyncOutlined spin />}
                            block
                            onClick={() => setIsOpenRentalForm(true)}
                            className="h-12 border-yellow-500 text-yellow-500 hover:text-yellow-600 hover:border-yellow-600"
                            disabled={!isLogged}
                          >
                            THUÊ SẢN PHẨM
                          </Button>
                        </Col>
                      )}
                    </Row>
                    
                    {/* Summary Box */}
                    <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <Space direction="vertical" size="small" className="w-full">
                        <div className="flex justify-between">
                          <Text>Tổng tiền:</Text>
                          <Text strong className="text-red-600 text-lg">
                            {totalPrice ? formatCurrency(`${totalPrice}`) : "Liên hệ"}
                          </Text>
                        </div>
                        
                        {productData.rentalPackages.length > 0 && (
                          <>
                            <Divider className="my-2" />
                            <Text strong>Gói cho thuê có sẵn:</Text>
                            {productData.rentalPackages.map((el, idx) => (
                              <div key={idx} className="flex justify-between items-center">
                                <Tag color="blue" icon={<TagOutlined />}>{el.name}</Tag>
                                <Text type="success">{el.price}%/ngày</Text>
                              </div>
                            ))}
                          </>
                        )}
                        
                        <Divider className="my-2" />
                        <Space>
                          <EnvironmentOutlined />
                          <Text type="secondary">Miễn phí vận chuyển cho đơn hàng từ 300k</Text>
                        </Space>
                        <Space>
                          <GiftOutlined />
                          <Text type="secondary">Tặng quà cho lần mua đầu tiên</Text>
                        </Space>
                      </Space>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>

            {/* Product Description & Reviews Tabs */}
            <Row>
              <Col span={24}>
                <Card bordered={false} className="shadow-sm">
                  <Tabs defaultActiveKey="1" className="product-tabs">
                    <TabPane tab="Thông tin chi tiết" key="1">
                      <div className="rich-text py-4">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(productData?.description),
                          }}
                        />
                      </div>
                    </TabPane>
                    <TabPane tab="Đánh giá sản phẩm" key="2">
                      <CommentProduct productData={productData} />
                    </TabPane>
                  </Tabs>
                </Card>
              </Col>
            </Row>
            
            {/* Related Products */}
            <div className="my-6">
              <Title level={3} className="mb-4">Sản phẩm liên quan</Title>
              <RelatedProducts category={category} />
            </div>
          </>
        )}
      </div>

      {/* Rental Form Modal */}
      <Modal
        width={1000}
        open={isOpenRentalForm}
        onCancel={() => setIsOpenRentalForm(false)}
        footer={false}
        centered
        destroyOnClose
      >
        <RentalForm
          data={productData}
          closeModal={() => setIsOpenRentalForm(false)}
        />
      </Modal>
    </div>
  );
};

export default withBaseComponent(DetailProduct);
