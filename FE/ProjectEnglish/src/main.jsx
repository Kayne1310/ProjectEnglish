import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'

import LoginUserPage from './pages/LoginAndRes/LoginUserPage.jsx';
import LoginAdminPage from './pages/LoginAndRes/LoginAdminPage.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,

  },
  {
    path: "/loginuser",
    element: <LoginUserPage />
  },
  {
    path: "/loginadmin",
    element: <LoginAdminPage />
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)