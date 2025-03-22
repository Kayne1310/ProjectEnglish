import { useState } from 'react';
import './ChangePasswordForm.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function ChangePasswordForm() {
const [email, setEmail] = useState('');
const [oldPassword, setOldPassword] = useState('');
const [newPassword, setNewPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');
const [error, setError] = useState('');

const hasUpperCase = /[A-Z]/.test(newPassword);
const hasNumber = /[0-9]/.test(newPassword);
const hasMinLength = newPassword.length >= 8;
const isPasswordValid = hasUpperCase && hasNumber && hasMinLength;

const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const passwordsMatch = newPassword === confirmPassword && newPassword !== '';

const handleSubmit = (e) => {
    e.preventDefault();
    if (!isEmailValid) {
    setError('Please enter a valid email address');
    return;
    }
    if (!oldPassword) {
    setError('Please enter your old password');
    return;
    }
    if (!isPasswordValid) {
    setError('Password does not meet requirements');
    return;
    }
    if (!passwordsMatch) {
    setError('Passwords do not match');
    return;
    }
    setError('');
    alert('Password changed successfully!');
};

return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
    <div className="card p-4 shadow" style={{ maxWidth: '700px' }}>
        <h1 className="mb-4 text">Change your password</h1>
        <form onSubmit={handleSubmit}>
        <div className="row mb-3">
            <div className="col-12 col-md-6">
            {/* Email */}
            <div className="mb-2">
                <label className="form-label">Email</label>
                <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                />
            </div>

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
                className={`form-control ${isPasswordValid ? 'is-valid' : ''}`}
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
                    className={`form-control ${passwordsMatch ? 'is-valid' : confirmPassword ? 'is-invalid' : ''}`}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                {confirmPassword && !passwordsMatch && (
                    <div className="error-inline">Passwords do not match</div>
                )}
                {confirmPassword && passwordsMatch && (
                    <div className="valid-inline">Passwords match</div>
                )}
                </div>
            </div>
            </div>

            {/* Password Requirements */}
            <div className="col-12 col-md-6 mt-3 mt-md-0">
            <p className="mb-2 fw-medium">Password must contain:</p>
            <ul className="list-unstyled">
                <li className={hasUpperCase ? 'text-success' : ''}>
                At least 1 upper case letter (A-Z)
                </li>
                <li className={hasNumber ? 'text-success' : ''}>
                At least 1 number (0-9)
                </li>
                <li className={hasMinLength ? 'text-success' : ''}>
                At least 8 characters
                </li>
            </ul>
            </div>
        </div>

        {/* Button */}
        <div className="row">
            <div className="col-12 col-md-6">
            <button type="submit" className="btn btn-primary w-100">
                Change my password
            </button>
            </div>
        </div>

        {error && <div className="alert alert-danger mt-3">{error}</div>}
        </form>
    </div>
    </div>
);
}

export default ChangePasswordForm;