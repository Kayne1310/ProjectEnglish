// src/components/AdminAuthWrapper.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../../components/layout/context/authContext';

const AdminAuthWrapper = ({ children }) => {
  const { userInfor, isAppLoading } = useContext(AuthContext);
  const location = useLocation();
  

  // Đợi cho context load xong
  if (isAppLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Sau khi load xong mới kiểm tra role
  if (userInfor?.role !== 'Admin') {
    return <Navigate to="/loginadmin" state={{ from: location.pathname }} />;
  }

  return children;
};

export default AdminAuthWrapper;