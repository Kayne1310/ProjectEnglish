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
    console.log(response);
}

export { createStudySet };
