//noi footer cua page

import { Link } from "react-router-dom";

const Footer = () => {
    return(
        <section className="info_section">
        <div className="container">
            <div className="contact_nav">
                <a href="tel:+01123455678990">
                    <i className="fa fa-phone"></i>
                    <span>Call: 01234567890</span>
                </a>
                <a href="mailto:demo@gmail.com">
                    <i className="fa fa-envelope"></i>
                    <span>Email: demo@gmail.com</span>
                </a>
                <Link href="#">
                    <i className="fa fa-map-marker"></i>
                    <span>Btec Fpt </span>
                </Link>
            </div>

            <div className="info_top">
                <div className="row">
                    <div className="col-sm-6 col-md-4 col-lg-3">
                        <div className="info_links">
                            <div className="info_links_menu">
                                <Link href="index.html">Home</Link>
                                <Link href="about.html">About Us</Link>
                                <Link href="courses.html">Courses</Link>
                                <Link href="blog.html">Blog</Link>
                                <Link href="contact.html">Contact Us</Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6 col-md-4 col-lg-3 mx-auto">
                        <div className="info_post">
                            <div className="post_box">

                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="info_form">
                            <form action="">
                                <input type="email" placeholder="Enter Your Email" required />
                                <button type="submit">Subscribe</button>
                            </form>
                            <div className="social_box">
                                <Link href="#"><i className="fa fa-facebook"></i></Link>
                                <Link href="#"><i className="fa fa-twitter"></i></Link>
                                <Link href="#"><i className="fa fa-linkedin"></i></Link>
                                <Link href="#"><i className="fa fa-instagram"></i></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    )
}

export default Footer;
