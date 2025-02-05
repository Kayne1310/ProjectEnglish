import React from "react";
import "../../assets/css/LoginCss/admin.css"; // Import CSS mới
import bear from "../../assets/image/bear-bg.jpg"; // Import ảnh mới
const LoginAdminPage = () => {
    return (
        <div className="admin-container">
            <main className="admin-main">
            <div className="admin-left-side">
    <img src={bear} alt="Admin Background" className="admin-image" />
</div>

                <div className="admin-right-side">
                    <form>
                        <div className="admin-btn-group">
                        </div>
            
                        <label htmlFor="email">Email</label>
                        <input className="admin-input" type="text" placeholder="Enter Email" name="email" required />
            
                        <label htmlFor="password">Password</label>
                        <input className="admin-input" type="password" placeholder="Enter Password" name="password" required />
            
                        <button type="submit" className="admin-login-btn">Sign in</button>
                        <div className="admin-links">
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default LoginAdminPage;
