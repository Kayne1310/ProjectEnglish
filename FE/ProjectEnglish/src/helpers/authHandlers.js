import authService from "../service/authService";

export const handleLogin = async (e, email, password, setError, setIsLoading) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
        const response = await authService.login(email, password);
        if (response.returnCode == -1) {
            setError("Login failed. Please Enter Email and Password incorrect.");
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