import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import ListQuizz from './pages/ListQuizz/ListQuizz.jsx';
import ContactUs from './pages/HomePage/ContactUsPage.jsx';
import HomePage from './pages/HomePage/HomePage.jsx';
// import ViewProfile from './pages/Profile/ViewProfile.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthWrapper } from './components/layout/context/authContext.jsx';
import QuizletForm from './pages/ListQuizz/Quizz.jsx';



// by canh - des Admin
// import ManageUsers from './pages/AdminPage/Content/ManageUsers.jsx';
// import ManageQuizzes from './pages/AdminPage/Content/ManageQuizzes.jsx';
// import ManageQuestions from './pages/AdminPage/Content/ManageQuestions.jsx';
// import Charts from './pages/AdminPage/Charts.jsx';
// import FAQ from './pages/AdminPage/FAQ.jsx';
// import Admin from './pages/AdminPage/Admin.jsx';   


import Admin from './pages/AdminPage/Admin.jsx';
import ManageUsers from './pages/AdminPage/Content/ManageUsers.jsx';



// import OverviewPage from './pages/AdminPage/pagesss/OverviewPage.jsx';
import ProductsPage from './pages/AdminPage/pagesss/ProductsPage.jsx';
import UsersPage from './pages/AdminPage/pagesss/UsersPage.jsx';
import SalesPage from './pages/AdminPage/pagesss/SalesPage.jsx';
import OrdersPage from './pages/AdminPage/pagesss/OrdersPage.jsx';
import AnalyticsPage from './pages/AdminPage/pagesss/AnalyticsPage.jsx';
import SettingsPage from './pages/AdminPage/pagesss/SettingsPage.jsx';



const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "/contactus", element: <ContactUs /> },
      // { path: "/viewprofile", element: <ViewProfile /> },

      { path: "/listquizz", element: <ListQuizz />, children: [{ path: "quizlet", element: <QuizletForm /> }] },
      ]
    },




      // Trang Admin
    {
      path: "/admin",
      element: <Admin />,
      children: [
  
            // { index: true, element: <Charts /> },
            // { path: "fuction-manageuser", element: <ManageUsers /> },
            // { path: "fuction-managequizzes", element: <ManageQuizzes /> },
            // { path: "fuction-managequestions", element: <ManageQuestions /> },
            
  
            // { path: "Charts", element: <Charts /> },

            // { path: "FAQ", element: <FAQ /> },







            { index: true, element: <ManageUsers /> }, // Trang mặc định khi vào "/admin"
            // { path: "overview", element: <OverviewPage /> },
            { path: "fuction-manageuser", element: <fuction-manageuser /> }, 
            { path: "users", element: <UsersPage /> },
            { path: "sales", element: <SalesPage /> },
            { path: "orders", element: <OrdersPage /> },
            { path: "analytics", element: <AnalyticsPage /> },
            { path: "settings", element: <SettingsPage /> },

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
