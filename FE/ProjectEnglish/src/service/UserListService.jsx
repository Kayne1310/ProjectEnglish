import axios from "axios"
const API_URL = import.meta.env.VITE_API_URL;

const getAllUserPage = async (page = 1, pageSize = 5, sortBy = "UserName", sortAscending = true) => {
    const response = await axios.get(`${API_URL}/User/Get_All_User_pagination`, { 
        params: {
            page,
            pageSize,
            sortBy,
            sortAscending
        },
        withCredentials: true 
    });
    return response.data;
}


const getAllUser = async () => {
    try {
        const reponse = await axios.get(`${API_URL}/User/Get_All_User`, { withCredentials: true });
        // console.log("check res: ", reponse)
        return reponse.data;
    } catch (error) {
        throw error
    }
}

export { getAllUserPage, getAllUser };