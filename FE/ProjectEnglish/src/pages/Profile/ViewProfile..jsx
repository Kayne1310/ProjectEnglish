import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../components/layout/context/authContext';

const ViewProfile = () => {
  const {userInfor}=useContext(AuthContext);
  const [userData, setUserData] = useState({
    userName: userInfor.userName || '',
    email: userInfor.email || '',
    picture: userInfor.picture || '',
  });
console.log(userInfor);
  useEffect(() => {

  if(userInfor){
      try {
        setUserData({
          ...userData,
          userName: userInfor.userName || '',
          email: userInfor.email || '',
          picture: userInfor.picture || ''
        });
      } catch (error) {
        console.error('Failed to parse user data:', error);
      }
    }
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setUserData({
      ...userData,
      [id]: value
    });
  };

  const handleUpdate = () => {
    // Cập nhật thông tin người dùng (có thể gọi API ở đây)
    console.log('Updated User Data:', userData);
    alert('Profile updated successfully!');
  };

  return (
    <div className="editprofile-body">
      <div className="container py-4 editprofile-container">
        <div className="row g-3">
          {/* Avatar + Thông tin */}
          <div className="col-lg-4">
            <div className="card h-100">
              <div className="card-body text-center">
                <div className="editprofile-user-profile">
                  <div className="editprofile-user-avatar mb-3">
                    <img src={userData.picture} className="rounded-circle img-fluid" alt="User Avatar" />
                  </div>
                  <h5 className="editprofile-user-name">{userData.userName}</h5>
                  <h6 className="editprofile-user-email text-muted">{userData.email}</h6>
                </div>
              </div>
            </div>
          </div>

          {/* Form chỉnh sửa thông tin */}
          <div className="col-lg-8">
            <div className="card h-100">
              <div className="card-body">
                <h6 className="mb-3 text-primary">Personal Details</h6>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="userName" className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="userName"
                      value={userData.userName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      value={userData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <h6 className="mt-4 mb-3 text-primary">Address</h6>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="street" className="form-label">Street</label>
                    <input
                      type="text"
                      className="form-control"
                      id="street"
                      value={userData.street}
                      onChange={handleInputChange}
                      placeholder="Enter Street"
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="city" className="form-label">City</label>
                    <input
                      type="text"
                      className="form-control"
                      id="city"
                      value={userData.city}
                      onChange={handleInputChange}
                      placeholder="Enter City"
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="state" className="form-label">State</label>
                    <input
                      type="text"
                      className="form-control"
                      id="state"
                      value={userData.state}
                      onChange={handleInputChange}
                      placeholder="Enter State"
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="zip" className="form-label">Zip Code</label>
                    <input
                      type="text"
                      className="form-control"
                      id="zip"
                      value={userData.zip}
                      onChange={handleInputChange}
                      placeholder="Zip Code"
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-end mt-4">
                  <button type="button" className="btn btn-secondary me-2">Cancel</button>
                  <button type="button" className="btn btn-primary" onClick={handleUpdate}>Update</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;