// App.js
import { Outlet, useLocation } from "react-router-dom";
import Nav from "./components/layout/nav";
import Footer from "./components/layout/footer";
import "./assets/css/Home/bootstrap.css";
import "./assets/css/Home/responsive.css";
import "./assets/css/Home/style.css";
import { useContext, useEffect, useState } from "react";
import authService from "./service/authService";
import { Spin } from "antd";
import { AuthContext } from "./components/layout/context/authContext";

const App = () => {
    const { setUser, isAppLoading, setIsAppLoading } = useContext(AuthContext);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isChatbaseReady, setIsChatbaseReady] = useState(false); // Theo dõi xem Chatbase elements đã sẵn sàng chưa
    const location = useLocation();

    // Các route không hiển thị chatbot
    const hideChatbotRoutes = [
        "/listquizz",
        "/viewprofile",
        "/listdocument/detaildocument",
        "/listdocument",
        "/listquizz/detailquiz",
        "/listquizz",
        "/flashcard",
        "/flashcard/:quizId",
        "/quizlet",
        "/changepassword",
        "/resetpassword",
        "/forgotpassword",
        "/loginadmin",
        "/loginuser",
        "/registeruser",
    ];

    // Kiểm tra xem có nên hiển thị chatbot không
    const shouldShowChatbot = !hideChatbotRoutes.some((route) =>
        location.pathname.startsWith(route)
    );

    // Khởi tạo Chatbase
    useEffect(() => {
        // Fetch user data
        setIsAppLoading(true);
        const timer = setTimeout(() => {
            fetchUser();
        }, 1000);

        // Nhúng Chatbase
        if (!window.chatbase || window.chatbase("getState") !== "initialized") {
            window.chatbase = (...args) => {
                if (!window.chatbase.q) window.chatbase.q = [];
                window.chatbase.q.push(args);
            };
            window.chatbase = new Proxy(window.chatbase, {
                get(target, prop) {
                    if (prop === "q") return target.q;
                    return (...args) => target(prop, ...args);
                },
            });

            const script = document.createElement("script");
            script.src = "https://www.chatbase.co/embed.min.js";
            script.id = "BdLlAdw69Esta4XhplQlO";
            script.setAttribute("chatbotId", "BdLlAdw69Esta4XhplQlO");
            script.async = true;
            script.onload = () => {
                console.log("Chatbase script loaded successfully");
                setIsChatbaseReady(true); // Đánh dấu Chatbase đã sẵn sàng
            };
            script.onerror = () => console.error("Failed to load Chatbase script");
            document.body.appendChild(script);
        }

        return () => clearTimeout(timer);
    }, []);

    // Xử lý toggle và sự kiện click cho Chatbase
    useEffect(() => {
        const checkChatbase = setInterval(() => {
            const bubbleWindow = document.getElementById("chatbase-bubble-window");
            const bubbleButton = document.getElementById("chatbase-bubble-button");

            if (bubbleWindow && bubbleButton) {
                clearInterval(checkChatbase);
                setIsChatbaseReady(true); // Đánh dấu Chatbase đã sẵn sàng

                // Toggle khi click nút
                const handleBubbleClick = (event) => {
                    event.stopPropagation();
                    setIsChatOpen((prev) => !prev);
                };

                bubbleButton.addEventListener("click", handleBubbleClick);

                // Đóng khi click ra ngoài
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

                // Cleanup sự kiện
                return () => {
                    bubbleButton.removeEventListener("click", handleBubbleClick);
                    document.removeEventListener("click", handleClickOutside);
                };
            }
        }, 500);

        return () => clearInterval(checkChatbase);
    }, [isChatOpen]);

    // Ẩn/hiển thị chatbot khi route thay đổi hoặc Chatbase sẵn sàng
    useEffect(() => {
        const bubbleWindow = document.getElementById("chatbase-bubble-window");
        const bubbleButton = document.getElementById("chatbase-bubble-button");

        if (bubbleWindow && bubbleButton && isChatbaseReady) {
            if (!shouldShowChatbot) {
                bubbleWindow.style.display = "none";
                bubbleButton.style.display = "none";
                setIsChatOpen(false); // Đóng chat nếu đang mở
            } else {
                bubbleWindow.style.display = isChatOpen ? "block" : "none";
                bubbleButton.style.display = "block";
            }
        }
    }, [location.pathname, shouldShowChatbot, isChatOpen, isChatbaseReady]);

    const fetchUser = async () => {
        try {
            const res = await authService.getUserInfor();

            if (res.user) {
                setUser({
                    userName: res.user.userName,
                    email: res.user.email,
                    picture: res.user.picture,
                    facebookId: res.user.facebookId,
                    googleId: res.user.googleId,
                });
                console.log("User Data:", res.user);
            }
        } catch (error) {
            throw error;
        } finally {
            setIsAppLoading(false);
        }
    };

    return (
        <>
            <style>
                {`
                    #chatbase-bubble-window {
                        position: fixed !important;
                        bottom: 80px !important;
                        right: 20px !important;
                        width: 300px !important;
                        height: 400px !important;
                        border-radius: 10px !important;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
                        z-index: 1000 !important;
                        transition: opacity 0.3s ease, transform 0.3s ease;
                        opacity: ${isChatOpen && shouldShowChatbot ? 1 : 0};
                        transform: ${isChatOpen && shouldShowChatbot ? "scale(1)" : "scale(0.95)"};
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
                        transition: transform 0.2s ease;
                    }

                    #chatbase-bubble-button:hover {
                        transform: scale(1.1);
                    }

                    .chatbase-powered-by {
                        display: none !important;
                    }
                `}
            </style>

            <Nav />
            <div style={{ minHeight: "calc(70vh - 100px)" }}>
                {isAppLoading === true ? (
                    <div
                        className="loading-container"
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "50vh",
                        }}
                    >
                        <Spin size="large" />
                    </div>
                ) : (
                    <Outlet />
                )}
            </div>
            <Footer />
        </>
    );
};

export default App;