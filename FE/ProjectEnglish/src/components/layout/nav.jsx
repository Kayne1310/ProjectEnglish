import "../../assets/css/Home/nav.css";
import { Link, NavLink } from "react-router-dom";
import React, { useState, useContext, useEffect } from "react";
import avatar from "../../assets/image/default-avatar.png";
import Dropdown from "react-bootstrap/Dropdown";
import { FaUser, FaCogs, FaSignOutAlt, FaHome, FaBook, FaQuestionCircle, FaFileAlt, FaUsers, FaAirFreshener, FaFirefox } from "react-icons/fa";
import { handleLogout } from "../../helpers/authHandlers";
import { AuthContext } from "./context/authContext";

const Nav = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const { userInfor, setUser } = useContext(AuthContext); // Lấy user từ context
    const toggleMenu = () => setIsOpen(!isOpen);
    // Kiểm tra trạng thái đăng nhập từ userInfor
    const isLoggedIn = !!userInfor?.userName;

    useEffect(() => {
        // Không cần set lại user ở đây vì đã có trong context
    }, [userInfor]);
    const onLogout = async () => {
        await handleLogout(setIsLoading, setError, setUser);
    };

    return (
        <>
            <div className="navigation">
                <header className="header_section long_section">
                    <nav className="navbar navbar-expand-lg custom_nav-container">
                        <div className="navbar-brand">
                            <span>
                                <Link className="" to="/">
                                    Quizzet
                                </Link>
                            </span>
                        </div>
                        <div className="d-none d-lg-flex mx-auto flex-column flex-lg-row align-items-center">
                            <ul className="navbar-nav">
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/">
                                        Home
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/flashcard">Flashcard</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/listquizz">
                                        Quizzet
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/listdocument">Document</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/community">Community</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/chatwithai">Chat with AI</NavLink>
                                </li>
                            </ul>
                        </div>
                        <div className="quote_btn-container">
                            <Dropdown>
                                {isLoggedIn ? (
                                    <Dropdown.Toggle className="custom-avatar-dropdown  " bsPrefix="custom-toggle"  variant="none"  style={{marginRight:"5px"}}>
                                        <img
                                            src={userInfor.picture || avatar}
                                            alt="User Avatar"
                                            className="avatar-img"
                                            onError={(e) => (e.target.src = avatar)}
                                        />
                                    </Dropdown.Toggle>
                                ) : (
                                    <Dropdown.Toggle as={Link} to="/loginuser" className="premium-login-btn" bsPrefix="custom-toggle">
                                        <span className="btn-content">
                                            <span className="btn-icon">
                                                <i className="bi bi-person-circle mr-1 ml-2"></i>
                                            </span>
                                            <span className="btn-text">Sign in</span>
                                        </span>
                                        <span className="btn-shine"></span>
                                    </Dropdown.Toggle>
                                )}

                                <Dropdown.Menu className="custom-dropdown-menu">
                                    {isLoggedIn ? (
                                        <>
                                            {/* Phần hiển thị tên và email */}
                                            <div className="custom-user-info flex items-center justify-center text-center">
                                                <div className="flex items-center gap-2 ">
                                                    {/* Avatar */}
                                                    <div className=" p-2 w-12 flex justify-center">

                                                        <img
                                                            src={userInfor.picture || avatar}
                                                            alt="User Avatar"
                                                            className="w-full h-full object-cover object-center"
                                                            onError={(e) => { e.target.src = avatar; }}
                                                        />

                                                    </div>

                                                    {/* Thông tin User */}
                                                    <div>
                                                        <p className="text-sm font-medium">{userInfor.userName || "Error display"}</p>
                                                        <p className="text-xs text-gray-500">{userInfor.email || "errordisplay@gmail.com"}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <Dropdown.Divider />
                                            {/* Các mục menu */}
                                            <Dropdown.Item as={Link} to="/viewprofile" className="custom-dropdown-item">
                                                <FaUser className="mr-2" /> Profile
                                            </Dropdown.Item>

                                            <Dropdown.Item as={Link} to="/changepassword" className="custom-dropdown-item">
                                                <FaCogs className="mr-2" /> Change Password
                                            </Dropdown.Item>

                                            <Dropdown.Item as={Link} to="/settings" className="custom-dropdown-item">
                                                <i className="fas fa-cog mr-2"></i> Settings
                                            </Dropdown.Item>

                                            <Dropdown.Item as={Link} to="/memes" className="custom-dropdown-item">
                                                <i className="far fa-image mr-2"></i> Themes
                                            </Dropdown.Item>

                                            <Dropdown.Item className="custom-dropdown-item">
                                                <img
                                                    src="https://cf.quizizz.com/img/flag_icons/us.png"
                                                    alt="English"
                                                    className="w-4 h-4 mr-2 object-cover rounded"
                                                />
                                                English
                                            </Dropdown.Item>

                                            <Dropdown.Divider />

                                            <Dropdown.Item onClick={onLogout} className="custom-dropdown-item">
                                                <FaSignOutAlt className="mr-2" /> Logout
                                            </Dropdown.Item>
                                        </>
                                    ) : null}
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </nav>
                </header>
                {error && <div className="error-message">{error}</div>}
            </div>

            {/* Mobile Bottom Navigation */}
            <div className="mobile-bottom-nav d-lg-none">
                <NavLink to="/" className="mobile-nav-item">
                    <FaHome />
                    <span>Home</span>
                </NavLink>
                <NavLink to="/flashcard" className="mobile-nav-item">
                    <FaBook />
                    <span>Flashcard</span>
                </NavLink>
                <NavLink to="/listquizz" className="mobile-nav-item">
                    <FaQuestionCircle />
                    <span>Quizzet</span>
                </NavLink>
                <NavLink to="/listdocument" className="mobile-nav-item">
                    <FaFileAlt />
                    <span>Document</span>
                </NavLink>
                <NavLink to="/community" className="mobile-nav-item">
                    <FaUsers />
                    <span>Community</span>
                </NavLink>
                <NavLink to="/chatwithai" className="mobile-nav-item">
                    <FaFirefox />
                    <span>Chat with AI</span>
                </NavLink>
            </div>
        </>
    );
};

export default Nav;