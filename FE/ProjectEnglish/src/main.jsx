

import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginAdminPage from './pages/LoginAndRes/LoginAdminPage.jsx';
import ListQuizz from './pages/ListQuizz/ListQuizz.jsx';
import ContactUs from './pages/HomePage/ContactUsPage.jsx';
import HomePage from './pages/HomePage/HomePage.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthWrapper } from './components/layout/context/authContext.jsx';
import Login from './pages/LoginAndRes/User/Login.jsx';
import Register from './pages/LoginAndRes/User/Register.jsx';
import ResetPasswordPage from './pages/LoginAndRes/User/ResetPasword.jsx';
import ForgotpasswordPage from './pages/LoginAndRes/User/ForgotPassword.jsx';
import QuizletForm from './pages/FlashCard/Quizz.jsx';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import ViewProfile from './pages/Profile/ViewProfile..jsx';


import PrivateRoute from './pages/privateroute.jsx';
import DetailQuizz from './pages/ListQuizz/DetailQuiz/DetailQuizz.jsx';


import Flashcard from './pages/FlashCard/FlashCard.jsx';
import ListDocument from './pages/Document/ListDocument.jsx';
import DocumentItem from './pages/Document/documentItem.jsx';
import FlashcardList from './pages/FlashCard/ListFlashCard.jsx';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },

      { path: "/contactus", element: <ContactUs /> },
      {
        path: "/viewprofile", element:
          (<PrivateRoute>
            <ViewProfile />,
          </PrivateRoute>)
      },
      {

        path: "/quizlet",
        element: <QuizletForm />
      },
      {
        path: "/listquizz",
        element: <ListQuizz />,
        children: [{
          path: "detailquiz/:quizId", element: <DetailQuizz />

        },
        ],
      },
      {
        path: "/listdocument",
        element: <ListDocument />
      },
      {
        path: "/listdocument/detaildocument/:id",
        element: <DocumentItem />
      },
      {
        path: "/contactus",
        element: <ContactUs />
      },
      {
        path: "/flashcard/:quizId",
        element: <Flashcard />
      },
      {
        path: "/listdocument/detaildocument/flashcard/:quizId",
        element: <Flashcard />
      },
      {
        path: "/flashcard",
        element: <FlashcardList />
      }

    ]
  },


  {
    path: "/resetpassword",
    element: <ResetPasswordPage />
  },
  {
    path: "/forgotpassword",
    element: <ForgotpasswordPage />
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
  },
  {
    path: "/resetpassword",
    element: <ResetPasswordPage />
  }

]);



const dotenvClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
ReactDOM.createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <AuthWrapper>
    <GoogleOAuthProvider clientId={dotenvClientId}>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
        style={{ zIndex: 9999 }} // Đặt z-index cao hơn thanh nav bar
      />
    </GoogleOAuthProvider>
  </AuthWrapper>
  // </StrictMode>
);

