import { useState } from "react";
import { Link } from "react-router-dom"; // 🔹 Import Link từ react-router-dom
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";



import Nav from "./components/layout/nav";
import HomePage from "./pages/HomePage/HomePage";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
    
        <Nav />
        <HomePage />


    </>
  );
}

export default App;
