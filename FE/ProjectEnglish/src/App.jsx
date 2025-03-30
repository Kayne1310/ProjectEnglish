import { Outlet } from "react-router-dom";
import Nav from "./components/layout/nav";
import Footer from "./components/layout/footer";
import "./assets/css/Home/bootstrap.css";
import { useContext, useEffect, useState } from "react"; // Thêm useEffect, useState
import { Spin } from "antd";
import { AuthContext } from "./components/layout/context/authContext";
import "./assets/css/LoginCss/admin.css";
import CryptoJS from "crypto-js"; // Thêm crypto-js để tính hash

const App = () => {
  const { isAppLoading } = useContext(AuthContext);
  const [isChatOpen, setIsChatOpen] = useState(false); // State để toggle chatbot
  const [isChatbaseReady, setIsChatbaseReady] = useState(false); // State kiểm tra chatbot sẵn sàng

  // Nhúng và quản lý chatbot
  useEffect(() => {
    // Tính hash bằng crypto-js
    const secret = "•••••••••"; // Thay bằng secret key thực tế của bạn
    const userId = "current_user_id"; // Thay bằng userId thực tế (có thể từ AuthContext)
    const hash = CryptoJS.HmacSHA256(userId, secret).toString(CryptoJS.enc.Hex);

    // Nhúng script Chatbase
    if (!document.getElementById("chatbase-script")) {
      const script = document.createElement("script");
      script.id = "chatbase-script";
      script.async = true;
      script.innerHTML = `(function(){if(!window.chatbase||window.chatbase("getState")!=="initialized"){window.chatbase=(...args)=>{if(!window.chatbase.q)window.chatbase.q=[];window.chatbase.q.push(args);};window.chatbase=new Proxy(window.chatbase,{get(target,prop){if(prop==="q")return target.q;return(...args)=>target(prop,...args)}});}const onLoad=()=>{const s=document.createElement("script");s.src="https://www.chatbase.co/embed.min.js";s.id="vE6jd3h-XY55ef4ESOjQQ";s.domain="www.chatbase.co";s.setAttribute("data-hash","${hash}");s.onload=()=>{console.log("Chatbase script loaded");};s.onerror=(e)=>{console.error("Chatbase script failed to load",e);};document.body.appendChild(s);};if(document.readyState==="complete")onLoad();else window.addEventListener("load",onLoad);})();`;
      document.body.appendChild(script);
      console.log("Chatbase script appended to body");
    }

    // Xử lý toggle và sự kiện click cho Chatbase
    const checkChatbase = setInterval(() => {
      const bubbleWindow = document.getElementById("chatbase-bubble-window");
      const bubbleButton = document.getElementById("chatbase-bubble-button");

      if (bubbleWindow && bubbleButton) {
        console.log("Chatbase elements found:", bubbleWindow, bubbleButton);
        clearInterval(checkChatbase);
        setIsChatbaseReady(true);

        const handleBubbleClick = (event) => {
          event.stopPropagation();
          setIsChatOpen((prev) => !prev);
        };

        bubbleButton.addEventListener("click", handleBubbleClick);

        const handleClickOutside = (event) => {
          if (
            !bubbleWindow.contains(event.target) &&
            !bubbleButton.contains(event.target) &&
            isChatOpen
          ) {
            setIsChatOpen(false);
          }
        };

        document.addEventListener("click", handleClickOutside);

        return () => {
          bubbleButton.removeEventListener("click", handleBubbleClick);
          document.removeEventListener("click", handleClickOutside);
        };
      } else {
        console.log("Waiting for Chatbase elements...");
      }
    }, 500);

    return () => clearInterval(checkChatbase);
  }, []);

  // Ẩn/hiển thị chatbot dựa trên state
  useEffect(() => {
    const bubbleWindow = document.getElementById("chatbase-bubble-window");
    const bubbleButton = document.getElementById("chatbase-bubble-button");

    if (bubbleWindow && bubbleButton && isChatbaseReady) {
      bubbleWindow.style.display = isChatOpen ? "block" : "none";
      bubbleButton.style.display = "block";
      console.log("Chatbot visibility updated:", { isChatOpen });
    }
  }, [isChatOpen, isChatbaseReady]);

  return (
    <>
      {isAppLoading ? (
        // Hiển thị spinner khi đang load
        <div
          className="loading-container"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh", // Full viewport height để che toàn bộ trang
          }}
        >
          <Spin size="large" />
        </div>
      ) : (
        // Hiển thị nội dung sau khi load xong
        <>
          <Nav />
          <div style={{ minHeight: "calc(70vh - 100px)" }}>
            <Outlet />
          </div>
          <Footer />

          {/* Style responsive và cố định cho chatbot */}
          <style>
            {`
              #chatbase-bubble-window {
                position: fixed !important;
                bottom: 80px !important;
                right: 20px !important;
                width: 400px !important;
                max-width: 90vw !important; /* Không vượt quá 90% chiều rộng màn hình */
                height: 500px !important;
                max-height: 80vh !important; /* Không vượt quá 80% chiều cao màn hình */
                border-radius: 10px !important;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
                z-index: 1000 !important;
                display: ${isChatOpen ? "block" : "none"};
                overflow-y: auto !important; /* Cho phép cuộn nếu nội dung dài */
                box-sizing: border-box !important; /* Đảm bảo padding/border không làm vượt kích thước */
              }

              #chatbase-bubble-button {
                position: fixed !important;
                bottom: 20px !important;
                right: 20px !important;
                width: 60px !important;
                height: 60px !important;
                background-color: #007bff !important;
                border-radius: 50% !important;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2) !important;
                z-index: 1001 !important;
              }

              /* Responsive cho tablet và điện thoại lớn (dưới 768px) */
              @media (max-width: 768px) {
                #chatbase-bubble-window {
                  width: 300px !important;
                  height: 400px !important;
                  bottom: 70px !important;
                  right: 15px !important;
                }
                #chatbase-bubble-button {
                  width: 50px !important;
                  height: 50px !important;
                  bottom: 15px !important;
                  right: 15px !important;
                }
              }

              /* Responsive cho điện thoại nhỏ (dưới 576px) */
              @media (max-width: 576px) {
                #chatbase-bubble-window {
                  width: 280px !important;
                  height: 350px !important;
                  bottom: 60px !important;
                  right: 10px !important;
                }
                #chatbase-bubble-button {
                  width: 40px !important;
                  height: 40px !important;
                  bottom: 10px !important;
                  right: 10px !important;
                }
              }

              /* Đảm bảo không bị lệch trên màn hình rất nhỏ */
              @media (max-width: 400px) {
                #chatbase-bubble-window {
                  width: 90% !important; /* Chiếm 90% chiều rộng màn hình */
                  right: 5px !important;
                  bottom: 50px !important;
                }
                #chatbase-bubble-button {
                  width: 35px !important;
                  height: 35px !important;
                  bottom: 5px !important;
                  right: 5px !important;
                }
              }

              .chatbase-powered-by {
                display: none !important;
              }
            `}
          </style>
        </>
      )}
    </>
  );
};

export default App;