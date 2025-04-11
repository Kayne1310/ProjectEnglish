import { useEffect, useState, useRef, useCallback } from 'react';
import * as signalR from '@microsoft/signalr';
import { getMessages, getMoreMessages } from '../../service/chatService';
import { calculateDaysAgo } from '../../helpers/DateHepler';
import '../../assets/css/Community/comunity.css';
import { useNavigate } from 'react-router-dom';
import AuthDialog from '../LoginAndRes/AuthDialog';
import EmojiPicker from 'emoji-picker-react';

const Community = () => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [connection, setConnection] = useState(null);
    const chatContainerRef = useRef(null);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [showAuthDialog, setShowAuthDialog] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const emojiPickerRef = useRef(null);

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    // Lấy tin nhắn ban đầu
    const getInitialMessages = async () => {
        try {
            setIsLoading(true);
            const response = await getMessages();
            const messageData = response.data || response;

            await delay(1000);
            if (Array.isArray(messageData)) {
                setMessages(messageData.reverse());
                setHasMore(messageData.length >= 25);
                setTimeout(() => scrollToBottom('instant'), 100);
            }
        } catch (error) {
            console.error("Error fetching initial messages:", error);
        } finally {
            setIsLoading(false);
        }
    };
    // Lấy thêm tin nhắn cũ
    const loadMoreMessages = useCallback(async () => {
        if (isLoading || !hasMore || messages.length === 0) return;

        try {
            setIsLoading(true);
            const oldestMessage = messages[0];
            const oldScrollHeight = chatContainerRef.current.scrollHeight;

            const response = await getMoreMessages(oldestMessage.timestamp);
            const olderMessages = response.data || response;

            await delay(1000);
            if (Array.isArray(olderMessages) && olderMessages.length > 0) {
                setMessages(prev => [...olderMessages.reverse(), ...prev]);
                setHasMore(olderMessages.length >= 25);

                // Giữ nguyên vị trí scroll sau khi load thêm tin nhắn
                setTimeout(() => {
                    const newScrollHeight = chatContainerRef.current.scrollHeight;
                    chatContainerRef.current.scrollTop = newScrollHeight - oldScrollHeight;
                }, 1);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Error fetching more messages:", error);
        } finally {
            setIsLoading(false);
        }
    }, [messages, isLoading, hasMore]);


    // Sửa lại hàm xử lý khi chọn emoji
    const onEmojiClick = (emojiData) => {
        setMessage(prevMessage => prevMessage + emojiData.emoji);
        setShowEmojiPicker(false);
    };

    useEffect(() => {
        window.scroll(0, 0);
        getInitialMessages();

        // Thiết lập kết nối SignalR
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl(import.meta.env.VITE_URL_SIGNALR, {
                withCredentials: true
            })

            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);

        // Khởi động kết nối
        newConnection.start()
            .then(() => {
                // console.log('Connected to SignalR Hub');
                newConnection.invoke('GetOnlineUsers')
                    .catch(err => console.error('Error getting online users:', err));
            })
            .catch(err => console.error('Error connecting to hub:', err));

        // Lắng nghe tin nhắn từ server
        newConnection.on('ReceiveMessage', (userId, message, picture, userName, timestamp) => {
            const newMessage = {
                userId,
                userName: userName || 'Anonymous',
                picture: picture,
                message,
                timestamp: timestamp
            };
            // console.log("newMessage", newMessage);

            setMessages(prev => [...prev, newMessage]);

            // Cuộn xuống tin nhắn mới nhất
            if (chatContainerRef.current) {
                setTimeout(() => scrollToBottom('smooth'), 3000);
            }
        });


        // Lắng nghe lỗi
        newConnection.on('ReceiveMessageError', (error) => {
            console.error('Message error:', error);
            // Có thể hiển thị thông báo lỗi cho người dùng ở đây
        });

        // Lắng nghe lỗi
        newConnection.on('ReceiveMessageError User Not Found', (error) => {

            console.error('Authentication error:', error);
            setShowAuthDialog(true);


        });
        // Lắng nghe người dùng tham gia
        newConnection.on('ReceiveMessage Join', (userId, picture, userName) => {
            if (userId && picture && userName) {
                setOnlineUsers(prev => {
                    // Kiểm tra theo userId
                    const userExists = prev.some(user => user.userId === userId);
                    if (!userExists) {
                        return [...prev, { userId, userName, picture }];
                    }
                    return prev;
                });
            }
        });
        // Nhận danh sách users đang online
        newConnection.on('ReceiveMessage AllUser', (users) => {
            // console.log('Users online:', users);
            if (Array.isArray(users)) {
                setOnlineUsers(users);
                // console.log('Users online:', users);
            }
        });

        // Lắng nghe người dùng disconnect
        newConnection.on('UserDisconnected', (userId) => {
            // console.log('User disconnected:', userId); // Debug log
            if (userId) {
                setOnlineUsers(prev => {
                    const filtered = prev.filter(user => user.userId !== userId);
                    // console.log('Users after filter:', filtered); // Debug log
                    return filtered;
                });
            }
        });

        // Cleanup khi component unmount
        return () => {
            if (newConnection) {
                newConnection.stop();
            }
        };
    }, [navigate]);

    // Thêm useEffect để xử lý click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Kiểm tra nếu click ra ngoài emoji picker và không phải là nút emoji
            if (emojiPickerRef.current && 
                !emojiPickerRef.current.contains(event.target) && 
                !event.target.closest('.emoji-button')) {
                setShowEmojiPicker(false);
            }
        };

        // Thêm event listener
        document.addEventListener('mousedown', handleClickOutside);

        // Cleanup
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Thêm event listener cho scroll

    // Hàm scroll mượt
    const scrollToBottom = (behavior = 'smooth') => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: behavior
            });
        }
    };



    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (message.trim() && connection) {
            try {
                await connection.invoke('SendMessage', message);
                setMessage("");
                setTimeout(() => scrollToBottom('instant'), 100); // Clear input sau khi gửi
            } catch (err) {
                console.error('Error sending message:', err);
                setMessage("");
                setTimeout(() => scrollToBottom('instant'), 100);
            }
            finally {
                setMessage("");
                setTimeout(() => scrollToBottom('instant'), 100);
            }
        }
    };

    // Xử lý đóng dialog
    const handleCloseDialog = () => {
        setShowAuthDialog(false);
    };

    // Xử lý xác nhận đăng nhập
    const handleConfirmAuth = () => {
        setShowAuthDialog(false);
        navigate('/loginuser', {
            state: {
                from: '/community',
                message: 'Vui lòng đăng nhập để tham gia chat'
            }
        });
    };

    return (
     <>
     <div className="container">
        <div className="row">
                    <div className="text-third ml-1 " style={{ marginTop: "100px" }}>
                        <h1 className="text-3xl font-bold text-primary">Community</h1>
                        <p>
                            Tham gia trò chuyện, chia sẻ kinh nghiệm và kết nối với những người học tiếng Anh khác.
                            Hãy cùng nhau tạo nên một cộng đồng học tập tích cực!
                        </p>
                    </div>
                    <div className="col-md-9">
                        <div className="row mb-3 mb-md-5 mt-3 mt-md-5">
            <div className="col-12">
                                <div className="mx-auto " style={{ maxWidth: "700px" }}>
                                    <div className="border border-primary rounded p-2 p-md-4">
                                        <div
                                            ref={chatContainerRef}
                                            className="chat-container custom-scroll"
                                            style={{ height: "500px", maxHeight: "500px", overflowY: "scroll" }}
                                        >
                                            {isLoading && messages.length === 0 && (
                                                <div className="text-center p-3">
                                                    <div className="spinner-border text-primary" role="status">
                                                        <span className="visually-hidden">Loading...</span>
                                                    </div>
                                                </div>
                                            )}

                                            {hasMore && messages.length > 0 && (
                                                <div className="text-center p-2">
                                                    {isLoading ? (
                                                        <div className="spinner-border spinner-border-sm text-primary" role="status">
                                                            <span className="visually-hidden">Loading...</span>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            className="btn btn-link btn-sm text-decoration-none text-secondary hover-effect"
                                                            onClick={loadMoreMessages}
                                                        >
                                                            <i className="bi bi-arrow-up-circle me-2"></i>
                                                            Xem thêm tin nhắn cũ
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                            {Array.isArray(messages) && messages.map((msg, index) => (
                                                <div key={index}>
                                                    <p className="ml-5 text-muted small mb-1 ps-1 mt-1 mb-0 fw-bold" >
                                                        {msg.userName}
                                                    </p>
                                                    <div className="d-flex align-items-start mb-1 position-relative">
                                                        <div className="position-relative me-n4 me-md-n5 mt-0"
                                                            href={`/profile/${msg.userId}`}
                                                            style={{ width: "40px", height: "40px" }}>
                                                            <img
                                                                alt=""
                                                                className="w-100 ms-1 h-100 object-fit-cover  border-2 border-primary rounded-circle"
                                                                src={msg.picture || "null"}
                                                            />
                                                        </div>

                                                        <div className="d-flex align-items-center w-100 ">
                                                            <div className="flex-grow-1 ">
                                                                <div className="d-flex justify-content-start " >
                                                                    <p className="bg-white rounded p-2 ml-3 small border "
                                                                        style={{
                                                                            minWidth: "50px",
                                                                            maxWidth: "500px",
                                                                            backgroundColor: "#ffffff !important"
                                                                        }}>
                                                                        {msg.message}


                                                                    </p>
                                                                    <p className=" text-muted  font-italic ml-2 mt-2"
                                                                        style={{
                                                                            minWidth: "50px",
                                                                            maxWidth: "500px",
                                                                            backgroundColor: "#ffffff !important",
                                                                            fontSize: "12px"
                                                                        }}>
                                                                        {calculateDaysAgo(msg.timestamp)}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-3 mt-md-4 border-top border-primary border-opacity-10 pt-3">
                                            <form onSubmit={handleSendMessage} className="d-flex gap-2">
                                                <div className="d-flex gap-2">

                                                    <input id="image" className="d-none" type="file" />
                                                    <input
                                                        id="text"
                                                        className="form-control form-control-sm form-control-md-lg"
                                                        placeholder="Nhập tin nhắn..."
                                                        type="text"
                                                        style={{ height: "45px" }}
                                                        onChange={(e) => setMessage(e.target.value)}
                                                        value={message}
                                                    />
                                                    <button 
                                                        className="btn btn-primary emoji-button"
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setShowEmojiPicker(!showEmojiPicker);
                                                        }}
                                                    >
                                                        <i className="bi bi-emoji-smile ml-1 mr-1"></i>
                                                    </button>
                                                    <button type="submit" className="btn btn-primary">
                                                        <i className="bi bi-send ml-1 mr-1"></i>
                                                    </button>
                                                </div>
                                            </form>
                                            {showEmojiPicker && (
                                                    <div 
                                                        ref={emojiPickerRef}
                                                        style={{ 
                                                            position: 'absolute', 
                                                            bottom: '60px', 
                                                            right: '20px',
                                                            zIndex: 1000 
                                                        }}
                                                    >
                                                        <EmojiPicker onEmojiClick={onEmojiClick} />
                                                    </div>
                                            )}


                                        </div>


                                    </div>
                                </div>
            </div>
        </div>
     </div>

                 
                    <div className="col-md-3 col-12 mb-5">
                        {/* Mobile view */}
                        <div className="d-md-none">
                            <div className="card border-primary mb-3 ">
                                <div className="card-body p-2">
                                    <div className="d-flex align-items-center justify-content-between"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#onlineUsersList"
                                        style={{ cursor: 'pointer' }}>
                                        <h5 className="card-title mb-0">
                                            <i className="bi bi-people-fill me-2"></i>
                                            Thành viên online ({onlineUsers.length})
                                        </h5>
                                        <i className="bi bi-chevron-down"></i>
                                    </div>
                                    <div className="collapse " id="onlineUsersList">
                                        <div className="mt-3 custom-scroll" style={{ maxHeight: "200px", overflowY: "auto" }}>
                                            {onlineUsers.map((user, index) => (
                                                <div key={index} className="d-flex align-items-center mb-2">
                                                    <img
                                                        src={user.picture || "null"}
                                                        alt={user.userName}
                                                        className="rounded-circle me-2"
                                                        style={{ width: "32px", height: "32px", objectFit: "cover" }}
                                                    />
                                                    <span className="small text-truncate">{user.userName}</span>
                                                </div>
                                            ))}
                                            
                                            
                                            
                                        </div>
                                    </div>


                                </div>
                            </div>
                        </div>

                        {/* Desktop view */}
                        <div className="d-none d-md-block">
                            <div className="card mt-5 border-primary custom-scroll"
                                style={{ maxHeight: "736px", overflowY: "auto" }}>
                                <div className="card-body">
                                    <h5 className="card-title">
                                        <i className="bi bi-people-fill me-2"></i>
                                        Thành viên online ({onlineUsers.length})
                                    </h5>
                                    <div className="online-users-list mt-3">
                                        {onlineUsers.map((user, index) => (
                                            <div key={index} className="d-flex align-items-center mb-2">
                                                <img
                                                    src={user.picture || "null"}
                                                    alt={user.userName}
                                                    className="rounded-circle me-2"
                                                    style={{ width: "32px", height: "32px", objectFit: "cover" }}
                                                />
                                                <span className="small text-truncate">{user.userName}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <AuthDialog
                isOpen={showAuthDialog}
                onClose={handleCloseDialog}
                onConfirm={handleConfirmAuth}
                stringPopup="Vui lòng đăng nhập để tham gia chat "
            />
        </>
    );
};

export { Community };