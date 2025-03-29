import { Link, useLocation } from "react-router-dom";
import "../../assets/css/AdminCss/sidebar.css";
import Nav from "react-bootstrap/Nav";

const Sidebar = ({ isMinimized }) => {
  const location = useLocation(); // Lấy đường dẫn hiện tại

  return (
    <>
      {/* Thêm overlay */}
      <div className={`sidebar-overlay ${isMinimized ? 'show' : ''}`}></div>
      
      <nav className={`sidebar ${isMinimized ? 'show' : ''}`} id="sidebar">
        <ul className="nav">
          <li className={`nav-item ${location.pathname === "/Admin" ? "active" : ""}`}>
            <Nav.Link as={Link} to="/Admin">
              <i className="icon-grid menu-icon"></i>
              <span className="menu-title">Dashboard</span>
            </Nav.Link>
          </li>

          <li className={`nav-item ${location.pathname === "/Admin/userlist" ? "active" : ""}`}>
            <Nav.Link as={Link} to="userlist">
              <i className="icon-grid menu-icon"></i>
              <span className="menu-title">User List</span>
            </Nav.Link>
          </li>

          <li className={`nav-item ${location.pathname === "/Admin/chart" ? "active" : ""}`}>
            <Nav.Link as={Link} to="chart">
              <i className="icon-bar-graph menu-icon"></i>
              <span className="menu-title">Chart</span>
            </Nav.Link>
          </li>

          <li className={`nav-item ${location.pathname === "/Admin/quiz" ? "active" : ""}`}>
            <Nav.Link as={Link} to="quiz">
              <i className="icon-grid menu-icon"></i>
              <span className="menu-title">Quiz</span>
            </Nav.Link>
          </li>

          <li className={`nav-item ${location.pathname === "/Admin/quizquestionanswer" ? "active" : ""}`}>
            <Nav.Link as={Link} to="quizquestionanswer">
              <i className="icon-grid menu-icon"></i>
              <span className="menu-title">Quiz Question</span>
            </Nav.Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Sidebar;
