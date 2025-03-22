
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const createQuizQuestionWithAnswers = async (quizData) => {
    try {
        // Tạo FormData để gửi dữ liệu multipart/form-data
        const formData = new FormData();

        // Thêm QuizQuestion data
        formData.append('QuizQuestion.description', quizData.description);
        formData.append('QuizQuestion.quiz_id', quizData.quiz_id);
        if (quizData.image) {
            formData.append('QuizQuestion.image', quizData.image); // image là file object
        }

        // Thêm QuizAnswers (array)
        quizData.answers.forEach((answer, index) => {
            formData.append(`QuizAnswers[${index}].description`, answer.description);
            formData.append(`QuizAnswers[${index}].correct_answer`, answer.correct_answer);
        });

        const response = await axios.post(`${API_URL}/QuizQuestion/create_quizquestion_with_answers`, formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                // withCredentials: true, // Nếu backend yêu cầu cookie/auth
            }
        );

        console.log("Full API Response:", response);

        if (!response || !response.data) {
            console.error("Error: response.data is undefined!");
            return null;
        }

        return response.data;
    } catch (error) {
        console.error("Create QuizQuestion failed:", error.response?.data || error.message);
        return { error: error.response?.data || error.message };
    }
};

const getAllQuiz = async () => {
    const response = await axios.get(`${API_URL}/Quiz/get_all_quiz`);
    return response.data;
};

// const getQuestionsByQuizId = async (quizId) => {
//     const response = await axios.get(`${API_URL}/Quiz/GetQuestionByQuizId/${quizId}`);
//     return response.data;
// };

const getQuestionsByQuizId = async (quizId) => {
    try {
        const response = await axios.get(`${API_URL}/Quiz/GetQuestionByQuizId/${quizId}`); // Giả sử endpoint
        return response.data;
    } catch (error) {
        if (error.response?.status === 400) {
            // Nếu lỗi 400 (không tìm thấy câu hỏi), trả về mảng rỗng
            return [];
        }
        console.error("Error fetching questions:", error);
        throw error; // Ném lỗi khác nếu không phải 400
    }
};

const updateQuizQuestionWithAnswers = async (quizData) => {
    try {
        // Tạo FormData để gửi dữ liệu multipart/form-data
        const formData = new FormData();

        // Thêm QuizQuestion data
        formData.append("QuizQuestion.question_id", quizData.question_id || ""); // Thêm question_id
        formData.append("QuizQuestion.description", quizData.description || "");
        if (quizData.image) {
            formData.append("QuizQuestion.image", quizData.image); // image là file object
        }

        // Thêm QuizAnswers (array) - giả sử backend vẫn yêu cầu answers dù không có trong curl
        if (quizData.answers && Array.isArray(quizData.answers)) {
            quizData.answers.forEach((answer, index) => {
                formData.append(`QuizAnswers[${index}].description`, answer.description || "");
                formData.append(`QuizAnswers[${index}].correct_answer`, answer.correct_answer || false);
            });
        }

        const response = await axios.put(
            `${API_URL}/QuizQuestion/update_quizquestion_with_answers`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    // "accept": "*/*", // Thêm accept header như trong curl
                },
                // withCredentials: true, // Uncomment nếu backend yêu cầu cookie/auth
            }
        );

        console.log("Full API Response:", response);

        if (!response || !response.data) {
            console.error("Error: response.data is undefined!");
            return null;
        }

        return response.data;
    } catch (error) {
        console.error("Update QuizQuestion failed:", error.response?.data || error.message);
        return { error: error.response?.data || error.message };
    }
};


const deleteQuizQuestionWithAnswers = async (questionId) => {
    try {
        // Tạo FormData object để gửi dữ liệu dưới dạng multipart/form-data
        const formData = new FormData();
        formData.append('question_id', questionId);

        const response = await axios.delete(
            `${API_URL}/QuizQuestion/delete_quizquestion_with_answers`,
            {
                headers: {
                    'Accept': '*/*',
                    'Content-Type': 'multipart/form-data',
                },
                data: formData, // Gửi FormData trong phần body
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error deleting quiz question:', error);
        throw error;
    }
};


export { createQuizQuestionWithAnswers, getAllQuiz, getQuestionsByQuizId, updateQuizQuestionWithAnswers, deleteQuizQuestionWithAnswers };