import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../components/layout/context/authContext';
import { updateUser } from '../../service/ProfileService';

const ViewProfile = () => {
  const { userInfor, setUser } = useContext(AuthContext);

  const [userData, setUserData] = useState({
    userId: userInfor.userId || '',
    userName: userInfor.userName || '',
    email: userInfor.email || '',
    picture: userInfor.picture || null,
    address: userInfor.address || '',
    age: userInfor.age || '',
    phone: userInfor.phone || '',
    gender: userInfor.gender || '',
  });
  const [previewImage, setPreviewImage] = useState(userInfor?.picture || '');

  useEffect(() => {
    if (userInfor) {
      setUserData({
        userId: userInfor.userId || '',
        userName: userInfor.userName || '',
        email: userInfor.email || '',
        picture: userInfor.picture || null,
        address: userInfor.address || '',
        age: userInfor.age || '',
        phone: userInfor.phone || '',
        gender: userInfor.gender || '',
      });
      setPreviewImage(userInfor.picture || '');
    }
  }, [userInfor]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setUserData((prev) => ({ ...prev, picture: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async () => {
    try {
      const updatedData = {
        UserID: userData.userId,
        UserName: userData.userName,
        Address: userData.address,
        Age: userData.age,
        Phone: userData.phone,
        Gender: userData.gender,
        Picture: userData.picture,
      };

      const response = await updateUser(updatedData);

      if (response && !response.error) {
        const updatedUser = {
          ...userInfor,
          userName: userData.userName,
          address: userData.address,
          age: userData.age,
          phone: userData.phone,
          gender: userData.gender,
          picture: response.picture || userData.picture,
        };
        setUser(updatedUser);
        setPreviewImage(response.picture || previewImage);
        alert('Cập nhật thông tin thành công!');
      } else {
        alert('Cập nhật thất bại: ' + (response?.error || 'Lỗi không xác định'));
      }
    } catch (error) {
      console.error('Error in handleUpdate:', error);
      alert('Đã xảy ra lỗi khi cập nhật thông tin.');
    }
  };

  if (!userInfor) {
    return <div>Loading...</div>;
  }

  return (
    <div className="editprofile-body">
      <div className="container py-4 editprofile-container">
        <div className="row g-3">
          {/* Avatar + Thông tin */}
          <div className="col-lg-4">
            <div className="card h-100">
              <div className="card-body text-center">
                <div className="editprofile-user-profile">
                  <div className="editprofile-user-avatar mb-3 position-relative">
                    <label htmlFor="picture" style={{ cursor: 'pointer' }}>
                      <img
                        src={previewImage || '/default-avatar.png'}
                        className="rounded-circle img-fluid"
                        alt="User Avatar"
                        style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                      />
                    </label>
                    <input
                      type="file"
                      id="picture"
                      accept="image/*"
                      onChange={handleImageChange}
                      hidden
                    />
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
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      value={userData.email}
                      readOnly
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="address" className="form-label">Address</label>
                    <input
                      type="text"
                      className="form-control"
                      id="address"
                      value={userData.address}
                      onChange={handleInputChange}
                      placeholder="Enter Address"
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="age" className="form-label">Age</label>
                    <select
                      className="form-control"
                      id="age"
                      value={userData.age}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Age</option>
                      {Array.from({ length: 100 }, (_, i) => i + 1).map((age) => (
                        <option key={age} value={age}>
                          {age}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="phone" className="form-label">Phone</label>
                    <input
                      type="text"
                      className="form-control"
                      id="phone"
                      value={userData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter Phone"
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="gender" className="form-label">Gender</label>
                    <select
                      className="form-control"
                      id="gender"
                      value={userData.gender}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="d-flex justify-content-end mt-4">
                  <button type="button" className="btn btn-secondary me-2">Cancel</button>
                  <button type="button" className="btn btn-primary" onClick={handleUpdate}>
                    Update
                  </button>
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