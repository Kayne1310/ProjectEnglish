import React from 'react';
import Sidebar from './components/layoutAdmin/Sidebar';
import { Outlet } from 'react-router-dom';
import AdminNavbar from './components/layoutAdmin/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import './assets/css/AdminCss/style.css'
import './assets/css/AdminCss/bs.css'


function AppAdmin() {
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