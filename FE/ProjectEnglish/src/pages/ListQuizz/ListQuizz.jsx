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

const ListQuizz = () => {
  const location = useLocation();
  const isQuizletPage = location.pathname.includes("/listquizz/detailquiz");
  const isHomePage = location.pathname === "/";

  const [arrQuiz, setArrQuiz] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Thêm trạng thái loading

  // Xử lý danh sách quiz trước khi render
  const processedQuiz = arrQuiz.map(quiz => ({
    ...quiz,
    image: quiz.image && quiz.image !== "null" && quiz.image !== "" ? quiz.image : b1
  }));

  useEffect(() => {
    let timer;

    const fetchData = async () => {
      try {
        const res = await getDataQuiz();
        console.log('res', res);
        setArrQuiz(res);

        // Đảm bảo loading tối thiểu 2 giây
        timer = setTimeout(() => {
          setIsLoading(false); // Tắt loading sau 2 giây và khi dữ liệu đã sẵn sàng
        }, 2000);
      } catch (error) {
        console.error("Error fetching quiz data:", error);
        setIsLoading(false); // Tắt loading nếu có lỗi
      }
    };

    fetchData();

    // Cleanup timer nếu component unmount trước khi 2 giây trôi qua
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  console.log("arrQuiz:", arrQuiz);
  console.log("isQuizletPage:", isQuizletPage);

  return (
    <>
      {isLoading ? (
        <div className="loading-container" style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh',
        }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          {/* Nếu không phải trang QuizletForm thì hiển thị ListQuizz */}
          {!isQuizletPage && (
            <section className="wrapper">
              <div className="container">
                <div className="row">
                  {processedQuiz && processedQuiz.length > 0 &&
                    processedQuiz.map((quiz, index) => (
                      <div key={`${index}-quiz`} className="col-sm-12 col-md-4 col-lg-3">
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
                            <h4 className="listquiz-card-title">{quiz.name}</h4>
                            <h4 className="listquiz-card-title">Số lượng: {quiz.countQuestion}</h4>
                            <div className="listquiz-card-footer">
                              <div className="listquiz-footer-left">
                                <img className="listquiz-avatar" src={avatar} alt="avatar" />
                                <div className="listquiz-user-info">
                                  <h6>Oz Coruhlu</h6>
                                  <span>Director of UI/UX</span>
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