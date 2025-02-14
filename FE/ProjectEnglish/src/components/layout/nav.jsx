import "../../assets/css/Home/style.scss";
import "../../assets/css/Home/bootstrap.css";
import "../../assets/css/Home/responsive.css";
import "../../assets/css/Home/style.css";
import "../../assets/css/Home/home.css";
import "../../assets/css/Home/nav.css";
import { Link, NavLink } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { handleLogout } from "../../helpers/authHandlers"; // Đường dẫn tới file chứa handler
// import Loading from "react-loading";
import Dropdown from 'react-bootstrap/Dropdown';

const Nav = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };
    
    // Kiểm tra trạng thái đăng nhập từ localStorage
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    useEffect(() => {
        const loggedIn = localStorage.getItem("isLoggedIn") === "true";
        setIsLoggedIn(loggedIn);
    }, []);

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
                                {/* <li className="nav-item">
                                    <NavLink className="nav-link" to="">About Us</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="">Contact Us</NavLink>
                                </li> */}
                            </ul>
                        </div>
                        <div className="quote_btn-container">
                            {/* 
                            <Dropdown>
                                <Dropdown.Toggle className="custom-dropdown" bsPrefix="custom-toggle">
                                    LOGIN
                                </Dropdown.Toggle>

                                <Dropdown.Menu className="custom-dropdown-menu">
                                    <Dropdown.Item as={Link} to="/loginuser" className="custom-dropdown-item">
                                        User
                                    </Dropdown.Item>
                                    <Dropdown.Item as={Link} to="/loginadmin" className="custom-dropdown-item">
                                        Admin
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown> */}

                            <Dropdown>
                                {!isLoggedIn ? (
                                    <>
                                        <Dropdown.Toggle className="custom-dropdown" bsPrefix="custom-toggle">
                                            LOGIN
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu className="custom-dropdown-menu">
                                            <Dropdown.Item as={Link} to="/loginuser" className="custom-dropdown-item">
                                                User
                                            </Dropdown.Item>
                                            <Dropdown.Item as={Link} to="/loginadmin" className="custom-dropdown-item">
                                                Admin
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </>
                                ) : (
                                    <>
                                        <Dropdown.Toggle className="custom-dropdown" bsPrefix="custom-toggle">
                                            PROFILE
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu className="custom-dropdown-menu">
                                            <Dropdown.Item className="custom-dropdown-item">
                                                Profile
                                            </Dropdown.Item>
                                            <Dropdown.Item onClick={() => handleLogout(setIsLoading, setError)} className="custom-dropdown-item">
                                                Logout
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </>
                                )}
                            </Dropdown>

                        </div>

                    </div>
                </nav>
            </header>
        </div>
    );
};

export default Nav;