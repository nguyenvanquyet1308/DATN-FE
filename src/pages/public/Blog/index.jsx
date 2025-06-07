import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Pagination, Typography, Card, Row, Col, Skeleton, Empty, Badge, Tag, Spin } from "antd";
import { CalendarOutlined, RightOutlined, ReadOutlined, EyeOutlined, FireOutlined } from '@ant-design/icons';
import { getBlog } from "apis/blog.api";
import DOMPurify from "dompurify";
import moment from "moment";
import paths from "constant/paths";
import { trunCateText } from "utils/helper";

const { Title, Text, Paragraph } = Typography;
const { Meta } = Card;

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchBlog = async () => {
    setLoading(true);
    try {
      const params = { limit, page };
      const res = await getBlog(params);
      setBlogs(res?.result?.content || []);
      setTotalPages(res?.result?.totalPages || 0);
      setTotalElements(res?.result?.totalElements || 0);
    } catch (error) {
      console.error("Lỗi khi tải bài viết:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (blogId) => {
    navigate(`/blogs/${blogId}`);
  };

  useEffect(() => {
    fetchBlog();
  }, [page, limit]);

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen py-12">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mb-10 text-center" data-aos="fade-up">
          <Badge 
            count="Tin mới" 
            style={{ backgroundColor: '#1890ff' }}
            offset={[10, 5]}
          >
            <Title 
              level={2} 
              className="relative inline-block font-bold mb-4"
            >
              Tin tức & Bài viết
            </Title>
          </Badge>
          <Paragraph className="max-w-2xl mx-auto text-gray-500 text-lg">
            Cập nhật thông tin mới nhất về sản phẩm, xu hướng thời trang và các sự kiện nổi bật
          </Paragraph>
        </div>

        {loading ? (
          <div className="py-10">
            <Row gutter={[24, 24]}>
              {[1, 2, 3, 4, 5, 6].map(item => (
                <Col xs={24} sm={12} lg={8} key={item}>
                  <Card className="h-full">
                    <Skeleton.Image active style={{ width: '100%', height: '200px' }} />
                    <Skeleton active paragraph={{ rows: 2 }} />
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        ) : blogs.length === 0 ? (
          <Empty description="Không có bài viết nào" className="py-16" />
        ) : (
          <Row gutter={[24, 24]}>
            {blogs.map((post) => {
              const imageArray = post.image ? post.image.split(",") : [];
              const firstImage = imageArray.length > 0 ? imageArray[0] : "";
              
              return (
                <Col 
                  xs={24} sm={12} lg={8} 
                  key={post.id}
                  data-aos="fade-up"
                  data-aos-delay={post.id * 100}
                >
                  <Link to={`/blogs/${post.blogId}`}>
                    <Card
                      hoverable
                      className="h-full overflow-hidden blog-card transition-all duration-300 hover:shadow-xl border-0 shadow-md"
                      cover={
                        <div className="overflow-hidden h-56">
                          <img
                            alt={post.title}
                            src={firstImage}
                            className="w-full h-full object-cover transition-transform duration-700 transform hover:scale-110"
                          />
                        </div>
                      }
                    >
                      <Badge.Ribbon
                        text="Bài viết"
                        color="blue"
                        className="opacity-90"
                      >
                        <Meta
                          title={
                            <Title level={4} className="mb-3 line-clamp-2">
                              {trunCateText(post.title, 80)}
                            </Title>
                          }
                          description={
                            <>
                              <div 
                                className="line-clamp-3 text-gray-600 mb-4"
                                dangerouslySetInnerHTML={{
                                  __html: DOMPurify.sanitize(post?.content),
                                }}
                              />
                              <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                                <span className="flex items-center">
                                  <CalendarOutlined className="mr-1" />
                                  {post?.createdAt ? (
                                    moment(post?.updatedAt).format("DD/MM/YYYY")
                                  ) : (
                                    "N/A"
                                  )}
                                </span>
                                <span className="flex items-center text-blue-500 transition-all hover:translate-x-1">
                                  Đọc tiếp <RightOutlined className="ml-1" />
                                </span>
                              </div>
                            </>
                          }
                        />
                      </Badge.Ribbon>
                    </Card>
                  </Link>
                </Col>
              );
            })}
          </Row>
        )}

        <div className="flex justify-center mt-12 bg-white p-4 rounded-lg shadow-sm">
          <Pagination
            current={page}
            pageSize={limit}
            total={totalElements}
            onChange={setPage}
            onShowSizeChange={(current, size) => setLimit(size)}
            showSizeChanger
            showTotal={(total, range) => `${range[0]}-${range[1]} của ${total} bài viết`}
            pageSizeOptions={[10, 25, 40, 100]}
          />
        </div>
      </div>

      <style jsx global>{`
        .blog-card .ant-card-body {
          padding: 24px;
        }
        
        .blog-card .ant-card-meta-title {
          white-space: normal;
          overflow: visible;
        }
        
        .ant-card-meta-description {
          color: rgba(0, 0, 0, 0.65);
        }
        
        .line-clamp-2 {
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        
        .line-clamp-3 {
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
        }
        
        @media (max-width: 768px) {
          .blog-card .ant-card-body {
            padding: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default Blogs;
