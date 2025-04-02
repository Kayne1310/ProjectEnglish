import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../layout/context/authContext";
import { handleLoginAdmin, handleLogout, handleLogoutAdmin } from "../../helpers/authHandlers";

const AdminNavbar = ({ toggleSidebar }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { userInfor, setUser } = useContext(AuthContext); // Lấy user từ context

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.nav-profile')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Không cần set lại user ở đây vì đã có trong context
  }, [userInfor]);

  const onLogout = async () => {
    await handleLogoutAdmin(setIsLoading, setError, setUser);
 
  };

  return (
    <div>
      <nav className="navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
        <div className="navbar-menu-wrapper d-flex align-items-center justify-content-between w-100">
          {/* Nút Toggle Sidebar cho mobile */}
          <button 
            className="navbar-toggler d-block" 
            type="button" 
            onClick={toggleSidebar}
          >
            <i className="icon-menu" style={{
              fontSize: '20px',
              color: '#000'
            }}></i>
          </button>

          <ul className="navbar-nav navbar-nav-right">
            {/* Thông báo - Thêm responsive classes */}
            <li className="nav-item dropdown d-none d-lg-block">
              <div className="dropdown-menu dropdown-menu-right navbar-dropdown preview-list" aria-labelledby="notificationDropdown">
                <p className="mb-0 font-weight-normal float-left dropdown-header">Notifications</p>
                <Link className="dropdown-item preview-item">
                  <div className="preview-thumbnail">
                    <div className="preview-icon bg-success">
                      <i className="ti-info-alt mx-0"></i>
                    </div>
                  </div>
                  <div className="preview-item-content">
                    <h6 className="preview-subject font-weight-normal">Info</h6>
                    <p className="font-weight-light small-text mb-0 text-muted">Sample notification</p>
                  </div>
                </Link>
                <Link className="dropdown-item preview-item">
                  <div className="preview-thumbnail">
                    <div className="preview-icon bg-warning">
                      <i className="ti-settings mx-0"></i>
                    </div>
                  </div>
                  <div className="preview-item-content">
                    <h6 className="preview-subject font-weight-normal">Settings</h6>
                    <p className="font-weight-light small-text mb-0 text-muted">Private message</p>
                  </div>
                </Link>
                <Link className="dropdown-item preview-item">
                  <div className="preview-thumbnail">
                    <div className="preview-icon bg-info">
                      <i className="ti-user mx-0"></i>
                    </div>
                  </div>
                  <div className="preview-item-content">
                    <h6 className="preview-subject font-weight-normal">New user registration</h6>
                    <p className="font-weight-light small-text mb-0 text-muted">2 days ago</p>
                  </div>
                </Link>
              </div>
            </li>

            {/* Avatar Profile - Sửa lại phần responsive */}
            <li className="nav-item nav-profile dropdown">
              <a 
                className="nav-link dropdown-toggle"
                href="#"
                data-bs-toggle="dropdown"
                onClick={toggleDropdown}
                style={{ cursor: 'pointer' }}
              >
                <img 
                  src="https://res.cloudinary.com/dvm1fjo7a/image/upload/v1743537434/image%20admin/kryrvd4dwdvvmz7fqv93.jpg" 
                  alt="profile" 
                  className="img-fluid rounded-circle"
                />
              </a>
              <div className={`dropdown-menu dropdown-menu-right navbar-dropdown ${isDropdownOpen ? 'show' : ''}`}>
                <Link className="dropdown-item">
                  <i className="ti-settings text-primary"></i> Settings
                </Link>
                <Link to="/loginadmin" className="dropdown-item" onClick={onLogout} style={{ cursor: 'pointer' }}>
                  <i className="ti-power-off text-primary"></i> Logout
                </Link>
              </div>
            </li>
          </ul>
        </div>
      </nav>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default AdminNavbar;
