import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

// const API_URL ="https://localhost:7048/api"; 

const getDataQuiz = async (quiz_id) => {
    try {
        const response = await axios.get(`${API_URL}/Quiz/GetCountQuestionbyQuiz`, {
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching quiz data:", error);
        return null;
    }

};



const getQuestionbyQuizId = async (quiz_id) => {
    try {
        console.log(quiz_id);
        const response = await axios.get(`${API_URL}/Quiz/GetQuestionByQuizId/${quiz_id}`);
        console.log("Response Data:", response); // In ra dữ liệu trả về
        return response;
    } catch (error) {
        console.error("Error fetching quiz data:", error.response ? error.response.data : error.message);
        return null;
    }
};

// Gọi API để kiểm tra
// getQuestionbyQuizId().then(response => {
//     console.log("Quiz Data:", response);
// });

const flashcard = async (quizId) => {
    try {
        const response = await axios.get(`${API_URL}/QuizAnswer/correct-answers?`, {
            params: { quizId: quizId }
        });

        return response.data;

    } catch (error) {
        throw error;
    }
}


export { getDataQuiz, getQuestionbyQuizId, flashcard };
