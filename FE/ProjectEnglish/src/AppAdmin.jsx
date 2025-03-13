
import React, { useContext, useEffect, useState } from 'react';
import Sidebar from './components/layoutAdmin/Sidebar';
import { Outlet } from 'react-router-dom';
import AdminNavbar from './components/layoutAdmin/Navbar';
import "../node_modules/bootstrap-icons/font/bootstrap-icons.css";
// import { AuthContext } from './components/layout/context/authContext';
// import authService from './service/authService';

function AppAdmin() {
  const [isMinimized, setIsMinimized] = useState(false);
  const toggleSidebar = () => {
    setIsMinimized(!isMinimized);
  };
  // const { setUser, isAppLoading, setIsAppLoading } = useContext(AuthContext);
  // const fetchUser = async () => {
  //   try {
  //     const res = await authService.getUserInfor();

  //     if (res.user) {
  //       setUser({
  //         userName: res.user.userName,
  //         email: res.user.email,
  //         picture: res.user.picture,
  //         facebookId: res.user.facebookId,
  //         googleId: res.user.googleId,
  //       });
  //       console.log("User Data:", res.user);
  //     }
  //     // if (res.status === 401) {
  //     //   console.log("Phiên làm việc đã hết hạn. Chuyển hướng đến trang đăng nhập.");
  //     //   window.location.href = "/loginuser";
  //     // }
  //   }
  //   catch (error) {
  //     throw error;
  //   }
  //   finally {
  //     setIsAppLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   setIsAppLoading(true); // Set loading to true before fetching user data
  //   const timer = setTimeout(() => {
  //     fetchUser();
  //   }, 1000); // 2 seconds delay

  //   return () => clearTimeout(timer); // Cleanup the timer if the component unmounts
  // }, []);

  useEffect(() => {
    import('./assets/css/AdminCss/feather/feather.css');
    import('./assets/css/AdminCss/style.css');
    import('./assets/css/AdminCss/bs.css');

  }, []);

  return (
    <>
      <div className={`container-scroller ${isMinimized ? "sidebar-minimized" : ""}`}>
        <AdminNavbar toggleSidebar={toggleSidebar} />
        <div className="container-fluid page-body-wrapper">
          <Sidebar isMinimized={isMinimized} />
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default AppAdmin;