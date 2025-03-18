

import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ListQuizz from './pages/ListQuizz/ListQuizz.jsx';
import ContactUs from './pages/HomePage/ContactUsPage.jsx';
import HomePage from './pages/HomePage/HomePage.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthWrapper } from './components/layout/context/authContext.jsx';
import Login from './pages/LoginAndRes/User/Login.jsx';
import Register from './pages/LoginAndRes/User/Register.jsx';
import ResetPasswordPage from './pages/LoginAndRes/User/ResetPasword.jsx';
import ForgotpasswordPage from './pages/LoginAndRes/User/ForgotPassword.jsx';
import QuizletForm from './pages/ListQuizz/Quizz.jsx';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import ViewProfile from './pages/Profile/ViewProfile..jsx';
import DetailQuizz from './pages/ListQuizz/DetailQuizz.jsx';
import PrivateRoute from './pages/privateroute.jsx';
import Flashcard from './components/FlashCard.jsx';
import AppAdmin from './AppAdmin.jsx';
import DashboardPage from './pages/Admin/DashboardPage/DashboardPage.jsx';
import UserlistPage from './pages/Admin/UserlistPage/UserlistPage.jsx';
import ChartPage from './pages/Admin/ChartPage/ChartPage.jsx';
import QuizPage from './pages/Admin/QuizPage/QuizPage.jsx';
import QuizQuestionAnswerPage from './pages/Admin/QuizQuestionAnswerPage/QuizQuestionAnswerPage.jsx';
import ListDocument from './pages/Document/ListDocument.jsx';
import DocumentItem from './pages/Document/documentItem.jsx';
import LoginAdminPage from './pages/LoginAndRes/Admin/LoginAdminPage.jsx';
import Flashcardcanh from './pages/FlashCard/ListFlashCard.jsx';
import FlashcardList from './pages/FlashCard/ListStudySet.jsx';


const router = createBrowserRouter([
  {
    // USER
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
        path: "/listquizz",
        element: <ListQuizz />,
        children: [{
          path: "detailquiz", element: <DetailQuizz />
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
        element: <FlashcardList />
      },
      {
        path: "/ListFlashCard/:id",
        element: <Flashcardcanh/>
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
    path: "/quizlet",
    element: <QuizletForm />
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


  // ADMIN
  {
    path: "/Admin",
    element: <AppAdmin />,
    children: [
      {
        index: true,
        element: <DashboardPage />
      },
      {

        path: "userlist",
        element: <UserlistPage />
      },
      {
        path: "chart",
        element: <ChartPage />
      },
      {
        path: "quiz",
        element: <QuizPage />
      },
      {
        path: "quizquestionanswer",
        element: <QuizQuestionAnswerPage />
      },
    ]
  },


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

