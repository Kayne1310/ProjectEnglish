import React from "react";
import { Container, Row, Col, Card, Form, Button, Breadcrumb } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../../assets/css/Profile/edit-profile.css"// Import CSS tùy chỉnh
import avatar from "../../assets/image/default-avatar.png";

const EditProfile = () => {
  return (
    <div className="editprofile-body">
    <div className="container py-4 editprofile-container">
    {/* Breadcrumb */}
  

    <div className="row g-3">
      {/* Profile Card */}
      <div className="col-lg-4">
        <div className="card h-100">
          <div className="card-body text-center">
            <div className="editprofile-user-profile">
              <div className="editprofile-user-avatar mb-3">
                <img
                  src={avatar}
                  className="rounded-circle img-fluid"
                  alt="User Avatar"
                />
              </div>
              <h5 className="editprofile-user-name">Yuki Hayashi</h5>
              <h6 className="editprofile-user-email text-muted">yuki@Maxwell.com</h6>
              <div className="editprofile-about mt-3">
                <h5>About</h5>
                <p>I'm Yuki, a Full Stack Designer who enjoys creating user-centric and delightful experiences.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div className="col-lg-8">
        <div className="card h-100">
          <div className="card-body">
            <h6 className="mb-3 text-primary">Personal Details</h6>
            <div className="row g-3">
              <div className="col-md-6">
                <label htmlFor="fullName" className="form-label">Full Name</label>
                <input type="text" className="form-control" id="fullName" placeholder="Enter full name" />
              </div>
              <div className="col-md-6">
                <label htmlFor="eMail" className="form-label">Email</label>
                <input type="email" className="form-control" id="eMail" placeholder="Enter email ID" />
              </div>
              <div className="col-md-6">
                <label htmlFor="phone" className="form-label">Phone</label>
                <input type="text" className="form-control" id="phone" placeholder="Enter phone number" />
              </div>
              <div className="col-md-6">
                <label htmlFor="website" className="form-label">Website URL</label>
                <input type="url" className="form-control" id="website" placeholder="Website url" />
              </div>
            </div>

            <h6 className="mt-4 mb-3 text-primary">Address</h6>
            <div className="row g-3">
              <div className="col-md-6">
                <label htmlFor="Street" className="form-label">Street</label>
                <input type="text" className="form-control" id="Street" placeholder="Enter Street" />
              </div>
              <div className="col-md-6">
                <label htmlFor="ciTy" className="form-label">City</label>
                <input type="text" className="form-control" id="ciTy" placeholder="Enter City" />
              </div>
              <div className="col-md-6">
                <label htmlFor="sTate" className="form-label">State</label>
                <input type="text" className="form-control" id="sTate" placeholder="Enter State" />
              </div>
              <div className="col-md-6">
                <label htmlFor="zIp" className="form-label">Zip Code</label>
                <input type="text" className="form-control" id="zIp" placeholder="Zip Code" />
              </div>
            </div>

            <div className="d-flex justify-content-end mt-4">
              <button type="button" className="btn btn-secondary me-2">Cancel</button>
              <button type="button" className="btn btn-primary">Update</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
);
};

export default EditProfile;
