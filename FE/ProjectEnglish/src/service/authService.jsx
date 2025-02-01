import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL; 
console.log(API_URL);
// const API_URL ="https://localhost:7048/api"; 

const login = async (username, password) => {
    try {
        const response = await axios.post(`${API_URL}/Account`, {
            userName: username,
            password: password
            
        });

        if (response.data && response.data.token) {
            localStorage.setItem("accessToken", response.data.token);
        }

        return response.data;
    } catch (error) {
        console.error("Login failed:", error.response?.data || error.message);
        throw error;
    }
};

const logout = () => {
    localStorage.removeItem("accessToken");
};

const authService = {
    login,
    logout,
};

export default authService;
