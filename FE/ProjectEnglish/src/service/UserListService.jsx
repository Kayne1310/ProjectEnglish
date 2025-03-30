import axios from "axios"
const API_URL = import.meta.env.VITE_API_URL;

const getAllUser = async (page = 1, pageSize = 2, sortBy = "UserName", sortAscending = true) => {
    const response = await axios.get(`${API_URL}/User/Get_All_User`, { 
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

export { getAllUser };