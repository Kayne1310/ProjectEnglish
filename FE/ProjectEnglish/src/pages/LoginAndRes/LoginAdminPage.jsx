// import React  from "react";
import "../../assets/css/LoginCss/admin.css";
// Import file CSS của bạn
const LoginAdminPage=()=>{
    return (
        <>
         <div className="login-admin">
  
           <main>
        <div className="left-side"></div>
        <div className="right-side">
          <form>
            <div className="btn-group">
          
            </div>
          
            <label htmlFor="email">Email</label>
            <input type="text" placeholder="Enter Email" name="email" required />
      
            <label htmlFor="password">Password</label>
            <input type="password" placeholder="Enter Password" name="password" required />
      
            <button type="submit" className="login-btn">Sign in</button>
            <div className="links">
        
            </div>
          </form>
        </div>
      </main>
      </div>
        </>
    )
}

export default LoginAdminPage;