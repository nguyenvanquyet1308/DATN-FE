import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { 
  Badge, 
  Modal, 
  Tooltip, 
  Input, 
  Drawer, 
  Avatar, 
  Menu, 
  Dropdown, 
  Button as AntButton,
  Space
} from "antd";
import { 
  SearchOutlined, 
  ShoppingCartOutlined, 
  UserOutlined, 
  MenuOutlined,
  HomeOutlined,
  ShopOutlined,
  ReadOutlined,
  QuestionCircleOutlined,
  InfoCircleOutlined,
  GiftOutlined,
  LogoutOutlined,
  SettingOutlined
} from '@ant-design/icons';

import Logo from "assets/images/DevTeam.png";
import DarkMode from "./DarkMode";
import paths from "constant/paths";
import Button from "components/Button";
import { logoutRequest } from "store/slicers/auth.slicer";
import SearchModal from "./SearchModal";

const menuItems = [
  { id: 1, name: "Trang chủ", link: paths.HOME, icon: <HomeOutlined /> },
  { id: 2, name: "Sản phẩm", link: paths.PRODUCTS, icon: <ShopOutlined /> },
  { id: 3, name: "Bài viết", link: paths.BLOGS, icon: <ReadOutlined /> },
  { id: 5, name: "Hỏi đáp", link: paths.FQA, icon: <QuestionCircleOutlined /> },
  { id: 6, name: "Giới thiệu", link: paths.INTRODUCE, icon: <InfoCircleOutlined /> },
  { id: 7, name: "Mã khuyến mãi", link: paths.COUPONS, icon: <GiftOutlined /> },
];

const Header = () => {
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isShowSearchModel, setIsShowSearchModel] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const userInfo = useSelector((state) => state.auth.userInfo.data);
  const cartUser = useSelector((state) => state.cart.cartList.data);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const controlHeader = () => {
    if (window.scrollY > lastScrollY && window.scrollY > 80) {
      setShowHeader(false);
    } else {
      setShowHeader(true);
    }
    setLastScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", controlHeader);
    return () => {
      window.removeEventListener("scroll", controlHeader);
    };
  }, [lastScrollY]);

  const userMenuItems = [
    {
      key: 'account',
      label: 'Tài khoản của tôi',
      icon: <UserOutlined />,
      onClick: () => navigate(paths.MEMBER.EDIT_ACCOUNT)
    },
    {
      key: 'orders',
      label: 'Đơn mua',
      icon: <ShoppingCartOutlined />,
      onClick: () => navigate(paths.MEMBER.ORDERS)
    },
    {
      key: 'logout',
      label: 'Đăng xuất',
      icon: <LogoutOutlined />,
      danger: true,
      onClick: () => {
        dispatch(logoutRequest());
        navigate("/");
      }
    }
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-transform duration-300 ${
          showHeader ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {/* Main navbar */}
        <div className="bg-white dark:bg-gray-800 shadow-md transition-all duration-300">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Link 
                to={paths.HOME} 
                className="flex items-center gap-2 transition-transform duration-300 hover:scale-105"
              >
                <img src={Logo} alt="Logo" className="w-12 h-12 object-contain" />
                <span className="font-bold text-lg text-gray-800 dark:text-white hidden sm:block">
                  Fashion Shop
                </span>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-1">
              {menuItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.link}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    location.pathname === item.link
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-200"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Right section: Search, Cart, DarkMode, User */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div 
                className="relative cursor-pointer group"
                onClick={() => setIsShowSearchModel(true)}
              >
                <div className="hidden sm:flex items-center bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden transition-all duration-300 group-hover:ring-2 group-hover:ring-blue-400">
                  <Input 
                    prefix={<SearchOutlined className="text-gray-400" />}
                    placeholder="Tìm kiếm"
                    bordered={false}
                    className="bg-transparent w-[150px] sm:w-[180px] group-hover:w-[220px] transition-all duration-300"
                    onClick={(e) => e.stopPropagation()}
                    readOnly
                  />
                </div>
                <SearchOutlined className="text-gray-600 dark:text-gray-300 text-xl sm:hidden" />
              </div>

              {/* Cart */}
              {userInfo && (
                <Link to={paths.CHECKOUT.CART}>
                  <Badge count={cartUser?.length} size="small">
                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300 transition-all duration-300 hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-600 dark:hover:text-blue-400">
                      <ShoppingCartOutlined className="text-xl" />
                    </div>
                  </Badge>
                </Link>
              )}

              {/* DarkMode */}
              <div className="hidden sm:block">
                <DarkMode />
              </div>

              {/* User Menu */}
              {userInfo ? (
                <Dropdown 
                  menu={{ items: userMenuItems }} 
                  placement="bottomRight" 
                  arrow
                  trigger={['click']}
                >
                  <div className="flex items-center gap-2 cursor-pointer bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 transition-all duration-300">
                    <Avatar size="small" icon={<UserOutlined />} className="bg-blue-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:block truncate max-w-[100px]">
                      {userInfo?.username || userInfo?.email}
                    </span>
                  </div>
                </Dropdown>
              ) : (
                <Link 
                  to={paths.LOGIN}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-full transition-all duration-300 text-sm font-medium"
                >
                  Đăng nhập
                </Link>
              )}

              {/* Mobile menu button */}
              <div className="md:hidden">
                <button 
                  className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
                  onClick={() => setMobileMenuOpen(true)}
                >
                  <MenuOutlined className="text-xl" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Search Modal */}
      <Modal
        open={isShowSearchModel}
        onCancel={() => setIsShowSearchModel(false)}
        footer={null}
        width={1100}
        destroyOnClose
        centered
        className="search-modal"
      >
        <SearchModal closeModal={() => setIsShowSearchModel(false)} />
      </Modal>

      {/* Mobile Menu Drawer */}
      <Drawer
        title={
          <div className="flex items-center gap-2">
            <img src={Logo} alt="Logo" className="w-8 h-8" />
            <span className="font-bold">Fashion Shop</span>
          </div>
        }
        placement="left"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        width={280}
      >
        <div className="flex flex-col space-y-2 mb-6">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              to={item.link}
              className={`flex items-center gap-2 px-4 py-3 rounded-md transition-colors duration-200 hover:bg-gray-100 ${
                location.pathname === item.link
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-700"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </div>

        <div className="pt-4 border-t border-gray-200 mt-4">
          <div className="flex justify-center mb-4">
            <DarkMode />
          </div>
          
          {userInfo ? (
            <div className="space-y-2">
              <div className="px-4 py-2 bg-gray-100 rounded-md flex items-center gap-2">
                <Avatar icon={<UserOutlined />} className="bg-blue-500" />
                <div className="truncate">
                  <div className="text-sm font-medium">{userInfo?.username || userInfo?.email}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mt-4">
                <Link 
                  to={paths.MEMBER.EDIT_ACCOUNT}
                  className="flex items-center justify-center gap-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-md text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <SettingOutlined /> Tài khoản
                </Link>
                <button 
                  className="flex items-center justify-center gap-1 px-3 py-2 bg-red-100 text-red-700 rounded-md text-sm"
                  onClick={() => {
                    dispatch(logoutRequest());
                    navigate("/");
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogoutOutlined /> Đăng xuất
                </button>
              </div>
            </div>
          ) : (
            <Link 
              to={paths.LOGIN}
              className="block text-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-all duration-300 text-sm font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Đăng nhập
            </Link>
          )}
        </div>
      </Drawer>

      {/* Spacing to compensate for fixed header */}
      <div className="h-16"></div>
    </>
  );
};

export default Header;
