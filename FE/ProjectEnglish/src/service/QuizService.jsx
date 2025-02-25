import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

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

export {flashcard} 