import { Avatar, Button, Card, Divider, Empty, Form, Input, List, Popover, notification, Typography } from "antd";
import {
  createComment,
  createReply,
  deleteComment,
  deleteReply,
  getCommentsByBlogId,
  putComment,
  putReply,
} from "apis/commentBlog.api";
import withBaseComponent from "hocs";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { changeLoading } from "store/slicers/common.slicer";
import img from "assets/images/AvatarDefault.jpg";
import Icons from "utils/icons";
import EmojiPicker from "emoji-picker-react";
import { SmileOutlined, SendOutlined, SettingOutlined, EditOutlined, DeleteOutlined, WarningOutlined, CommentOutlined } from "@ant-design/icons";

const { TextArea } = Input;
const { Title, Text } = Typography;

// Tự tạo component Comment vì Ant Design không export Comment
const CustomComment = ({ author, avatar, content, datetime, actions, children }) => {
  return (
    <div className="ant-comment">
      <div className="ant-comment-inner">
        <div className="ant-comment-avatar">
          {avatar}
        </div>
        <div className="ant-comment-content">
          <div className="ant-comment-content-author">
            <span className="ant-comment-content-author-name">{author}</span>
            <span className="ant-comment-content-author-time">{datetime}</span>
          </div>
          <div className="ant-comment-content-detail">{content}</div>
          {actions && actions.length > 0 && (
            <ul className="ant-comment-actions">
              {actions.map((action, index) => (
                <li key={`action-${index}`}>{action}</li>
              ))}
            </ul>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};

const CommentBlog = ({ checkLoginBeforeAction }) => {
  const { blogId } = useParams();
  const userInfo = useSelector((state) => state.auth.userInfo.data);
  const dispatch = useDispatch();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyContent, setReplyContent] = useState({});
  const [replyToReplyContent, setReplyToReplyContent] = useState({});
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeReplyDropdown, setActiveReplyDropdown] = useState(null);
  const [editCommentId, setEditCommentId] = useState(null);
  const [editedComment, setEditedComment] = useState("");
  const [editReplyId, setEditReplyId] = useState(null);
  const [editedReply, setEditedReply] = useState("");

  const handleEmojiClick = (emojiObject, event) => {
    if (emojiObject?.emoji) {
      setNewComment((prevComment) => prevComment + emojiObject.emoji);
    }
  };
  
  const handleEditCommentClick = (commentId) => {
    if (editCommentId === commentId) {
      setEditCommentId(null);
    } else {
      setEditCommentId(commentId);
    }
  };
  
  const handleEditReplyClick = (ReplyId) => {
    if (editReplyId === ReplyId) {
      setEditReplyId(null);
    } else {
      setEditReplyId(ReplyId);
    }
  };
  
  const handleUpdateComment = async (CommentId) => {
    dispatch(changeLoading());
    try {
      await putComment(CommentId, editedComment);
      setEditedComment("");
      setEditCommentId(null);
      notification.success({ message: "Cập nhật bình luận thành công", placement: "top" });
      fetchComments(blogId);
    } catch (error) {
      console.log("Lỗi khi trả lời comment: ", error);
    }
    dispatch(changeLoading());
  };
  
  const handleUpdateReply = async (ReplyId) => {
    dispatch(changeLoading());
    try {
      await putReply(ReplyId, editedReply);
      setEditedReply("");
      setEditReplyId(null);
      notification.success({ message: "Cập nhật bình luận thành công", placement: "top" });
      fetchComments(blogId);
    } catch (error) {
      console.log("Lỗi khi trả lời comment: ", error);
    }
    dispatch(changeLoading());
  };
  
  const toggleDropdown = (commentId) => {
    if (activeDropdown === commentId) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(commentId);
    }
  };

  const toggleReplyDropdown = (replyId) => {
    if (activeReplyDropdown === replyId) {
      setActiveReplyDropdown(null);
    } else {
      setActiveReplyDropdown(replyId);
    }
  };

  const fetchComments = async (blogId) => {
    try {
      const res = await getCommentsByBlogId(blogId);
      setComments(res);
    } catch (error) {
      console.log("Không thể lấy comment của blog đó: ", error);
    }
  };

  const handleCreateComment = async (blogId) => {
    if (newComment.length < 1) {
      return notification.warning({
        message: "Vui lòng điền bình luận của bạn!",
        placement: "top"
      });
    }
    if (newComment.length > 500) {
      return notification.warning({ 
        message: "Bình luận của bạn quá dài!",
        placement: "top" 
      });
    }
    dispatch(changeLoading());
    try {
      await createComment({
        content: newComment,
        blogId: blogId,
        userId: userInfo.id,
      });
      setNewComment("");
      fetchComments(blogId);
      notification.success({ 
        message: "Bình luận thành công!",
        placement: "top" 
      });
    } catch (error) {
      console.log("Lỗi khi tạo comment: ", error);
    }
    dispatch(changeLoading());
  };

  const handleReply = async (parentCommentId) => {
    if (replyContent.length < 1) {
      return notification.warning({
        message: "Vui lòng điền bình luận của bạn!",
        placement: "top"
      });
    }
    if (replyContent.length > 500) {
      return notification.warning({ 
        message: "Bình luận của bạn quá dài!",
        placement: "top" 
      });
    }
    dispatch(changeLoading());
    try {
      await createReply({
        content: replyContent[parentCommentId],
        commentId: parentCommentId,
        userId: userInfo.id,
      });
      setReplyContent((prev) => ({ ...prev, [parentCommentId]: "" }));
      notification.success({
        message: "Bạn đã trả lời bình luận thành công!",
        placement: "top",
      });
      fetchComments(blogId);
    } catch (error) {
      console.log("Lỗi khi trả lời comment: ", error);
    }
    dispatch(changeLoading());
  };

  const handleReplyToReply = async (commentId, ReplyId) => {
    if (replyToReplyContent.length < 1) {
      return notification.warning({
        message: "Vui lòng điền bình luận của bạn!",
        placement: "top"
      });
    }
    if (replyToReplyContent.length > 500) {
      return notification.warning({ 
        message: "Bình luận của bạn quá dài!",
        placement: "top" 
      });
    }
    dispatch(changeLoading());
    try {
      await createReply({
        content: replyToReplyContent[ReplyId],
        commentId: commentId,
        userId: userInfo.id,
        parentReplyId: ReplyId,
      });
      setReplyToReplyContent((prev) => ({ ...prev, [ReplyId]: "" }));
      notification.success({
        message: "Bạn đã trả lời bình luận thành công!",
        placement: "top",
      });
      fetchComments(blogId);
    } catch (error) {
      console.log("Lỗi khi trả lời comment: ", error);
    }
    dispatch(changeLoading());
  };

  const handleRemoveComment = async (commentId) => {
    dispatch(changeLoading());
    try {
      await deleteComment(commentId);
      fetchComments(blogId);
      notification.success({ 
        message: "Xóa bình luận thành công!",
        placement: "top" 
      });
    } catch (error) {
      console.log("Lỗi khi xóa bình luận: ", error);
    }
    dispatch(changeLoading());
  };
  
  const handleRemoveReplyComment = async (replyId) => {
    dispatch(changeLoading());
    try {
      await deleteReply(replyId);
      fetchComments(blogId);
      notification.success({ 
        message: "Xóa bình luận thành công!",
        placement: "top" 
      });
    } catch (error) {
      console.log("Lỗi khi xóa bình luận: ", error);
    }
    dispatch(changeLoading());
  };

  useEffect(() => {
    fetchComments(blogId);
  }, [blogId]);

  useEffect(() => {
    console.log("Dữ liệu comment: ", comments);
  }, [comments]);

  // Tạo menu cho dropdown của comment
  const getCommentActions = (comment) => {
    const menu = [];
    if (userInfo && comment.user_id === userInfo.id) {
      menu.push({
        key: 'edit',
        label: 'Chỉnh sửa',
        icon: <EditOutlined />,
        onClick: () => handleEditCommentClick(comment.commentId)
      });
      menu.push({
        key: 'delete',
        label: 'Xóa',
        icon: <DeleteOutlined />,
        onClick: () => handleRemoveComment(comment.commentId),
        danger: true
      });
    }
    menu.push({
      key: 'report',
      label: 'Báo cáo',
      icon: <WarningOutlined />,
      onClick: () => {}
    });
    return menu;
  };

  // Tạo menu cho dropdown của reply
  const getReplyActions = (reply) => {
    const menu = [];
    if (userInfo && reply.user_id === userInfo.id) {
      menu.push({
        key: 'edit',
        label: 'Chỉnh sửa',
        icon: <EditOutlined />,
        onClick: () => handleEditReplyClick(reply.replyId)
      });
      menu.push({
        key: 'delete',
        label: 'Xóa',
        icon: <DeleteOutlined />,
        onClick: () => handleRemoveReplyComment(reply.replyId),
        danger: true
      });
    }
    menu.push({
      key: 'report',
      label: 'Báo cáo',
      icon: <WarningOutlined />,
      onClick: () => {}
    });
    return menu;
  };

  return (
    <div className="comment-blog-section py-8">
      <Card bordered={false} className="comment-container max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Title level={4} className="m-0">
            <CommentOutlined className="mr-2" />
            Bình luận ({comments.length})
          </Title>
        </div>
        
        <Form className="mb-6">
          <div className="relative">
            <TextArea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Nhập bình luận của bạn..."
              autoSize={{ minRows: 3, maxRows: 6 }}
              className="rounded-lg transition-all"
              maxLength={500}
              showCount
            />
            <Button
              type="text"
              shape="circle"
              icon={<SmileOutlined />}
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="absolute right-2 bottom-2"
            />
          </div>
          
          {showEmojiPicker && (
            <div className="relative z-10 mt-2">
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                pickerStyle={{ width: '100%' }}
              />
            </div>
          )}
          
          <Button
            onClick={() => checkLoginBeforeAction(() => handleCreateComment(blogId))}
            type="primary"
            icon={<SendOutlined />}
            className="mt-3"
          >
            Gửi bình luận
          </Button>
        </Form>
        
        <Divider />
        
        <List
          className="comment-list"
          itemLayout="horizontal"
          locale={{ emptyText: <Empty description="Chưa có bình luận" image={Empty.PRESENTED_IMAGE_SIMPLE} /> }}
          dataSource={comments.slice().reverse()}
          renderItem={(comment) => (
            <List.Item key={comment.commentId} className="comment-item mb-4 p-0 border-0">
              <Card 
                className="w-full transition-shadow hover:shadow-md" 
                bordered={false}
                bodyStyle={{ padding: '16px' }}
              >
                <CustomComment
                  avatar={<Avatar src={comment.avatar || img} alt={comment.userName} />}
                  author={<Text strong>{comment.userName}</Text>}
                  datetime={
                    <Text type="secondary">
                      {moment(comment.createdAt).format("HH:mm DD/MM/YYYY")}
                    </Text>
                  }
                  content={comment.content}
                  actions={[
                    <Button 
                      type="text" 
                      size="small" 
                      onClick={() => setReplyContent((prev) => ({
                        ...prev,
                        [comment.commentId]: !prev[comment.commentId],
                      }))}
                      icon={<Icons.FaReply />}
                    >
                      Trả lời
                    </Button>
                  ]}
                />
                
                <div className="absolute top-4 right-4">
                  <Popover
                    content={
                      <div className="action-menu">
                        {getCommentActions(comment).map(item => (
                          <Button 
                            key={item.key} 
                            type="text" 
                            block 
                            onClick={item.onClick} 
                            className={`text-left ${item.danger ? 'text-red-500 hover:text-red-700' : ''}`}
                            icon={item.icon}
                          >
                            {item.label}
                          </Button>
                        ))}
                      </div>
                    }
                    trigger="click"
                    open={activeDropdown === comment.commentId}
                    onOpenChange={(visible) => !visible && setActiveDropdown(null)}
                  >
                    <Button 
                      type="text" 
                      shape="circle" 
                      icon={<SettingOutlined />}
                      onClick={() => toggleDropdown(comment.commentId)}
                    />
                  </Popover>
                </div>
                
                {/* Form trả lời comment */}
                {replyContent[comment.commentId] && (
                  <div className="reply-form mt-3 pl-12">
                    <Input
                      placeholder="Nhập câu trả lời..."
                      value={replyContent[comment.commentId] || ''}
                      onChange={(e) => setReplyContent({
                        ...replyContent,
                        [comment.commentId]: e.target.value
                      })}
                      addonAfter={
                        <Button 
                          type="link"
                          onClick={() => checkLoginBeforeAction(() => handleReply(comment.commentId))}
                          size="small"
                          className="p-0"
                        >
                          <SendOutlined />
                        </Button>
                      }
                    />
                  </div>
                )}
                
                {/* Form chỉnh sửa comment */}
                {editCommentId === comment.commentId && (
                  <div className="edit-form mt-3">
                    <Input.TextArea
                      value={editedComment}
                      onChange={(e) => setEditedComment(e.target.value)}
                      placeholder="Chỉnh sửa bình luận..."
                      autoSize={{ minRows: 2, maxRows: 4 }}
                    />
                    <Button
                      type="primary"
                      onClick={() => checkLoginBeforeAction(() => handleUpdateComment(comment.commentId))}
                      className="mt-2"
                      size="small"
                    >
                      Lưu thay đổi
                    </Button>
                  </div>
                )}
                
                {/* Danh sách reply */}
                <div className="replies pl-12 mt-3">
                  {comment.replyResponse.map((reply) => (
                    <Card 
                      key={reply.replyId} 
                      className="reply-item mb-2 transition-shadow hover:shadow-sm"
                      size="small"
                      bordered={false}
                      bodyStyle={{ padding: '12px' }}
                    >
                      <CustomComment
                        avatar={<Avatar src={reply.avatar || img} alt={reply.userName} size="small" />}
                        author={<Text strong>{reply.userName}</Text>}
                        datetime={
                          <Text type="secondary" className="text-xs">
                            {moment(reply.createdAt).format("HH:mm DD/MM/YYYY")}
                          </Text>
                        }
                        content={
                          <Text>
                            <Text type="secondary" strong className="text-blue-500 mr-1">
                              @{reply.parentReplyUserName || reply.userComment}
                            </Text>
                            {reply.content}
                          </Text>
                        }
                        actions={[
                          <Button 
                            type="text"
                            size="small"
                            onClick={() => setReplyToReplyContent((prev) => ({
                              ...prev,
                              [reply.replyId]: !prev[reply.replyId],
                            }))}
                            icon={<Icons.FaReply />}
                          >
                            Trả lời
                          </Button>
                        ]}
                      />
                      
                      <div className="absolute top-2 right-2">
                        <Popover
                          content={
                            <div className="action-menu">
                              {getReplyActions(reply).map(item => (
                                <Button 
                                  key={item.key} 
                                  type="text" 
                                  block 
                                  onClick={item.onClick} 
                                  className={`text-left ${item.danger ? 'text-red-500 hover:text-red-700' : ''}`}
                                  icon={item.icon}
                                >
                                  {item.label}
                                </Button>
                              ))}
                            </div>
                          }
                          trigger="click"
                          open={activeReplyDropdown === reply.replyId}
                          onOpenChange={(visible) => !visible && setActiveReplyDropdown(null)}
                        >
                          <Button 
                            type="text" 
                            shape="circle" 
                            size="small"
                            icon={<SettingOutlined />}
                            onClick={() => toggleReplyDropdown(reply.replyId)}
                          />
                        </Popover>
                      </div>
                      
                      {/* Form trả lời reply */}
                      {replyToReplyContent[reply.replyId] && (
                        <div className="reply-to-reply-form mt-2">
                          <Input
                            placeholder="Nhập câu trả lời..."
                            value={replyToReplyContent[reply.replyId] || ''}
                            onChange={(e) => setReplyToReplyContent({
                              ...replyToReplyContent,
                              [reply.replyId]: e.target.value,
                            })}
                            size="small"
                            addonAfter={
                              <Button 
                                type="link"
                                onClick={() => checkLoginBeforeAction(() => handleReplyToReply(comment.commentId, reply.replyId))}
                                size="small"
                                className="p-0"
                              >
                                <SendOutlined />
                              </Button>
                            }
                          />
                        </div>
                      )}
                      
                      {/* Form chỉnh sửa reply */}
                      {editReplyId === reply.replyId && (
                        <div className="edit-reply-form mt-2">
                          <Input.TextArea
                            value={editedReply}
                            onChange={(e) => setEditedReply(e.target.value)}
                            placeholder="Chỉnh sửa câu trả lời..."
                            autoSize={{ minRows: 2, maxRows: 4 }}
                            size="small"
                          />
                          <Button
                            type="primary"
                            size="small"
                            onClick={() => checkLoginBeforeAction(() => handleUpdateReply(reply.replyId))}
                            className="mt-2"
                          >
                            Lưu thay đổi
                          </Button>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              </Card>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default withBaseComponent(CommentBlog);
