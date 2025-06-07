import React, { useEffect, useState } from "react";
import { Switch, Tooltip } from "antd";
import { BulbOutlined, BulbFilled } from "@ant-design/icons";
import LightButton from "assets/website/light-mode-button.png";
import DarkButton from "assets/website/dark-mode-button.png";

const DarkMode = () => {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ? localStorage.getItem("theme") : "light"
  );
  const [isAnimating, setIsAnimating] = useState(false);

  const element = document.documentElement; // html element

  useEffect(() => {
    if (theme === "dark") {
      element.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      element.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  const toggleTheme = () => {
    setIsAnimating(true);
    
    // Delay the actual theme change to allow for animation
    setTimeout(() => {
      setTheme(theme === "light" ? "dark" : "light");
      setIsAnimating(false);
    }, 200);
  };

  return (
    <div className="dark-mode-toggle">
      <Tooltip title={theme === "light" ? "Chuyển sang chế độ tối" : "Chuyển sang chế độ sáng"}>
        <div 
          className="relative w-12 h-6 flex items-center justify-center cursor-pointer"
          onClick={toggleTheme}
        >
          {/* Custom image toggle for visual appeal */}
          <div className="relative w-12 h-6">
            <img
              src={LightButton}
              alt="Chế độ sáng"
              className={`w-full absolute top-0 left-0 transition-all duration-300 ${
                isAnimating ? 'transform scale-110' : ''
              } ${theme === "dark" ? "opacity-0" : "opacity-100"}`}
            />
            <img
              src={DarkButton}
              alt="Chế độ tối"
              className={`w-full absolute top-0 left-0 transition-all duration-300 ${
                isAnimating ? 'transform scale-110' : ''
              }`}
            />
          </div>

          {/* Alternative modern toggle with icons */}
          <div className="hidden">
            <Switch
              checked={theme === "dark"}
              onChange={toggleTheme}
              checkedChildren={<BulbFilled className="text-yellow-300" />}
              unCheckedChildren={<BulbOutlined />}
              className={theme === "dark" ? "bg-blue-600" : ""}
            />
          </div>
        </div>
      </Tooltip>

      <style jsx global>{`
        .dark-mode-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .dark .ant-switch-checked {
          background-color: #177ddc !important;
        }
        
        @media (prefers-reduced-motion: reduce) {
          .dark-mode-toggle img {
            transition: opacity 0.1s ease;
          }
        }
      `}</style>
    </div>
  );
};

export default DarkMode;
