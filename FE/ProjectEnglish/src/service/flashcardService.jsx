import axios from "axios"
const API_URL = import.meta.env.VITE_API_URL;
const getAllFlashCard = async () =>{

    const reponse=await axios.get(`${API_URL}/Quiz/get_all_quiz`);
    console.log(reponse);
    return reponse.data;
}

const getALlStudySetService=async ()=>{
    const response =await axios.get(`${API_URL}/StudySet/GetListStudy`);
    console.log(response);
    return response.data;
}

const getALlStudySetServiceByUserId=async ()=>{
    const response =await axios.get(`${API_URL}/StudySet/GetListStudyByUserId`,{
        withCredentials:true
    });
    console.log("data gell all by StudySet UserId",response);
    return response.data;
}

const getListFlashCardByStudySetId=async (id)=>{
    const response =await axios.get(`${API_URL}/FlashCard/GetListFlashCardByStudySetId/${id}`);
    console.log(response);
    return response.data;
    
}


const createFlashCardWithStudySet=async (data)=>{
    console.log("data",data);
    const response =await axios.post(`${API_URL}/FlashCard/CreateFlashCardWithStudySet`,data,{withCredentials:true});
    console.log(response);
    return response.data;
}


export {getAllFlashCard,getALlStudySetService,getALlStudySetServiceByUserId,getListFlashCardByStudySetId,createFlashCardWithStudySet};