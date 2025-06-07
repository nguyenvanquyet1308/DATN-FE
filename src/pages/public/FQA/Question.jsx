import { faker } from "@faker-js/faker";
import { 
  notification, 
  Progress, 
  Tooltip, 
  Card, 
  Button, 
  Tag, 
  Avatar, 
  Typography, 
  Divider, 
  Input, 
  Space,
  Image
} from "antd";
import {
  CameraOutlined,
  DeleteOutlined,
  SendOutlined,
  LikeOutlined, 
  LikeFilled,
  DislikeOutlined, 
  DislikeFilled, 
  SmileOutlined,
  HeartOutlined,
  HeartFilled,
  CommentOutlined,
  MoreOutlined,
  FireOutlined,
  UserOutlined
} from '@ant-design/icons';
import TextArea from "antd/es/input/TextArea";
import useFileUpload from "hooks/useUpload";
import defaultPreviewImage from "assets/images/admin/defaultPreviewProduct.png";
import moment from "moment";
import "moment/locale/vi";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { replyQuestion } from "apis/replyQuestion.api";
import {
  createReactQuestion,
  updateReactQuestion,
} from "apis/reactQuestion.api";
import ReplyItem from "./ReplyItem";
import renderReply from "./renderReply";
moment.locale("vi");

const { Title, Text, Paragraph } = Typography;

function Question({
  data,
  indexShowComment,
  index,
  setIndexShowComment,
  setData,
}) {
  const [reactions, setReactions] = useState({});
  const [commentText, setCommentText] = useState("");
  const { isLogged, userInfo } = useSelector((state) => state.auth);
  const { upload } = useFileUpload();
  const [uploadProgress, setUploadProgress] = useState([]);
  const [uploadUrls, setUploadUrls] = useState([]);
  const [loadingData, setLoadingData] = useState({
    comment: false,
    reaction: null,
  });
  const [userReacted, setUserReacted] = useState(null);

  const handleComment = async () => {
    if (!commentText && uploadUrls.length === 0) {
      notification.warning({
        message: "Vui lòng nhập hoặc tải ảnh cho bình luận",
        duration: 1,
        placement: "top",
      });
      return;
    }

    setLoadingData((prev) => ({ ...prev, comment: true }));
    try {
      const res = await replyQuestion({
        replyText: commentText,
        images: uploadUrls.join(","),
        questionId: data.id,
      });
      notification.success({
        message: "Cảm ơn góp ý của bạn",
        duration: 1,
        placement: "top",
      });

      if (Array.isArray(data.replies))
        setData({ ...data, replies: [...data.replies, res.result] });
      else {
        setData({
          ...data,
          replies: [res.result],
        });
      }

      setUploadProgress([]);
      setCommentText("");
      setUploadUrls([]);
    } catch (error) {
      notification.warning({
        message: error.message,
        duration: 1,
        placement: "top",
      });
    }

    setLoadingData((prev) => ({ ...prev, comment: false }));
  };

  const handleReactQuestion = async (reactionType) => {
    if (
      loadingData["reaction"] === reactionType ||
      userReacted?.reactionType === reactionType
    )
      return;

    if (!isLogged) {
      notification.warning({
        message: "Vui lòng đăng nhập để thả cảm xúc...",
        duration: 1,
        placement: "top",
      });
      return;
    }

    setLoadingData((prev) => ({ ...prev, reaction: reactionType }));
    try {
      let res = null;

      if (!!userReacted && userReacted?.reactionType !== reactionType) {
        res = await updateReactQuestion(userReacted?.id, {
          reactionType,
          questionId: data.id,
        });

        setData({
          ...data,
          reactions: data.reactions?.map((el) =>
            el.id === res.result.id ? res.result : el,
          ),
        });
      } else {
        res = await createReactQuestion({
          reactionType,
          questionId: data.id,
        });

        if (Array.isArray(data.reactions))
          setData({
            ...data,
            reactions: [...data.reactions, res.result],
          });
        else {
          setData({
            ...data,
            reactions: [res.result],
          });
        }
      }

      notification.success({
        message: "Cảm ơn tương tác của bạn",
        duration: 1,
        placement: "top",
      });
    } catch (error) {
      notification.warning({
        message: error.message,
        duration: 1,
        placement: "top",
      });
    }

    setLoadingData((prev) => ({ ...prev, reaction: null }));
  };

  useEffect(() => {
    setReactions([]);
    setUserReacted(null);
    if (data?.reactions?.length >= 1) {
      const filterReacts = {};
      data.reactions.forEach((react) => {
        if (react?.postBy?.id === userInfo.data?.id) setUserReacted(react);

        if (filterReacts[react.reactionType]) {
          filterReacts[react.reactionType] = [
            ...filterReacts[react.reactionType],
            react,
          ];
        } else {
          filterReacts[react.reactionType] = [react];
        }
      });
      setReactions(filterReacts);
    }
  }, [data]);

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
          className="w-24 h-20 object-cover"
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

    for (let i = 0, j = index; i < filesReceived.length && j <= 7; i++, j++) {
      uploadPromises.push(upload(filesReceived[i], uploadProgress, j));
    }

    const urls = await Promise.all(uploadPromises);

    setUploadUrls(urls);
    setUploadProgress([]);
  };

  const renderReactionButton = (type, icon, activeIcon, color, count) => {
    const isActive = userReacted?.reactionType === type;
    const Icon = isActive ? activeIcon : icon;
    
    return (
      <Button
        type={isActive ? "primary" : "default"}
        ghost={isActive}
        icon={<Icon />}
        size="small"
        loading={loadingData.reaction === type}
        onClick={() => handleReactQuestion(type)}
        style={isActive ? { borderColor: color, color } : {}}
      >
        {count || ""}
      </Button>
    );
  };

  return (
    <Card hoverable className="overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar 
            src={data?.postBy?.avatar || faker.image.avatar()}
            icon={<UserOutlined />}
            size="large"
          />
          <div>
            <Text strong className="block">
              {userInfo?.data?.id === data?.postBy?.id
                ? "Bạn"
                : data?.postBy?.username || "Người dùng"}
            </Text>
            <Text type="secondary" className="text-xs">
              {moment(data?.createdAt).fromNow()}
            </Text>
          </div>
        </div>
        <Button type="text" icon={<MoreOutlined />} />
      </div>
      
      <div className="mb-4">
        <Paragraph>{data?.questionText}</Paragraph>
        
        {data?.images?.length > 0 && (
          <div className="mt-2">
            <Image.PreviewGroup>
              <div className="flex flex-wrap gap-2">
                {data?.images?.split(",").map((img, imgIndex) => (
                  <div key={imgIndex} className="w-24 h-24 overflow-hidden rounded border border-gray-200">
                    <Image
                      src={img}
                      alt={`Question image ${imgIndex}`}
                      className="object-cover"
                      style={{ width: '100%', height: '100%' }}
                    />
                  </div>
                ))}
              </div>
            </Image.PreviewGroup>
          </div>
        )}
      </div>
      
      <div className="flex flex-wrap items-center gap-2 my-3">
        <Space.Compact>
          {renderReactionButton(
            "like",
            LikeOutlined,
            LikeFilled,
            "#1890ff",
            reactions.like?.length || ""
          )}
          
          {renderReactionButton(
            "dislike",
            DislikeOutlined,
            DislikeFilled,
            "#ff4d4f",
            reactions.dislike?.length || ""
          )}
          
          {renderReactionButton(
            "heart",
            HeartOutlined,
            HeartFilled,
            "#eb2f96",
            reactions.heart?.length || ""
          )}
          
          {renderReactionButton(
            "smile",
            SmileOutlined,
            SmileOutlined,
            "#faad14",
            reactions.smile?.length || ""
          )}
        </Space.Compact>
        
        <Button
          type={indexShowComment === index ? "primary" : "default"}
          icon={<CommentOutlined />}
          size="small"
          onClick={() => setIndexShowComment(indexShowComment === index ? null : index)}
        >
          {data?.replies?.length || ""} Trả lời
        </Button>
      </div>
      
      {indexShowComment === index && (
        <div className="mt-4 border-t pt-4">
          <div className="flex gap-3 mb-4">
            <Avatar src={faker.image.avatar()} icon={<UserOutlined />} />
            <div className="flex-1">
              <TextArea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Nhập câu trả lời của bạn..."
                autoSize={{ minRows: 2, maxRows: 6 }}
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
                    id={`file-input-comment-${data.id}`}
                    className="hidden"
                    onChange={(e) => handleUpload(e)}
                    multiple
                    type="file"
                    accept="image/*"
                  />
                  <Tooltip title="Tải ảnh lên">
                    <Button 
                      icon={<CameraOutlined />}
                      onClick={() => document.getElementById(`file-input-comment-${data.id}`).click()}
                    >
                      Thêm ảnh
                    </Button>
                  </Tooltip>
                </div>
                
                <Button 
                  type="primary" 
                  icon={<SendOutlined />}
                  onClick={handleComment}
                  loading={loadingData.comment}
                >
                  Gửi trả lời
                </Button>
              </div>
            </div>
          </div>
          
          {data?.replies?.length > 0 && (
            <div className="ml-3 border-l-2 border-blue-100 pl-4 space-y-4">
              {renderReply(data?.replies, data)}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

export default Question;
