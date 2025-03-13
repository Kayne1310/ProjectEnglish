import { useContext, useState } from 'react';
import logo from '../../../assets/image/logo.png';
import bear from '../../../assets/image/bear.jpeg';
import { AuthContext } from '../../../components/layout/context/authContext';
import { handleLogin } from '../../../helpers/authHandlers';
import { useNavigate } from 'react-router-dom';
import Loading from 'react-loading';

const LoginAdminPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useContext(AuthContext); // Lấy setUser từ AuthContext
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(email, password, setError, setIsLoading, setUser, navigate);
  };

  const handleShowPassword = (e) => {
    setShowPassword(e.target.checked);
  };

  return (
    <div className="body">
      <main>
        <div className="left-side">
          <img id='bear' src={bear} alt="bear" />
        </div>
        <div className="right-side">
          <div className="logo-container">
            <img id='logo' src={logo} alt="logo" />
          </div>
          <h1 className="login-title">Login Admin</h1>
          <h5 className="login-subtitle">Sign in to experience Quizzet better.</h5>
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="password">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="show-password-container">
              <input
                type="checkbox"
                id="showPassword"
                checked={showPassword}
                onChange={handleShowPassword}
              />
              <label htmlFor="showPassword" className="show-password-label">Show Password</label>
            </div>
            <button type="submit" className="login-btn">Sign in</button>
            {isLoading && (
              <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
                <Loading type="spin" color="#13d420" height={30} width={30} />
              </div>
            )}
            {!isLoading && error && <p style={{ color: "red" }}>{error}</p>}
          </form>
        </div>
      </main>
    </div>
  );
};

export default LoginAdminPage;

// const LoginAdminPage = () =>{
//   return(
//     <>
//     <h1>Admin login</h1>
//     </>
//   );
// }

// export default LoginAdminPage