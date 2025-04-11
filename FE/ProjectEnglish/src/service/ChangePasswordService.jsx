import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL;

const ChangePassword = async (oldPassword, newPassword, reNewPassword) => {
    try {
        const res = await axios.post(`${API_URL}/User/ChangePassword`, {
            oldPassword: oldPassword,
            newPassword: newPassword,
            reNewPassword: reNewPassword
        }, { withCredentials: true })

        // console.log("check res for change pass: ", res)

        if (!res || !res.data) {
            return null;
        }

        return res.data;
    } catch (err) {
        return { err: err.res?.data || err.message };
    }
}

export { ChangePassword }