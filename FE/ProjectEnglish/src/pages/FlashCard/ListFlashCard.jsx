// import React from 'react';
import './Flashcardcanh.css'; // Import file CSS
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
// import b2 from "../../assets/image/b2.jpg";
import covn from '../../assets/image/covn.jpg'


const Flashcardcanh = () => {
    return (
        <div className="container">
            {/* Container Fluid */}

                <a href="#" className="flashcardcanh-btn-back text-decoration-none">Quay lại</a>
                <h2 className="flashcardcanh-header-title">Flashcard: Nhớ em đến điên loạn</h2>
                <p>
                    <img
                        style={{
                            width: '30px',
                            height: '20px',
                            marginRight: '10px',
                            verticalAlign: 'middle'
                        }}
                        src={covn} alt="Ngonngu" />

                    Ngôn ngữ: Tiếng Lòng - tiếng em
                </p>
                <p className="flashcardcanh-creator">
                    Người tạo: Tuấn Cảnh
                    <img
                        className="flashcardcanh-avatar"
                        src="https://i.pinimg.com/474x/e8/9b/57/e89b5756585ec42bc6deb90b3aaa23de.jpg"
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
                <div className="flashcardcanh-stats-box">
                    <div className="flashcardcanh-row flashcardcanh-mt-3">
                        <div className="col-3 flashcardcanh-stat-item flashcardcanh-learned">Tất cả <br />51</div>
                        <div className="col-3 flashcardcanh-stat-item flashcardcanh-new">Đã nhớ<br />0</div>
                        <div className="col-3 flashcardcanh-stat-item flashcardcanh-review">Ôn tập<br />0</div>
                        <div className="col-3 flashcardcanh-stat-item flashcardcanh-mastered">Ghi nhớ <br />51</div>
                    </div>

            </div>


                {/* Flashcard 1 */}
                <div className="flashcardcanh-columns">
                <div className="flashcardcanh-container">
                    <div className="flashcardcanh-header">
                        <span className="flashcardcanh-canontap">Thẻ cân ôn tập</span>
                        <span className="flashcardcanh-sobaihoc">Số bài học: 99+</span>
                        <span className="flashcardcanh-ghinho">Ghi nhớ: 99%+</span>
                    </div>
                    <h1 className="flashcardcanh-title">Nhớ em <span className="flashcardcanh-audio-icon">🔊</span></h1>
                    <p className="flashcardcanh-subtitle">(Động danh hay tính từ ??))</p>
                    <p className="flashcardcanh-definition">Định nghĩa: Lỗi nhớ em</p>
                    <p className="flashcardcanh-source">Ví dụ:</p>
                    <div className="flashcardcanh-examples">
                        <p>1. Miss you like crazy!!!<span className="flashcardcanh-audio-icon">🔊</span></p>
                        <p className="flashcardcanh-example-text">Miss you like crazy !!!</p>
                        <p className="flashcardcanh-translation">Nhớ em đến điên loạn</p>
                        <p>2. Miss you like crazy!!!<span className="flashcardcanh-audio-icon">🔊</span></p>
                        <p className="flashcardcanh-example-text">Miss you like crazy !!!</p>
                        <p className="flashcardcanh-translation">Nhớ em đến điên loạn</p>
                        <p>3. Miss you like crazy!!!<span className="flashcardcanh-audio-icon">🔊</span></p>
                        <p className="flashcardcanh-example-text">Miss you like crazy !!!</p>
                        <p className="flashcardcanh-translation">Nhớ em đến điên loạn</p>
                    </div>
                    <p className="flashcardcanh-note">Ghi chú: Code ít thôi thằng ngu</p>
                    <p className="flashcardcanh-time">3 ngày sau sinh nhật người yêu cũ</p>
                </div>
   

                {/* Flashcard 2 */}
                <div className="flashcardcanh-container">
                    <div className="flashcardcanh-header">
                        <span className="flashcardcanh-canontap">Thẻ cân ôn tập</span>
                        <span className="flashcardcanh-sobaihoc">Số bài học: 99+</span>
                        <span className="flashcardcanh-ghinho">Ghi nhớ: 99%+</span>
                    </div>
                    <h1 className="flashcardcanh-title">Yêu em <span className="flashcardcanh-audio-icon">🔊</span></h1>
                    <p className="flashcardcanh-subtitle">(Động danh hay tính từ ??))</p>
                    <p className="flashcardcanh-definition">Định nghĩa: Lỗi yêu em</p>
                    <p className="flashcardcanh-source">Ví dụ:</p>
                    <div className="flashcardcanh-examples">
                        <p>1. Love you like crazy!!!<span className="flashcardcanh-audio-icon">🔊</span></p>
                        <p className="flashcardcanh-example-text">Love you like crazy !!!</p>
                        <p className="flashcardcanh-translation">Yêu em đến điên loạn</p>
                    </div>
                    <p className="flashcardcanh-note">Ghi chú: Code ít thôi thằng ngốc</p>
                    <p className="flashcardcanh-time">2 ngày sau sinh nhật người yêu cũ</p>
                </div>
                </div> 
            </div>

    );
};

export default Flashcardcanh;