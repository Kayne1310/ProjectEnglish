import "../../assets/css/Home/nav.css";
import { Link, NavLink } from "react-router-dom";
import React, { useState, useContext, useEffect } from "react";
import avatar from "../../assets/image/default-avatar.png";
import Dropdown from "react-bootstrap/Dropdown";
import { FaUser, FaCogs, FaSignOutAlt, FaHome, FaBook, FaQuestionCircle, FaFileAlt, FaUsers } from "react-icons/fa";
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
                <header className="header_section long_section px-0">
                    <nav className="navbar navbar-expand-lg custom_nav-container">
                        <a className="navbar-brand">
                            <span>
                                <Link className="nav-link" to="/">
                                    Quizzet
                                </Link>
                            </span>
                        </a>
                        <div className="d-none d-lg-flex mx-auto flex-column flex-lg-row align-items-center">
                            <ul className="navbar-nav">
                                <li className="nav-item active">
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
                                    <Dropdown.Toggle className="custom-avatar-dropdown" bsPrefix="custom-toggle">
                                        <img
                                            src={userInfor.picture || avatar}
                                            alt="User Avatar"
                                            className="avatar-img"
                                            onError={(e) => (e.target.src = avatar)}
                                        />
                                    </Dropdown.Toggle>
                                ) : (
                                    <Dropdown.Toggle className="custom-dropdown" bsPrefix="custom-toggle">
                                        LOGIN
                                    </Dropdown.Toggle>
                                )}

                                <Dropdown.Menu className="custom-dropdown-menu">
                                    {isLoggedIn ? (
                                        <>
                                            {/* Phần hiển thị tên và email */}
                                            <div className="custom-user-info p-3 flex items-center justify-center text-center">
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

                                            <hr className="border-gray-200 my-2 mx-1" />
                                            {/* Các mục menu */}
                                            <Dropdown.Item as={Link} to="/viewprofile" className="custom-dropdown-item">
                                                <FaUser className="mr-2" /> Profile
                                            </Dropdown.Item>
                                            <Dropdown.Item as={Link} to="/changepassword" className="custom-dropdown-item">
                                                <FaCogs className="mr-2" /> Change Password
                                            </Dropdown.Item>
                                            <Dropdown.Divider />

                                            <Dropdown.Item as={Link} to="/settings" className="custom-dropdown-item">
                                                <i className="fas fa-cog mr-2"></i> Settings
                                            </Dropdown.Item>
                                            <Dropdown.Item as={Link} to="/memes" className="custom-dropdown-item">
                                                <i className="far fa-image mr-2"></i> Memes
                                            </Dropdown.Item>
                                            <Dropdown.Item className="custom-dropdown-item">
                                                <img
                                                    src="https://cf.quizizz.com/img/flag_icons/us.png"
                                                    alt="English"
                                                    className="w-4 h-4 mr-2 object-cover rounded"
                                                />
                                                English
                                            </Dropdown.Item>
                                            <Dropdown.Item onClick={onLogout} className="custom-dropdown-item">
                                                <FaSignOutAlt className="mr-2" /> Logout
                                            </Dropdown.Item>
                                        </>
                                        ) : (
                                            <>
                                                <Dropdown.Item as={Link} to="/loginuser" className="custom-dropdown-item">
                                                    User Login
                                                </Dropdown.Item>
                                                <Dropdown.Item as={Link} to="/loginadmin" className="custom-dropdown-item">
                                                    Admin Login
                                                </Dropdown.Item>
                                            </>
                                        )}
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
            </div>
        </>
    );
};

export default Nav;