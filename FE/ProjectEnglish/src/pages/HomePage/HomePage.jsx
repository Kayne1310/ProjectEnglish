//home age
import "../../assets/css/Home/style.scss";
// import "../../assets/css/Home/bootstrap.css";
import "../../assets/css/Home/responsive.css";
import "../../assets/css/Home/style.css";
import "../../assets/css/Home/home.css";
import Slider from "../../assets/image/slider-img.png";
import About from "../../assets/image/about-img.png";
import ListQuizz from "../ListQuizz/ListQuizz";
import ContactUs from "./ContactUsPage";
import userContext from "../../reactContext/userReactContext";
import { useContext } from "react";
// import Footer from "../../components/layout/footer";



const HomePage = () => {
   
    return (
        <>
            <div className="hero_area">
                {/* <!-- slider section --> */}

                <section className="slider_section long_section">
                    <div id="customCarousel" className="carousel slide" data-bs-ride="carousel">
                        <div className="carousel-inner">
                            <div className="carousel-item active">
                                <div className="container">
                                    <div className="row">
                                        <div className="col-md-5">
                                            <div className="detail-box">
                                                <h1>For All Your <br /> Furniture Needs</h1>
                                                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                                                <div className="btn-box">
                                                    <a href="#" className="btn1">Contact Us  </a>
                                                    <a href="#" className="btn2">About Us</a>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-7">
                                            <div className="img-box">
                                                <img src={Slider} alt="" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="carousel-item">
                                <div className="container">
                                    <div className="row">
                                        <div className="col-md-5">
                                            <div className="detail-box">
                                                <h1>High Quality Furniture</h1>
                                                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                                            </div>
                                        </div>
                                        <div className="col-md-7">
                                            <div className="img-box">
                                                <img src={Slider} alt="" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <ol className="carousel-indicators">
                            <li data-bs-target="#customCarousel" data-bs-slide-to="0" className="active"></li>
                            <li data-bs-target="#customCarousel" data-bs-slide-to="1"></li>
                        </ol>


                        <a className="carousel-control-prev" href="#customCarousel" role="button" data-bs-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        </a>
                        <a className="carousel-control-next" href="#customCarousel" role="button" data-bs-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        </a>
                    </div>
                </section>

                {/* <!-- end slider section --> */}
            </div>

            <div className="w-100 bg-white" style={{ height: '50px' }}></div>



            <section className="about_section layout_padding long_section">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="img-box">
                                <img src={About} />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="detail-box">
                                <div className="heading_container">
                                    <h2>
                                        About Us
                                    </h2>
                                </div>
                                <p> Welcome to Our English Learning Platform!
                                    We are dedicated to helping you improve your English skills through engaging lessons, interactive exercises, and real-life practice. Whether you're a beginner or looking to enhance your fluency, our platform provides structured courses, expert guidance, and a supportive learning community.

                                    Start your journey to mastering English today!</p>
                                <a href="">
                                    Read More
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* <!-- end about section -->

            <!-- blog section --> */}
            <ListQuizz />

            {/* <!-- Contact Section --> */}
            <ContactUs />

            {/* <!-- Info Section --> */}


        </>
    );
}
export default HomePage;