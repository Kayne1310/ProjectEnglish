import React, { useEffect, useState } from "react";
import b1 from "../../assets/image/b1.jpg";
import b2 from "../../assets/image/b2.jpg";
import b3 from "../../assets/image/b3.jpg";
// import '../../assets/css/Home/bootstrap.min.css';
import '../../assets/css/Home/home.css';


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
                // <section className="blog_section layout_padding">
                //     <div className="container">
                //         <div className="heading_container">
                //             <h2>Quizzet</h2>
                //         </div>
                //         {/* <div className="row">
                //             {arrQuiz && arrQuiz.length > 0 &&
                //                 arrQuiz.map((quiz, index) => {
                //                     return (

                //                         <div key={`${index}-quiz`} className="col-md-6 col-lg-4 mx-auto">
                //                             <div className="box">
                //                                 <div className="img-box">
                //                                     <img src={b1} alt="Flashcard" />
                //                                     <img src= {`data:image/jpeg;base64,${quiz.image}`} alt="Flashcard" />
                //                                 </div>
                //                                 <div className="detail-box">
                //                                     <h5>Quiz{index +1}</h5>
                //                                     <p>{quiz.description}</p>
                //                                     <Link to="quizlet">Read More</Link>
                //                                 </div>
                //                             </div>
                //                         </div>

                //                     )

                //                 }
                //                 )
                //             }

                //             {arrQuiz && arrQuiz.length === 0}
                //             <div>
                //                 you don't have any quiz now...
                //             </div>
                //         </div> */}

                //         <div className="row">

                //             <div className="col-md-6 col-lg-4 mx-auto">
                //                 <div className="box">
                //                     <div className="img-box">
                //                         <img src={b1} alt="Flashcard" />

                //                     </div>
                //                     <div className="detail-box">
                //                         <h5>Quiz</h5>
                //                         <p>hok nhieu len do ngu</p>
                //                         <Link to="detailquiz">Read More</Link>
                //                     </div>
                //                 </div>
                //             </div>

                //         </div>
                //     </div>
                // </section >
                <section className="contact_section p-5">

             
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4 ">
                    <div className="col">
                        <div className="card h-100 rounded-xl shadow-md" style={{ minHeight: '500px' }}>
                            <div className="position-relative h-100 rounded-3 overflow-hidden">
                                <Link className="d-block w-100 h-100 " to="/quiz/detail/cac-cau-hoi-ve-python-gTYKuL"  >
                                    <img
                                        
                                        alt="Các câu hỏi về python"
                                        fetchpriority="high"
                                        decoding="async"
                                        className="d-block img-fluid w-100  object-cover transition-transform "
                                        src="https://topdev.vn/blog/wp-content/uploads/2023/02/top-10-cau-hoi-phong-van-python-developer.png"
                                        style={{
                                     
                                            height: '100%',
                                            objectFit: 'cover',
                        
                                        }}
                        
                                    />
                                </Link>
                                <div className="card-img-overlay d-flex flex-column justify-content-end bg-gradient ">
                                    <h1 className="card-title text-white" style={{ fontSize: '18px', lineHeight: '1.75rem' }}>
                                        Các câu hỏi về python
                                    </h1>
                                    <p className="card-text text-white-50" style={{ fontSize: '14px', lineHeight: '1.25rem' }}>
                                        20 câu hỏi về Python siêu dễ
                                    </p>
                                    <div className="d-flex justify-content-end align-items-center gap-1 mb-1 text-muted small">
                                        <svg
                                            stroke="currentColor"
                                            fill="currentColor"
                                            strokeWidth="0"
                                            viewBox="0 0 576 512"
                                            height="1em"
                                            width="1em"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M288 144a110.94 110.94 0 0 0-31.24 5 55.4 55.4 0 0 1 7.24 27 56 56 0 0 1-56 56 55.4 55.4 0 0 1-27-7.24A111.71 111.71 0 1 0 288 144zm284.52 97.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400c-98.65 0-189.09-55-237.93-144C98.91 167 189.34 112 288 112s189.09 55 237.93 144C477.1 345 386.66 400 288 400z"
                                            ></path>
                                        </svg>
                                        <p className="mb-0 text-white">Lượt làm: 15</p>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center gap-1">
                                        <Link className="d-flex align-items-center gap-2" href="/profile/66f4137d4dacf0d78879b944">
                                            <div className="position-relative rounded-circle overflow-hidden" style={{ width: '40px', height: '40px' }}>
                                                <img
                                                    alt="Trọng An"
                                                    fetchpriority="high"
                                                    decoding="async"
                                                    className="img-fluid w-100 h-100 object-cover scale-125"
                                                    src="https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/hinh-anime-2.jpg"
                                                />
                                            </div>
                                            <div className="group">
                                                <div className="d-flex align-items-center gap-1">
                                                    <h2 className="h6 mb-0 text-truncate  text-white" style={{textDecoration:'none'}}>Trọng An</h2>
                                                    <svg
                                                        stroke="currentColor"
                                                        fill="currentColor"
                                                        strokeWidth="0"
                                                        viewBox="0 0 24 24"
                                                        color="#3b82f6"
                                                        height="1em"
                                                        width="1em"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        style={{ color: 'rgb(59, 130, 246)' }}
                                                    >
                                                        <path fill="none" d="M0 0h24v24H0z"></path>
                                                        <path
                                                            d="M23 11.99 20.56 9.2l.34-3.69-3.61-.82L15.4 1.5 12 2.96 8.6 1.5 6.71 4.69 3.1 5.5l.34 3.7L1 11.99l2.44 2.79-.34 3.7 3.61.82 1.89 3.2 3.4-1.47 3.4 1.46 1.89-3.19 3.61-.82-.34-3.69 2.44-2.8zm-3.95 1.48-.56.65.08.85.18 1.95-1.9.43-.84.19-.44.74-.99 1.68-1.78-.77-.8-.34-.79.34-1.78.77-.99-1.67-.44-.74-.84-.19-1.9-.43.18-1.96.08-.85-.56-.65L3.67 12l1.29-1.48.56-.65-.09-.86-.18-1.94 1.9-.43.84-.19.44-.74.99-1.68 1.78.77.8.34.79-.34 1.78-.77.99 1.68.44.74.84.19 1.9.43-.18 1.95-.08.85.56.65 1.29 1.47-1.28 1.48z"
                                                        ></path>
                                                        <path d="m10.09 13.75-2.32-2.33-1.48 1.49 3.8 3.81 7.34-7.36-1.48-1.49z"></path>
                                                    </svg>
                                                </div>
                                                <p className="text-muted small d-flex align-items-center gap-1 mb-0 text-white" >
                                                    <svg
                                                        stroke="currentColor"
                                                        fill="currentColor"
                                                        strokeWidth="0"
                                                        viewBox="0 0 24 24"
                                                        color="#D9D9D9"
                                                        height="1em"
                                                        width="1em"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        style={{ color: 'rgb(217, 217, 217)' }}
                                                    >
                                                        <g id="Timer">
                                                            <g>
                                                                <path
                                                                    d="M2.336,9.685A9.934,9.934,0,0,0,13.592,21.808,9.931,9.931,0,0,0,20.708,7.23,10.046,10.046,0,0,0,12,2.072a.507.507,0,0,0-.5.5v4.2a.5.5,0,0,0,1,0v-4.2l-.5.5a8.935,8.935,0,0,1,8.433,11.892A8.938,8.938,0,0,1,6.468,19.027,9.041,9.041,0,0,1,3.3,9.951c.142-.627-.822-.9-.964-.266Z"
                                                                ></path>
                                                                <path d="M7.4,8.117a.5.5,0,0,1,.707-.707l4.243,4.242h0a.5.5,0,0,1-.707.707Z"></path>
                                                            </g>
                                                        </g>
                                                    </svg>{' '}
                                                    khoảng 1 tháng trước
                                                </p>
                                            </div>
                                        </Link>
                                        <Link
                                            className="d-flex align-items-center gap-1 btn btn-primary rounded-md text-sm"
                                            href="/quiz/cac-cau-hoi-ve-python-gTYKuL"
                                        >
                                            Làm bài
                                            <svg
                                                stroke="currentColor"
                                                fill="currentColor"
                                                strokeWidth="0"
                                                viewBox="0 0 512 512"
                                                height="1em"
                                                width="1em"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    fill="none"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="32"
                                                    d="M262.62 336 342 256l-79.38-80m68.35 80H170"
                                                ></path>
                                                <path
                                                    fill="none"
                                                    strokeMiterlimit="10"
                                                    strokeWidth="32"
                                                    d="M256 448c106 0 192-86 192-192S362 64 256 64 64 150 64 256s86 192 192 192z"
                                                ></path>
                                            </svg>
                                        </Link>
                                    </div>
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