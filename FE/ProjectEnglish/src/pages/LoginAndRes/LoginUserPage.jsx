import React, { useEffect, useState } from "react";
import "@fortawesome/fontawesome-free/css/all.css";
import "../../assets/css/LoginCss/user.css"; // Import file CSS của bạn
import authService from "../../service/authService";
import { Oval } from "react-loader-spinner";

const LoginUserPage = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isRegisterSuccess, setIsRegisterSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
        setIsRegisterSuccess(false);
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
    setIsLoading(true);

    try {
      const response = await authService.login(email, password);

      if (response.returnCode == -1) {
        setError("Login failed. Please Enter Email and Password incorrect.");
        setIsLoading(false);
      }

      else {

        console.log(response);
        setTimeout(() => {
          setIsLoading(false);
          window.location.href = "/"; // Redirect after successful login
        }, 2000); // Hide loader after 2 seconds
        window.location.href = "/"; // Chuyển hướng sau khi login thành công
      }
    } catch (err) {
      setError(`Login failed. ${err.message}`);
      setIsLoading(false);
    }
  };

  // Hander login
  const handerRegister = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const response = await authService.register(name, email, password);
      if (response.returnCode == -1) {
        setError(`Register failed.${response.returnMessage} ` );
        setName("");
        setEmail("");
        setPassword("");
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      }

      else {
        setIsRegisterSuccess(true);
        setName("");
        setEmail("");
        setPassword("");
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      }
    }
    catch (err) {
      setError(`Register failed. ${err.message}`);
      setIsLoading(false);
    }
  };


  return (
    <div className="container" id="container">
      {/* Đăng ký tài khoản */}
      <div className="form-container sign-up">
        <form onSubmit={handerRegister}>
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
          <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
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
          <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
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
