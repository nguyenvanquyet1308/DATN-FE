import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import Icons from "utils/icons";

function NavItem({ data, isShowText, setNav }) {
  const [isOpenParent, setIsOpenParent] = useState(false);
  const location = useLocation();

  const isSubmenuActive = data.submenu?.some(
    (item) => location.pathname === item.path,
  );

  useEffect(() => {
    if (!isShowText) {
      setIsOpenParent(false);
    }
  }, [isShowText]);

  return (
    <div key={data.id} className="mb-1">
      {!data?.submenu && (
        <NavLink
          to={data.path}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
              isShowText ? "justify-start" : "justify-center"
            } ${
              isActive
                ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md"
                : "text-gray-200 hover:bg-gray-700 hover:text-white"
            }`
          }
        >
          <span className={`text-lg ${isShowText ? "" : "text-xl"}`}>{data.icon}</span>
          {isShowText && <span className="font-medium tracking-wide">{data.text}</span>}
        </NavLink>
      )}
      {data.submenu && (
        <div className="relative">
          <div
            onClick={() => {
              setNav(true);
              setIsOpenParent(!isOpenParent);
            }}
            className={`flex items-center px-4 py-3 rounded-lg cursor-pointer transition-all duration-300 ${
              isShowText ? "justify-between" : "justify-center"
            } ${
              isSubmenuActive 
                ? "text-primary font-medium" 
                : "text-gray-200 hover:bg-gray-700 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className={`text-lg ${isShowText ? "" : "text-xl"}`}>{data.icon}</span>
              {isShowText && <span className="font-medium tracking-wide">{data.text}</span>}
            </div>
            {isShowText && (
              <span className="transition-transform duration-300 ease-in-out text-lg ml-2">
                {isOpenParent ? (
                  <Icons.IoIosArrowDropdown className="transform transition-transform" />
                ) : (
                  <Icons.IoIosArrowDropright className="transform transition-transform" />
                )}
              </span>
            )}
          </div>
          {isOpenParent && isShowText && (
            <div className="pl-4 mt-1 flex flex-col gap-1 overflow-hidden animate-fadeIn">
              {data.submenu.map((item) => (
                <NavLink
                  key={item.id}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2.5 rounded-md transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-primary/90 to-secondary/90 text-white shadow-sm"
                        : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                    }`
                  }
                >
                  <Icons.FaRegCircle size={6} className="text-current opacity-80" />
                  <span className="font-medium tracking-wide text-sm">{item.text}</span>
                </NavLink>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default NavItem;
