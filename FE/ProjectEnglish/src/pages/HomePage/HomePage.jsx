//home age
import "../../assets/css/Home/style.scss";
import "../../assets/css/Home/bootstrap.css";
import "../../assets/css/Home/responsive.css";
import "../../assets/css/Home/style.css";
import "../../assets/css/Home/home.css";
import Slider from "../../assets/image/slider-img.png";
import About from "../../assets/image/about-img.png";
import b1 from "../../assets/image/b1.jpg";
import b2 from "../../assets/image/b2.jpg";
import b3 from "../../assets/image/b3.jpg";
const HomePage = () => {
    return (
        <>


            <div class="main-content">
                {/* <!-- slider section --> */}
                <section class="slider_section long_section">
                    <div id="customCarousel" class="carousel slide" data-ride="carousel">
                        <div class="carousel-inner">
                            <div class="carousel-item active">
                                <div class="container">
                                    <div class="row">
                                        <div class="col-md-5">
                                            <div class="detail-box">
                                                <h1>For All Your
                                                    {/* <br> */}
                                                    English Learning Needs</h1>
                                                <p>Improve your English skills with interactive lessons, quizzes, and expert guidance.</p>
                                                <div class="btn-box">
                                                    <a href="" class="btn1">Start Learning</a>
                                                    <a href="" class="btn2">Explore Courses</a>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-7">
                                            <div class="img-box">
                                                <img src={Slider} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <ol class="carousel-indicators">
                            <li data-target="#customCarousel" data-slide-to="0" class="active"></li>
                        </ol>
                    </div>
                </section>
                {/* <!-- end slider section --> */}
            </div>



            <section class="about_section layout_padding long_section">
                <div class="container">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="img-box">
                                <img src={About} />
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="detail-box">
                                <div class="heading_container">
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

            <section class="blog_section layout_padding">
                <div class="container">
                    <div class="heading_container">
                        <h2>
                            Quizzet
                        </h2>
                    </div>
                    <div class="row">
                        <div class="col-md-6 col-lg-4 mx-auto">
                            <div class="box">
                                <div class="img-box">
                                    <img src={b1} />
                                </div>
                                <div class="detail-box">
                                    <h5>
                                        Flashcard
                                    </h5>
                                    <p>
                                        Flashcard là một trong những cách tốt nhất để ghi nhớ những kiến thức quan trọng.</p>
                                    <a href="">
                                        Read More
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 col-lg-4 mx-auto">
                            <div class="box">
                                <div class="img-box">
                                    <img src={b2} />
                                </div>
                                <div class="detail-box">
                                    <h5>
                                        Quiz
                                    </h5>
                                    <p>
                                        Tổng hợp những bài quiz để bạn kiểm tra thử kiến thức của bản thân              </p>
                                    <a href="">
                                        Read More
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 col-lg-4 mx-auto">
                            <div class="box">
                                <div class="img-box">
                                    <img src={b3} />
                                </div>
                                <div class="detail-box">
                                    <h5>
                                        Tài liệu              </h5>
                                    <p>
                                        Tổng hợp những tài liệu của nhiều môn luôn sẵn sàng để bạn ôn bài hiệu quả nhất              </p>
                                    <a href="">
                                        Read More
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* <!-- Contact Section --> */}
            <section class="contact_section">
                <div class="container">
                    <div class="row align-items-center">
                        {/* <!-- Contact Form --> */}
                        <div class="col-md-12">
                            <div class="form_container">
                                <div class="heading_container text-center">
                                    <h2>Contact Us</h2>
                                </div>
                                <form action="">
                                    <div class="form-group">
                                        <label for="name">Your Name</label>
                                        <input type="text" id="name" placeholder="Enter your full name" required />
                                    </div>
                                    <div class="form-group">
                                        <label for="phone">Phone Number</label>
                                        <input type="tel" id="phone" placeholder="Enter your phone number" required />
                                    </div>
                                    <div class="form-group">
                                        <label for="email">Email</label>
                                        <input type="email" id="email" placeholder="Enter your email address" required />
                                    </div>
                                    <div class="form-group">
                                        <label for="message">Message</label>
                                        <textarea id="message" class="message-box" placeholder="Write your message here..." required></textarea>
                                    </div>
                                    <div class="btn_box text-center">
                                        <button type="submit">SEND MESSAGE</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        {/* <!-- Map Section --> */}

                    </div>
                </div>
            </section>

            {/* <!-- Info Section --> */}
            <section class="info_section">
                <div class="container">
                    <div class="contact_nav">
                        <a href="tel:+01123455678990">
                            <i class="fa fa-phone"></i>
                            <span>Call: 01234567890</span>
                        </a>
                        <a href="mailto:demo@gmail.com">
                            <i class="fa fa-envelope"></i>
                            <span>Email: demo@gmail.com</span>
                        </a>
                        <a href="#">
                            <i class="fa fa-map-marker"></i>
                            <span>Btec Fpt </span>
                        </a>
                    </div>

                    <div class="info_top">
                        <div class="row">
                            <div class="col-sm-6 col-md-4 col-lg-3">
                                <div class="info_links">
                                    <div class="info_links_menu">
                                        <a href="index.html">Home</a>
                                        <a href="about.html">About Us</a>
                                        <a href="courses.html">Courses</a>
                                        <a href="blog.html">Blog</a>
                                        <a href="contact.html">Contact Us</a>
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-6 col-md-4 col-lg-3 mx-auto">
                                <div class="info_post">
                                    <div class="post_box">

                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="info_form">
                                    <form action="">
                                        <input type="email" placeholder="Enter Your Email" required />
                                        <button type="submit">Subscribe</button>
                                    </form>
                                    <div class="social_box">
                                        <a href="#"><i class="fa fa-facebook"></i></a>
                                        <a href="#"><i class="fa fa-twitter"></i></a>
                                        <a href="#"><i class="fa fa-linkedin"></i></a>
                                        <a href="#"><i class="fa fa-instagram"></i></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
export default HomePage;