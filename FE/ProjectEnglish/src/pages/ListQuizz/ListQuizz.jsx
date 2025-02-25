import React, { useEffect, useState } from "react";
import '../../assets/css/Home/document.css';


import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { getAllQuiz } from "../../service/documentService";

const ListQuizz = () => {

    const [quizzes, setQuizzes] = useState([]);
    const location = useLocation(); // Lấy đường dẫn hiện tại
    const isQuizletPage = location.pathname === "/listquizz/detailquiz";

    useEffect(() => {
        const fetchQuizData = async () => {
            try {
                const data = await getAllQuiz();
                setQuizzes(data);
            } catch (error) {
                console.error('Error fetching quizzes:', error);
            }
        };

        fetchQuizData();
    }, []);

    return (
        <>

            {/* Nếu không phải trang QuizletForm thì hiển thị ListQuizz */}
            {!isQuizletPage && (
                <section className="about_section layout_padding long_section mt-5 mb-5">
                    <div className="container">
    
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