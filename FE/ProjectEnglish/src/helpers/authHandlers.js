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
            // Lưu trạng thái đăng nhập vào localStorage
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("user", JSON.stringify(response.data));
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
            setTimeout(() => {
                setIsLoading(false);
                window.location.href = "/";
                localStorage.setItem("accessToken", apiResponse.token);
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

};

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
            setTimeout(() => {
                setIsLoading(false);
                window.location.href = "/";
                localStorage.setItem("accessToken", apiResponse.data.token);
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

export const handleResetPassword = async (password,email,token, setError, setIsLoading, setIsSuccess) => {  
    setError("");
    setIsLoading(true);
    setIsSuccess(false);
    try {
        const response = await authService.resetPassword(email,token,password);
        console.log("API Response:", response);
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
export const handleForgotPassword = async (email, setError, setIsLoading, setIsSuccess,setEmail) => {
    setError("");
    setIsLoading(true);
    setIsSuccess(false);
    try {
        const response = await authService.forgotpassword(email);
        console.log("API Response:", response);
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