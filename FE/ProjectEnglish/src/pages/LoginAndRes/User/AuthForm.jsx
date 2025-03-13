import React from "react";
import { Link } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.css";
import "../../../assets/css/LoginCss/user.css";
import Loading from "react-loading";
import { LoginSocialFacebook, } from 'reactjs-social-login'

const AuthForm = ({
    title,
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    error,
    isLoading,
    isRegisterSuccess,
    handleSubmit,
    googleLogin,
    facebookLogin,
    toggleText,
    toggleLink,
    toggleLinkText,
    showSignUp

}) => {
    return (
        <div className="login-user">
            <div className="containers" style={{ maxWidth: "350px" }}>
                <div className="form-box">
                    <form onSubmit={handleSubmit}>
                        <h1 style={{ fontSize: "22px" }}>{title}</h1>
                        <div className="social-icons" style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "10px" }}>
                            <Link to="#" className="icon" onClick={googleLogin} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "40px", height: "40px", backgroundColor: "#db4437", borderRadius: "50%", color: "white", fontSize: "20px", textDecoration: "none" }}>
                                <i className="fa-brands fa-google"></i>
                            </Link>

                            <LoginSocialFacebook
                                isOnlyGetToken
                                appId={import.meta.env.VITE_APP_FB_APP_ID2 || ''}
                                onResolve={facebookLogin}
                                onReject={(err) => {
                                    console.log(err)
                                }}
                            >
                                <Link to="#" className="icon" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "40px", height: "40px", backgroundColor: "#3b5998", borderRadius: "50%", color: "white", fontSize: "20px", textDecoration: "none" }}>
                                    <i className="fa-brands fa-facebook-f"></i>
                                </Link>
                            </LoginSocialFacebook>
                        </div>
                        <span>or use your email password</span>
                        {showSignUp && (
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        )}
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        {!showSignUp && <Link to="/forgotpassword" className="forgot-password" >
                            Forget Your Password?
                        </Link>}

                        <button type="submit">{title}</button>
                        {isLoading && (
                            <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
                                <Loading type="spin" color="#13d420" height={30} width={30} />
                            </div>
                        )}
                        {!isLoading && error && <p style={{ color: "red" }}>{error}</p>}
                        {isRegisterSuccess && showSignUp && (
                            <p style={{ color: "green" }}>Register success. Please login</p>
                        )}
                        <p className="toggle-text">
                            {toggleText}{" "}
                            <Link to={toggleLink} style={{ color: "#13d420", textDecoration: "none" }}>
                                {toggleLinkText}
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AuthForm;
