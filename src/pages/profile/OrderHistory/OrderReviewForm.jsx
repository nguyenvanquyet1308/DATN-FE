import { 
  Button, 
  Input, 
  notification, 
  Progress, 
  Card, 
  Typography, 
  Rate, 
  Upload, 
  Space, 
  Divider, 
  Alert
} from "antd";
import { 
  CameraOutlined, 
  DeleteOutlined, 
  LoadingOutlined, 
  StarOutlined,
  CheckOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import TextArea from "antd/es/input/TextArea";
import logo from "assets/logo.png";
import useFileUpload from "hooks/useUpload";
import { useState } from "react";
import defaultPreviewImage from "assets/images/admin/defaultPreviewProduct.png";
import { createReview } from "apis/review.api";

const { Title, Text, Paragraph } = Typography;

function OrderReviewForm({ data, closeModal, fetchData }) {
  const [stars, setStars] = useState(5);
  const [review_text, setReviewText] = useState("");
  const { upload } = useFileUpload();
  const [uploadProgress, setUploadProgress] = useState([]);
  const [uploadUrls, setUploadUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const starDescriptions = {
    5: { text: "Tuyệt vời", color: "#52c41a" },
    4: { text: "Hài lòng", color: "#7cb305" },
    3: { text: "Bình thường", color: "#fadb14" },
    2: { text: "Không hài lòng", color: "#fa8c16" },
    1: { text: "Tệ", color: "#f5222d" }
  };

  const handleUpload = async (e) => {
    const filesReceived = e.target.files;

    if (filesReceived.length > 7) {
      notification.error({
        message: "Vượt quá số lượng cho phép",
        description: "Chỉ được chọn tối đa 7 ảnh!",
        placement: "top",
      });
      return;
    }

    setUploadUrls(new Array(filesReceived.length).fill(null));

    const uploadProgress = (percent, fileIndex) => {
      setUploadProgress((prevProgress) => {
        const newProgress = [...prevProgress];
        newProgress[fileIndex] = percent;
        return newProgress;
      });
    };

    const uploadPromises = [];

    for (let i = 0; i < filesReceived.length && i <= 7; i++) {
      uploadPromises.push(upload(filesReceived[i], uploadProgress, i));
    }

    const urls = await Promise.all(uploadPromises);

    setUploadUrls(urls);
    setUploadProgress([]);
  };

  const ImageUploadPreview = ({ src, index }) => {
    return (
      <div className="relative rounded-lg overflow-hidden border border-gray-200">
        <Button
          type="text" 
          danger
          icon={<DeleteOutlined />}
          size="small"
          className="absolute top-0 right-0 bg-white shadow-sm"
          onClick={() => setUploadUrls((prev) => prev.filter((el) => el !== src))}
        />

        <div className="h-20 w-24">
          <img
            src={src || defaultPreviewImage}
            alt="Uploaded preview"
            className="w-full h-full object-cover"
          />
        </div>
        
        {uploadProgress[index] !== undefined && uploadProgress[index] > 0 && (
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Progress
              type="circle"
              percent={uploadProgress[index]}
              size={32}
              strokeColor="#1890ff"
            />
          </div>
        )}
      </div>
    );
  };

  const handleSubmitReview = async () => {
    if (!review_text.trim()) {
      notification.warning({
        message: "Nội dung đánh giá trống",
        description: "Vui lòng nhập nội dung đánh giá",
        placement: "top",
      });
      return;
    }

    setIsLoading(true);
    try {
      await createReview({
        detailOrderId: data.id,
        productId: data.productId,
        review_text,
        rating: stars,
        ...(uploadUrls.length > 0 && { images: uploadUrls.join(",") }),
      });
      notification.success({
        message: "Đánh giá thành công",
        description: "Cảm ơn bạn đã đánh giá sản phẩm.",
        placement: "top",
      });
      closeModal();
      fetchData();
    } catch (error) {
      notification.error({
        message: "Lỗi khi gửi đánh giá",
        description: error.message || "Vui lòng thử lại sau.",
        placement: "top",
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="review-form-container">
      <Alert
        message="Đánh giá của bạn rất quan trọng"
        description="Chúng tôi cần đánh giá của bạn để cải thiện chất lượng dịch vụ và sản phẩm"
        type="info"
        showIcon
        className="mb-6"
        icon={<img src={logo} alt="Logo" className="h-6 w-6" />}
      />
      
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Sản phẩm thông tin */}
          <div className="flex-shrink-0">
            <img
              src={data?.sku?.images?.split(",")[0]}
              alt={data?.productName}
              className="w-28 h-28 object-cover rounded-md border border-gray-200"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <Title level={4} className="mb-1">{data?.productName}</Title>
            
            {Object.values(data?.sku?.attributes || {}).length > 0 && (
              <div>
                <Text type="secondary">Phân loại: </Text>
                <Space>
                  {Object.values(data?.sku?.attributes || {}).map((attr, index) => (
                    <span key={index} className="text-blue-600">
                      {attr}
                      {index < Object.values(data?.sku?.attributes).length - 1 && " | "}
                    </span>
                  ))}
                </Space>
              </div>
            )}
          </div>
        </div>
      </Card>

      <Card className="mb-6">
        <div className="text-center mb-4">
          <Title level={5}>Đánh giá chất lượng sản phẩm</Title>
          <div className="flex justify-center mt-2">
            <Rate
              value={stars}
              onChange={setStars}
              character={<StarOutlined />}
              className="text-3xl"
            />
          </div>
          <Text strong style={{ color: starDescriptions[stars]?.color }} className="text-xl mt-2 block">
            {starDescriptions[stars]?.text}
          </Text>
        </div>
        
        <Divider />
        
        <div className="mb-4">
          <TextArea
            rows={5}
            value={review_text}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Hãy chia sẻ những điều bạn thích về sản phẩm này với những người mua khác..."
            className="text-base"
            showCount
            maxLength={500}
          />
        </div>
        
        <div className="mb-4">
          <Title level={5} className="mb-3">
            <CameraOutlined className="mr-2" /> Thêm hình ảnh (tối đa 7 ảnh)
          </Title>
          <div className="flex flex-wrap gap-3">
            {uploadUrls.length > 0 && uploadUrls.map((link, index) => (
              <ImageUploadPreview key={index} src={link} index={index} />
            ))}
            
            {uploadUrls.length < 7 && (
              <Upload
                accept="image/*"
                showUploadList={false}
                beforeUpload={() => false}
                fileList={[]}
                onChange={(e) => handleUpload(e.target)}
                className="flex-shrink-0"
              >
                <div className="border border-dashed border-gray-300 rounded-md p-3 h-20 w-24 flex flex-col items-center justify-center hover:border-blue-500 cursor-pointer transition-all">
                  <CameraOutlined className="text-xl mb-1" />
                  <span className="text-xs text-gray-500">Thêm ảnh</span>
                </div>
              </Upload>
            )}
          </div>
        </div>
      </Card>

      <div className="flex justify-end gap-3">
        <Button
          size="large"
          icon={<ArrowLeftOutlined />}
          onClick={() => closeModal()}
        >
          Quay lại
        </Button>
        <Button
          type="primary"
          size="large"
          icon={isLoading ? <LoadingOutlined /> : <CheckOutlined />}
          loading={isLoading}
          onClick={() => handleSubmitReview()}
        >
          {isLoading ? "Đang gửi..." : "Gửi đánh giá"}
        </Button>
      </div>
    </div>
  );
}

export default OrderReviewForm;
