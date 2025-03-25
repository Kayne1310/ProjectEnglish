
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

// Cấu hình mặc định để gửi cookie
axios.defaults.withCredentials = true;

const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/Account`, {
            email: email,
            password: password
        }, { withCredentials: true });


        console.log("Full API Response:", response); // Log toàn bộ response

        if (!response || !response.data) {
            console.error("Error: response.data is undefined!");
            return null;
        }
        return response.data; 
    } catch (error) {
        console.error("Login failed:", error.response?.data || error.message);
        return { error: error.response?.data || error.message };
    }
};


const logout = async () => {
    try {
      const response = await axios.post(`${API_URL}/Account/Logout`, {}, {
        withCredentials: true,
      });
      console.log("Full Logout Response:", response);
      if (!response || !response.data) {
        console.error("Error: response.data is undefined!");
        return null;
      }
      return response.data;

    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
      return { error: error.response?.data || error.message };
    }
  };

const register = async (username, email, password) => {
    try {
        const response = await axios.post(`${API_URL}/User`, {
            userName: username,
            email: email,
            password: password,
        });

        return response.data;
    } catch (error) {
        console.error("Register failed:", error.response?.data.errors || error.message);
        throw error;
    }
}


const GoogleRegister = async (accessToken) => {
    try {
        // Gọi API Google để lấy thông tin user
        const { data } = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        const userData = {
            Name: data.name,
            Email: data.email,
            GoogleId: data.id,
            PictureUrl: data.picture,
        };

        console.log("Google User:", data);

        // Gửi dữ liệu lên backend để xử lý đăng nhập
        const apiResponse = await axios.post(`${API_URL}/User/GoogleRegister`, userData);

        return apiResponse.data;
    } catch (error) {
        console.error("Google Login failed:", error.response?.data || error.message);
        throw error;
    }
};


const googleLogin = async (accessToken) => {
    try {
        // Gọi API Google để lấy thông tin user
        const { data } = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        const userData = {
            Name: data.name,
            Email: data.email,
            GoogleId: data.id,
            PictureUrl: data.picture,
        };

        console.log("Google User:", data);

        // Gửi dữ liệu lên backend để xử lý đăng nhập

        const apiResponse = await axios.post(
            `${API_URL}/Account/google-login`,
            userData,
            { withCredentials: true } // Bắt buộc để cookie hoạt động
        );
        return apiResponse.data;
    } catch (error) {
        console.error("Google Login failed:", error.response?.data || error.message);
        throw error;
    }
};


const facebookLogin = async (accessToken) => {
    try {
        const accessTokens = accessToken;
        const { data } = await axios.get(
            `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`
        );

        const userData = {
            Name: data.name,
            Email: data.email,
            FacebookId: data.id,
            PictureUrl: data.picture.data.url,
        };

        console.log("Facebook User:", userData);


        const apiResponse = await axios.post(`${API_URL}/Account/facebook-login`, userData, { withCredentials: true });

        return apiResponse;
    } catch (error) {
        console.error("Facebook Login failed:", error.response?.data || error.message);
        throw error;
    }
};

const facebookRegister = async (accessToken) => {
    try {
        const accessTokens = accessToken;
        const { data } = await axios.get(
            `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`
        );

        const userData = {
            Name: data.name,
            Email: data.email,
            FacebookId: data.id,
            PictureUrl: data.picture.data.url,
        };

        console.log("Facebook User:", userData);

        const apiResponse = await axios.post(`${API_URL}/User/FacebookRegister`, userData);

        return apiResponse;
    } catch (error) {
        console.error("Facebook Login failed:", error.response?.data || error.message);
        throw error;
    }
};


const resetPassword = async (email, token, newpassword) => {

    try {
        const response = await axios.post(`${API_URL}/Account/reset-password`,
            {
                email: email,
                token: token,
                newpassword: newpassword
            });

        console.log(response);
        return response.data;
    }
    catch (error) {
        console.error("Reset Password failed:", error.response?.data || error.message);
        throw error;
    }

};


const getUserInfor = async () => {
    try {
        const response = await axios.get(`${API_URL}/User/getUser`, { withCredentials: true });
        return response.data;
    }
    catch (error) {
        return error;
    }
};

const forgotpassword = async (email) => {
    try {
        const response = await axios.post(`${API_URL}/Account/forgot-password`, {
            email: email
        });

        return response.data;
    } catch (error) {
        console.error("Forgot Password failed:", error.response?.data || error.message);
        throw error;
    }
};

const authService = {
    login,
    logout,
    register,
    GoogleRegister,
    googleLogin,
    facebookLogin,
    facebookRegister,
    resetPassword,
    forgotpassword,
    getUserInfor,
};

export default authService;