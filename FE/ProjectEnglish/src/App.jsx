
import { Outlet } from "react-router-dom";
import Nav from "./components/layout/nav";
import Footer from "./components/layout/footer";
import "./assets/css/Home/bootstrap.css";
import "./assets/css/Home/responsive.css";
import "./assets/css/Home/style.css";
// import "./assets/css/Home/style.scss";
import { use, useContext } from "react";
import { useEffect } from "react";
import authService from "./service/authService";
import { Spin } from 'antd';
import { AuthContext } from "./components/layout/context/authContext";



const App = () => {
  const { setUser, isAppLoading, setIsAppLoading } = useContext(AuthContext);
  useEffect(() => {
    setIsAppLoading(true); // Set loading to true before fetching user data
    const timer = setTimeout(() => {
      fetchUser();
    }, 1000); // 2 seconds delay

    return () => clearTimeout(timer); // Cleanup the timer if the component unmounts
  }, []);

  const fetchUser = async () => {
    try {
      const res = await authService.getUserInfor();

      if (res.user) {
        setUser({
          userName: res.user.userName,
          email: res.user.email,
          picture: res.user.picture,
          facebookId: res.user.facebookId,
          googleId: res.user.googleId, 
          userId:res.user.userID,
          
        });
        console.log("User Data:", res.user);
      }
      // if (res.status === 401) {
      //   console.log("Phiên làm việc đã hết hạn. Chuyển hướng đến trang đăng nhập.");
      //   window.location.href = "/loginuser";
      // }
    }

    catch (error) {
      throw error;
    }
    finally {
      setIsAppLoading(false);
    }
  };


  return (
    <>
      {isAppLoading ? (
        // Hiển thị spinner khi đang load
        <div className="loading-container" style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh' // Full viewport height để che toàn bộ trang
        }}>
          <Spin size="large" />
        </div>
      ) : (
        // Hiển thị nội dung sau khi load xong
        <>
          <Nav />
          <div style={{ minHeight: 'calc(70vh - 100px)' }}>
            <Outlet />
          </div>
          <Footer />
        </>
      )}


    </>
  );

}

export default App;
