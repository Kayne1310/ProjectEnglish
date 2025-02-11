import React, { useEffect, useState } from "react";
import "@fortawesome/fontawesome-free/css/all.css";
import "../../assets/css/LoginCss/user.css";
import { handerGoogleRegister, handerRegister, handleLogin } from "../../helpers/authHandlers";
import Loading from "react-loading";
import { Link } from "react-router-dom";
import { Eye, EyeSlash } from "react-bootstrap-icons"; // Sử dụng icon từ react-bootstrap-icons

import { useGoogleLogin } from "@react-oauth/google";



const LoginUserPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isRegisterSuccess, setIsRegisterSuccess] = useState(false);
    const [showSignUp, setShowSignUp] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (showSignUp) {
            handerRegister(e, name, email, password, setError, setIsLoading, setIsRegisterSuccess, setName, setEmail, setPassword);
        } else {
            handleLogin(e, email, password, setError, setIsLoading);
        }
    };

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (response) => {
            await handerGoogleRegister(response, setError, setIsLoading,setIsRegisterSuccess);
        },
        onError: (error) => {
            console.error("Google login failed:", error);
            setError("Google login failed.");
        },
    });


    return (
        <div className="login-user">
            <div className="containers" style={{ maxWidth: "350px" }}>
                <div className="form-box">
                    <form onSubmit={handleSubmit}>
                        <h1 style={{ fontSize: "22px" }}>{showSignUp ? "Create Account" : "Sign In"}</h1>
                        <div className="social-icons" style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "10px" }}>
                            <Link to="#" className="icon" onClick={handleGoogleLogin} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "40px", height: "40px", backgroundColor: "#db4437", borderRadius: "50%", color: "white", fontSize: "20px", textDecoration: "none" }}>
                                <i className="fa-brands fa-google"></i>
                              
                            </Link>
                            <Link to="#" className="icon" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "40px", height: "40px", backgroundColor: "#3b5998", borderRadius: "50%", color: "white", fontSize: "20px", textDecoration: "none" }}>
                                <i className="fa-brands fa-facebook-f"></i>
                            </Link>
                        </div>
                        <span>or use your email password</span>
                        {showSignUp && (
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                style={{ padding: "8px" }}
                            />
                        )}
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ padding: "8px" }}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ padding: "8px" }}
                        />
                        {!showSignUp && <Link to="#" className="forgot-password">Forget Your Password?</Link>}
                        <button type="submit" style={{ padding: "10px", fontSize: "14px" }}>{showSignUp ? "Sign Up" : "Sign In"}</button>
                        {isLoading && (
                            <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
                                <Loading type="spin" color="#13d420" height={30} width={30} />
                            </div>
                        )}
                        {!isLoading&& error  && <p style={{ color: "red" }}>{error}</p>}
                        {isRegisterSuccess && !isLoading && showSignUp && (
                            <p style={{ color: "green" }}>Register success. Please login</p>
                        )}
                        <p className="toggle-text" onClick={() => setShowSignUp(!showSignUp)}>
                            {showSignUp ? "Already have an account? " : "Don't have an account?"}
                            <span style={{ color: "#13d420", textDecoration: "underline", cursor: "pointer" }}>
                                {showSignUp ? "Sign In" : "Sign Up"}
                            </span>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginUserPage;
