import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ResultQuizz.scss";
import { Modal } from 'antd';
import { generateContentWithGemini } from "../../../service/geminiService";

// import Lightbox from "yet-another-react-lightbox";
// import "yet-another-react-lightbox/styles.css";

const ResultQuizz = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { quizData, questions, userAnswers, completionTime, submitResult } = location.state || {};
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    // const [open, setOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isExplanationModalVisible, setIsExplanationModalVisible] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [aiExplanation, setAiExplanation] = useState('');
    const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);

    const totalQuestions = questions?.length || 0;

    // Safely calculate correct answers from API response
    const correctAnswers = submitResult?.countCorrect || 0;

    // console.log("submitResult", submitResult);

    const wrongAnswers = totalQuestions - correctAnswers;

    const formatTime = (timeInSeconds) => {
        const hours = Math.floor(timeInSeconds / 3600);
        const minutes = Math.floor((timeInSeconds % 3600) / 60);
        const seconds = timeInSeconds % 60;
        return `${hours}h:${minutes}m:${seconds}s`;
    };

    const isAnswerCorrect = (question) => {
        // Tìm kết quả của câu hỏi hiện tại trong quizData
        const questionResult = submitResult?.quizData?.find(
            item => item.questionId === question.question_id
        );
        return questionResult?.isCorrect || false;
    };

    const scrollToQuestion = (questionId) => {
        const element = document.getElementById(`question-${questionId}`);
        if (element) {
            // Thêm timeout để đảm bảo scroll hoạt động sau khi DOM đã cập nhật
            setTimeout(() => {
                const headerOffset = 100;
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }, 100);
        }
    };

    const handlePrevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handleGetAIExplanation = async (question) => {
        setIsLoadingExplanation(true);
        setCurrentQuestion(question);
        setIsExplanationModalVisible(true);

        try {
            // Tìm đáp án người dùng đã chọn
            const userAnswer = question.answers.find(
                ans => ans.idAnswered === userAnswers[question.question_id]
            );

            // Tìm đáp án đúng
            const currentQuestionResult = submitResult?.quizData?.find(
                item => item.questionId === question.question_id
            );
            const correctAnswer = currentQuestionResult?.systemAnswers?.find(
                ans => ans.correctAnswer === true
            );

            // Tạo prompt cho Gemini
            const prompt = `Bạn là một giáo sư chuyên nghiệp. Hãy phân tích chi tiết câu hỏi ${question.description} này theo cấu trúc (không sử dụng markdown hoặc ký tự đặc biệt trong câu trả lời):

            [QUESTION]
            ${question.description}

            [USER_ANSWER]
            ${userAnswer?.description}

            [CORRECT_ANSWER]
            ${correctAnswer?.description}

            [ĐÁNH GIÁ ĐÁP ÁN]
            Phân tích: ${currentQuestionResult?.isCorrect ? 'Đáp án bạn chọn là chính xác bởi vì:' : 'Đáp án bạn chọn chưa chính xác bởi vì:'}
            So sánh: Hãy phân tích sự khác biệt giữa đáp án của bạn và đáp án đúng

            [GỢI Ý CẢI THIỆN]
            Lưu ý quan trọng:
            ${currentQuestionResult?.isCorrect ? 'Để nắm vững kiến thức này hơn, bạn nên:' : 'Để tránh mắc lỗi tương tự, bạn nên:'}`;

            const response = await generateContentWithGemini(prompt);
            // Xử lý response để loại bỏ các dấu ** nếu có
            const cleanedResponse = response.candidates[0].content.parts[0].text.replace(/\*\*/g, '');
            setAiExplanation(cleanedResponse);
        } catch (error) {
            console.error('Error getting AI explanation:', error);
            setAiExplanation('Có lỗi xảy ra khi lấy giải thích. Vui lòng thử lại sau.');
        } finally {
            setIsLoadingExplanation(false);
        }
    };

    return (
        <div className="result-wrapper">
            <div className="result-page-container">
                <div className={`result-main-content ${isSidebarOpen ? 'with-sidebar' : ''}`}>
                    <div className="result-content-wrapper">
                        <div className="result-stats-container">
                            <div className="result-stats">
                                <div className="result-header">
                                    <h1>Bài quiz về chủ đề: {quizData?.name || "N/A"}</h1>
                                    <p>Nội dung: {quizData?.description || "N/A"}</p>
                                </div>
                                <div className="result-stats-grid">
                                    <div className="result-stat-item">
                                        <div className="result-stat-value">{totalQuestions}</div>
                                        <div className="result-stat-label">Tổng số câu hỏi</div>
                                    </div>
                                    <div className="result-stat-item">
                                        <div className="result-stat-value correct">{correctAnswers}</div>
                                        <div className="result-stat-label">Câu đúng</div>
                                    </div>
                                    <div className="result-stat-item">
                                        <div className="result-stat-value incorrect">{wrongAnswers}</div>
                                        <div className="result-stat-label">Câu sai</div>
                                    </div>
                                    <div className="result-stat-item">
                                        <div className="result-stat-value">{formatTime(completionTime || 0)}</div>
                                        <div className="result-stat-label">Thời gian hoàn thành</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="result-detail-container">
                            <div className="result-content">
                                <div className="result-questions">
                                    {questions && questions.map((question, questionIndex) => (
                                        <div
                                            key={question.question_id}
                                            id={`question-${question.question_id}`}
                                            className="result-question-container"
                                        >
                                            <div className="result-question" title={question.description}>
                                                <strong>Câu {questionIndex + 1}:</strong> {question.description}
                                            </div>
                                            <div className="d-flex justify-content-start mt-2">
                                                <button
                                                    className="d-flex align-items-center gap-1 btn btn-primary py-0 text-small mb-1"
                                                    onClick={() => handleGetAIExplanation(question)}
                                                >
                                                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286m1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94"></path>
                                                    </svg>
                                                    Giải thích bằng AI
                                                </button>
                                            </div>

                                            {question.image && (
                                                <div className="result-image">
                                                    <img
                                                        src={question.image}
                                                        alt="Question"
                                                    // onClick={() => setOpen(true)}
                                                    />
                                                    {/* <Lightbox
                                                        open={open}
                                                        close={() => setOpen(false)}
                                                        slides={[{ src: question.image }]}
                                                    /> */}
                                                </div>
                                            )}

                                            <div className="result-answer">
                                                <div className="result-answer-options">
                                                    {question.answers.map((answer, index) => {
                                                        const isUserAnswer = userAnswers[question.question_id] === answer.idAnswered;
                                                        const currentQuestionResult = submitResult?.quizData?.find(
                                                            item => item.questionId === question.question_id
                                                        );

                                                        // Tìm đáp án đúng từ systemAnswers
                                                        const correctAnswer = currentQuestionResult?.systemAnswers?.find(
                                                            ans => ans.correctAnswer === true
                                                        );

                                                        // Kiểm tra xem đáp án hiện tại có phải là đáp án đúng không
                                                        const isCorrectAnswer = answer.idAnswered === correctAnswer?.id;

                                                        let className = '';

                                                        // Nếu là đáp án người dùng chọn
                                                        if (isUserAnswer) {
                                                                className = currentQuestionResult?.isCorrect ? 'correct' : 'incorrect' ;    
                                                        }
                                                        // Nếu là đáp án đúng từ systemAnswers
                                                        if (isCorrectAnswer) {
                                                            className = 'correct';
                                                        }

                                                        return (
                                                            <div key={answer.idAnswered} className="result-answer-wrapper">
                                                                <div className={`result-answer-option ${className}`}>
                                                                    <span className="result-answer-number">
                                                                        {isUserAnswer ? (
                                                                            <i
                                                                                className={`fas ${currentQuestionResult?.isCorrect ? 'fa-check-circle' : 'fa-times-circle'}`}
                                                                            ></i>
                                                                        ) : (
                                                                            isCorrectAnswer ?
                                                                                <i className="fas fa-check-circle"></i> :
                                                                                index + 1
                                                                        )}
                                                                    </span>
                                                                    <span className="result-answer-text" title={answer.description}>{answer.description}</span>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            <div className={`result-feedback ${isAnswerCorrect(question) ? 'correct' : 'incorrect'}`}>
                                                {isAnswerCorrect(question)
                                                    ? 'Tuyệt vời!'
                                                    : 'Đừng nản chí, học là một quá trình!'}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* New Completion Section */}
                        <div className="completion-section">
                            <div className="completion-content">
                                <div className="completion-icon">
                                    <i className="fas fa-check-circle"></i>
                                </div>
                                <h2>đã check xong! Bạn đã sẵn sàng tới bài kiểm tra tiếp theo?</h2>
                                <button
                                    className="next-quiz-btn"
                                    onClick={() => navigate('/listquizz')}
                                >
                                    <i className="fas fa-arrow-right"></i>
                                    Tiếp tới bài kiểm tra
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Toggle Button */}
                <button
                    className={`sidebar-toggle ${isSidebarOpen ? 'open' : ''}`}
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                    <i className={`fas ${isSidebarOpen ? 'fa-chevron-right' : 'fa-chevron-left'}`}></i>
                </button>

                {/* Questions Sidebar */}
                <div className={`questions-sidebar ${isSidebarOpen ? 'open' : ''}`}>
                    <div className="sidebar-header">
                        <h3>
                            <i className="fas fa-times close-icon" onClick={() => setIsSidebarOpen(false)}></i>
                            Ẩn danh sách câu hỏi
                        </h3>
                    </div>
                    <div className="questions-list">
                        {questions && questions.map((question, index) => {
                            const isCorrect = isAnswerCorrect(question);
                            return (
                                <div
                                    key={question.question_id}
                                    className={`question-item ${isCorrect ? 'correct' : 'incorrect'}`}
                                    onClick={() => scrollToQuestion(question.question_id)}
                                >
                                    <span className="question-number">{index + 1}</span>
                                    <span className="question-status">
                                        <i className={`fas ${isCorrect ? 'fa-check' : 'fa-times'}`}></i>
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <Modal
                title="Giải thích chi tiết"
                open={isExplanationModalVisible}
                onCancel={() => setIsExplanationModalVisible(false)}
                footer={null}
                width={800}
            >
                {isLoadingExplanation ? (
                    <div className="text-center py-4">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <div className="ai-explanation-content">
                        <div className="explanation-sections">
                            {aiExplanation.split('[').map((section, index) => {
                                if (index === 0) return null; // Bỏ qua phần đầu rỗng
                                const [title, ...content] = section.split(']');
                                if (!content.length) return null;

                                let icon, color;
                                switch (title) {
                                    case 'QUESTION':
                                        icon = 'fa-question-circle';
                                        color = '#007bff';
                                        break;
                                    case 'USER_ANSWER':
                                        icon = 'fa-user';
                                        color = '#dc3545';
                                        break;
                                    case 'CORRECT_ANSWER':
                                        icon = 'fa-check-circle';
                                        color = '#28a745';
                                        break;
                                    case 'ĐÁNH GIÁ ĐÁP ÁN':
                                        icon = 'fa-clipboard-check';
                                        color = '#007bff';
                                        break;
                                    case 'GỢI Ý CẢI THIỆN':
                                        icon = 'fa-lightbulb';
                                        color = '#ffc107';
                                        break;
                                    default:
                                        icon = 'fa-info-circle';
                                        color = '#6c757d';
                                }

                                // Chuyển đổi tiêu đề từ tiếng Anh sang tiếng Việt
                                let vietnameseTitle = title;
                                switch (title) {
                                    case 'QUESTION':
                                        vietnameseTitle = 'CÂU HỎI';
                                        break;
                                    case 'USER_ANSWER':
                                        vietnameseTitle = 'ĐÁP ÁN CỦA BẠN';
                                        break;
                                    case 'CORRECT_ANSWER':
                                        vietnameseTitle = 'ĐÁP ÁN ĐÚNG';
                                        break;
                                }

                                return (
                                    <div key={index} className="explanation-section mb-4">
                                        <h4 className="section-title" style={{ color: color }}>
                                            <i className={`fas ${icon} me-2`}></i>
                                            {vietnameseTitle}
                                        </h4>
                                        <div className="section-content">
                                            {content.join(']')}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default ResultQuizz;