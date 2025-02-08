import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import LoginUserPage from './pages/LoginAndRes/LoginUserPage.jsx';
import LoginAdminPage from './pages/LoginAndRes/LoginAdminPage.jsx';
import ListQuizz from './pages/ListQuizz/ListQuizz.jsx';
import ContactUs from './pages/HomePage/ContactUsPage.jsx';
import HomePage from './pages/HomePage/HomePage.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from './pages/LoginAndRes/User/Login.jsx';
import Register from './pages/LoginAndRes/User/Register.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {

        path: "/listquizz",
        element: <ListQuizz />
      },
      {
        path: "/contactus",
        element: <ContactUs />
      }
    ]
  },
  {
    path: "/loginuser",
    element: <Login />
  },
  {
    path: "/registeruser",
    element: <Register />
  },

  {
    path: "/loginadmin",
    element: <LoginAdminPage />
  }

]);

const clientId = "954871855690-ebeilhq9a689iia9plkl3d9o9sfng7ci.apps.googleusercontent.com";

const dotenvClientId=import.meta.env.VITE_GOOGLE_CLIENT_ID;
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
     <GoogleOAuthProvider clientId= {dotenvClientId}>
    <RouterProvider router={router} />
     </GoogleOAuthProvider>
  </React.StrictMode>,
)