
import authService from "../service/authService";
import { toast } from "react-toastify"; // Import toast
// Sử dụng hook navigate để chuyển hướng trang
export const handleLogin = async (email, password, setError, setIsLoading, setUser, navigate) => {
    setError("");
    setIsLoading(true);

    try {
        const response = await authService.login(email, password);

    

        if (!response || !response.user) {
            const errorMessage ="Login failed. User data is missing.";
            // setError(errorMessage); // Cập nhật trạng thái lỗi
            toast.error(errorMessage); // Hiển thị toast lỗi
            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
            console.error("Missing user data:", response);
        } else {
   

            setUser({
                userName: response.user.userName,
                email: response.user.email,
                picture: response.user.picture,
                address: response.user.address,
                age: response.user.age,
                phone: response.user.phone,
                gender: response.user.gender,
                facebookId: response.user.facebookId,
                googleId: response.user.googleId,
            }); // Lưu thông tin user vào context
         
            toast.success("Login successfully!");
            setTimeout(() => {
                setIsLoading(false);
                if (response.user.role === "User") {
                    navigate("/") // Chuyển hướng sau khi đăng nhập thành công
                } else {
                    setError("Login failed. Invalid role!");
                }
            }, 1000);
            return;
        }
    } catch (err) {
        setError(`Login failed. ${err.message}`);
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }

    setTimeout(() => {
        setIsLoading(false);
    }, 1000);
};

export const handleLoginAdmin = async (email, password, setError, setIsLoading, setUser, navigate) => {
    setError("");
    setIsLoading(true);

    try {
        const response = await authService.login(email, password);

        console.log("API Response:", response); // Kiểm tra response trả về từ authService

        if (!response || !response.user) {
            setError("Login failed. User data is missing.");
            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
            console.error("Missing user data:", response);
        } else {
            console.log("User Data:", response.user);

            setUser({
                userName: response.user.userName,
                email: response.user.email,
                picture: response.user.picture,
                address: response.user.address,
                age: response.user.age,
                phone: response.user.phone,
                gender: response.user.gender,
                facebookId: response.user.facebookId,
                googleId: response.user.googleId,
            }); // Lưu thông tin user vào context

            setTimeout(() => {
                setIsLoading(false);
                if (response.user.role === "Admin") {
                    navigate("/Admin")
                } else {
                    setError("Login failed. Invalid role!");
                }
            }, 1000);
            return;
        }
    } catch (err) {
        const errorMessage = `Login failed. ${err.message}`;
        // setError(errorMessage);// Cập nhật trạng thái lỗi
        toast.error(errorMessage); // Hiển thị toast lỗi
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }

    setTimeout(() => {
        setIsLoading(false);
    }, 1000);
};


export const handleLogout = async (
    setIsLoading,
    setError,
    setUser,
) => {
    setError("");
    setIsLoading(true);

    try {
        const res = await authService.logout();

        console.log("Logout Response:", res);

        if (!res || res.error || res.returnCode !== 1) {
            throw new Error(res?.returnMessage || "Logout failed");
        } else {
            setUser(null); // Xóa user trong context/state
            setIsLoading(false);
            window.location.href="/" // load sau khi điêu hướng
        }
    } catch (error) {
        setError(`Logout failed. ${error.message}`);
        setIsLoading(false);
    }
};


////
export const handerRegister = async (e, name, email, password, setError, setIsLoading, setIsRegisterSuccess, setName, setEmail, setPassword) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    setIsRegisterSuccess(false);


    try {
        const response = await authService.register(name, email, password);
 
        if (response.returnCode == -1) {
            // setError(`Register failed. ${response.returnMessage}`);
            toast.error(`Register failed. ${response.returnMessage}`); // hiển thị toast lỗi
            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
        } else {
            setName("");
            setEmail("");
            setPassword("");
            setTimeout(() => {
                setIsLoading(false);
                setIsRegisterSuccess(true);
            }, 1000); // Hide loader after 2 seconds
            toast.success("Register successfully!"); // Hiển thị toast thành công
        }
    } catch (err) {
        // setError(`Register failed. ${err.message}`);
        toast.error(`Register failed. ${err.message}`); // Hiển thị toast lỗi
        setTimeout(() => {
            setIsLoading(false);

        }, 1000);
    }
};

export const handerGoogleRegister = async (response, setError, setIsLoading, setIsRegisterSuccess) => {
    setError("");
    setIsLoading(true);
    setIsRegisterSuccess(false);

    try {
        const apiResponse = await authService.GoogleRegister(response.access_token);

        console.log("API Response:", apiResponse);



        if (apiResponse.returnCode == -1) {
            setError(`Register failed. ${apiResponse.returnMessage}`);
            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
        }
        else if (apiResponse.returnCode == 1) {
            setTimeout(() => {
                setIsLoading(false);
                setIsRegisterSuccess(true);
            }, 1000); // Hide loader after 1 seconds
        }
    } catch (err) {
        setError(`Register failed. ${err.message}`);
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }


}




export const handleGoogleLogin = async (response, setError, setIsLoading, setUser, navigate) => {
    setError("");
    setIsLoading(true);


    try {
        const apiResponse = await authService.googleLogin(response.access_token);
        // console.log("Context Response:", userInfo.email);
        // console.log("Context Response:", userInfo.userId);
        // console.log("Context Response:", userInfo.name);
        // console.log("Context Response:", userInfo.picture);
        // console.log("API Response:", apiResponse);
        if (apiResponse.returnCode == -1) {
            const errorMessage = `Register failed. ${apiResponse.returnMessage}`
            setError(errorMessage); // Cập nhật trạng thái lỗi
            toast.error(errorMessage); // Hiển thị toast lỗi
            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
        }

        else if (apiResponse.returnCode == 1) {
            localStorage.setItem("isLoggedIn", "true");
            setTimeout(() => {
                setIsLoading(false);
                navigate("/");
                const successMessage = "Đăng nhập bằng Google thành công!";
                setError(""); // Reset lỗi (hoặc không cần nếu không hiển thị trên form)
                toast.success(successMessage); // Hiển thị toast thành công

            }, 1000); // Hide loader after 1 seconds
        }
    } catch (err) {
        const errorMessage = `Register failed. ${err.message}`;
        setError(errorMessage); // Cập nhật trạng thái lỗi
        toast.error(errorMessage); // Hiển thị toast lỗi
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }

};


export const FacebookRegister = async (response, setError, setIsLoading, setIsRegisterSuccess) => {
    setError("");
    setIsLoading(true);
    setIsRegisterSuccess(false);

    try {
        const apiResponse = await authService.facebookRegister(response.accessToken);

        if (apiResponse.data.returnCode == -1) {
            setError(`Register failed. ${apiResponse.data.returnMessage}`);
            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
        }
        else if (apiResponse.data.returnCode == 1) {
            localStorage.setItem("isLoggedIn", "true");
            setTimeout(() => {
                setIsLoading(false);
                setIsRegisterSuccess(true);
            }, 1000); // Hide loader after 1 seconds
        }
    } catch (err) {
        setError(`Register failed. ${err.message}`);
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }


};




export const handleFacebookLogin = async (data, setError, setIsLoading, setUser, navigate) => {
    setError("");
    setIsLoading(true);
    try {

        const apiResponse = await authService.facebookLogin(data.accessToken);


        if (apiResponse.data.returnCode == -1) {
            setError(`Register failed. ${apiResponse.returnMessage}`);
            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
        }


        else if (apiResponse.data.returnCode == 1) {
            localStorage.setItem("isLoggedIn", "true");
            setTimeout(() => {
                setIsLoading(false);
                navigate("/");


            }, 1000); // Hide loader after 1 seconds
        }

    }
    catch (err) {
        setError(`Register failed. ${err.message}`);
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }
};

export const handleResetPassword = async (password, email, token, setError, setIsLoading, setIsSuccess) => {
    setError("");
    setIsLoading(true);
    setIsSuccess(false);
    try {
        const response = await authService.resetPassword(email, token, password);
      
        if (response.returnCode == -1) {
            setError(`Reset password failed. ${response.returnMessage}`);
            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
        } else {
            setTimeout(() => {
                setIsLoading(false);
                setIsSuccess(true);
            }, 1000); // Hide loader after 1 seconds
        }
    } catch (err) {
        setError(`Reset password failed. ${err.message}`);
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }
};
export const handleForgotPassword = async (email, setError, setIsLoading, setIsSuccess, setEmail) => {
    setError("");
    setIsLoading(true);
    setIsSuccess(false);
    try {
        const response = await authService.forgotpassword(email);
    
        if (response.returnCode == -1) {
            setError(`Forgot password failed. ${response.returnMessage}`);
            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
            setEmail("");
        } else {
            setTimeout(() => {
                setIsLoading(false);
                setIsSuccess(true);
                setEmail("");
            }, 1000); // Hide loader after 1 second
        }
    } catch (err) {
        setError(`Forgot password failed. ${err.message}`);
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }
};