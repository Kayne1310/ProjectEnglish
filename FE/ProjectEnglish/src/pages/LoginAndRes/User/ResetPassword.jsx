import React, { useState } from "react";
import "@fortawesome/fontawesome-free/css/all.css";
import "../../../assets/css/LoginCss/user.css";
// import { handleResetPassword } from "../../helpers/authHandlers";
import Loading from "react-loading";
import { Link } from "react-router-dom";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    // handleResetPassword(password, setError, setIsLoading, setIsSuccess);
  };

  return (
    <div className="login-user" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", fontFamily: "inherit" }}>
      <div className="containers" style={{ maxWidth: "350px", background: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)" }}>
        <div className="form-box">
          <form onSubmit={handleSubmit} style={{ textAlign: "center" }}>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", fontFamily: "inherit" }}>Reset Password</h1>
            <span style={{ fontSize: "16px", fontFamily: "inherit" }}>Enter your new password</span>
            <input
              type="password"
              placeholder="New Password"
              value={password}
            //   onChange={(e) => setPassword(e.target.value)}
              required
              style={{ padding: "10px", width: "100%", marginBottom: "10px", fontSize: "16px", fontFamily: "inherit" }}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
            //   onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{ padding: "10px", width: "100%", marginBottom: "10px", fontSize: "16px", fontFamily: "inherit" }}
            />
            <button type="submit" style={{ padding: "12px", fontSize: "16px", fontWeight: "bold", width: "100%", background: "#13d420", color: "#fff", border: "none", borderRadius: "5px", fontFamily: "inherit" }}>
              Reset Password
            </button>
            {isLoading && (
              <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
                <Loading type="spin" color="#13d420" height={30} width={30} />
              </div>
            )}
            {error && <p style={{ color: "red", fontFamily: "inherit" }}>{error}</p>}
            {isSuccess && !isLoading && <p style={{ color: "green", fontFamily: "inherit" }}>Your password has been reset successfully.</p>}
            <p>
              <Link to="/login" style={{ color: "#13d420", textDecoration: "underline", fontFamily: "inherit" }}>
                Back to Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
