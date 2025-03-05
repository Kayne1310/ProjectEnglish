import React, { useState } from "react";
import { Link } from "react-router-dom";

const AdminNavbar = ({ toggleSidebar }) => {
  return (
    <nav className="navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
      <div className="navbar-menu-wrapper d-flex align-items-center justify-content-end">
        {/* Nút Toggle Sidebar */}
        <button  type="button" onClick={toggleSidebar}>
          <span className="icon-menu"></span>
        </button>

        <ul className="navbar-nav navbar-nav-right">
          {/* Thông báo */}
          <li className="nav-item dropdown">
            <a className="nav-link count-indicator dropdown-toggle" id="notificationDropdown" href="#" data-bs-toggle="dropdown">
              <i className="icon-bell mx-0"></i>
              <span className="count"></span>
            </a>
            <div className="dropdown-menu dropdown-menu-right navbar-dropdown preview-list" aria-labelledby="notificationDropdown">
              <p className="mb-0 font-weight-normal float-left dropdown-header">Notifications</p>
              <a className="dropdown-item preview-item">
                <div className="preview-thumbnail">
                  <div className="preview-icon bg-success">
                    <i className="ti-info-alt mx-0"></i>
                  </div>
                </div>
                <div className="preview-item-content">
                  <h6 className="preview-subject font-weight-normal">Info</h6>
                  <p className="font-weight-light small-text mb-0 text-muted">Sample notification</p>
                </div>
              </a>
              <a className="dropdown-item preview-item">
                <div className="preview-thumbnail">
                  <div className="preview-icon bg-warning">
                    <i className="ti-settings mx-0"></i>
                  </div>
                </div>
                <div className="preview-item-content">
                  <h6 className="preview-subject font-weight-normal">Settings</h6>
                  <p className="font-weight-light small-text mb-0 text-muted">Private message</p>
                </div>
              </a>
              <a className="dropdown-item preview-item">
                <div className="preview-thumbnail">
                  <div className="preview-icon bg-info">
                    <i className="ti-user mx-0"></i>
                  </div>
                </div>
                <div className="preview-item-content">
                  <h6 className="preview-subject font-weight-normal">New user registration</h6>
                  <p className="font-weight-light small-text mb-0 text-muted">2 days ago</p>
                </div>
              </a>
            </div>
          </li>

          {/* Avatar Profile */}
          <li className="nav-item nav-profile dropdown">
            <a className="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown" id="profileDropdown">
              <img src="https://phanmemmkt.vn/wp-content/uploads/2024/09/avt-Facebook-hai-huoc.jpg" alt="profile" />
            </a>
            <div className="dropdown-menu dropdown-menu-right navbar-dropdown" aria-labelledby="profileDropdown">
              <a className="dropdown-item">
                <i className="ti-settings text-primary"></i> Settings
              </a>
              <a className="dropdown-item">
                <i className="ti-power-off text-primary"></i> Logout
              </a>
            </div>
          </li>
        </ul>

        {/* Nút toggle menu cho mobile */}
        <button className="navbar-toggler navbar-toggler-right d-lg-none align-self-center" type="button" onClick={toggleSidebar}>
          <span className="icon-menu"></span>
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
