import React, { useState } from "react";
import "@fortawesome/fontawesome-free/css/all.css";
import "../../../assets/css/LoginCss/user.css";
import Loading from "react-loading";
import { Link } from "react-router-dom";
import { handleForgotPassword } from "../../../helpers/authHandlers";

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        handleForgotPassword(email, setError, setIsLoading, setIsSuccess,setEmail);
    };

    return (
        <div className="login-user" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", fontFamily: "Arial, sans-serif" }}>
            <div className="containers" style={{ maxWidth: "350px", background: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)" }}>
                <div className="form-box">
                    <form onSubmit={handleSubmit} style={{ textAlign: "center" }}>
                        <h1 style={{ fontSize: "24px", fontWeight: "bold", fontFamily: "Arial, sans-serif" }}>Forgot password</h1>
                        <span style={{ fontSize: "16px", fontFamily: "Arial, sans-serif" }}>Enter your Username </span>

                        <input
                            type="email"
                            placeholder="Enter your Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ padding: "10px", width: "100%", marginBottom: "10px", fontSize: "16px", fontFamily: "Arial, sans-serif" }}
                        />
                        <button type="submit" style={{ padding: "12px", fontSize: "16px", fontWeight: "bold", width: "100%", background: "#13d420", color: "#fff", border: "none", borderRadius: "5px", fontFamily: "Arial, sans-serif" }}>
                            Forgot password
                        </button>
                        {isLoading && (
                            <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
                                <Loading type="spin" color="#13d420" height={30} width={30} />
                            </div>
                        )}
                        {!isLoading &&error && <p style={{ color: "red", fontFamily: "Arial, sans-serif" }}>{error}</p>}
                        {isSuccess && !isLoading && <p style={{ color: "green", fontFamily: "Arial, sans-serif" }}> Send Password Successful. Please Check your Email!</p>}
                        <p>
                            <Link to="/loginuser" style={{ color: "#13d420", textDecoration: "underline", fontFamily: "Arial, sans-serif" }}>
                                Back to Login
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;