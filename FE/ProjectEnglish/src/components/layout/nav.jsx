import "../../assets/css/Home/nav.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import React, { useState, useEffect, useContext } from "react";
import avatar from "../../assets/image/default-avatar.png";
import Dropdown from "react-bootstrap/Dropdown";
import { FaUser, FaCogs, FaSignOutAlt } from "react-icons/fa";
import { handleLogout } from "../../helpers/authHandlers";
import { AuthContext } from "./context/authContext";

const Nav = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const { userInfor, setUser } = useContext(AuthContext); // Lấy user từ context
    const navigate = useNavigate();

    const toggleMenu = () => setIsOpen(!isOpen);

    // Kiểm tra trạng thái đăng nhập từ userInfor
    const isLoggedIn = !!userInfor?.userName;

    useEffect(() => {
        // Không cần set lại user ở đây vì đã có trong context
    }, [userInfor]);

    const onLogout = async () => {
        await handleLogout(setIsLoading, setError, setUser, navigate);
    };

    return (
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
                    <button
                        className="navbar-toggler"
                        type="button"
                        onClick={toggleMenu}
                        aria-controls="navbarSupportedContent"
                        aria-expanded={isOpen}
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div
                        className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}
                        id="navbarSupportedContent"
                    >
                        <div className="d-flex mx-auto flex-column flex-lg-row align-items-center">
                            <ul className="navbar-nav">
                                <li className="nav-item active">
                                    <NavLink className="nav-link" to="/">
                                        Home
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/flashcard">
                                        Flashcard
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/listquizz">
                                        Quizzet
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/contactus">
                                        Contact US
                                    </NavLink>
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
                                            <Dropdown.Item as={Link} to="/viewprofile" className="custom-dropdown-item">
                                                <FaUser className="mr-2" /> Profile
                                            </Dropdown.Item>
                                            <Dropdown.Item as={Link} to="/changepassword" className="custom-dropdown-item">
                                                <FaCogs className="mr-2" /> Change Password
                                            </Dropdown.Item>
                                            <Dropdown.Divider />
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
                    </div>
                </nav>
            </header>
            {error && <div className="error-message">{error}</div>}
        </div>
    );
};

export default Nav;