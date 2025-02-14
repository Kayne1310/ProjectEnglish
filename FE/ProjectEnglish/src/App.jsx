import { useState } from "react";
import { Link } from "react-router-dom"; // 🔹 Import Link từ react-router-dom
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Outlet } from "react-router-dom";
import Nav from "./components/layout/nav";
import HomePage from "./pages/HomePage/HomePage";
import Footer from "./components/layout/footer";


function App() {
  // const [count, setCount] = useState(0);

  return (
    <>
      <Nav />
      
      <Outlet />
      
      <Footer />
    </>
  );
}

export default App;
