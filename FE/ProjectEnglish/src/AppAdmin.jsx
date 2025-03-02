import React, { useEffect } from 'react';
import Sidebar from './components/layoutAdmin/Sidebar';
import { Outlet } from 'react-router-dom';
import AdminNavbar from './components/layoutAdmin/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";


function AppAdmin() {
  useEffect(() => {
    import ('./assets/css/AdminCss/style.css');
    import ('./assets/css/AdminCss/bs.css');
  
  },[]);
  return (
    <div className="container-scroller">
      <AdminNavbar />
      <div className="container-fluid page-body-wrapper">
        <Sidebar />
        <Outlet />
      </div>
    </div>
  );
}

export default AppAdmin;