import "./Header.css";

import { BiSearch } from "react-icons/bi";
import { AiOutlineUser } from "react-icons/ai";
import { RiSettingsLine } from "react-icons/ri";

import { IoAnalytics } from "react-icons/io5";
import { TbMessages } from "react-icons/tb";

import { HiOutlineMoon, HiOutlineLogout } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import paths from "constant/paths";
import { useDispatch } from "react-redux";
import { logoutRequest } from "store/slicers/auth.slicer";

const Header = ({ setDarkTheme, DarkTheme }) => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  return (
    <header
      className="flex items-center justify-end px-4 py-2 bg-white dark:bg-gray-800 shadow-md"
    >
      <div className="tools">
        <HiOutlineLogout
          size={24}
          className="icon"
          onClick={() => dispatch(logoutRequest())}
        />

        <div className="divider"></div>

        <img
          src="https://images.unsplash.com/photo-1669170023257-4da4bc7adfbe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80"
          alt=""
          className="h-[40px] w-[40px] rounded-full  aspect-auto"
        />
      </div>
    </header>
  );
};

export default Header;
