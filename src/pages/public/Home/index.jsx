import React from "react";
import TopProducts from "./TopProducts";
import Banner from "./Banner";
import BlogHome from "./BlogHome";

function Home() {
  return (
    <div className="bg-gray-100 dark:bg-gray-900 dark:text-white duration-200 w-full ">
      <TopProducts />
      <Banner />
      <BlogHome />
    </div>
  );
}

export default Home;
