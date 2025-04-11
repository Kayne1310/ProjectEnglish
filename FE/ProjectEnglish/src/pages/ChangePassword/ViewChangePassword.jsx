import React, { useContext, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../assets/css/ChangePassword/Changepassword.css'
import { ChangePassword } from '../../service/ChangePasswordService';
import { AuthContext } from '../../components/layout/context/authContext';
import { toast } from 'react-toastify';

const ViewChangePassword = () => {
    const [email, setEmail] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [reNewPassword, setreNewPassword] = useState('');
    const [error, setError] = useState('');
    const passwordsMatch = newPassword === reNewPassword && newPassword !== '';

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!passwordsMatch) {
            setError('Passwords do not match');
            return;
        }
        setError('');

        try {
            const res = await ChangePassword(oldPassword, newPassword, reNewPassword);
            if (res != null) {
                if (res.returnCode === 1) {
                toast.success(`${res.returnMessage}`);
                  
                    // Reset form after success
                    setOldPassword('');
                    setNewPassword('');
                    setreNewPassword('');
                } else if (res.returnCode === -1) {
                    toast.error(`${res.returnMessage}`);
                
                    // Reset form
                    setOldPassword('');
                    setNewPassword('');
                    setreNewPassword('');
                }

            } else {
                setError('Failed to change password. Please check your old password.');
            }
        } catch (error) {
            setError('An error occurred while changing password. Please try again.');
          
        }

    };
    return (
        <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100 py-3">
            <div className="shadow-sm w-100" style={{ borderRadius: '20px', backgroundColor: 'white', maxWidth: '500px' }}>
                <div className="p-3 p-md-5">
                    <h2 className="mb-3 mb-md-4 text-center fw-bold">Change Your Password</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="row g-3">
                            {/* Old Password */}
                            <div className="col-12">
                                <label className="form-label fw-medium">Old Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    required
                                />
                            </div>

                            {/* New Password */}
                            <div className="col-12">
                                <label className="form-label fw-medium">New Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Confirm New Password */}
                            <div className="col-12">
                                <label className="form-label fw-medium">Confirm New Password</label>
                                <div className="position-relative">
                                    <input
                                        type="password"
                                        className={`form-control ${passwordsMatch ? 'is-valid' : reNewPassword && !passwordsMatch ? 'is-invalid' : ''}`}
                                        value={reNewPassword}
                                        onChange={(e) => setreNewPassword(e.target.value)}
                                        required
                                    />
                                    {reNewPassword && !passwordsMatch && (
                                        <div className="invalid-feedback d-block">Passwords do not match</div>
                                    )}
                                    {reNewPassword && passwordsMatch && (
                                        <div className="valid-feedback d-block">Passwords match</div>
                                    )}
                                </div>
                            </div>

                            {/* Button */}
                            <div className="col-12 mt-4">
                                <button type="submit" className="btn btn-primary w-100 py-2">
                                    Change Password
                                </button>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="col-12 mt-3">
                                    <div className="alert alert-danger py-2">{error}</div>
                                </div>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ViewChangePassword;