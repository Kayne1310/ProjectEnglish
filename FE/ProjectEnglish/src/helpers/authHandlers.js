import authService from "../service/authService";

export const handleLogin = async (e, email, password, setError, setIsLoading) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
        const response = await authService.login(email, password);
        if (response.returnCode == -1) {
            setError(`Login failed. ${response.returnMessage}`);
            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
        } else {
            console.log(response);
            // Lưu trạng thái đăng nhập và thông tin người dùng vào localStorage
            localStorage.setItem("isLoggedIn", "true");
            // localStorage.setItem("user", JSON.stringify(response.data)); // Lưu thông tin người dùng

            setTimeout(() => {
                setIsLoading(false);
                window.location.href = "/"; // Redirect after successful login
            }, 1000); // Hide loader after 1 seconds
        }
    } catch (err) {
        setError(`Login failed. ${err.message}`);
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }
};

export const handleLogout = async (setIsLoading, setError) => {
    setError("");
    setIsLoading(true);
    try {
        // Gọi API logout (nếu cần)
        // await authService.logout(); // Bạn có thể gọi API logout ở đây nếu cần

        // Xóa thông tin khỏi localStorage
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("accessToken");

        setTimeout(() => {
            setIsLoading(false);
            window.location.href = "/"; // Chuyển hướng về trang đăng nhập
        }, 1000);
    } catch (error) {
        setError(`Logout failed. ${error.message}`);
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }
};

export const handerRegister = async (e, name, email, password, setError, setIsLoading, setIsRegisterSuccess, setName, setEmail, setPassword) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    setIsRegisterSuccess(false);

    console.log("Registering user:", { name, email, password });
    try {
        const response = await authService.register(name, email, password);
        console.log("API Response:", response);
        if (response.returnCode == -1) {
            setError(`Register failed. ${response.returnMessage}`);
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
        }
    } catch (err) {
        setError(`Register failed. ${err.message}`);
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




export const handleGoogleLogin = async (response, setError, setIsLoading) => {
    setError("");
    setIsLoading(true);


    try {
        const apiResponse = await authService.googleLogin(response.access_token);
        console.log("API Response:", apiResponse);
        if (apiResponse.returnCode == -1) {
            setError(`Register failed. ${apiResponse.returnMessage}`);
            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
        }

        else if (apiResponse.returnCode == 1) {
            localStorage.setItem("isLoggedIn", "true");
            setTimeout(() => {
                setIsLoading(false);
                window.location.href = "/";
            }, 1000); // Hide loader after 1 seconds
        }
    } catch (err) {
        setError(`Register failed. ${err.message}`);
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
        console.log("API Response:", apiResponse);
        if (apiResponse.data.returnCode == -1) {
            setError(`Register failed. ${apiResponse.data.returnMessage}`);
            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
        }
        else if (apiResponse.data.returnCode == 1) {
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

export const handleFacebookLogin = async (data, setError, setIsLoading) => {
    setError("");
    setIsLoading(true);
    try {

        const apiResponse = await authService.facebookLogin(data.accessToken);
        console.log("API Response:", apiResponse);

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
                window.location.href = "/";
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