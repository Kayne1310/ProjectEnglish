import React, { useEffect, useState } from "react";
import b1 from "../../assets/image/b1.jpg";
import b2 from "../../assets/image/b2.jpg";
import b3 from "../../assets/image/b3.jpg";
import avatar from "../../assets/image/default-avatar.png";
import '../../assets/css/Home/home.css';
import './listquizz.css';
import { Link, Outlet, useLocation } from "react-router-dom";
import { getDataQuiz } from "../../service/quizService";
import { Spin } from 'antd'; // Thêm Spin từ antd để hiển thị loading
import AOS from "aos";
import { calculateDaysAgo } from "../../helpers/DateHepler";



const ListQuizz = () => {
  const location = useLocation();
  const isQuizletPage = location.pathname.includes("/listquizz/detailquiz");
  const isHomePage = location.pathname === "/";

  const [arrQuiz, setArrQuiz] = useState([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('none');
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
    let filtered = [...(arrQuiz || [])];

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
    setFilteredQuizzes(arrQuiz);
  };

  useEffect(() => {
    window.scroll(0, 0); // Scroll to top
    let timer;

    const fetchData = async () => {
      try {
        const res = await getDataQuiz();
        console.log('res', res);
        setArrQuiz(res);
        setFilteredQuizzes(res); // Khởi tạo filteredQuizzes với dữ liệu ban đầu

        // Đảm bảo loading tối thiểu 2 giây
        timer = setTimeout(() => {
          setIsLoading(false); // Tắt loading sau 2 giây và khi dữ liệu đã sẵn sàng
        }, 1000);
      } catch (error) {
        console.error("Error fetching quiz data:", error);
        setIsLoading(false); // Tắt loading nếu có lỗi
      }
    };

    if (isHomePage) {
      AOS.init({ duration: 1000, once: true });
    }
    fetchData();
    // Cleanup timer nếu component unmount trước khi 2 giây trôi qua
    return () => {
      if (timer) clearTimeout(timer);
      AOS.refreshHard();
    };
  }, [location.pathname]); // Thêm location.pathname vào dependencies

  console.log("arrQuiz:", arrQuiz);
  console.log("isQuizletPage:", isQuizletPage);


  // Xử lý danh sách quiz trước khi render
  const processedQuiz = (filteredQuizzes || []).map(quiz => ({
    ...quiz,
    image: quiz.image && quiz.image !== "null" && quiz.image !== "" ? quiz.image : b1
  }));



  return (
    <>
      {!isHomePage && isLoading ? (
        <div className="loading-container" style={{
          display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh'
        }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          {/* Nếu không phải trang QuizletForm thì hiển thị ListQuizz */}
          {!isQuizletPage && (
            <section
              className={`slider_section long_section ${!isHomePage ? 'layout_padding' : 'mb-5'}`}
              style={{ backgroundColor: '#f9fafa' }}
              data-aos={isHomePage ? "fade-up" : ""}
            >
              <div className="container">
                <div className="row">
                  <div className="">
                    <h1 className="text-3xl font-bold text-primary" data-aos={isHomePage ? "zoom-in" : ""}>Quizzet</h1>
                    <p>
                      Tổng hợp những bài quiz để bạn kiểm tra thử kiến thức của bản thân
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
                      placeholder="Tìm câu hỏi..."
                      value={searchTerm}
                      onChange={handleSearch}
                    />
                    <Link className="btn btn-secondary text-center flex-grow-1" to="/tailieu/themtailieu">
                      Thêm câu hỏi
                    </Link>
                    <Link className="btn btn-primary text-center flex-grow-1" to="/tailieu/themtailieu">
                      thi thử
                    </Link>
                  </div>
                  {processedQuiz && processedQuiz.length > 0 &&
                    processedQuiz.map((quiz, index) => (
                      <div key={`${index}-quiz`} className="col-sm-12 col-md-4 col-lg-3 my-3" data-aos={isHomePage ? "zoom-in" : ""}>
                        <div className="listquiz-card">
                          <div
                            className="listquiz-card-bg"
                            style={{
                              backgroundImage: quiz.image
                                ? `url(${quiz.image})`
                                : `url(${b1})`,
                            }}
                          ></div>
                          <div className="listquiz-card-content">
                            <h4 className="listquiz-card-title" title={quiz.name}>
                              {/* <i className="bi bi-book me-2"></i> */}
                              {quiz.name}
                            </h4>
                            <h4 className="listquiz-card-title-2">
                              <i className="bi bi-question-circle me-2"></i>
                              Số lượng: {quiz.countQuestion}
                            </h4>
                            <div className="listquiz-card-footer">
                              <div className="listquiz-footer-left">
                                <img className="listquiz-avatar" src="https://res.cloudinary.com/dvm1fjo7a/image/upload/v1742227443/image%20admin/mxdem7htk5n7hvcf5edf.jpg" alt="avatar" />
                                <div className="listquiz-user-info">
                                  <h6>admin</h6>
                                  <span>{calculateDaysAgo(quiz.createAt)}</span>
                                </div>
                              </div>
                              <Link
                                className="listquiz-btn-primary"
                                to={
                                  isHomePage
                                    ? `/listquizz/detailquiz/${quiz.quiz_id}`
                                    : `detailquiz/${quiz.quiz_id}`
                                }
                              >
                                Read More
                              </Link>
                            </div>
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
      )}
    </>
  );
};

export default ListQuizz;