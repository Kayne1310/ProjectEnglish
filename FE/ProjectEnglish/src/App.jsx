
import { Outlet } from "react-router-dom";
import Nav from "./components/layout/nav";
import Footer from "./components/layout/footer";
import "./assets/css/Home/bootstrap.css";
import "./assets/css/Home/responsive.css";
import "./assets/css/Home/style.css";
// import "./assets/css/Home/style.scss";


function App() {
  return (
    <>
      <Nav />
      <Outlet />
      <Footer />
    </>
  );
}

export default App;
