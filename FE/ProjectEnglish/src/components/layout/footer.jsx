//noi footer cua page

import { Link } from "react-router-dom";

const Footer = () => {
    return(
        <section className="info_section">
        <div className="container">
            <div className="contact_nav">
                <Link href="tel:+01123455678990">
                    <i className="fa fa-phone"></i>
                    <span>Call: 0365744381</span>
                </Link>
                <Link href="mailto:demo@gmail.com">
                    <i className="fa fa-envelope"></i>
                    <span>Email: khanhdjkl@gmail.com</span>
                </Link>
                <Link href="#">
                    <i className="fa fa-map-marker"></i>
                    <span>Ha noi </span>
                </Link>
            </div>

            <div className="info_top">
                <div className="row">
                  
                    <div className="col-sm-12 col-md-12 col-lg-3 mx-auto">
                        <div className="info_post">
                            <div className="post_box">

                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 ">
                        <div className="info_form">
                            <form action="">
                                <input type="email" placeholder="Enter Your Email" required />
                                <button type="submit">Subscribe</button>
                            </form>
                            <div className="social_box d-flex justify-content-center">
                                <Link href="#"><i class="fa-brands fa-facebook-f"></i></Link>
                                <Link href="#"><i class="fa-brands fa-google"></i></Link>
                                <Link href="#"><i class="fa-brands fa-github"></i></Link>
                                <Link href="#"><i class="fa-brands fa-instagram"></i></Link>
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
