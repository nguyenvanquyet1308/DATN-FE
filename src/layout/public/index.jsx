import React from "react";
import { Outlet } from "react-router-dom";
import { Layout, BackTop } from "antd";
import { UpOutlined } from '@ant-design/icons';
import Header from "./Header";
import Footer from "./Footer";

const { Content } = Layout;

const PublicLayout = () => {
  return (
    <Layout className="min-h-screen">
      <Header />
      <Content className="flex-grow bg-gray-50 dark:bg-gray-900 transition-colors duration-300 pt-16">
        <Outlet />
      </Content>
      <Footer />
      
      <BackTop>
        <div className="fixed bottom-8 right-8 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 shadow-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110">
          <UpOutlined />
        </div>
      </BackTop>
    </Layout>
  );
};

export default PublicLayout;
