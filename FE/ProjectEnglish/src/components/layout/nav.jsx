import "../../assets/css/Home/nav.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import React, { useState, useEffect, useContext } from "react";
import avatar from "../../assets/image/default-avatar.png";
import Dropdown from 'react-bootstrap/Dropdown';
import { FaUser, FaCogs, FaList, FaSignOutAlt } from 'react-icons/fa';
import { handleLogout } from "../../helpers/authHandlers"; // Đường dẫn tới file chứa handler
import { AuthContext } from "./context/authContext";
// import Loading from "react-loading";


const Nav = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const { userInfor } = useContext(AuthContext);
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };


    // Kiểm tra trạng thái đăng nhập từ localStorage
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");
    const [user, setUser] = useState({
        name: userInfor.userName || "",
        avatar: userInfor.picture || avatar,
    });

    // Cập nhật lại khi component render lại (nếu có thay đổi)
    useEffect(() => {
        const loggedIn = localStorage.getItem("isLoggedIn") === "true";
        const userAvatar = userInfor.picture;

        setIsLoggedIn(loggedIn);
        setUser({
            name: userInfor.userName || "User",
            avatar: userAvatar || avatar,
        });
    }, []);

    const Logout = async () => {
        await handleLogout(setIsLoading, setError, navigate);
        localStorage.removeItem("isLoggedIn");
        setIsLoggedIn(false);
    };

    return (
        <div className="navigation">
            <header className="header_section long_section px-0">
                <nav className="navbar navbar-expand-lg custom_nav-container">
                    <a className="navbar-brand">
                        <span><Link className="nav-link" to="/">Quizzet</Link></span>
                    </a>
                    <button className="navbar-toggler" type="button" onClick={toggleMenu} aria-controls="navbarSupportedContent" aria-expanded={isOpen} aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarSupportedContent">
                        <div className="d-flex mx-auto flex-column flex-lg-row align-items-center">
                            <ul className="navbar-nav">
                                <li className="nav-item active">
                                    <NavLink className="nav-link" to="/">Home </NavLink>
                                </li>
                                <li className="nav-item">

                                    <NavLink className="nav-link" to="/flashcard">Flashcard</NavLink>

                                </li>
                                <li className="nav-item">
                                    <nav>
                                        <NavLink className="nav-link" to="/listquizz">Quizzet</NavLink>
                                    </nav>
                                </li>
                                <li className="nav-item">
                                    <nav>
                                        <NavLink className="nav-link" to="/contactus">Contact US</NavLink>
                                    </nav>
                                </li>
                                {/* <li className="nav-item">
                                    <NavLink className="nav-link" to="">About Us</NavLink>
                                </li> */}

                                {/* <li className="nav-item">
                                    <NavLink className="nav-link" to="">community</NavLink>
                                </li> */}
                            </ul>
                        </div>
                        <div className="quote_btn-container">
                            <Dropdown>
                                {isLoggedIn ? (
                                    <Dropdown.Toggle className="custom-avatar-dropdown" bsPrefix="custom-toggle">
                                        <img
                                            src={user.avatar || avatar}
                                            alt="User Avatar"
                                            className="avatar-img"
                                            onError={(e) => { e.target.src = avatar; }}
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
                                            <div className="custom-user-info p-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="border-2 border-gray-300 rounded-full overflow-hidden w-8 h-8 flex-shrink-0">
                                                        <img
                                                            src={user.avatar || avatar}
                                                            alt="User Avatar"
                                                            className="w-8 h-8 object-cover"
                                                            onError={(e) => { e.target.src = avatar; }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium">{user.name || "Error display "}</p>
                                                        <p className="text-xs text-gray-500">{userInfor.email || "errordisplay@gmail.com"}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <hr className="border-gray-200 my-2 mx-1" />
                                            {/* Các mục menu */}
                                            <Dropdown.Item as={Link} to="/viewprofile" className="custom-dropdown-item">
                                                <i className="far fa-user-circle mr-2"></i> View profile
                                            </Dropdown.Item>
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
                                            <Dropdown.Item onClick={() => Logout(setIsLoading, setError)} className="custom-dropdown-item">
                                                <i className="fas fa-sign-out-alt mr-2"></i> Logout
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

                    </div>
                </nav>
            </header>
        </div>
    );
};

export default Nav;