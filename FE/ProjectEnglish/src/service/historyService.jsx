import axios from "axios"
const API_URL = import.meta.env.VITE_API_URL;

const getAllHistory = async () => {
    const response = await axios.get(`${API_URL}/History/get_all_history`, { 
        withCredentials: true 
    });
    return response.data;
}

const getQuizById = async (quiz_id) => {
    const response = await axios.get(`${API_URL}/Quiz/get_quiz_by_id`, {
        params: {
            quiz_id: quiz_id
        },
        withCredentials: true
    });
    return response.data;
}

export  {getAllHistory, getQuizById}

