//noi footer cua page

import { Link } from "react-router-dom";

const Footer = () => {
    return(
        <section className="info_section">
        <div className="container">
            <div className="contact_nav">
                <Link href="tel:+01123455678990">
                    <i className="fa fa-phone"></i>
                    <span> 0365744381</span>
                </Link>
                <Link href="mailto:demo@gmail.com">
                    <i className="fa fa-envelope"></i>
                    <span>khanhdjkl@gmail.com</span>
                </Link>
                <Link href="#">
                    <i className="fa fa-map-marker"></i>
                    <span>Ha noi </span>
                </Link>
            </div>

            <div className="info_top">
                <div className="row d-flex  justify-content-center ">
                    <div className="col-md-4  ">
                        <div className="info_form">
                            <form action="">
                                <input type="email" placeholder="Enter Your Email" required />
                                <button type="submit">Subscribe</button>
                            </form>
                            <div className="social_box d-flex justify-content-center">
                                <Link to="https://www.facebook.com/ysbalaba"><i class="fa-brands fa-facebook-f"></i></Link>
                                <Link to="#"><i class="fa-brands fa-google"></i></Link>
                                <Link to="https://github.com/Kayne1310"><i class="fa-brands fa-github"></i></Link>
                                <Link to="https://www.instagram.com/kayne.1310/"><i class="fa-brands fa-instagram"></i></Link>
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
