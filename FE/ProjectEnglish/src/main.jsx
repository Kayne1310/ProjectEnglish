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
import QuizletForm from './pages/FlashCard/Quizz.jsx';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import ViewProfile from './pages/Profile/ViewProfile..jsx';
import PrivateRoute from './pages/privateroute.jsx';
import DetailQuizz from './pages/ListQuizz/DetailQuiz/DetailQuizz.jsx';
import Flashcard from './pages/FlashCard/FlashCard.jsx';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
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
import ViewChangePassword from './pages/ChangePassword/ViewChangePassword.jsx';
import { Community } from './pages/Community/community.jsx';
import ChatGemini from './pages/ChatWithAI/chatwithai.jsx';
import ResultQuizz from './pages/ListQuizz/DetailQuiz/ResultQuizz.jsx';
import AdminAuthWrapper from './pages/LoginAndRes/Admin/AdminAuthWrapper.jsx';
import NotFound from './pages/NotFound.jsx';


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

        path: "/quizlet",
        element: <QuizletForm />
      },
      {
        path: "/listquizz",
        element:
          <ListQuizz /> ,
        children: [{
          path: "detailquiz/:quizId", element: <DetailQuizz />
        },
        {
          path: "detailquiz/:quizId/result",
          element:
            (<PrivateRoute>
              <ResultQuizz />
            </PrivateRoute>)
        }
        ],
      },
      {
        path: "/listdocument",
        element: <ListDocument />,
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
        path: "/flashcard/practice/:studySetId",
        element: <Flashcard />
      },
      {
        path: "/flashcard/:quizId",
        element: <FlashcardList />
      },
      {
        path: "/ListFlashCard/:id",
        element: <Flashcardcanh />
      },
      {
        path: "/listdocument/detaildocument/flashcard/:quizId",
        element: <Flashcard />
      },
      {
        path: "/flashcard",
        element: <FlashcardList />
      },
      {

        path: "/changepassword",
        element: <ViewChangePassword />
      },
      {
        path: "/community",
        element: <Community />

      },
      {
        path: "/chatwithai",
        element: <ChatGemini />
      }

    ]
  },

  {
    path: "/resultquiz/:quizId",
    element: <ResultQuizz />
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
    element: (
      <AdminAuthWrapper>
        <AppAdmin />
      </AdminAuthWrapper>
    ),
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

  {
    path: "*",
    element: <NotFound />
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
        autoClose={1000}
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

