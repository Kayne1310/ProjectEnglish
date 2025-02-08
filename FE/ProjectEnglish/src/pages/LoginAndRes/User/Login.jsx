import React, { useState } from "react";
import { handleGoogleLogin, handleLogin } from "../../../helpers/authHandlers";
import { useGoogleLogin } from "@react-oauth/google";
import AuthForm from "./AuthForm";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        handleLogin(e, email, password, setError, setIsLoading);
    };

    const HandleGoogleLogin = useGoogleLogin({
        onSuccess: async (response) => {
            await handleGoogleLogin(response, setError, setIsLoading);
            console.log("Google login success", response);
        },
        onError: (error) => {
            console.error("Google login failed:", error);
            setError("Google login failed.");
        },
    });

    return (
        <AuthForm
            title="Sign In"
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            error={error}
            isLoading={isLoading}
            handleSubmit={handleSubmit}
            googleLogin={HandleGoogleLogin}
            toggleText="Don't have an account?"
            toggleLink="/registeruser"
            toggleLinkText="Sign Up"
            showSignUp={false}
        />
    );
};

export default Login;
