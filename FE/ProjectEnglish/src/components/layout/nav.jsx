// import "../../assets/css/Home/style.scss";
import "../../assets/css/Home/bootstrap.css";
import "../../assets/css/Home/responsive.css";
// import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';    
import "../../assets/css/Home/style.css";
import "../../assets/css/Home/home.css";
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
    const {userInfor}=useContext(AuthContext);
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };


    // Kiểm tra trạng thái đăng nhập từ localStorage
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");
    const [user, setUser] = useState({
        name: userInfor.userName || "",
        avatar: userInfor.picture|| avatar,
    });

    // Cập nhật lại khi component render lại (nếu có thay đổi)
    useEffect(() => {
        const loggedIn = localStorage.getItem("isLoggedIn") === "true";
        const userAvatar = userInfor.picture;

        setIsLoggedIn(loggedIn);
        setUser({
            name: userInfor.userName  || "User",
            avatar: userAvatar || avatar,
        });
    }, []);

    const Logout = async () => {
           await handleLogout(setIsLoading, setError,navigate);
        localStorage.removeItem("isLoggedIn");
        setIsLoggedIn(false);
    };

    return (
        <div className="navigation">
            <header className="header_section long_section px-0">
                <nav className="navbar navbar-expand-lg custom_nav-container">
                    <div className="navbar-brand">
                        <span><Link className="nav-link" to="/">Quizzet</Link></span>
                    </div>
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
                                    <NavLink className="nav-link" to="/viewprofile">About Us</NavLink>
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
                                            <Dropdown.Item onClick={() => Logout(setIsLoading, setError)} className="custom-dropdown-item">
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