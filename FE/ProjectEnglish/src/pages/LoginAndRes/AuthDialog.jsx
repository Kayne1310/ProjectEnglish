import React from 'react';
import '../../assets/css/LoginCss/AuthDialog.css';

const AuthDialog = ({ isOpen, onClose, onConfirm,stringPopup }) => {
    if (!isOpen) return null;

    return (
        <div className="dialog-overlay">
            <div className="dialog-content animate__animated animate__fadeInDown">
                <div className="dialog-header">
                    <h5 className="text-center mb-0">Thông báo</h5>
                </div>
                <div className="dialog-body text-center py-4">
                    <i className="bi bi-exclamation-circle text-warning display-4"></i>
                    <p className="mt-3 mb-0">{stringPopup}</p>
                </div>
                <div className="dialog-footer d-flex justify-content-center">
                    <button 
                        className="btn btn-secondary me-2 w-50 rounded-pill "
                        onClick={onClose}
                    >
                        Hủy
                    </button>
                    <button 
                        className="btn btn-primary w-50 rounded-pill "
                        onClick={onConfirm}
                    >
                        Đăng nhập
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthDialog;