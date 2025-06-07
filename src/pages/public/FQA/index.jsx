import { 
  notification, 
  Progress, 
  Skeleton, 
  Tooltip, 
  Typography, 
  Card, 
  Input, 
  Button, 
  Divider,
  Avatar, 
  Row, 
  Col,
  Empty,
  Space,
  Badge
} from "antd";
import {
  CameraOutlined,
  DeleteOutlined,
  SendOutlined,
  CloudUploadOutlined,
  SearchOutlined,
  TrophyOutlined,
  CommentOutlined,
  UserOutlined
} from '@ant-design/icons';
import { createQuestion, getQuestions } from "apis/question.api";
import React, { useEffect, useMemo, useState } from "react";
import { faker } from "@faker-js/faker";
import defaultPreviewImage from "assets/images/admin/defaultPreviewProduct.png";
import moment from "moment";
import "moment/locale/vi";
import Question from "./Question";
import { useSelector } from "react-redux";
import Icons from "utils/icons";
import useFileUpload from "hooks/useUpload";
import { HashLoader } from "react-spinners";
import { getTopReactUsers } from "apis/user.api";
import Pagination from "pages/admin/components/Pagination";

moment.locale("vi");

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

function FAQ() {
  const [question, setQuestion] = useState();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [indexShowComment, setIndexShowComment] = useState();
  const [loadingData, setLoadingData] = useState({ question: false });
  const [uploadUrls, setUploadUrls] = useState([]);
  const { upload } = useFileUpload();
  const [uploadProgress, setUploadProgress] = useState([]);
  const [questionText, setQuestionText] = useState("");
  const [topReactUsers, setTopReactUsers] = useState([]);

  useEffect(() => {
    fetchQuestions();
  }, [page, limit]);

  useEffect(() => {
    fetchQuestions();
    fetchTopReactUsers();
  }, []);

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

  const handleUploadImageQuestion = async (e) => {
    const filesReceived = e.target.files;

    if (filesReceived.length > 7) {
      notification.error({
        message: "Chỉ chọn tối đa 7 ảnh!",
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

  const fetchQuestions = async () => {
    setLoadingData((prev) => ({ ...prev, question: true }));
    try {
      const params = { page, limit };
      const res = await getQuestions(params);
      setQuestion(res.result);
    } catch (error) {
      notification.warning({
        message: error.message,
        duration: 2,
        placement: "top"
      });
    }
    setLoadingData((prev) => ({ ...prev, question: false }));
  };

  const fetchTopReactUsers = async () => {
    setLoadingData((prev) => ({ ...prev, topUser: true }));
    try {
      const res = await getTopReactUsers();
      setTopReactUsers(res);
    } catch (error) {
      notification.warning({
        message: error.message,
        duration: 2,
        placement: "top"
      });
    }
    setLoadingData((prev) => ({ ...prev, topUser: false }));
  };

  const topQuestionUserPanel = useMemo(
    () => (
      <Col xs={24} lg={6}>
        <Card
          title={
            <Space>
              <TrophyOutlined className="text-yellow-500" /> 
              <Text strong>Top người dùng tương tác</Text>
            </Space>
          }
          className="sticky top-20"
          bordered={false}
          style={{ height: 'fit-content' }}
        >
          {loadingData.topUser ? (
            <Skeleton active avatar paragraph={{ rows: 5 }} />
          ) : (
            <div className="space-y-5">
              {topReactUsers.map((user, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Badge count={index + 1} color={index < 3 ? "gold" : "blue"} offset={[-8, 36]}>
                    <Avatar 
                      src={user.avatar || faker.image.avatar()} 
                      size={42}
                      icon={<UserOutlined />}
                    />
                  </Badge>
                  <div>
                    <Text strong className="block">
                      {user.username || user.email.split("@")[0]}
                    </Text>
                    <Text type="secondary" className="text-xs">
                      {Math.floor(Math.random() * 100) + 5} câu hỏi
                    </Text>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </Col>
    ),
    [loadingData.topUser, topReactUsers],
  );

  const handleCreateQuestion = async () => {
    if (!questionText && uploadUrls.length === 0) {
      notification.warning({
        message: "Vui lòng nhập hoặc tải ảnh cho bình luận",
        duration: 1,
        placement: "top",
      });
      return;
    }
    try {
      const res = await createQuestion({
        questionText,
        images: uploadUrls.join(","),
      });

      setQuestion((prev) => ({
        ...prev,
        content: [
          ...prev?.content,
          { ...res.result, replies: [], reactions: [] },
        ],
      }));

      notification.success({
        message: "Cảm ơn góp ý của bạn",
        duration: 1,
        placement: "top",
      });

      setUploadProgress([]);
      setQuestionText("");
      setUploadUrls([]);
    } catch (error) {
      notification.warning({
        message: error.message,
        duration: 1,
        placement: "top",
      });
    }
  };

  const questionRender = useMemo(
    () => (
      <Col xs={24} lg={18}>
        <Card bordered={false} className="mb-4">
          <div className="flex gap-3 mb-2">
            <Avatar src={faker.image.avatar()} />
            <div className="flex-1">
              <TextArea
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="Bạn đang thắc mắc điều gì, đăng câu hỏi ngay..."
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
                    id="file-input-question"
                    className="hidden"
                    multiple
                    type="file"
                    onChange={(e) => handleUploadImageQuestion(e)}
                    accept="image/*"
                  />
                  <Tooltip title="Tải ảnh lên">
                    <Button 
                      icon={<CameraOutlined />}
                      onClick={() => document.getElementById('file-input-question').click()}
                    >
                      Thêm ảnh
                    </Button>
                  </Tooltip>
                </div>
                
                <Button 
                  type="primary" 
                  icon={<SendOutlined />}
                  onClick={handleCreateQuestion}
                >
                  Gửi câu hỏi
                </Button>
              </div>
            </div>
          </div>
        </Card>
        
        <Divider orientation="left">
          <Space>
            <CommentOutlined />
            <span>Danh sách câu hỏi</span>
          </Space>
        </Divider>
        
        {loadingData.question ? (
          <div className="flex justify-center py-10">
            <HashLoader size={60} color="#1890ff" />
          </div>
        ) : question?.content?.length === 0 ? (
          <Empty 
            description="Chưa có câu hỏi nào" 
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <div className="space-y-4">
            {question?.content
              ?.sort(
                (a, b) =>
                  new Date(b.updatedAt).getTime() -
                  new Date(a.updatedAt).getTime(),
              )
              .map((el, index) => (
                <Question
                  key={el.id}
                  data={el}
                  index={index}
                  indexShowComment={indexShowComment}
                  setIndexShowComment={setIndexShowComment}
                  setData={(data) => {
                    setQuestion((prevData) => {
                      const updatedContent = [...prevData.content];
                      updatedContent[index] = data;
                      return {
                        ...prevData,
                        content: updatedContent,
                      };
                    });
                  }}
                />
              ))}
          </div>
        )}
        
        {question && question.content?.length > 0 && (
          <div className="flex justify-end mt-6">
            <Pagination
              listLimit={[10, 25, 40, 100]}
              limitCurrent={limit}
              setLimit={setLimit}
              totalPages={question?.totalPages}
              setPage={setPage}
              pageCurrent={page}
              totalElements={question?.totalElements}
            />
          </div>
        )}
      </Col>
    ),
    [
      question,
      indexShowComment,
      setIndexShowComment,
      questionText,
      uploadUrls,
      loadingData.question,
    ],
  );

  return (
    <div className="bg-gray-50 min-h-screen py-6 px-4">
      <div className="max-w-7xl mx-auto">
        <Title level={2} className="text-center mb-8">
          Hỏi đáp cộng đồng
        </Title>
        
        <Row gutter={[24, 24]}>
          {topQuestionUserPanel}
          {questionRender}
        </Row>
      </div>
    </div>
  );
}

export default FAQ;
