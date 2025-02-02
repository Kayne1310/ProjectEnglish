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

const  logout = async (userId) => {
    try {
        const response = await axios.post(`${API_URL}/Account/Logout`, {
           userId: userId      
        });
        
        if (response.data && response.data.token) {     
            localStorage.removeItem("accessToken");
        }
    } catch (error) {
        throw error;
    }
};


const register = async (username, email,password) => {
    try {
        const response = await axios.post(`${API_URL}/User`, {
            userName: username,
            email: email,
            password: password,
        });

        return response.data;
    } catch (error) {
        console.error("Register failed:", error.response?.data || error.message);
        throw error;
    }
}

const authService = {
    login,
    logout,
    register,
};

export default authService;
