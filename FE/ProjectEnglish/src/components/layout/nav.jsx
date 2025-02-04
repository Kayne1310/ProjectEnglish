import "../../assets/css/Home/style.scss";
import "../../assets/css/Home/bootstrap.css";
import "../../assets/css/Home/responsive.css";
import "../../assets/css/Home/style.css";
import "../../assets/css/Home/home.css";
import "../../assets/css/Home/nav.css";
import { Link } from "react-router-dom";
import React, { useState } from "react";

const Nav = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="navigation">
            <header className="header_section long_section px-0">
                <nav className="navbar navbar-expand-lg custom_nav-container">
                    <a className="navbar-brand">
                        <span>Quizzet</span>
                    </a>
                    <button className="navbar-toggler" type="button" onClick={toggleMenu} aria-controls="navbarSupportedContent" aria-expanded={isOpen} aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarSupportedContent">
                        <div className="d-flex mx-auto flex-column flex-lg-row align-items-center">
                            <ul className="navbar-nav">
                                <li className="nav-item active">
                                    <a className="nav-link">Home <span className="sr-only">(current)</span></a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="about.html"> About</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="furniture.html">Furnitures</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="blog.html">Blog</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="contact.html">Contact Us</a>
                                </li>
                            </ul>
                        </div>
                        <div className="quote_btn-container">
                            <a href="">
                                <span><Link to="/loginuser">User</Link></span>
                                <i className="fa fa-user" aria-hidden="true"></i>
                            </a>
                            <a href="">
                                <span><Link to="/loginuser">Admin</Link></span>
                                <i className="fa fa-user" aria-hidden="true"></i>
                            </a>
                        </div>
                    </div>
                </nav>
            </header>
        </div>
    );
};

export default Nav;