// import React from 'react';
import './Flashcardcanh.css'; // Import file CSS
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
// import b2 from "../../assets/image/b2.jpg";
import covn from '../../assets/image/covn.jpg'
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getListFlashCardByStudySetId } from '../../service/flashcardService';
import { calculateDaysAgo } from '../../helpers/DateHepler';
import { AuthContext } from '../../components/layout/context/authContext';


const Flashcardcanh = () => {
    const { userInfor } = useContext(AuthContext);
    const [flashcards, setFlashcards] = useState([]);
    const { id } = useParams(); // Get studySet ID from URL
    const [studySet, setStudySet] = useState(null);
    // const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState(null);
    const [PictureUrl, setPictureUrl] = useState(null);

    useEffect(() => {

        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => new bootstrap.Modal(modal));

        const fetchFlashcards = async () => {
            try {
                const data = await getListFlashCardByStudySetId(id);

                // Access the data property from response

                console.log("data", data);
                setFlashcards(data.listFlashcards);
                setStudySet(data.studySet);
                setUserName(data.username);
                setPictureUrl(data.pictureUrl);
            } catch (error) {
                console.error('Error fetching flashcards:', error);
            }
        };

        fetchFlashcards();
    }, [id]);


    return (
        <div className="container">

            {/* Container Fluid */}
            {studySet && (
                <>
                    <a href="#" className="flashcardcanh-btn-back text-decoration-none">Quay lại</a>
                    <div className="d-flex justify-content-between align-items-center">

                        <h2 className="flashcardcanh-header-title fs-1" style={{ color: "rgb(33 135 213", }}>Flashcard: {studySet.title}</h2>
                        {studySet.userId === userInfor.userId && (
                            <div className="d-flex justify-content-between gap-2 align-items-center">
                                <div className="d-flex gap-2 align-items-center" style={{ height: "36px" }}>
                                    <button className="btn btn-primary h-100 rounded">
                                        <i className="bi bi-pencil"></i>
                                    </button>
                                    <button className="btn btn-primary h-100 rounded" data-bs-toggle="modal" data-bs-target="#addWordModal">
                                        <i className="bi bi-plus-lg"></i>
                                    </button>
                                    <button className="btn btn-primary d-flex align-items-center gap-1 rounded">
                                        <i className="bi bi-grid"></i> Thêm nhiều
                                    </button>
                                </div>
                                <div>
                                    <button className="btn btn-danger d-flex align-items-center gap-1">
                                        <i className="bi bi-trash"></i> Xóa
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <p className="fs-3 font-italic" style={{ color: "rgb(126 154 210)", }}>{studySet.desc}</p>
                    <p >
                        Ngôn ngữ :
                        <img
                            style={{
                                width: '30px',
                                height: '20px',
                                marginRight: '10px',
                                verticalAlign: 'middle',
                                marginLeft: '10px',
                            }}
                            src={studySet.imageCountry} />


                    </p>

                    <p className="flashcardcanh-creator">
                        Người tạo: {userName}
                        <img
                            className="flashcardcanh-avatar"
                            src={PictureUrl}
                            alt="Avatar người tạo"
                        />
                    </p>
                    <div className="flashcardcanh-mt-3">
                        <button className="flashcardcanh-btn-practice">Luyện tập</button>
                        <button className="flashcardcanh-btn-practice">Luyện tập theo khoa học (beta)</button>
                    </div>
                    <p className="flashcardcanh-mt-2 text-muted">
                        Dựa trên nghiên cứu về đường cong lãng quên của Hermann Ebbinghaus,
                        chúng tôi khuyến khích bạn ôn lại 5-7 lần tại các khoảng thời gian khác nhau để ghi nhớ lâu dài.
                    </p>
                    <div className="flashcardcanh-stats-box w-100">
                        <div className="flashcardcanh-row flashcardcanh-mt-3 w-100 ">
                            <div className="col-3 border flashcardcanh-stat-item flashcardcanh-learned">Tất cả <br />51</div>
                            <div className="col-3 border flashcardcanh-stat-item flashcardcanh-new">Đã nhớ<br />0</div>
                            <div className="col-3 border flashcardcanh-stat-item flashcardcanh-review">Ôn tập<br />0</div>
                            <div className="col-3 border flashcardcanh-stat-item flashcardcanh-mastered">Ghi nhớ <br />51</div>
                        </div>

                    </div>
                </>
            )}

            {/* Flashcard 1 */}
            <div className="flashcardcanh-columns">
                {flashcards && flashcards.map((data) => (
                    <div className="flashcardcanh-container mb-5">
                        <div className="flashcardcanh-header">
                            <span className="flashcardcanh-canontap">Thẻ cân ôn tập</span>
                            <span className="flashcardcanh-sobaihoc">Số bài học: 99+</span>
                            <span className="flashcardcanh-ghinho">Ghi nhớ: 99%+</span>
                        </div>
                        <h1 className="flashcardcanh-title">{data.title} <span className="flashcardcanh-audio-icon"><i class="bi bi-volume-up"></i></span></h1>
                        <p className="flashcardcanh-subtitle f">( {data.typeOfWord} )</p>

                        <span className="flashcardcanh-definition font-weight-bold">Định nghĩa : </span>
                        <span>{data.define}</span>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <p className="flashcardcanh-source font-weight-bold mb-0">Ví dụ:</p>
                            <span className="flashcardcanh-time p-1">{calculateDaysAgo(data.createdAt)} ngày trước</span>
                        </div>
                        <div className="border border-secondary rounded p-3 flashcardcanh-examples-container custom-scroll">
                            <div className="flashcardcanh-examples">
                                {data.exampleVM?.map((example, index) => (
                                    <div key={index}>
                                        <p className="font-weight-bold fs-5 mb-0">{index + 1}. {example.en}<span className="flashcardcanh-audio-icon"><i class="bi bi-volume-up"></i></span></p>
                                        <p className="flashcardcanh-translation font-weight-bold mb-0">{example.trans}</p>
                                        <p className="flashcardcanh-translation mb-0 font-italic  ">{example.vi} </p>
                                    </div>
                                ))}

                            </div>
                        </div>

                        <p className="flashcardcanh-note  mt-2 font-weight-bold">Note: <span className="font-weight-normal">{data.note}</span>  </p>
                    </div>
                ))}
            </div>

            {/* popup add word */}

            <div className="modal fade" id="addWordModal" tabIndex="-1" aria-labelledby="addWordModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg modal-dialog-centered " style={{width: "30%",height:"30%" }}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="addWordModalLabel">Thêm từ mới</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <div className="d-flex gap-3 align-items-end mb-3">
                                    <div className="flex-grow-1">
                                        <div className="d-flex gap-2 align-items-center">
                                            <p className="ms-2 mb-1">
                                                Tên từ mới (nhập rồi bấm vào AI Generate)
                                                <svg className="text-danger ms-1" stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em">
                                                    <path fill="none" d="M0 0h24v24H0z"></path>
                                                    <path d="M11.07 12.85c.77-1.39 2.25-2.21 3.11-3.44.91-1.29.4-3.7-2.18-3.7-1.69 0-2.52 1.28-2.87 2.34L6.54 6.96C7.25 4.83 9.18 3 11.99 3c2.35 0 3.96 1.07 4.78 2.41.7 1.15 1.11 3.3.03 4.9-1.2 1.77-2.35 2.31-2.97 3.45-.25.46-.35.76-.35 2.24h-2.89c-.01-.78-.13-2.05.48-3.15zM14 20c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z"></path>
                                                </svg>
                                            </p>
                                        </div>
                                        <input type="text" className="form-control" placeholder="Tên từ mới" />
                                    </div>
                                    <button className="btn btn-primary d-flex align-items-center gap-2">
                                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em">
                                            <path d="M184 0c30.9 0 56 25.1 56 56V456c0 30.9-25.1 56-56 56c-28.9 0-52.7-21.9-55.7-50.1c-5.2 1.4-10.7 2.1-16.3 2.1c-35.3 0-64-28.7-64-64c0-7.4 1.3-14.6 3.6-21.2C21.4 367.4 0 338.2 0 304c0-31.9 18.7-59.5 45.8-72.3C37.1 220.8 32 207 32 192c0-30.7 21.6-56.3 50.4-62.6C80.8 123.9 80 118 80 112c0-29.9 20.6-55.1 48.3-62.1C131.3 21.9 155.1 0 184 0zM328 0c28.9 0 52.6 21.9 55.7 49.9c27.8 7 48.3 32.1 48.3 62.1c0 6-.8 11.9-2.4 17.4c28.8 6.2 50.4 31.9 50.4 62.6c0 15-5.1 28.8-13.8 39.7C493.3 244.5 512 272.1 512 304c0 34.2-21.4 63.4-51.6 74.8c2.3 6.6 3.6 13.8 3.6 21.2c0 35.3-28.7 64-64 64c-5.6 0-11.1-.7-16.3-2.1c-3 28.2-26.8 50.1-55.7 50.1c-30.9 0-56-25.1-56-56V56c0-30.9 25.1-56 56-56z"></path>
                                        </svg>
                                        AI Generate
                                    </button>
                                </div>

                                <div className="mb-3">
                                    <p className="ms-2 mb-1">Định nghĩa</p>
                                    <input type="text" className="form-control" placeholder="Định nghĩa (bắt buộc)" />
                                </div>

                                <div className="border rounded p-3">
                                    <p className="text-muted">Không yêu cầu phải điền</p>
                                    <div className="d-flex gap-3 align-items-center mb-3">
                                        <div className="flex-grow-1">
                                            <p className="ms-2 mb-1">Loại từ</p>
                                            <input type="text" className="form-control" placeholder="Loại từ (N,V,Adj,...)" />
                                        </div>
                                        <div className="flex-grow-1">
                                            <p className="ms-2 mb-1">Phiên âm</p>
                                            <input type="text" className="form-control" placeholder="Phiên âm" />
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <p className="ms-2 mb-1">Ví dụ</p>
                                        <textarea className="form-control" rows="4" placeholder="Ví dụ (tối đa 10 câu)" ></textarea>
                                    </div>
                                    <div className="mb-3">
                                        <p className="ms-2 mb-1">Ghi chú</p>
                                        <textarea className="form-control" rows="3" placeholder="Ghi chú" ></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" className="btn btn-primary">Tạo</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>



    );
};





export default Flashcardcanh;