import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import ListQuizz from './pages/ListQuizz/ListQuizz.jsx';
import ContactUs from './pages/HomePage/ContactUsPage.jsx';
import HomePage from './pages/HomePage/HomePage.jsx';
import ViewProfile from './pages/Profile/ViewProfile..jsx';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthWrapper } from './components/layout/context/authContext.jsx';

import QuizletForm from './pages/ListQuizz/Quizz.jsx';




import ManageUsers from './pages/AdminPage/Content/ManageUsers.jsx';
import ManageQuizzes from './pages/AdminPage/Content/ManageQuizzes.jsx';
import ManageQuestions from './pages/AdminPage/Content/ManageQuestions.jsx';

import Charts from './pages/AdminPage/Charts.jsx';

import FAQ from './pages/AdminPage/FAQ.jsx';


import Admin from './pages/AdminPage/Admin.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "/contactus", element: <ContactUs /> },
      { path: "/viewprofile", element: <ViewProfile /> },

      { path: "/listquizz", element: <ListQuizz />, children: [{ path: "quizlet", element: <QuizletForm /> }] },
      ]
    },




      // Trang Admin
    {
      path: "/admin",
      element: <Admin />,
      children: [
  
            // { index: true, element: <ManageUsers /> },
            { path: "fuction-manageuser", element: <ManageUsers /> },
            { path: "fuction-managequizzes", element: <ManageQuizzes /> },
            { path: "fuction-managequestions", element: <ManageQuestions /> },
            
  
            { path: "Charts", element: <Charts /> },

            { path: "FAQ", element: <FAQ /> },

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
