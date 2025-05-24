import React, { useEffect, useState } from "react";
import img1 from "assets/images/bn2.jpg";
import img2 from "assets/images/10.jpg";
import img3 from "assets/images/13.jpg";
import img4 from "assets/images/bn4.jpg";
import img5 from "assets/images/bn3.jpg";
import img6 from "assets/images/bn1.jpg";
import img7 from "assets/images/sale1.jpg";
import img8 from "assets/images/sale2.jpg";
import img9 from "assets/images/sale3.jpg";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { getProducts } from "apis/product.api";
import { getProductBrands } from "apis/productBrand.api";
import { name } from "@cloudinary/url-gen/actions/namedTransformation";
import Product from "../Products/Product";
import QueryString from "qs";
import { useDispatch, useSelector } from "react-redux";
import { generatePath, useNavigate } from "react-router-dom";
import { setFilterParams } from "store/slicers/common.slicer";
import paths from "constant/paths";

const TopDealProduct = () => {
  const [blogs, setBlogs] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { filterParams } = useSelector((state) => state.common);

  const fetchProduct = async () => {
    const params = {
      limit,
      page,
    };
    try {
      const res = await getProducts(params);
      setProducts(res?.result?.content);
    } catch (error) {
      console.log(error.message);
    }
  };
  const fetchBrand = async () => {
    const params = {
      limit,
      page,
    };
    try {
      const res = await getProductBrands(params);
      setBrands(res?.result?.content);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchProduct();
    fetchBrand();
  }, []);

  const contentStyle = {
    margin: 0,
    height: "160px",
    color: "#fff",
    lineHeight: "160px",
    textAlign: "center",
    background: "#364d79",
  };
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 2,
  };
  var setting = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  return (
    <div>
      <div className="relative">
        <Slider {...sliderSettings}>
          {[img6, img1, img5, img4].map((image, index) => (
            <div key={index} className="relative overflow-hidden">
              {/* Hình ảnh với hiệu ứng zoom nhẹ và tỷ lệ khung hình cố định */}
              <img
                src={image}
                className="w-full h-auto max-h-[650px] object-cover transform transition-transform duration-700 ease-out hover:scale-110 sm:scale-105 md:scale-110"
                alt=""
              />

              {/* Lớp phủ gradient động */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent" />

              {/* Nội dung banner với hiệu ứng xuất hiện dần */}
              <div className="absolute inset-0 flex flex-col justify-center items-start px-4 md:px-10 text-white space-y-4 transition-opacity duration-1000 ease-in-out opacity-0 hover:opacity-100">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold transition-transform duration-700 ease-in-out transform translate-y-8 hover:translate-y-0">
                  Khuyến mãi đặc biệt
                </h2>
                <p className="text-sm sm:text-base md:text-lg max-w-md transition-transform duration-700 ease-in-out transform translate-y-8 delay-100 hover:translate-y-0">
                  Cơ hội sở hữu sản phẩm với giá ưu đãi và nhiều phần quà hấp
                  dẫn.
                </p>
                <button className="px-6 py-2 bg-red-500 text-white rounded-full font-medium hover:bg-red-600 transition duration-700 ease-in-out transform translate-y-8 delay-200 hover:translate-y-0">
                  Khám phá ngay
                </button>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* Categories */}
      <div className="bg-white shadow-2xl rounded-lg p-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Phần Banner Bên Trái */}
          <div className="flex-none w-full md:w-1/2 bg-gradient-to-r from-orange-400 to-gray-300  p-6 rounded-lg relative overflow-hidden shadow-xl">
            {/* Thêm hiệu ứng nền gradient nhẹ */}
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-r from-indigo-600 to-transparent opacity-15 z-0"></div>

            {/* Nội dung bên trong */}
            <div className="relative z-10 text-white">
              <div className="text-red-600 font-bold text-xl mb-2">
                Bùng Nổ Sale Giữa Tháng - Mua Ngay, Đừng Bỏ Lỡ!
              </div>
              <div className="text-white font-semibold text-base mb-4">
                Còn 2 Ngày
              </div>

              <h2 className="text-3xl font-extrabold text-white mb-4 transition duration-300 transform text-white-400">
                Siêu Ưu Đãi Giảm Giá Đến 70% - Nâng Tầm Phong Cách!
              </h2>
              <div className="text-white font-semibold text-lg mb-4">
                Đặc biệt: Giảm 50% toàn bộ sản phẩm từ ngày 7/7 đến 21/7. Không
                thể bỏ qua!
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4">
                <img
                  src={img7}
                  alt="Product 1"
                  className="w-full rounded-lg shadow-xl transition-transform duration-300 transform hover:scale-105 hover:shadow-2xl"
                />
                <img
                  src={img8}
                  alt="Product 2"
                  className="w-full rounded-lg shadow-xl transition-transform duration-300 transform hover:scale-105 hover:shadow-2xl"
                />
                <img
                  src={img9}
                  alt="Product 3"
                  className="w-full rounded-lg shadow-xl transition-transform duration-300 transform hover:scale-105 hover:shadow-2xl"
                />
              </div>
            </div>
          </div>

          {/* Phần Danh Mục Bên Phải */}
          <div className="flex w-full md:w-1/2 overflow-x-auto">
            {/* Lưới hai hàng cho các danh mục */}
            <div className="grid grid-rows-3 gap-6 grid-flow-col w-max px-2">
              {brands.map((brand, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center w-32 h-40 cursor-pointer hover:bg-gray-50 p-4 rounded-lg transition duration-300 transform hover:scale-105 hover:shadow-xl"
                  onClick={() => {
                    dispatch(
                      setFilterParams({
                        ...filterParams,
                        brand: brand.name,
                      }),
                    );
                    navigate({
                      pathname: paths.PRODUCTS,
                      search: QueryString.stringify({
                        ...filterParams,
                        category: brand.name,
                      }),
                    });
                  }}
                >
                  {/* Hình ảnh và hiệu ứng hover */}
                  <div className="w-20 h-20 mb-2 flex items-center justify-center overflow-hidden rounded-full border-4 border-indigo-600 shadow-lg transform transition-all duration-300 hover:scale-110 hover:rotate-12">
                    <img
                      src={brand.image}
                      className="object-cover w-full h-full transition duration-300 transform hover:scale-110"
                    />
                  </div>
                  {/* Tiêu đề danh mục */}
                  <span className="text-sm font-semibold text-gray-800 transition duration-200 transform hover:text-indigo-600">
                    {brand.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="bg-white p-4 rounded-lg shadow-lg mt-2 transition-all hover:shadow-xl relative">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-extrabold text-red-500 flex items-center space-x-2">
            <span>🔥</span>
            <span>TOP DEAL • SIÊU RẺ</span>
          </h2>
          <a
            href="#"
            className="text-blue-600 text-sm font-semibold hover:underline"
          >
            Xem tất cả
          </a>
        </div>

        {/* Nút mũi tên trái */}
        <button
          onClick={() => {
            document.getElementById("productList").scrollLeft -= 400;
          }}
          className="hidden md:flex absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-400/70 text-white rounded-full p-3 shadow-md hover:bg-violet-300 hover:scale-110 transition-all focus:outline-none z-10"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M12.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L8.414 10l4.293 4.293a1 1 0 010 1.414z "
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Danh sách sản phẩm */}
        <div
          id="productList"
          className="flex space-x-4 overflow-x-auto scrollbar-hide px-4 py-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }} // Ẩn thanh cuộn trên Firefox và IE
        >
          {products
            .filter((product) => product.stars === 5) // Lọc sản phẩm có số sao là 5
            .map((product, index) => (
              <div
                key={index}
                className="border rounded-lg overflow-hidden bg-white shadow-lg transition-all transform hover:shadow-xl hover:-translate-y-2 flex flex-col items-center p-2 min-w-[200px]"
              >
                <div
                  className="relative w-full h-64"
                  onClick={() =>
                    navigate(
                      generatePath(paths.DETAIL_PRODUCT, {
                        id: product?.id,
                      }),
                      { state: { productData: product } },
                    )
                  }
                >
                  {product?.skus?.length > 0 && (
                    <img
                      src={product.skus[0]?.images.split(",")[0]}
                      alt="Product Image"
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute top-2 right-2 flex flex-col space-y-1">
                    <span className="bg-blue-400 text-white text-[0.6rem] font-bold px-2 py-1 rounded-full text-center">
                      Chính hãng
                    </span>
                  </div>
                </div>
                <div className="text-center p-3 flex flex-col items-center">
                  <h3 className="text-xs font-semibold mb-1 line-clamp-2 text-center">
                    {product.name}
                  </h3>
                  <div className="flex items-center text-yellow-500 mb-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={
                          i < product.stars
                            ? "text-yellow-500"
                            : "text-gray-300"
                        }
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <div className="text-gray-500 text-xs font-bold">
                    {product.skus[0]?.discount && product.skus[0]?.price
                      ? `${(
                          (product.skus[0].price *
                            (100 - product.skus[0].discount)) /
                          100
                        ).toLocaleString()}đ`
                      : "Liên hệ"}
                  </div>
                  <div className="text-red-500 text-base line-through">
                    {product?.skus[0]?.price
                      ? `${product.skus[0].price.toLocaleString()}đ`
                      : "Liên hệ"}
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Nút mũi tên phải */}
        <button
          onClick={() => {
            document.getElementById("productList").scrollLeft += 400;
          }}
          className="hidden md:flex absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-400/70 text-white rounded-full p-3 shadow-md hover:bg-violet-300 hover:scale-110 transition-all focus:outline-none z-10"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M7.293 4.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414-1.414L11.586 10 7.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TopDealProduct;
