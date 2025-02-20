import SideBar from "./SiderBar";
import './Admin.scss';
import { FaBars } from 'react-icons/fa';
import { useState } from "react";

const Admin = () => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="admin-container">
            <div className="admin-sidebar">
                <SideBar collapsed={collapsed} />
            </div>
            <div className="admin-content">
		<div className="admin-header">
                <FaBars onClick={() => setCollapsed(!collapsed)} />

		</div>

		<div className="admin-main">
                content goes here
        </div>

    </div>

</div>
    )
}
export default Admin;