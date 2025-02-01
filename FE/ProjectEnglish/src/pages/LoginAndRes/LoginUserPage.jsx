import React, { useEffect, useState } from "react";
import "@fortawesome/fontawesome-free/css/all.css";
import "../../assets/css/LoginCss/user.css"; // Import file CSS của bạn
import authService from "../../service/authService";

const LoginUserPage = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {

    // Lấy button và container
    const loginBtn = document.getElementById("login");
    const registerBtn = document.getElementById("register");
    const container = document.getElementById("container");

    if (loginBtn && registerBtn && container) {
      registerBtn.addEventListener("click", () => {
        container.classList.add("active");
      });

      loginBtn.addEventListener("click", () => {
        container.classList.remove("active");
      });
    }

    // Cleanup event listener khi component bị unmount
    return () => {
      if (loginBtn) loginBtn.removeEventListener("click", () => { });
      if (registerBtn) registerBtn.removeEventListener("click", () => { });
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await authService.login(email, password);
     
      if(response.returnCode ==-1){
        setError("Login failed. Please Enter Email and Password incorrect.");
      }
      else{

        console.log(response);
        window.location.href = "/"; // Chuyển hướng sau khi login thành công
      }
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    }
  };


  return (
    <div className="container" id="container">
      {/* Đăng ký tài khoản */}
      <div className="form-container sign-up">
        <form>
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
          <input type="text" placeholder="Name"  />
          <input type="email" placeholder="Email"  />
          <input type="password" placeholder="Password" />
          <button type="submit">Sign Up</button>
        </form>
      </div>

      {/* Đăng nhập */}
      <div className="form-container sign-in">
        <form onSubmit={handleLogin}> 
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
          <input type="text" placeholder="Email"  value={email} onChange={(e) => setEmail(e.target.value)}/>
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
          <a href="#">Forget Your Password?</a>
          <button type="submit">Sign In</button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
      </div>

      {/* Toggle giữa Sign In / Sign Up */}
      <div className="toggle-container">
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
  );
};

export default LoginUserPage;
