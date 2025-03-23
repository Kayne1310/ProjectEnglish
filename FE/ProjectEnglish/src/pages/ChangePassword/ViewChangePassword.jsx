import React, { useContext, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../assets/css/ChangePassword/Changepassword.css'
import { ChangePassword } from '../../service/ChangePasswordService';
import { AuthContext } from '../../components/layout/context/authContext';

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
                    alert(`${res.returnMessage}`);
                    // Reset form after success
                    setOldPassword('');
                    setNewPassword('');
                    setreNewPassword('');
                } else if (res.returnCode === -1) {
                    alert(`${res.returnMessage}`);
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
            console.error('Change password error:', error);
        }

    };
    return (
        <div className="container d-flex justify-content-center mb-4">
            <div className="card p-4" style={{ maxHeight: '500px', height: '420px', width: '450px' }}>
                <h1 className="mb-4 text-center">Change your password</h1>
                <form onSubmit={handleSubmit}>
                    <div className="col-12 col-md-15">
                        {/* Email */}
                        {/* <div className="mb-2" style={{display: 'none'}}>
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                value={userData.email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div> */}

                        {/* Old Password */}
                        <div className="mb-2">
                            <label className="form-label">Old Password</label>
                            <input
                                type="password"
                                className="form-control"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                required
                            />
                        </div>

                        {/* New Password */}
                        <div className="mb-2">
                            <label className="form-label">New Password</label>
                            <input
                                type="password"
                                className="form-control"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>

                        {/* Confirm New Password */}
                        <div className="mb-2">
                            <label className="form-label">Confirm New Password</label>
                            <div className="position-relative">
                                <input
                                    type="password"
                                    className={`form-control ${passwordsMatch ? 'is-valid' : reNewPassword ? 'is-invalid' : ''}`}
                                    value={reNewPassword}
                                    onChange={(e) => setreNewPassword(e.target.value)}
                                    required
                                />
                                {reNewPassword && !passwordsMatch && (
                                    <div className="error-inline">Passwords do not match</div>
                                )}
                                {reNewPassword && passwordsMatch && (
                                    <div className="valid-inline">Passwords match</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Password Requirements */}



                    {/* Button */}

                    <div className="col-12 col-md-15">
                        <button type="submit" className="btn btn-primary w-100">
                            Change
                        </button>
                    </div>


                    {error && <div className="alert alert-danger mt-3">{error}</div>}
                </form>
            </div>
        </div>

    );
}

export default ViewChangePassword;