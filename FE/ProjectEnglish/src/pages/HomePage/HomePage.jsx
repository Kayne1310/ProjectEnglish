//home age
import "../../assets/css/Home/home.css";
import Slider from "../../assets/image/slider-img.png";
import About from "../../assets/image/about-img.png";
import ListQuizz from "../ListQuizz/ListQuizz";
import ContactUs from "./ContactUsPage";
import b1 from "../../assets/image/b1.jpg";
import b2 from "../../assets/image/b2.jpg";
import b3 from "../../assets/image/b3.jpg";
import { Link } from "react-router-dom";

import FlashcardList from "../FlashCard/ListStudySet";

import ListDocument from "../Document/ListDocument";
import AOS from "aos";
import "../../../node_modules/aos/dist/aos.css";
import { useEffect } from "react";

const HomePage = () => {
    useEffect(() => {
        AOS.init({ duration: 1000, once: true }); // Hiệu ứng 1 giây, chạy một lần duy nhất
        
      }, []);

    return (
        <>
        
         <div className="w-100" style={{ height: '60px', backgroundColor: '#f9fafa' }}></div>
            <div className="hero_area">
                {/* <!-- slider section --> */}
                <section className="slider_section long_section" style={{ height: '600px' }}>
                   <div className="container2">
                    <div id="customCarousel" className="carousel slide" data-bs-ride="carousel">
                        <div className="carousel-inner">
                            <div className="carousel-item active">
                                <div className="container">
                                    <div className="row">
                                        <div className="col-md-5"  data-aos="fade-right">
                                            <div className="detail-box">
                                                <h1>Learning English is easy!</h1>
                                                <p>Luyện nghe, nói, đọc và viết với bạn mỗi ngày để tự tin hơn trong cuộc sống và công việc.</p>                                        
                                            </div>
                                        </div>
                                        <div className="col-md-7" data-aos="fade-left">
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
                                                <h1>Start learning English today!</h1>
                                                <p>Khám phá cách học tiếng Anh đơn giản, thú vị và hiệu quả mỗi ngày.</p>
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
                   </div>
                </section>

                {/* <!-- end slider section --> */}
            </div>

            {/* <div className="w-100" style={{ height: '50px', backgroundColor: '#f9fafa' }}></div> */}




            <section className="slider_section long_section">
                <div className="container2 " style={{ height: '500px' }}>
                    <div className="row">
                        <div className="col-md-6 mt-5" data-aos="zoom-in">
                            <div className="img-box">
                                <img src={About} />
                            </div>
                        </div>
                        <div className="col-md-6 mt-5" data-aos="fade-up">
                            <div className="detail-box">
                                <div className="heading_container">
                                    <h2>
                                        About Us
                                    </h2>
                                </div>
                                <p> Chào mừng bạn đến với nền tảng học tiếng Anh của chúng tôi!
                                    Tại đây, bạn sẽ được cải thiện kỹ năng tiếng Anh qua bài học thú vị, luyện tập thực tế và sự hỗ trợ từ cộng đồng.
                                    Bắt đầu hành trình chinh phục tiếng Anh ngay hôm nay!</p>
                                {/* <a href="">
                                    Read More
                                </a> */}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="w-100" style={{ height: '50px', backgroundColor: '#f9fafa' }}></div>

            {/* <!-- end about section -->

            <!-- blog section --> */}
            <section className="blog_section layout_padding long_section mb-5" >
                <div className="container">
                    <div className="heading_container">
                        <h2>welcome Quizzet</h2>
                    </div>
                    <div className="row">
                        <div className="col-md-6 col-lg-4 mx-auto" data-aos="zoom-in">
                            <div className="box">
                                <div className="img-box">
                                    <img src={b1} alt="Flashcard" />
                                </div>
                                <div className="detail-box">
                                    <h5>Flashcard</h5>
                                    <p>Flashcard là một trong những cách tốt nhất để ghi nhớ những kiến thức quan trọng.</p>
                                    <div className="btn-box "> <Link to="/flashcard">Read More</Link></div>
                                   
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-4 mx-auto" data-aos="fade-up">
                            <div className="box">
                                <div className="img-box">
                                    <img src={b2} alt="Quiz" />
                                </div>
                                <div className="detail-box">
                                    <h5>Quiz</h5>
                                    <p>Tổng hợp những bài quiz để bạn kiểm tra thử kiến thức của bản thân</p>
                                    <div className="btn-box "> <Link to="/listquizz">Read More</Link></div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-4 mx-auto" data-aos="zoom-in">
                            <div className="box">
                                <div className="img-box">
                                    <img src={b3} alt="Tài liệu" />
                                </div>
                                <div className="detail-box">
                                    <h5>Document</h5>
                                    <p>Tổng hợp những tài liệu của nhiều môn luôn sẵn sàng để bạn ôn bài hiệu quả nhất</p>
                                    <div className="btn-box "><Link to="/listdocument">Read More</Link></div> 
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
     
            <FlashcardList aos={AOS}/>

            <ListQuizz aos={AOS} />

            <ListDocument/>
            {/* <!-- Contact Section --> */}
            <ContactUs />
            

            {/* <!-- Info Section --> */}


        </>
    );
}
export default HomePage;