import axios from "axios"
const API_URL = import.meta.env.VITE_API_URL;
const getAllQuiz = async () =>{

    const reponse=await axios.get(`${API_URL}/Quiz/GetCountQuestionbyQuiz`);
    return reponse.data;
}

export {getAllQuiz};