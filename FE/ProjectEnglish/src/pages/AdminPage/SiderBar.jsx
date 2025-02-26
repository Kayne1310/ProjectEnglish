import 'react-pro-sidebar/dist/css/styles.css';
import { ProSidebar, Menu, MenuItem, SubMenu, SidebarHeader, SidebarFooter, SidebarContent } from 'react-pro-sidebar';
import { FaTachometerAlt, FaGem } from 'react-icons/fa';
import { GoCircle } from 'react-icons/go';  // Import GoCircle icon
import { SiQuizlet } from "react-icons/si";
import PropTypes from 'prop-types';
import { Link } from "react-router-dom"; // chuyển trang - thẻ link 
import sidebarBg from '../../assets/bg2.jpg';
import { GoFileDirectory } from "react-icons/go";

const SideBar = ({ collapsed, handleToggleSidebar }) => {
    return (
        <ProSidebar
            image={sidebarBg}
            collapsed={collapsed}
            breakPoint="md"
            onToggle={handleToggleSidebar}
        >
            <SidebarHeader>
                <div
                    style={{
                        padding: '24px',
                        textTransform: 'uppercase',
                        fontWeight: 'bold',
                        fontSize: 14,
                        letterSpacing: '1px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: collapsed ? 'center' : 'flex-start',
                    }}
                >
                    <SiQuizlet size={collapsed ? '2em' : '2em'} />
                    {!collapsed && <span style={{ marginLeft: '10px' }}>Quizzet</span>}
                </div>
            </SidebarHeader>

            <SidebarContent>

            <Menu iconShape="circle">
                        <MenuItem
                            icon={<FaTachometerAlt />}
                            suffix={<span className="badge red">New</span>}
                        >
                            Dashboard
                        </MenuItem>
            </Menu>

                {/* Components Menu with Collapse */}
                <Menu iconShape="circle">
                    <SubMenu icon={<FaGem />} title="Function">
                        <MenuItem icon={<GoCircle />}>  {/* Add icon here */}
                            <Link to="/admin/fuction-manageuser">Manage Users</Link>
                        </MenuItem>
                        <MenuItem icon={<GoCircle />}>
                            <Link to="/admin/fuction-managequizzes">Manage Quizzes</Link> 
                        </MenuItem>
                        <MenuItem icon={<GoCircle />} >
                            <Link to="/admin/fuction-managequestions">Manage Questions</Link>  
                        </MenuItem>
                    </SubMenu>
                </Menu>

                {/* Forms Menu with Collapse */}
                <Menu iconShape="circle">
                    <SubMenu icon={<FaGem />} title="Charts">
                    
                        <MenuItem icon={<GoCircle />} >
                            <Link to="/admin/Charts">Charts</Link>
                        </MenuItem>

                    </SubMenu>
                </Menu>

                {/* Pages Menu */}
                <Menu iconShape="circle">
                    <li className="nav-heading" style={{
                        fontSize: '13px',
                        textTransform: 'uppercase',
                        fontWeight: 600,
                        margin: '10px 0 5px 15px',
                        justifyContent: 'center'
                    }}>Pages</li>
                </Menu>

                <Menu iconShape="circle">
                    <MenuItem icon= <GoFileDirectory /> >
                        <Link to="FAQ">FAQ</Link>
                    </MenuItem>
                </Menu>

            </SidebarContent>

            <SidebarFooter style={{ textAlign: 'center' }}>
                <div
                    className="sidebar-btn-wrapper"
                    style={{
                        padding: '20px 24px',
                    }}
                >

                </div>
            </SidebarFooter>
        </ProSidebar>
    );
};

SideBar.propTypes = {
    collapsed: PropTypes.bool,
    handleToggleSidebar: PropTypes.func,
};

export default SideBar;
