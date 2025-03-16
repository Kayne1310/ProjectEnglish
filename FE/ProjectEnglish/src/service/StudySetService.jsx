import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

// CreateStudySet
const createStudySet = async (title, language, isPublic, desc) => {
    const response = await axios.post(`${API_URL}/StudySet/CreateStudySet`, {
        title: title,
        language: language,
        desc: desc,
        public: isPublic
    }, { withCredentials: true });
    return response.data;
}

//update study set
const updateStudySet = async (data) => {
    const response = await axios.put(`${API_URL}/StudySet/UpdateStudySet`, data, { withCredentials: true });
    console.log("updateStudySet", response);
    return response.data;
}

//delete study set  
const deleteStudySet = async (id) => {
    const response = await axios.delete(`${API_URL}/StudySet/DeleteStudySet/${id}`, { withCredentials: true });
    return response.data;
}

export { createStudySet, updateStudySet, deleteStudySet };
