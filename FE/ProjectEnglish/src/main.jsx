import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import LoginAdminPage from './pages/LoginAndRes/LoginAdminPage.jsx';
import ListQuizz from './pages/ListQuizz/ListQuizz.jsx';
import ContactUs from './pages/HomePage/ContactUsPage.jsx';
import HomePage from './pages/HomePage/HomePage.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from './pages/LoginAndRes/User/Login.jsx';
import Register from './pages/LoginAndRes/User/Register.jsx';
import { UserProvider } from './reactContext/userReactContext.jsx';
import Flashcard from './components/FlashCard.jsx';
import AppAdmin from './AppAdmin.jsx';
import DashboardPage from './pages/Admin/DashboardPage/DashboardPage.jsx';
import UserlistPage from './pages/Admin/UserlistPage/UserlistPage.jsx';
import ChartPage from './pages/Admin/ChartPage/ChartPage.jsx';
import QuizPage from './pages/Admin/QuizPage/QuizPage.jsx';
import QuizQuestionAnswerPage from './pages/Admin/QuizQuestionAnswerPage/QuizQuestionAnswerPage.jsx';

const router = createBrowserRouter([
  {
    // USER
    path: "/",
    element: <App />,
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
        path: "/flashcard",
        element: <Flashcard />
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
  <React.StrictMode>
    <UserProvider>
      <GoogleOAuthProvider clientId={dotenvClientId}>
        <RouterProvider router={router} />
      </GoogleOAuthProvider>
    </UserProvider>
  </React.StrictMode>,
)