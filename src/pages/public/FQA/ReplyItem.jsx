import { faker } from "@faker-js/faker";
import moment from "moment";
import renderReply from "./renderReply";
import { useState } from "react";
import { 
  notification, 
  Progress, 
  Tooltip, 
  Button, 
  Typography, 
  Avatar, 
  Input, 
  Card, 
  Space, 
  Divider, 
  Image 
} from "antd";
import {
  DeleteOutlined,
  CameraOutlined,
  SendOutlined,
  UserOutlined,
  CloseOutlined,
  CommentOutlined,
  MessageOutlined
} from '@ant-design/icons';
import useFileUpload from "hooks/useUpload";
import defaultPreviewImage from "assets/images/admin/defaultPreviewProduct.png";
import { replyQuestion } from "apis/replyQuestion.api";
import { useSelector } from "react-redux";

const { Text, Paragraph } = Typography;
const { TextArea } = Input;

function ReplyItem({ data, questionData, replyTo }) {
  const { isLogged, userInfo } = useSelector((state) => state.auth);
  const [isShowCommentPanel, setIsShowCommentPanel] = useState(false);
  const [uploadProgress, setUploadProgress] = useState([]);
  const { upload } = useFileUpload();
  const [uploadUrls, setUploadUrls] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [isReplyLoading, setIsReplyLoading] = useState(false);

  const handleReply = async () => {
    if (!replyText && uploadUrls.length === 0) {
      notification.warning({
        message: "Vui lòng nhập hoặc tải ảnh cho bình luận",
        duration: 1,
        placement: "top",
      });
      return;
    }

    setIsReplyLoading(true);
    try {
      const res = await replyQuestion({
        replyText,
        images: uploadUrls.join(","),
        questionId: questionData.id,
        parentId: data.id,
      });

      if (Array.isArray(data.childReplies))
        data.childReplies = [...data.childReplies, res.result];
      else {
        data.childReplies = [res.result];
      }

      notification.success({
        message: "Cảm ơn góp ý của bạn",
        duration: 1,
        placement: "top",
      });

      setUploadProgress([]);
      setReplyText("");
      setUploadUrls([]);
      setIsShowCommentPanel(false);
    } catch (error) {
      notification.warning({
        message: error.message,
        duration: 1,
        placement: "top",
      });
    }

    setTimeout(() => {
      setIsReplyLoading(false);
    }, 1000);
  };

  const ImageUploadPreview = ({ src, index }) => {
    return (
      <div className="relative rounded overflow-hidden border border-gray-200">
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          size="small"
          className="absolute top-0 right-0 bg-white shadow-sm z-10"
          onClick={() => setUploadUrls((prev) => prev.filter((el) => el !== src))}
        />
        <img
          src={src || defaultPreviewImage}
          alt={src}
          className="w-20 h-20 object-cover"
        />
        {uploadProgress[index] !== undefined && uploadProgress[index] > 0 && (
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-40 flex items-center justify-center transition-all duration-300">
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

  const handleUpload = async (e) => {
    const filesReceived = e.target.files;

    if (filesReceived.length > 7) {
      notification.error({
        message: "Chỉ chọn tối đa 7 ảnh!",
        placement: "top"
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

  return (
    <div
      className={`mb-3 ${
        replyTo
          ? "pl-4 border-l-2 border-blue-100"
          : ""
      }`}
    >
      <Card 
        size="small" 
        className="w-full"
        bordered={!replyTo}
      >
        <div className="flex items-center gap-2 mb-2">
          <Avatar
            src={data?.postBy?.avatar || faker.image.avatar()}
            size={replyTo ? "small" : "default"}
            icon={<UserOutlined />}
          />
          <div>
            <Text strong className="block">
              {userInfo?.data?.id === data?.postBy?.id
                ? "Bạn"
                : data?.postBy?.username}
            </Text>
            <Text type="secondary" className="text-xs">
              {moment(data?.createdAt).fromNow()}
            </Text>
          </div>
        </div>
        
        <div className="ml-8">
          {replyTo && userInfo.data.id !== data?.postBy?.id && (
            <Text strong className="text-blue-600">@{replyTo.postBy.username} </Text>
          )}
          <Paragraph>{data?.replyText}</Paragraph>
          
          {data?.images?.length > 0 && (
            <div className="mt-2">
              <Image.PreviewGroup>
                <div className="flex flex-wrap gap-2">
                  {data?.images?.split(",").map((img, index) => (
                    <div key={index} className="w-16 h-16 overflow-hidden rounded border border-gray-200">
                      <Image
                        src={img}
                        alt={`Reply image ${index}`}
                        className="object-cover"
                        style={{ width: '100%', height: '100%' }}
                      />
                    </div>
                  ))}
                </div>
              </Image.PreviewGroup>
            </div>
          )}
          
          <div className="flex justify-end mt-2">
            <Button
              type="text"
              size="small"
              icon={isShowCommentPanel ? <CloseOutlined /> : <MessageOutlined />}
              onClick={() => {
                if (!isLogged) {
                  notification.warning({
                    message: "Vui lòng đăng nhập để trả lời",
                    duration: 1,
                    placement: "top",
                  });
                  return;
                }
                setIsShowCommentPanel(!isShowCommentPanel);
                setUploadUrls([]);
                setReplyText("");
              }}
            >
              {isShowCommentPanel ? "Hủy" : "Trả lời"}
            </Button>
          </div>
        </div>
      </Card>
      
      {isShowCommentPanel && (
        <div className="ml-8 mt-3">
          <div className="flex gap-3">
            <Avatar
              src={userInfo?.data?.avatar || faker.image.avatar()}
              size="small"
              icon={<UserOutlined />}
            />
            <div className="flex-1">
              <TextArea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Nhập câu trả lời của bạn..."
                autoSize={{ minRows: 2, maxRows: 4 }}
                className="mb-3"
              />
              
              {uploadUrls.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-3 border-t border-b py-3 bg-gray-50">
                  {uploadUrls.map((link, index) => (
                    <ImageUploadPreview key={index} src={link} index={index} />
                  ))}
                </div>
              )}
              
              <div className="flex justify-between">
                <div>
                  <input
                    id={`file-input-reply-${data.id}`}
                    className="hidden"
                    onChange={(e) => handleUpload(e)}
                    multiple
                    type="file"
                    accept="image/*"
                  />
                  <Tooltip title="Tải ảnh lên">
                    <Button 
                      icon={<CameraOutlined />}
                      size="small"
                      onClick={() => document.getElementById(`file-input-reply-${data.id}`).click()}
                    >
                      Thêm ảnh
                    </Button>
                  </Tooltip>
                </div>
                
                <Button 
                  type="primary" 
                  icon={<SendOutlined />}
                  size="small"
                  onClick={handleReply}
                  loading={isReplyLoading}
                >
                  Gửi trả lời
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {data?.childReplies && data.childReplies.length > 0 && (
        <div className="mt-3 ml-6">
          {renderReply(data?.childReplies, questionData, data)}
        </div>
      )}
    </div>
  );
}

export default ReplyItem;
