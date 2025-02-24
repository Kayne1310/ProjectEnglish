import React, { useContext, useState } from "react";
import { handleFacebookLogin, handleGoogleLogin, handleLogin } from "../../../helpers/authHandlers";
import { useGoogleLogin } from "@react-oauth/google";
import AuthForm from "./AuthForm";
import userContext from "../../../reactContext/userReactContext";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        handleLogin(e, email, password, setError, setIsLoading);
    };
    // const userInfo=useContext(userContext);
    // console.log(userInfo);

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
    const HandleFacebookLogin = async ({ data }) => {
      await handleFacebookLogin(data, setError, setIsLoading);
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
