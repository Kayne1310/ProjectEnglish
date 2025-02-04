import React, { useEffect, useState } from "react";
import "@fortawesome/fontawesome-free/css/all.css";
import "../../assets/css/LoginCss/user.css"; // Import file CSS của bạn
import authService from "../../service/authService";
import { Oval } from "react-loader-spinner";
import { handerRegister, handleLogin } from "../../helpers/authHandlers";

const LoginUserPage = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isRegisterSuccess, setIsRegisterSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {

    // Lấy button và containers
    const loginBtn = document.getElementById("login");
    const registerBtn = document.getElementById("register");
    const containers = document.getElementById("containers");

    if (loginBtn && registerBtn && containers) {
      registerBtn.addEventListener("click", () => {
        containers.classList.add("active");
        setError("");
        setName("");
        setPassword("");
        setEmail("");
        setIsRegisterSuccess(false);
      });

      loginBtn.addEventListener("click", () => {
        containers.classList.remove("active");
        setIsRegisterSuccess(false);
        setError("");
        setEmail("");
        setPassword("");
      });
    }

    // Cleanup event listener khi component bị unmount
    return () => {
      if (loginBtn) loginBtn.removeEventListener("click", () => { });
      if (registerBtn) registerBtn.removeEventListener("click", () => { });
    };
  }, []);

  return (
    <div className="login-user">

 
    <div className="containers" id="containers">
      {/* Đăng ký tài khoản */}
      <div className="form-containers sign-up">
        <form onSubmit={(e) => handerRegister(e, name, email, password, setError, setIsLoading, setIsRegisterSuccess, setName, setEmail, setPassword)}>
          <h1>Create Account</h1>
          <div className="social-icons">
            <a href="#" className="icon">
              <i className="fa-brands fa-google-plus-g"></i>
            </a>
            <a href="#" className="icon">
              <i className="fa-brands fa-facebook-f"></i>
            </a>
          </div>
          <span>or use your email for registration</span>
          <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
          <button type="submit">Sign Up</button>
          {isLoading && (
            <div className="loader-overlay">
              <Oval
                height={50}
                width={50}
                color="#4fa94d"
                visible={true}
                ariaLabel="oval-loading"
                secondaryColor="#4fa94d"
                strokeWidth={2}
                strokeWidthSecondary={2}
              />
            </div>
          )}
          {!isLoading && isRegisterSuccess && <p style={{ color: "green" }}>Register success. Please login</p>}
          {!isLoading && error && <p style={{ color: "red" }}>{error}</p>}
        </form>
      </div>

      {/* Đăng nhập */}
      <div className="form-containers sign-in">
        <form onSubmit={(e) => handleLogin(e, email, password, setError, setIsLoading)}>
          <h1>Sign In</h1>
          <div className="social-icons">
            <a href="#" className="icon">
              <i className="fa-brands fa-google-plus-g"></i>
            </a>
            <a href="#" className="icon">
              <i className="fa-brands fa-facebook-f"></i>
            </a>
          </div>
          <span>or use your email password</span>
          <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <a href="#">Forget Your Password?</a>
          <button type="submit">Sign In</button>
          {isLoading && (
            <div className="loader-overlay">
              <Oval
                height={50}
                width={50}
                color="#4fa94d"
                visible={true}
                ariaLabel="oval-loading"
                secondaryColor="#4fa94d"
                strokeWidth={2}
                strokeWidthSecondary={2}
              />
            </div>
          )}
          {!isLoading && error && <p style={{ color: "red" }}>{error}</p>}
        </form>
      </div>

      {/* Toggle giữa Sign In / Sign Up */}
      <div className="toggle-containers">
        <div className="toggle">
          <div className="toggle-panel toggle-left">
            <h1>Welcome Back!</h1>
            <p>Enter your personal details to use all of site features</p>
            <button className="hidden" id="login">
              Sign In
            </button>
          </div>
          <div className="toggle-panel toggle-right">
            <h1>Hello, Friend!</h1>
            <p>Register with your personal details to use all of site features</p>
            <button className="hidden" id="register">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default LoginUserPage;
