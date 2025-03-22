
import React, { useContext, useEffect, useState } from 'react';
import Sidebar from './components/layoutAdmin/Sidebar';
import { Outlet } from 'react-router-dom';
import AdminNavbar from './components/layoutAdmin/Navbar';
import "../node_modules/bootstrap-icons/font/bootstrap-icons.css";
// import { AuthContext } from './components/layout/context/authContext';
// import authService from './service/authService';

const AppAdmin = () => {
  const [isMinimized, setIsMinimized] = useState(false);
  const toggleSidebar = () => {
    setIsMinimized(!isMinimized);
  };

  useEffect(() => {
    import('./assets/css/AdminCss/feather/feather.css');
    import('./assets/css/AdminCss/style.css');
    import('./assets/css/AdminCss/bs.css');
    import ("./assets/css/LoginCss/admin.css");
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