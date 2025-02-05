import React, { useState } from "react";
import "../../assets/css/LoginCss/user.css"; // Đường dẫn đến CSS
// import image1 from "../../assets/image/1.jpg";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";

const LoginUserPage = () => {
  const [isRegister, setIsRegister] = useState(false);

  return (
      <div className="login-container">
          <div className="login-box">
              {/* Login Section */}
              {!isRegister ? (
                  <div className="w-100 w-md-50 px-3 px-md-5 text-center">
                      <h2 className="font-bold text-2xl text-[#002D74] mt-3 mt-md-5">Log In</h2>
                      <br />
                      <form className="d-flex flex-column align-items-center gap-3 gap-md-4">
                          <input className="login-input-field w-100" type="email" name="email" placeholder="Email" />
                          <input className="login-input-field w-100" type="password" name="password" placeholder="Password" />
                          <button className="login-btn-primary mt-3 mt-md-5 w-100">Log In</button>
                      </form>
                      <div className="login-divider d-flex justify-content-center align-items-center">
                          <hr className="w-25" />
                          <p className="mx-2">OR</p>
                          <hr className="w-25" />
                      </div>

                      {/* // buton facebook, google */}
                      <div className="d-flex justify-content-center gap-3 mt-3">
                      <a href="#" className="icon btn btn-light border rounded p-3 d-flex align-items-center justify-content-center"
                          style={{ width: "50px", height: "50px" }}>
                          <i className="fa-brands fa-google text-danger fs-4"></i>
                      </a>
                      <a href="#" className="icon btn btn-light border rounded p-3 d-flex align-items-center justify-content-center"
                          style={{ width: "50px", height: "50px" }}>
                          <i className="fa-brands fa-facebook-f text-primary fs-4"></i>
                      </a>
                      </div>



                      <p className="login-forgot-password mt-3">Forgot your Password?</p>
                      <div className="login-register-container d-flex justify-content-center">
                          <p className="me-2">Don't have an account?</p>
                          <button className="login-btn-secondary" onClick={() => setIsRegister(true)}>Register</button>
                      </div>
                  </div>
              ) : (
                  /* Register Section */
                  <div className="w-100 w-md-50 px-3 px-md-5 text-center">
                      <h2 className="font-bold text-2xl text-[#002D74] mt-3 mt-md-5">Register</h2>
                      <br />
                      <form className="d-flex flex-column align-items-center gap-3 gap-md-4">
                          <input className="login-input-field w-100" type="text" name="fullname" placeholder="Full Name" />
                          <input className="login-input-field w-100" type="email" name="email" placeholder="Email" />
                          <input className="login-input-field w-100" type="password" name="password" placeholder="Password" />
                          <button className="login-btn-primary mt-3 mt-md-5 w-100">Register</button>
                      </form>
                      <div className="login-divider d-flex justify-content-center align-items-center">
                          <hr className="w-25" />
                          <p className="mx-2">OR</p>
                          <hr className="w-25" />
                      </div>


                      {/* buton facebook, google */}
                      <div className="d-flex justify-content-center gap-3 mt-3">
                      <a href="#" className="icon btn btn-light border rounded p-3 d-flex align-items-center justify-content-center"
                          style={{ width: "50px", height: "50px" }}>
                          <i className="fa-brands fa-google text-danger fs-4"></i>
                      </a>
                      <a href="#" className="icon btn btn-light border rounded p-3 d-flex align-items-center justify-content-center"
                          style={{ width: "50px", height: "50px" }}>
                          <i className="fa-brands fa-facebook-f text-primary fs-4"></i>
                      </a>
                      </div>


                      <p className="login-forgot-password mt-3">Already have an account?</p>
                      <div className="login-register-container d-flex justify-content-center">
                          <button className="login-btn-secondary" onClick={() => setIsRegister(false)}>Log In</button>
                      </div>
                  </div>
              )}
          </div>
      </div>
  );
};

export default LoginUserPage;
