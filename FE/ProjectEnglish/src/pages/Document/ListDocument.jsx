import React, { useEffect, useState } from "react";
import '../../assets/css/Home/document.css';
import { Link, Outlet, useLocation } from "react-router-dom";
import { getAllQuiz } from "../../service/documentService";
import { Spin } from 'antd'; // Thêm Spin từ antd để hiển thị loading
import AOS from "aos";

const ListDocument = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [filteredQuizzes, setFilteredQuizzes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('none');
    const location = useLocation();
    const isHomePage = location.pathname === "/";
    const [isLoading, setIsLoading] = useState(true); // Thêm trạng thái loading

    // Xử lý tìm kiếm
    const handleSearch = (e) => {
        const searchValue = e.target.value;
        setSearchTerm(searchValue);
        filterQuizzes(searchValue, selectedCategory);
    };

    // Xử lý lọc theo danh mục
    const handleCategoryChange = (e) => {
        const category = e.target.value;
        setSelectedCategory(category);
        filterQuizzes(searchTerm, category);
    };

    // Hàm lọc kết hợp
    const filterQuizzes = (search, category) => {
        let filtered = [...quizzes];

        // Lọc theo từ khóa tìm kiếm
        if (search) {
            filtered = filtered.filter(quiz =>
                quiz.name.toLowerCase().includes(search.toLowerCase())
            );
        }

        // Lọc theo danh mục
        if (category && category !== 'none') {
            filtered = filtered.filter(quiz => quiz.category === category);
        }

        setFilteredQuizzes(filtered);
    };

    // Sắp xếp theo tên A-Z
    const handleSortByName = () => {
        const sorted = [...filteredQuizzes].sort((a, b) =>
            a.name.localeCompare(b.name)
        );
        setFilteredQuizzes(sorted);
    };

    // Sắp xếp theo số câu hỏi
    const handleSortByQuestions = () => {
        const sorted = [...filteredQuizzes].sort((a, b) =>
            b.countQuestion - a.countQuestion
        );
        setFilteredQuizzes(sorted);
    };

    // Reset về mặc định
    const handleReset = () => {
        setSearchTerm('');
        setSelectedCategory('none');
        setFilteredQuizzes(quizzes);
    };

    useEffect(() => {
        window.scroll(0, 0); // Thêm dòng này để scroll lên đầu trang
        let timer;
        const fetchQuizData = async () => {
            try {
                const data = await getAllQuiz();
                setQuizzes(data);
                setFilteredQuizzes(data); // Khởi tạo filteredQuizzes với dữ liệu ban đầu
                // Đảm bảo loading tối thiểu 2 giây
                timer = setTimeout(() => {
                    setIsLoading(false); // Tắt loading sau 2 giây và khi dữ liệu đã sẵn sàng
                }, 1000);
            } catch (error) {
                console.error('Error fetching quizzes:', error);
                setIsLoading(false); // Tắt loading nếu có lỗi
            }
        };

        fetchQuizData();
        return () => {
            if (timer) clearTimeout(timer);
            AOS.refreshHard();
        };
    }, []);

    return (
        <>
            {!isHomePage && isLoading ? (
                <div className="loading-container" style={{
                    display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh'
                }}>
                    <Spin size="large" />
                </div>
            ) : (
                <section className={`slider_section long_section ${!isHomePage ? 'layout_padding' : ''}`} data-aos={isHomePage ? "fade-up" : ""}>
                    <div className="container">
                        <div className="">
                            <h1 className="text-3xl font-bold text-primary">Tài liệu</h1>
                            <p>
                                Tổng hợp những tài liệu của nhiều môn luôn sẵn sàng để bạn ôn bài hiệu quả nhất.
                            </p>
                            <p>
                                Nếu bạn có tài liệu cần đưa lên web? bấm vào nút dưới để
                                <a className="underline text-primary mr-1" href="mailto:khanhdjkl@gmail.com" style={{ textDecoration: "none" }}> gửi tài liệu</a>
                                cho mình nhá
                            </p>
                        </div>
                        <div className="d-flex flex-wrap gap-3 mt-3 mb-3 w-100" data-aos={isHomePage ? "fade-left" : ""}>
                            <button
                                className="btn btn-primary flex-grow-1"
                                onClick={handleReset}
                            >
                                Default
                            </button>
                            <button
                                className="btn btn-primary flex-grow-1 btn-hover-text"
                                onClick={handleSortByName}
                                data-hover="Sắp xếp theo chữ cái"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-sort-alpha-down" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M10.082 5.629 9.664 7H8.598l1.789-5.332h1.234L13.402 7h-1.12l-.419-1.371zm1.57-.785L11 2.687h-.047l-.652 2.157z" />
                                    <path d="M12.96 14H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645zM4.5 2.5a.5.5 0 0 0-1 0v9.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L4.5 12.293z" />
                                </svg>
                            </button>
                            <button
                                className="btn btn-primary flex-grow-1 btn-hover-text"
                                onClick={handleSortByQuestions}
                                data-hover="Sắp xếp theo số lượng câu hỏi"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-sort-numeric-down" viewBox="0 0 16 16">
                                    <path d="M12.438 1.668V7H11.39V2.684h-.051l-1.211.859v-.969l1.262-.906h1.046z" />
                                    <path fillRule="evenodd" d="M11.36 14.098c-1.137 0-1.708-.657-1.762-1.278h1.004c.058.223.343.45.773.45.824 0 1.164-.829 1.133-1.856h-.059c-.148.39-.57.742-1.261.742-.91 0-1.72-.613-1.72-1.758 0-1.148.848-1.835 1.973-1.835 1.09 0 2.063.636 2.063 2.687 0 1.867-.723 2.848-2.145 2.848zm.062-2.735c.504 0 .933-.336.933-.972 0-.633-.398-1.008-.94-1.008-.52 0-.927.375-.927 1 0 .64.418.98.934.98" />
                                    <path d="M4.5 2.5a.5.5 0 0 0-1 0v9.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L4.5 12.293z" />
                                </svg>
                            </button>
                            <select
                                className="form-select w-auto flex-grow-1"
                                value={selectedCategory}
                                onChange={handleCategoryChange}
                            >
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
                            <input
                                type="text"
                                className="form-control w-auto flex-grow-1"
                                placeholder="Tìm tên tài liệu..."
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                            <Link className="btn btn-secondary text-center flex-grow-1" to="/tailieu/themtailieu">
                                Thêm tài liệu
                            </Link>
                            <Link className="btn btn-primary d-flex align-items-center justify-content-center gap-2 flex-grow-1" to="/flashcard">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-file" viewBox="0 0 16 16">
                                    <path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1" />
                                </svg>
                                Flashcard
                            </Link>
                        </div>

                        <div className="row" data-aos={isHomePage ? "fade-right" : ""}>
                            {filteredQuizzes.map((quiz, index) => (
                                <div key={quiz.quiz_id} className="col-md-4 col-lg-3 pb-3">
                                    <div className="card card-custom bg-white border-white border-0">
                                        <div
                                            className="card-custom-img"
                                            style={{
                                                backgroundImage: `url(${quiz.image})`
                                            }}
                                            onError={(e) => (e.target.style.backgroundImage = `url("https://res.cloudinary.com/dvm1fjo7a/image/upload/v1740153734/QUIZ/874de8a8-1966-4393-bf78-a595e8e67ee6.jpg")`)}
                                        />
                                        <div className="card-custom-avatar">
                                            <img
                                                className="img-fluid"
                                                src="https://lh3.googleusercontent.com/a/ACg8ocKCC7S34GPA39ZSn9vC5VtbTqXGjwKtttuidg8_-SZQn605TO8=s96-c"
                                                alt="Avatar"
                                            />
                                        </div>
                                        <div className="card-body card-body-fixed" style={{ overflowY: "hidden" }}>
                                            <h4 className="card-title">{quiz.name}</h4>
                                            <p className="card-text">{quiz.description}</p>
                                            <p className="card-text view">
                                                <i className="fas fa-eye"></i>
                                                View
                                            </p>
                                            <p className="card-text view">
                                                <i className="fas fa-question-circle"></i>
                                                Số Câu hỏi : {quiz.countQuestion}
                                            </p>
                                        </div>
                                        <div className="card-footer" style={{ background: "inherit", borderColor: "inherit" }}>
                                            <Link to={`/listdocument/detaildocument/${quiz.quiz_id}`} className="btn btn-primary">
                                                Check Document
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}
            <Outlet />
        </>
    );
};

export default ListDocument;