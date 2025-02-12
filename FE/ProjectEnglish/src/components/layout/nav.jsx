// import "../../assets/css/Home/style.scss";
import "../../assets/css/Home/bootstrap.css";
import "../../assets/css/Home/responsive.css";
// import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';    
import "../../assets/css/Home/style.css";
import "../../assets/css/Home/home.css";
import "../../assets/css/Home/nav.css";
import { Link, NavLink } from "react-router-dom";
import React, { useState, useEffect } from "react";
import avatar from "../../assets/image/default-avatar.png";
import Dropdown from 'react-bootstrap/Dropdown';
import { FaUser, FaCogs, FaList, FaSignOutAlt } from 'react-icons/fa';

const Nav = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    // Xử lý đăng xuất
    // const handleLogout = () => {
    //     localStorage.removeItem("isLoggedIn"); // Xóa trạng thái đăng nhập
    //     setIsLoggedIn(false);
    //     window.location.href = "/"; // Chuyển hướng về trang chính
    // };

    // Kiểm tra trạng thái đăng nhập từ localStorage
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");
    const [user, setUser] = useState({
        name: localStorage.getItem("userName") || "User",
        avatar: localStorage.getItem("userAvatar") || avatar,
    });

    // Cập nhật lại khi component render lại (nếu có thay đổi)
    useEffect(() => {
        const loggedIn = localStorage.getItem("isLoggedIn") === "true";
        const userName = localStorage.getItem("userName");
        const userAvatar = localStorage.getItem("userAvatar");

        setIsLoggedIn(loggedIn);
        setUser({
            name: userName || "User",
            avatar: userAvatar || avatar,
        });
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userName");
        localStorage.removeItem("userAvatar");
        setIsLoggedIn(false);
        window.location.reload(); // Reload để cập nhật UI
    };
    // const [showDropdown, setShowDropdown] = useState(false);
    // const [animateDropdown, setAnimateDropdown] = useState(false);
    // // Hiệu ứng dropdown (fade-in)
    // const handleDropdownToggle = () => {
    //     if (showDropdown) {
    //         setAnimateDropdown(false); // Ẩn hiệu ứng trước khi tắt
    //         setTimeout(() => setShowDropdown(false), 200); // Chờ hiệu ứng chạy xong rồi tắt
    //     } else {
    //         setShowDropdown(true);
    //         setTimeout(() => setAnimateDropdown(true), 10); // Thêm nhỏ delay để hiệu ứng hoạt động
    //     }
    // };

    // // Xử lý khi click ra ngoài dropdown
    // useEffect(() => {
    //     const handleClickOutside = (e) => {
    //         if (!e.target.closest(".custom-avatar-dropdown") && !e.target.closest(".custom-dropdown-menu")) {
    //             setAnimateDropdown(false); // Ẩn hiệu ứng trước khi tắt
    //             setTimeout(() => setShowDropdown(false), 200); // Chờ hiệu ứng chạy xong rồi tắt
    //         }
    //     };
    //     if (showDropdown) {
    //         document.addEventListener("click", handleClickOutside);
    //     } else {
    //         document.removeEventListener("click", handleClickOutside);
    //     }

    //     return () => document.removeEventListener("click", handleClickOutside);
    // }, [showDropdown]);

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
                                    <nav>
                                        <NavLink className="nav-link" to="/listquizz">Quizzet</NavLink>
                                    </nav>
                                </li>
                                <li className="nav-item">
                                    <nav>
                                        <NavLink className="nav-link" to="/contactus">Contact US</NavLink>
                                    </nav>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/editprofile">About Us</NavLink>
                                </li>
                                {/* <li className="nav-item">
                                    <NavLink className="nav-link" to="">community</NavLink>
                                </li> */}
                            </ul>
                        </div>
                        <div className="quote_btn-container">

                            <Dropdown >
                                {isLoggedIn ? (
                                    <Dropdown.Toggle className="custom-avatar-dropdown" bsPrefix="custom-toggle">
                                        <img
                                            src={user.avatar || avatar}  // Sử dụng biến `avatar` đã import
                                            alt="User Avatar"
                                            className="avatar-img"
                                            onError={(e) => { e.target.src = avatar; }} // Nếu ảnh lỗi, đổi sang ảnh mặc định

                                        />
                                    </Dropdown.Toggle>
                                ) : (
                                    <Dropdown.Toggle className="custom-dropdown" bsPrefix="custom-toggle">
                                        LOGIN
                                    </Dropdown.Toggle>
                                )}


                                {/* <Dropdown.Menu className={`custom-dropdown-menu ${animateDropdown ? "show" : ""}`}> */}
                                <Dropdown.Menu className="custom-dropdown-menu ">

                                    {isLoggedIn ? (
                                        <>
                                            <Dropdown.Item as={Link} to="/viewprofile" className="custom-dropdown-item">
                                                <FaUser className="mr-2" />
                                                Profile
                                            </Dropdown.Item>
                                            <Dropdown.Item as={Link} to="/settings" className="custom-dropdown-item">
                                                <FaCogs className="mr-2" />
                                                Settings
                                            </Dropdown.Item>
                                            <Dropdown.Divider />
                                            <Dropdown.Item onClick={handleLogout} className="custom-dropdown-item">
                                                <FaSignOutAlt className="mr-2" />
                                                Logout
                                            </Dropdown.Item>
                                        </>
                                    ) : (
                                        <>
                                        
                                            <Dropdown.Item as={Link} to="/loginuser" className="custom-dropdown-item">User Login</Dropdown.Item>
                                            <Dropdown.Item as={Link} to="/loginadmin" className="custom-dropdown-item">Admin Login</Dropdown.Item>
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