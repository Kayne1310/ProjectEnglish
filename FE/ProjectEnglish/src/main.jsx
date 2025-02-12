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
import ViewProfile from './pages/Profile/VIewProfile.jsx';
import EditProfile from './pages/Profile/EditProfile..jsx';

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
      },
      {
        path: "/viewprofile",
        element: <ViewProfile/>
      },
      {
        path: "/editprofile",
        element: <EditProfile />
      }
    ]
  },
  {
    path: "/loginuser",
    element: <LoginUserPage />
  },
  {
    path: "/loginadmin",
    element: <LoginAdminPage />
  },


]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)