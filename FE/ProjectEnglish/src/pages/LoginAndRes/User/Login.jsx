import React, { useState, useContext } from "react";
import { handleFacebookLogin, handleGoogleLogin, handleLogin } from "../../../helpers/authHandlers";
import { useGoogleLogin } from "@react-oauth/google";
import AuthForm from "./AuthForm";
import {AuthContext} from "../../../components/layout/context/authContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { setUser } = useContext(AuthContext); // Lấy setUser từ AuthContext
    const navigate=useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        handleLogin( email, password, setError, setIsLoading, setUser,navigate);
    };

    const HandleGoogleLogin = useGoogleLogin({
        onSuccess: async (response) => {
            await handleGoogleLogin(response, setError, setIsLoading,setUser,navigate);
            console.log("Google login success", response);
        },
        onError: (error) => {
            console.error("Google login failed:", error);
            setError("Google login failed.");
        },
    });
    const HandleFacebookLogin = async ({ data }) => {
      await handleFacebookLogin(data, setError, setIsLoading,setUser,navigate);
    };
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
            facebookLogin={HandleFacebookLogin }
        />
    );
};

export default Login;
