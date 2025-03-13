
import axios from "axios"
const API_URL = import.meta.env.VITE_API_URL;
const getAllUser = async () => {
    try {
        const reponse = await axios.get(`${API_URL}/User/Get_All_User`);
        console.log("check res", reponse)
        return reponse.data;
    } catch (error) {
        throw error
    }
}

export { getAllUser };