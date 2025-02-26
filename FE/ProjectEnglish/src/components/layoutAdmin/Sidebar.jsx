import React, { useState } from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Sidebar = () => {

  return (
    <nav className={"sidebar sidebar-offcanvas"} id="sidebar">


      <Nav className="flex-column">
        <Nav.Link as={Link} to="/Admin" className="sidebar-item">
          <i className="ti-dashboard menu-icon me-2"></i>
          <span className="menu-title">Dashboard</span>
        </Nav.Link>
        <Nav.Link as={Link} to="userlist" className="sidebar-item">
          <i className="ti-user menu-icon me-2"></i>
          <span className="menu-title">User List</span>
        </Nav.Link>
        <Nav.Link as={Link} to="chart" className="sidebar-item">
          <i className="ti-bar-chart menu-icon me-2"></i>
          <span className="menu-title">Chart</span>
        </Nav.Link>
        <Nav.Link as={Link} to="quiz" className="sidebar-item">
          <i className="ti-help-alt menu-icon me-2"></i>
          <span className="menu-title">Quiz</span>
        </Nav.Link>
        <Nav.Link as={Link} to="quizquestionanswer" className="sidebar-item">
          <i className="ti-comment-alt menu-icon me-2"></i>
          <span className="menu-title">Quiz Question</span>
        </Nav.Link>
      </Nav>

    </nav>
  );
};

export default Sidebar;