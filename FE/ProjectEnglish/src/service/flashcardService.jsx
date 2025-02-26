import axios from "axios"
const API_URL = import.meta.env.VITE_API_URL;
const getAllFlashCard = async () =>{

    const reponse=await axios.get(`${API_URL}/Quiz/get_all_quiz`);
    console.log(reponse);
    return reponse.data;
}

export {getAllFlashCard};