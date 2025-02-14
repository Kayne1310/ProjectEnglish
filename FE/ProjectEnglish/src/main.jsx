import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import LoginUserPage from './pages/LoginAndRes/LoginUserPage.jsx';
import LoginAdminPage from './pages/LoginAndRes/LoginAdminPage.jsx';
import ListQuizz from './pages/ListQuizz/ListQuizz.jsx';
import ContactUs from './pages/HomePage/ContactUsPage.jsx';
import HomePage from './pages/HomePage/HomePage.jsx';
import ViewProfile from './pages/Profile/ViewProfile..jsx';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthWrapper } from './components/layout/context/authContext.jsx';

import Login from './pages/LoginAndRes/User/Login.jsx';
import Register from './pages/LoginAndRes/User/Register.jsx';
import QuizletForm from './pages/ListQuizz/Quizz.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },

      { path: "/contactus", element: <ContactUs /> },
      {
        path: "/viewprofile", element: <ViewProfile />,
      },
      {
        path: "/listquizz", element: <ListQuizz />,
        children: [{
          path: "quizlet", element: <QuizletForm />
        },
        ],
      },


    ]
  },
  { path: "/loginuser", element: <Login /> },
  { path: "/registeruser", element: <Register /> },

  { path: "/loginadmin", element: <LoginAdminPage /> }
]);

const dotenvClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

ReactDOM.createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <AuthWrapper>
    <GoogleOAuthProvider clientId={dotenvClientId}>
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  </AuthWrapper>
  // </StrictMode>
);
