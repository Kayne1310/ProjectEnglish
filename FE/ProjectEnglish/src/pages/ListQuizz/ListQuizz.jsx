import React, { useEffect, useState } from "react";
import b1 from "../../assets/image/b1.jpg";
import b2 from "../../assets/image/b2.jpg";
import b3 from "../../assets/image/b3.jpg";
import '../../assets/css/Home/document.css';


import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

const ListQuizz = () => {
    const location = useLocation(); // Lấy đường dẫn hiện tại
    const isQuizletPage = location.pathname === "/listquizz/detailquiz";
    //     const [arrQuiz, setArrQuiz] = useState([]);

    //     useEffect(() => {
    //         getQuizData();
    //     }, []);

    //     const getQuizData = async () => {
    //         const res = await getQuizByUser();
    //         if (res && res.EC === 0) {
    //             setArrQuiz(res.DT);
    //         }
    // }

    return (
        <>

            {/* Nếu không phải trang QuizletForm thì hiển thị ListQuizz */}
            {!isQuizletPage && (
                <section className="contact_section p-5">
                    <div className="container">
                        <div className="mt-10 mb-5 text-third">
                            <h1 className="text-3xl font-bold">Tài liệu</h1>
                            <p>
                                Tổng hợp những tài liệu của nhiều môn luôn sẵn sàng để bạn ôn bài hiệu quả nhất.
                            </p>
                            <p>
                                Nếu bạn có tài liệu cần đưa lên web? bấm vào nút dưới để
                                <a className="underline text-primary" href="mailto:khanhdjkl@gmail.com" style={{textDecoration:"none"}}> gửi tài liệu</a>
                                cho mình nhá
                            </p>
                        </div>
                        <div className="d-flex flex-wrap gap-3 mt-3 mb-3 w-100">
                            <button className="btn btn-primary flex-grow-1">Default</button>
                            <button className="btn btn-primary flex-grow-1 btn-hover-text" data-hover="Sắp xếp theo chữ cái">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-sort-alpha-down" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M10.082 5.629 9.664 7H8.598l1.789-5.332h1.234L13.402 7h-1.12l-.419-1.371zm1.57-.785L11 2.687h-.047l-.652 2.157z" />
                                    <path d="M12.96 14H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645zM4.5 2.5a.5.5 0 0 0-1 0v9.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L4.5 12.293z" />
                                </svg>
                            </button>
                            <button className="btn btn-primary flex-grow-1 btn-hover-text" data-hover="Sắp xếp theo số lượng câu hỏi">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-sort-numeric-down" viewBox="0 0 16 16">
                                    <path d="M12.438 1.668V7H11.39V2.684h-.051l-1.211.859v-.969l1.262-.906h1.046z" />
                                    <path fill-rule="evenodd" d="M11.36 14.098c-1.137 0-1.708-.657-1.762-1.278h1.004c.058.223.343.45.773.45.824 0 1.164-.829 1.133-1.856h-.059c-.148.39-.57.742-1.261.742-.91 0-1.72-.613-1.72-1.758 0-1.148.848-1.835 1.973-1.835 1.09 0 2.063.636 2.063 2.687 0 1.867-.723 2.848-2.145 2.848zm.062-2.735c.504 0 .933-.336.933-.972 0-.633-.398-1.008-.94-1.008-.52 0-.927.375-.927 1 0 .64.418.98.934.98" />
                                    <path d="M4.5 2.5a.5.5 0 0 0-1 0v9.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L4.5 12.293z" />
                                </svg>
                            </button>
                            <select className="form-select w-auto flex-grow-1">
                                <option value="none">Tất cả</option>
                                <option value="daicuong">Đại cương</option>
                                <option value="lsdang">Lịch sử Đảng</option>
                                <option value="tthcm">Tư tưởng HCM</option>
                                <option value="triet">Triết học</option>
                                <option value="taichinh">Tài chính - Ngân hàng</option>
                                <option value="cntt">CNTT</option>
                                <option value="ketoan">Kế toán</option>
                                <option value="dieuduong">Điều dưỡng</option>
                                <option value="kythuat">Kỹ thuật</option>
                                <option value="thucpham">Thực phẩm</option>
                                <option value="qtkd">Quản trị kinh doanh</option>
                                <option value="dulich">Du lịch - Lữ hành</option>
                                <option value="khachsan">Quản trị khách sạn</option>
                                <option value="dongphuonghoc">Đông phương học</option>
                                <option value="anh">Ngôn ngữ Anh</option>
                                <option value="trung">Ngôn ngữ Trung</option>
                            </select>
                            <input type="text" className="form-control w-auto flex-grow-1" placeholder="Tìm tên tài liệu..." />
                            <a className="btn btn-secondary text-center flex-grow-1" href="/tailieu/themtailieu">Thêm tài liệu</a>
                            <a className="btn btn-primary d-flex align-items-center justify-content-center gap-2 flex-grow-1" href="/flashcard">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file" viewBox="0 0 16 16">
                                    <path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1" />
                                </svg>  Flashcard
                            </a>
                        </div>



                        <div className="row ">

                            <div className="col-md-4 col-lg-3 pb-3">
                                <div className="card card-custom bg-white border-white border-0">
                                    <div
                                        className="card-custom-img"
                                        style={{
                                            backgroundImage: `url("https://res.cloudinary.com/dvm1fjo7a/image/upload/v1740048094/QUIZ/fcba4c3d-77dd-4f0d-ab7c-9899ca71864d.png")`,
                                        }}
                                    ></div>
                                    <div className="card-custom-avatar">
                                        <img
                                            className="img-fluid"
                                            src="https://scontent.fhan2-3.fna.fbcdn.net/v/t1.30497-1/84628273_176159830277856_972693363922829312_n.jpg?stp=c379.0.1290.1290a_cp0_dst-jpg_s50x50_tt6&_nc_cat=1&ccb=1-7&_nc_sid=7565cd&_nc_eui2=AeF2IVd41-b8yGHepbghN72Vik--Qfnh2B6KT75B-eHYHnm_ViUHtY5FwQVRs2Lgi_x6XpAWterpDWSlCVy9rsPO&_nc_ohc=aG4wLkfBojIQ7kNvgFREMO7&_nc_oc=Adj2CDWA8K7xlUx0Nd6ceJNen9WWNUkbOjjyBZosXAKGdUxe6RoaAaX9RB4UF1JZCvQ&_nc_zt=24&_nc_ht=scontent.fhan2-3.fna&edm=AP4hL3IEAAAA&_nc_gid=AHnkCKPOQW0jQnWvQ1A9x-T&oh=00_AYAKZok1aKLxlEe-EO11uiMcEmbEi22Phgxa-_ujtPoA6A&oe=67D15119"
                                            alt="Avatar"
                                        />
                                    </div>
                                    <div className="card-body card-body-fixed" style={{ overflowY: "hidden" }}>
                                        <h4 className="card-title">Card title Card titleCard titleCard titleCard titleCard title </h4>
                                        <p className="card-text">
                                            Descrip tion
                                        </p>
                                        <p className="card-text view">
                                            <i className="fas fa-eye "></i>
                                            View
                                        </p>
                                        <p className="card-text view">
                                            <i className="fas fa-question-circle "></i>
                                            Số Câu hỏi :100
                                        </p>
                                    </div>
                                    <div className="card-footer" style={{ background: "inherit", borderColor: "inherit" }}>
                                        <a href="#" className="btn btn-primary ">
                                            Option
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4 col-lg-3 pb-3">
                                <div className="card card-custom bg-white border-white border-0">
                                    <div
                                        className="card-custom-img"
                                        style={{
                                            backgroundImage: `url("https://res.cloudinary.com/dvm1fjo7a/image/upload/v1740048094/QUIZ/fcba4c3d-77dd-4f0d-ab7c-9899ca71864d.png")`,
                                        }}
                                    ></div>
                                    <div className="card-custom-avatar">
                                        <img
                                            className="img-fluid"
                                            src="https://scontent.fhan2-3.fna.fbcdn.net/v/t1.30497-1/84628273_176159830277856_972693363922829312_n.jpg?stp=c379.0.1290.1290a_cp0_dst-jpg_s50x50_tt6&_nc_cat=1&ccb=1-7&_nc_sid=7565cd&_nc_eui2=AeF2IVd41-b8yGHepbghN72Vik--Qfnh2B6KT75B-eHYHnm_ViUHtY5FwQVRs2Lgi_x6XpAWterpDWSlCVy9rsPO&_nc_ohc=aG4wLkfBojIQ7kNvgFREMO7&_nc_oc=Adj2CDWA8K7xlUx0Nd6ceJNen9WWNUkbOjjyBZosXAKGdUxe6RoaAaX9RB4UF1JZCvQ&_nc_zt=24&_nc_ht=scontent.fhan2-3.fna&edm=AP4hL3IEAAAA&_nc_gid=AHnkCKPOQW0jQnWvQ1A9x-T&oh=00_AYAKZok1aKLxlEe-EO11uiMcEmbEi22Phgxa-_ujtPoA6A&oe=67D15119"
                                            alt="Avatar"
                                        />
                                    </div>
                                    <div className="card-body card-body-fixed" style={{ overflowY: "hidden" }}>
                                        <h4 className="card-title">Card title Card titleCard titleCard titleCard titleCard title </h4>
                                        <p className="card-text">
                                            Descrip tion
                                        </p>
                                        <p className="card-text view">
                                            <i className="fas fa-eye "></i>
                                            View
                                        </p>
                                        <p className="card-text view">
                                            <i className="fas fa-question-circle "></i>
                                            Số Câu hỏi :100
                                        </p>
                                    </div>
                                    <div className="card-footer" style={{ background: "inherit", borderColor: "inherit" }}>
                                        <a href="#" className="btn btn-primary ">
                                            Option
                                        </a>
                                    </div>
                                </div>
                            </div>        <div className="col-md-4 col-lg-3 pb-3">
                                <div className="card card-custom bg-white border-white border-0">
                                    <div
                                        className="card-custom-img"
                                        style={{
                                            backgroundImage: `url("https://res.cloudinary.com/dvm1fjo7a/image/upload/v1740048094/QUIZ/fcba4c3d-77dd-4f0d-ab7c-9899ca71864d.png")`,
                                        }}
                                    ></div>
                                    <div className="card-custom-avatar">
                                        <img
                                            className="img-fluid"
                                            src="https://scontent.fhan2-3.fna.fbcdn.net/v/t1.30497-1/84628273_176159830277856_972693363922829312_n.jpg?stp=c379.0.1290.1290a_cp0_dst-jpg_s50x50_tt6&_nc_cat=1&ccb=1-7&_nc_sid=7565cd&_nc_eui2=AeF2IVd41-b8yGHepbghN72Vik--Qfnh2B6KT75B-eHYHnm_ViUHtY5FwQVRs2Lgi_x6XpAWterpDWSlCVy9rsPO&_nc_ohc=aG4wLkfBojIQ7kNvgFREMO7&_nc_oc=Adj2CDWA8K7xlUx0Nd6ceJNen9WWNUkbOjjyBZosXAKGdUxe6RoaAaX9RB4UF1JZCvQ&_nc_zt=24&_nc_ht=scontent.fhan2-3.fna&edm=AP4hL3IEAAAA&_nc_gid=AHnkCKPOQW0jQnWvQ1A9x-T&oh=00_AYAKZok1aKLxlEe-EO11uiMcEmbEi22Phgxa-_ujtPoA6A&oe=67D15119"
                                            alt="Avatar"
                                        />
                                    </div>
                                    <div className="card-body card-body-fixed" style={{ overflowY: "hidden" }}>
                                        <h4 className="card-title">Card title Card titleCard titleCard titleCard titleCard title </h4>
                                        <p className="card-text">
                                            Descrip tion
                                        </p>
                                        <p className="card-text view">
                                            <i className="fas fa-eye "></i>
                                            View
                                        </p>
                                        <p className="card-text view">
                                            <i className="fas fa-question-circle "></i>
                                            Số Câu hỏi :100
                                        </p>
                                    </div>
                                    <div className="card-footer" style={{ background: "inherit", borderColor: "inherit" }}>
                                        <a href="#" className="btn btn-primary ">
                                            Option
                                        </a>
                                    </div>
                                </div>
                            </div>        <div className="col-md-4 col-lg-3 pb-3">
                                <div className="card card-custom bg-white border-white border-0">
                                    <div
                                        className="card-custom-img"
                                        style={{
                                            backgroundImage: `url("https://res.cloudinary.com/dvm1fjo7a/image/upload/v1740048094/QUIZ/fcba4c3d-77dd-4f0d-ab7c-9899ca71864d.png")`,
                                        }}
                                    ></div>
                                    <div className="card-custom-avatar">
                                        <img
                                            className="img-fluid"
                                            src="https://scontent.fhan2-3.fna.fbcdn.net/v/t1.30497-1/84628273_176159830277856_972693363922829312_n.jpg?stp=c379.0.1290.1290a_cp0_dst-jpg_s50x50_tt6&_nc_cat=1&ccb=1-7&_nc_sid=7565cd&_nc_eui2=AeF2IVd41-b8yGHepbghN72Vik--Qfnh2B6KT75B-eHYHnm_ViUHtY5FwQVRs2Lgi_x6XpAWterpDWSlCVy9rsPO&_nc_ohc=aG4wLkfBojIQ7kNvgFREMO7&_nc_oc=Adj2CDWA8K7xlUx0Nd6ceJNen9WWNUkbOjjyBZosXAKGdUxe6RoaAaX9RB4UF1JZCvQ&_nc_zt=24&_nc_ht=scontent.fhan2-3.fna&edm=AP4hL3IEAAAA&_nc_gid=AHnkCKPOQW0jQnWvQ1A9x-T&oh=00_AYAKZok1aKLxlEe-EO11uiMcEmbEi22Phgxa-_ujtPoA6A&oe=67D15119"
                                            alt="Avatar"
                                        />
                                    </div>
                                    <div className="card-body card-body-fixed" style={{ overflowY: "hidden" }}>
                                        <h4 className="card-title">Card title Card titleCard titleCard titleCard titleCard title </h4>
                                        <p className="card-text">
                                            Descrip tion
                                        </p>
                                        <p className="card-text view">
                                            <i className="fas fa-eye "></i>
                                            View
                                        </p>
                                        <p className="card-text view">
                                            <i className="fas fa-question-circle "></i>
                                            Số Câu hỏi :100
                                        </p>
                                    </div>
                                    <div className="card-footer" style={{ background: "inherit", borderColor: "inherit" }}>
                                        <a href="#" className="btn btn-primary ">
                                            Option
                                        </a>
                                    </div>
                                </div>
                            </div>        <div className="col-md-4 col-lg-3 pb-3">
                                <div className="card card-custom bg-white border-white border-0">
                                    <div
                                        className="card-custom-img"
                                        style={{
                                            backgroundImage: `url("https://res.cloudinary.com/dvm1fjo7a/image/upload/v1740048094/QUIZ/fcba4c3d-77dd-4f0d-ab7c-9899ca71864d.png")`,
                                        }}
                                    ></div>
                                    <div className="card-custom-avatar">
                                        <img
                                            className="img-fluid"
                                            src="https://scontent.fhan2-3.fna.fbcdn.net/v/t1.30497-1/84628273_176159830277856_972693363922829312_n.jpg?stp=c379.0.1290.1290a_cp0_dst-jpg_s50x50_tt6&_nc_cat=1&ccb=1-7&_nc_sid=7565cd&_nc_eui2=AeF2IVd41-b8yGHepbghN72Vik--Qfnh2B6KT75B-eHYHnm_ViUHtY5FwQVRs2Lgi_x6XpAWterpDWSlCVy9rsPO&_nc_ohc=aG4wLkfBojIQ7kNvgFREMO7&_nc_oc=Adj2CDWA8K7xlUx0Nd6ceJNen9WWNUkbOjjyBZosXAKGdUxe6RoaAaX9RB4UF1JZCvQ&_nc_zt=24&_nc_ht=scontent.fhan2-3.fna&edm=AP4hL3IEAAAA&_nc_gid=AHnkCKPOQW0jQnWvQ1A9x-T&oh=00_AYAKZok1aKLxlEe-EO11uiMcEmbEi22Phgxa-_ujtPoA6A&oe=67D15119"
                                            alt="Avatar"
                                        />
                                    </div>
                                    <div className="card-body card-body-fixed" style={{ overflowY: "hidden" }}>
                                        <h4 className="card-title">Card title Card titleCard titleCard titleCard titleCard title </h4>
                                        <p className="card-text">
                                            Descrip tion
                                        </p>
                                        <p className="card-text view">
                                            <i className="fas fa-eye "></i>
                                            View
                                        </p>
                                        <p className="card-text view">
                                            <i className="fas fa-question-circle "></i>
                                            Số Câu hỏi :100
                                        </p>
                                    </div>
                                    <div className="card-footer" style={{ background: "inherit", borderColor: "inherit" }}>
                                        <a href="#" className="btn btn-primary ">
                                            Option
                                        </a>
                                    </div>
                                </div>
                            </div>

                        </div>



                    </div>

                </section>
            )
            }
            {/* Luôn luôn hiển thị component con */}
            <Outlet />
        </>
    );
}

export default ListQuizz;