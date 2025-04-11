import axios from "axios"
const API_URL = import.meta.env.VITE_API_URL;
const getAllFlashCard = async () => {
    const reponse = await axios.get(`${API_URL}/Quiz/get_all_quiz`);
    // console.log(reponse);
    return reponse.data;
}

const getALlStudySetService = async () => {
    const response = await axios.get(`${API_URL}/StudySet/GetListStudy`);
    // console.log(response);
    return response.data;
}

const getALlStudySetServiceByUserId = async () => {
    try{
         
        const response = await axios.get(`${API_URL}/StudySet/GetListStudyByUserId`, {
            withCredentials: true
        });
        if(response.returnCode==401){
            return;
        }
        // console.log("data gell all by StudySet UserId", response);
        return response.data;
    }
    catch(error){
        // console.log(error.reponse.data.returnMessage);
    }
}

const getListFlashCardByStudySetId = async (id) => {
    try{

        const response = await axios.get(`${API_URL}/FlashCard/GetListFlashCardByStudySetId/${id}`);
        if(response.returnCode==401){
            // console.log("return message",response.returnMessage);
        }
  
        return response.data;
    }
    catch(error){
        // console.log("return messatge",reponse.returnMessage);
    }

}

const createFlashCardWithStudySet = async (data) => {
    // console.log("data", data);
    const response = await axios.post(`${API_URL}/FlashCard/CreateFlashCardWithStudySet`, data, { withCredentials: true });
    // console.log(response);
    return response.data;
}

const updateFlashCardWithStudySet = async (data) => {
    // console.log("data", data);
    const response = await axios.put(`${API_URL}/FlashCard/UpdateFlashCardWithStudySet`, data, { withCredentials: true });
    // console.log("updateFlashCardWithStudySet", response);
    return response.data;
}

const deleteFlashCardWithStudySet = async (id) => {
    const response = await axios.delete(`${API_URL}/FlashCard/DeleteFlashCardWithStudySet/${id}`, { withCredentials: true });
    // console.log("deleteFlashCardWithStudySet", response);
    return response.data;
}


export {
    getAllFlashCard, 
    getALlStudySetService,
    getALlStudySetServiceByUserId,
    getListFlashCardByStudySetId, 
    createFlashCardWithStudySet, 
    updateFlashCardWithStudySet, 
    deleteFlashCardWithStudySet
};

