
import { Outlet } from "react-router-dom";
import Nav from "./components/layout/nav";
import Footer from "./components/layout/footer";
import "./assets/css/Home/bootstrap.css";
// import "./assets/css/Home/style.css";
// import "./assets/css/Home/responsive.css";
// import "./assets/css/Home/style.scss";
import { use, useContext } from "react";
import { useEffect } from "react";
import authService from "./service/authService";
import { Spin } from 'antd';
import { AuthContext } from "./components/layout/context/authContext";

import "./assets/css/LoginCss/admin.css";


const App = () => {
  const { isAppLoading } = useContext(AuthContext);


  return (
    <>

      {isAppLoading ? (
        // Hiển thị spinner khi đang load
        <div className="loading-container" style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh' // Full viewport height để che toàn bộ trang
        }}>
          <Spin size="large" />
        </div>
      ) : (
        // Hiển thị nội dung sau khi load xong
        <>
          <Nav />
          <div style={{ minHeight: 'calc(70vh - 100px)' }}>
            <Outlet />
          </div>
          <Footer />
        </>
      )}


    </>
  );

}

export default App;
