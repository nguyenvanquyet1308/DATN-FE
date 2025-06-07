import React, { useEffect } from "react";
import TopProducts from "./TopProducts";
import Banner from "./Banner";
import BlogHome from "./BlogHome";
import Subscribe from "./Subscribe";
import ChatBox from "../../../components/ChatBox/ChatBox";
import { Layout, BackTop } from "antd";
import { UpOutlined } from '@ant-design/icons';

const { Content } = Layout;

function Home() {
  // Thêm hiệu ứng scroll reveal khi trang được load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout className="min-h-screen">
      <Content className="bg-gray-50 dark:bg-gray-900 dark:text-white transition-all duration-300">
        <div className="max-w-screen-2xl mx-auto">
          <TopProducts />
          <Banner />
          <Subscribe />
          <BlogHome />
          <ChatBox />
        </div>
        
        <BackTop>
          <div className="fixed bottom-8 right-8 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 shadow-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110">
            <UpOutlined />
          </div>
        </BackTop>
      </Content>
    </Layout>
  );
}

export default Home;
