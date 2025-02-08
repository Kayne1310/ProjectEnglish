import React, { useState } from "react";

import { useGoogleLogin } from "@react-oauth/google";
import AuthForm from "./AuthForm";
import { handerRegister,handerGoogleRegister } from "../../../helpers/authHandlers";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isRegisterSuccess, setIsRegisterSuccess] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        handerRegister(
            e,
            name,
            email,
            password,
            setError,
            setIsLoading,
            setIsRegisterSuccess,
            setName,
            setEmail,
            setPassword
        );
    };

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (response) => {
            await handerGoogleRegister(response, setError, setIsLoading, setIsRegisterSuccess);
        },
        onError: (error) => {
            console.error("Google login failed:", error);
            setError("Google login failed.");
        },
    });

    return (
        <AuthForm
            title="Create Account"
            name={name}
            setName={setName}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            error={error}
            isLoading={isLoading}
            isRegisterSuccess={isRegisterSuccess}
            handleSubmit={handleSubmit}
            googleLogin={handleGoogleLogin}
            toggleText="Already have an account?"
            toggleLink="/loginuser"
            toggleLinkText="Sign In"
            showSignUp={true}
        />
    );
};

export default Register;
