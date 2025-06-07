import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { postChatbox } from "apis/chatbox.api";

const ChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (inputValue.trim() === "") return;

    const userMessage = {
      text: inputValue,
      isUser: true,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await postChatbox({
        userPrompt: inputValue,
      });
      const aiMessage = {
        text: response,
        isUser: false,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message to AI:", error);
      
      const errorMessage = {
        text: "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.",
        isUser: false,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const renderTextWithMarkdown = (text) => {
    // Xử lý URL trước
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    
    // Tách văn bản thành các dòng
    const lines = text.split('\n');
    
    return (
      <div>
        {lines.map((line, lineIndex) => {
          // Kiểm tra xem dòng có phải là mục danh sách không (bắt đầu bằng * hoặc -)
          const listItemMatch = line.match(/^(\s*[\*\-]\s+)(.+)$/);
          
          if (listItemMatch) {
            // Đây là một mục danh sách
            const [, bullet, content] = listItemMatch;
            
            // Xử lý nội dung để hỗ trợ link
            const parts = content.split(urlRegex);
            const contentWithLinks = parts.map((part, i) => {
              if (urlRegex.test(part)) {
                return (
                  <a
                    key={i}
                    href={part}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    {part}
                  </a>
                );
              } else {
                return part;
              }
            });
            
            return (
              <div key={lineIndex} className="flex mb-1">
                <span className="mr-2">{bullet.trim()}</span>
                <span>{contentWithLinks}</span>
              </div>
            );
          } else {
            // Đây là văn bản thông thường
            const parts = line.split(urlRegex);
            const lineWithLinks = parts.map((part, i) => {
              if (urlRegex.test(part)) {
                return (
                  <a
                    key={i}
                    href={part}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    {part}
                  </a>
                );
              } else {
                return part;
              }
            });
            
            return (
              <div key={lineIndex} className={lineIndex > 0 ? "mt-1" : ""}>
                {lineWithLinks}
              </div>
            );
          }
        })}
      </div>
    );
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {!isOpen ? (
        <button
          onClick={toggleChat}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        </button>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl flex flex-col w-[350px] h-[450px]">
          <div className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center rounded-t-lg">
            <h3 className="font-medium">Chat với AI</h3>
            <button onClick={toggleChat} className="text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                Hãy đặt câu hỏi cho AI...
              </div>
            ) : (
              messages.map((message, index) => (
                
                <div
                  key={index}
                  className={`mb-3 ${
                    message.isUser ? "text-right" : "text-left"
                  }`}
                >
                  <div
                    className={`inline-block px-3 py-2 rounded-lg ${
                      message.isUser
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
                    }`}
                  >
                    {renderTextWithMarkdown(message.text)}
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="text-left mb-3">
                <div className="inline-block px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 p-3 flex">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Nhập tin nhắn..."
              className="flex-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || inputValue.trim() === ""}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg disabled:opacity-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBox; 