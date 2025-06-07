import React, { useEffect, useState } from "react";
import { Typography, Row, Col, Card, Skeleton, Empty, Spin, Badge } from "antd";
import { getBlog } from "apis/blog.api";
import { Link } from "react-router-dom";
import { trunCateText } from "utils/helper";
import DOMPurify from "dompurify";
import moment from "moment";
import { CalendarOutlined, ReadOutlined, RightOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Meta } = Card;

const BlogHome = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBlog = async () => {
    setLoading(true);
    try {
      const params = { limit: 6, page: 1 };
      const res = await getBlog(params);
      setData(res?.result?.content || []);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, []);

  return (
    <section className="blog-section py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Header section */}
        <div className="text-center mb-12">
          <Badge 
            count="Tin mới" 
            style={{ backgroundColor: '#1890ff' }}
            offset={[10, 5]}
          >
            <Title 
              level={2} 
              className="relative inline-block font-bold text-3xl md:text-4xl mb-4"
              data-aos="fade-up"
            >
              Bài viết nổi bật
            </Title>
          </Badge>
          <Paragraph 
            className="max-w-2xl mx-auto text-gray-500 text-lg"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Khám phá tin tức thời trang, mua sắm và nhiều loại khác đang chờ bạn đọc
          </Paragraph>
        </div>

        {loading ? (
          <Row gutter={[24, 24]} className="mb-8">
            {[1, 2, 3].map(item => (
              <Col xs={24} sm={12} lg={8} key={item}>
                <Card className="h-full">
                  <Skeleton.Image active style={{ width: '100%', height: '200px' }} />
                  <Skeleton active paragraph={{ rows: 2 }} />
                </Card>
              </Col>
            ))}
          </Row>
        ) : data?.length === 0 ? (
          <Empty description="Không có bài viết nào" className="py-12" />
        ) : (
          <Row gutter={[24, 24]}>
            {data.map((post) => {
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

        {!loading && data.length > 0 && (
          <div className="text-center mt-12">
            <Link 
              to="/blogs"
              className="inline-block px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-full transition-all duration-300 hover:shadow-lg transform hover:scale-105"
              data-aos="fade-up"
            >
              Xem tất cả bài viết
            </Link>
          </div>
        )}
      </div>

      <style jsx global>{`
        .blog-card .ant-card-body {
          padding: 24px;
        }
        
        .blog-card .ant-card-meta-title {
          white-space: normal;
          overflow: visible;
        }
        
        @media (max-width: 768px) {
          .blog-card .ant-card-body {
            padding: 16px;
          }
        }
      `}</style>
    </section>
  );
};

export default BlogHome;
