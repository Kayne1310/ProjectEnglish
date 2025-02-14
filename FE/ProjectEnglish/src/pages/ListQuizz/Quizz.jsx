import React from "react";
import "../../assets/css/Home/QuizletForm.css"; // Import file CSS
// import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';   
import test from "../../assets/image/b1.jpg"

const QuizletForm = () => {
    return (
        <>
            <div className="quizlet-body">
                <div className="quizlet-wrapper">
                    {/* Form Quizlet */}
                    <div className="quizlet-container">
                        <div className="quizlet-definition-section">
                            <div className="quizlet-definition-label">
                                <i className="fas fa-lightbulb"></i>
                            </div>
                            <button className="quizlet-audio-btn" title="sound">
                                <i className="fas fa-volume-up"></i>
                            </button>
                        </div>

                        <div className="quizlet-content-wrapper">
                            <div className="quizlet-question-container">
                                <p>lôi thôi, lếch thếch</p>
                            </div>
                            <div className="quizlet-image-wrapper">
                                <div className="quizlet-image-container">
                                    <img
                                        src={test}
                                        alt="lôi thôi, lếch thếch"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="quizlet-options">
                            <button className="quizlet-option">
                                <span className="quizlet-option-text">1. baggy</span>
                            </button>
                            <button className="quizlet-option">
                                <span className="quizlet-option-text">2. skimpy</span>
                            </button>
                            <button className="quizlet-option">
                                <span className="quizlet-option-text">3. frumpy</span>
                            </button>
                            <button className="quizlet-option">
                                <span className="quizlet-option-text">4. clumsy</span>
                            </button>
                        </div>

                        <div className="quizlet-help-link">
                            <a href="#">Bạn không biết?</a>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="quizlet-footer-navigation">
                        <div className="quizlet-footer-button">
                            <i className="fas fa-chevron-left"></i>
                            <span>Lùi lại</span>
                        </div>
                        <div className="quizlet-footer-button">
                            <span>Tiến tới</span>
                            <i className="fas fa-chevron-right"></i>
                        </div>
                    </div>
                </div>

            </div>

        </>
    );
};

export default QuizletForm;

