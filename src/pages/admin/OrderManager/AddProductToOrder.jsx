import React, { useState } from "react";
import { 
  Modal, 
  Tooltip, 
  Card, 
  Typography, 
  Tag, 
  Space, 
  Rate, 
  Button,
  Badge,
  Image
} from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { COLOR_DATA_OPTIONS_PANEL } from "constant/filterData";
import paths from "constant/paths";
import withBaseComponent from "hocs";
import { useCallback, useEffect } from "react";
import { generatePath } from "react-router-dom";
import ReactStars from "react-stars";
import { fillUniqueATTSkus, formatMoney, trunCateText } from "utils/helper";
import Icons from "utils/icons";
import AddProductForm from "./AddProductForm";
import { getProductListRequest } from "store/slicers/product.slicer";
import { useDispatch } from "react-redux";

const { Text, Title } = Typography;

function AddProductToOrder({ data, navigate }) {
  const [isShowModal, setIsShowModal] = useState(false);
  const [skuShow, setSkuShow] = useState(data?.skus[0]);
  const dispatch = useDispatch();

  const openFormCart = (event) => {
    event.stopPropagation();
    setIsShowModal(true);
  };

  const uniqueColors = fillUniqueATTSkus(data?.skus, "color");
  const uniqueSizes = fillUniqueATTSkus(data?.skus, "size");
  
  const getColorStyle = (colorName) => {
    const colorData = COLOR_DATA_OPTIONS_PANEL.find(
      (dataColor) => colorName?.toLowerCase()?.includes(dataColor.key)
    );
    return colorData?.color || "bg-gray-400";
  };

  return (
    <>
      <Modal
        title="Thêm sản phẩm vào đơn hàng"
        width={800}
        open={isShowModal}
        onCancel={() => setIsShowModal(false)}
        footer={null}
        destroyOnClose
      >
        <AddProductForm data={data} closeModal={() => setIsShowModal(false)} />
      </Modal>
      
      <Card
        hoverable
        cover={
          <div style={{ padding: "16px", display: "flex", justifyContent: "center", height: "180px" }}>
            <Image
              src={skuShow?.images?.split(",")[0]}
              alt={skuShow?.code}
              style={{ maxHeight: "100%", objectFit: "contain" }}
              preview={false}
            />
          </div>
        }
        actions={[
          <Button 
            type="primary" 
            icon={<ShoppingCartOutlined />} 
            onClick={openFormCart}
            style={{ background: "#52c41a", borderColor: "#52c41a" }}
          >
            Thêm vào đơn
          </Button>
        ]}
      >
        <Space direction="vertical" size="small" style={{ width: "100%" }}>
          <Title level={5} ellipsis={{ tooltip: data.name }}>
            {trunCateText(data.name, 46)}
          </Title>
          
          <Space>
            <Text strong style={{ fontSize: "16px", color: "#f5222d" }}>
              {formatMoney(skuShow?.price)}đ
            </Text>
            {skuShow?.discount > 0 && (
              <Tag color="volcano">-{skuShow?.discount}%</Tag>
            )}
          </Space>
          
          {uniqueColors.length > 0 && (
            <div>
              <Text type="secondary">Màu sắc:</Text>
              <div style={{ display: "flex", gap: "4px", marginTop: "4px" }}>
                {uniqueColors.map((sku, index) => (
                  <Tooltip key={index} title={sku?.attributes?.color}>
                    <div
                      className={`${getColorStyle(sku?.attributes?.color)}`}
                      style={{ 
                        width: "20px", 
                        height: "20px", 
                        borderRadius: "50%", 
                        border: "1px solid #d9d9d9",
                        cursor: "pointer",
                        boxShadow: skuShow === sku ? "0 0 0 2px #1890ff" : "none"
                      }}
                      onMouseEnter={() => setSkuShow(sku)}
                    />
                  </Tooltip>
                ))}
              </div>
            </div>
          )}
          
          {uniqueSizes.length > 2 && (
            <Tag color="blue">
              {uniqueSizes.length} kích thước
            </Tag>
          )}
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Rate 
              disabled 
              defaultValue={data?.stars || 5} 
              allowHalf 
              style={{ fontSize: "14px" }} 
            />
            
            {data?.totalSold > 0 && (
              <Badge count={data?.totalSold} color="#faad14" overflowCount={999}>
                <Text type="secondary" style={{ padding: "0 8px" }}>Đã bán</Text>
              </Badge>
            )}
          </div>
        </Space>
      </Card>
    </>
  );
}

export default withBaseComponent(AddProductToOrder);
