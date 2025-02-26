import React from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';

const AdminNavbar = () => {
  return (
    <Navbar fixed="top" expand="lg" className="col-lg-12 col-12 p-0 d-flex justify-content-between">
      {/* Logo on the left */}
      <Navbar.Brand href="/Admin">
        <img
          src="https://via.placeholder.com/40" // Replace with your logo URL
          alt="Logo"
          style={{ height: '40px' }}
        />
      </Navbar.Brand>

      <Navbar.Toggle aria-controls="navbar-menu" />

      <Navbar.Collapse id="navbar-menu" className="justify-content-end">
        <Nav className="navbar-nav-right align-items-center">
          {/* Notification Dropdown */}
          <NavDropdown
            title={<i className="icon-bell mx-0"></i>}
            id="notificationDropdown"
            className="count-indicator"
          >
            <NavDropdown.Header>Notifications</NavDropdown.Header>
            <NavDropdown.Item>
              <div className="d-flex">
                <div className="preview-thumbnail">
                  <div className="preview-icon bg-success rounded-circle">
                    <i className="ti-info-alt mx-0"></i>
                  </div>
                </div>
                <div className="preview-item-content ms-3">
                  <h6>Info</h6>
                  <p className="font-weight-light small-text mb-0 text-muted">Sample notification</p>
                </div>
              </div>
            </NavDropdown.Item>
          </NavDropdown>

          {/* Avatar Dropdown */}
          <NavDropdown
            title={
              <img
                src="https://phanmemmkt.vn/wp-content/uploads/2024/09/avt-Facebook-hai-huoc.jpg" // Replace with your avatar URL
                alt="profile"
                className="rounded-circle"
                style={{ width: '40px', height: '40px' }}
              />
            }
            id="profileDropdown"
            className="ms-3"
          >
            <NavDropdown.Item href="#profile">
              <i className="ti-user text-primary me-2"></i> Profile
            </NavDropdown.Item>
            <NavDropdown.Item href="#logout">
              <i className="ti-power-off text-primary me-2"></i> Logout
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default AdminNavbar;