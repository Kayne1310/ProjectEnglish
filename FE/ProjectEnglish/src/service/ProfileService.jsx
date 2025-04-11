import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const updateUser = async (userData) => { 
    try {
        const formData = new FormData();

        // Thêm các trường vào formData, bao gồm quiz_id
        formData.append('UserID', userData.UserID || ''); 
        formData.append('UserName', userData.UserName || ''); 
        formData.append('Address', userData.Address || ''); 
        formData.append('Age', userData.Age || '');
        formData.append('Phone', userData.Phone || ''); 
        formData.append('Gender', userData.Gender || '');
        if (userData.Picture) {
            formData.append('Picture', userData.Picture);
        }

        const response = await axios.put(`${API_URL}/User/update_user`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        // console.log("Full API Response for Update:", response.data);

        if (!response || !response.data) {
            console.error("Error: response.data is undefined!");
            return null;
        }

        return response.data;
    } catch (error) {
        console.error("Update user failed:", error.response?.data || error.message);
        return { error: error.response?.data || error.message };
    }
};

export {updateUser}