import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, Breadcrumb, Card, Skeleton, Divider, Tag, Avatar, Space, Row, Col, List, Affix, BackTop, Spin } from "antd";
import { CalendarOutlined, UserOutlined, HomeOutlined, TagOutlined, ReadOutlined, ArrowUpOutlined, FieldTimeOutlined } from '@ant-design/icons';
import { getBlogById } from "apis/blog.api";
import DOMPurify from "dompurify";
import moment from "moment";
import CommentBlog from "../CommentBlog";
import { getCategoryBlog } from "apis/categoryBlog.api";

const { Title, Text, Paragraph } = Typography;

const BlogDetail = () => {
  const { blogId } = useParams();
  const [blog, setBlog] = useState(null);
  const [cateBlog, setCateBlog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cateLoading, setCateLoading] = useState(true);

  useEffect(() => {
    const fetchBlogDetail = async () => {
      setLoading(true);
      try {
        const res = await getBlogById(blogId);
        setBlog(res?.result);
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết bài viết:", error);
      } finally {
        setLoading(false);
      }
    };
    
    const fetchCateBlog = async () => {
      setCateLoading(true);
      try {
        const res = await getCategoryBlog();
        setCateBlog(res?.result?.content || []);
      } catch (error) {
        console.error("Lỗi khi lấy danh mục blog:", error);
      } finally {
        setCateLoading(false);
      }
    };
    
    fetchCateBlog();
    fetchBlogDetail();
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [blogId]);

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <BackTop>
        <div className="fixed bottom-8 right-8 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 shadow-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110">
          <ArrowUpOutlined />
        </div>
      </BackTop>
      
      <div className="container mx-auto px-4">
        <Breadcrumb className="mb-6">
          <Breadcrumb.Item href="/">
            <HomeOutlined /> Trang chủ
          </Breadcrumb.Item>
          <Breadcrumb.Item href="/blogs">
            <ReadOutlined /> Tin tức
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            {loading ? <Skeleton.Input active size="small" style={{ width: 100 }} /> : blog?.title}
          </Breadcrumb.Item>
        </Breadcrumb>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            {loading ? (
              <Card className="shadow-md border-0">
                <Skeleton active avatar paragraph={{ rows: 4 }} />
                <Divider />
                <Skeleton active paragraph={{ rows: 10 }} />
              </Card>
            ) : blog ? (
              <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border-0">
                <article>
                  <Title level={1} className="text-3xl font-bold mb-4">
                    {blog.title}
                  </Title>
                  
                  <Space className="mb-6 flex flex-wrap" size={[0, 8]} wrap>
                    <Tag icon={<UserOutlined />} color="blue">
                      {blog.userName || "Admin"}
                    </Tag>
                    <Tag icon={<CalendarOutlined />} color="orange">
                      {moment(blog?.createdAt).format("DD/MM/YYYY")}
                    </Tag>
                    <Tag icon={<FieldTimeOutlined />} color="green">
                      {moment(blog?.createdAt).format("HH:mm")}
                    </Tag>
                    {blog.categoryBlogName && (
                      <Tag icon={<TagOutlined />} color="purple">
                        {blog.categoryBlogName}
                      </Tag>
                    )}
                  </Space>
                  
                  {blog.image && (
                    <div className="mb-6 overflow-hidden rounded-lg">
                      <img 
                        src={blog.image.split(',')[0]} 
                        alt={blog.title}
                        className="w-full h-auto object-cover transition-transform duration-700 hover:scale-105" 
                      />
                    </div>
                  )}
                  
                  <Divider className="my-6" />
                  
                  <div 
                    className="blog-content text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(blog?.content),
                    }}
                  />
                </article>
              </Card>
            ) : (
              <Card className="shadow-md border-0 text-center py-8">
                <Title level={4} type="secondary">Không tìm thấy bài viết</Title>
              </Card>
            )}

            <section className="mt-8">
              <CommentBlog />
            </section>
          </Col>
          
          <Col xs={24} lg={8}>
            <Affix offsetTop={20}>
              <div className="space-y-6">
                <Card 
                  title={
                    <Title level={4} className="mb-0 flex items-center">
                      <TagOutlined className="mr-2" /> Danh mục
                    </Title>
                  }
                  className="shadow-md hover:shadow-lg transition-shadow duration-300 border-0"
                >
                  {cateLoading ? (
                    <Skeleton active paragraph={{ rows: 5 }} />
                  ) : (
                    <List
                      dataSource={cateBlog}
                      renderItem={(item) => (
                        <List.Item
                          className="px-2 py-3 border-b hover:bg-gray-50 transition-colors duration-300 cursor-pointer rounded-md"
                        >
                          <Space>
                            <TagOutlined className="text-blue-500" />
                            <Text strong>{item?.name}</Text>
                          </Space>
                        </List.Item>
                      )}
                      locale={{ emptyText: "Không có danh mục nào" }}
                    />
                  )}
                </Card>
                
                <Card 
                  title={
                    <Title level={4} className="mb-0 flex items-center">
                      <ReadOutlined className="mr-2" /> Bài viết liên quan
                    </Title>
                  }
                  className="shadow-md hover:shadow-lg transition-shadow duration-300 border-0"
                >
                  <Text>Chức năng đang phát triển</Text>
                </Card>
              </div>
            </Affix>
          </Col>
        </Row>
      </div>
      
      <style jsx global>{`
        .blog-content img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 16px 0;
        }
        
        .blog-content h1, 
        .blog-content h2, 
        .blog-content h3, 
        .blog-content h4 {
          margin-top: 28px;
          margin-bottom: 16px;
          font-weight: 600;
          line-height: 1.25;
        }
        
        .blog-content h1 {
          font-size: 2em;
        }
        
        .blog-content h2 {
          font-size: 1.5em;
        }
        
        .blog-content h3 {
          font-size: 1.25em;
        }
        
        .blog-content p {
          margin-bottom: 16px;
          line-height: 1.7;
        }
        
        .blog-content ul, 
        .blog-content ol {
          padding-left: 2em;
          margin-bottom: 16px;
        }
        
        .blog-content li {
          margin-bottom: 8px;
        }
        
        .blog-content blockquote {
          padding: 0 1em;
          color: #6a737d;
          border-left: 0.25em solid #dfe2e5;
          margin: 16px 0;
        }
        
        .blog-content pre {
          background-color: #f6f8fa;
          border-radius: 6px;
          padding: 16px;
          overflow: auto;
          margin: 16px 0;
        }
        
        .blog-content code {
          background-color: rgba(27, 31, 35, 0.05);
          border-radius: 3px;
          font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
          font-size: 85%;
          padding: 0.2em 0.4em;
        }
        
        .blog-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 16px 0;
        }
        
        .blog-content table th,
        .blog-content table td {
          padding: 8px 12px;
          border: 1px solid #dfe2e5;
        }
        
        .blog-content table th {
          background-color: #f6f8fa;
        }
        
        @media (max-width: 768px) {
          .blog-content h1 {
            font-size: 1.75em;
          }
          
          .blog-content h2 {
            font-size: 1.35em;
          }
          
          .blog-content h3 {
            font-size: 1.15em;
          }
        }
      `}</style>
    </div>
  );
};

export default BlogDetail;
