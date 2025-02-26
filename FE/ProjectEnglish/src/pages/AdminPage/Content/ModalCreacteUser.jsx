import { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import './ManageUsers.scss';
import { FcPlus } from "react-icons/fc";

const ModalCreateUser = () => {
    const [show, setShow] = useState(false);
    const [imagePreview, setImagePreview] = useState(null); // Trạng thái cho hình ảnh xem trước

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [image, setImage] = useState();
    const [role, setRole] = useState("");
    const [previewImage, setPreviewImage] = useState("");

    // Xử lý việc tải lên và xem trước hình ảnh
    // const handleImageUpload = (event) => {
    //     const file = event.target.files[0];
    //     if (file) {
    //         const reader = new FileReader();
    //         reader.onloadend = () => {
    //             setImagePreview(reader.result); // Đặt URL xem trước hình ảnh
    //         };
    //         reader.readAsDataURL(file); // Đọc file dưới dạng URL dữ liệu
    //     }
    // };

    const handleImageUpload = (event) => {
        if (event.target && event.target.files[0]) {
            setPreviewImage(URL.createObjectURL(event.target.files[0]));
        }else {
            // setPreviewImage("");
        }
    }

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Thêm người dùng mới hoặc admin
            </Button>

            <Modal
                show={show}
                onHide={handleClose}
                size="xl"
                className="modal-add-user"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Thêm người dùng mới</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form className="row g-3">
                        <div className="col-12">
                            <label htmlFor="inputEmail4" className="form-label">Email</label>
                            <input 
                                type="email" 
                                className="form-control" 
                                id="inputEmail4" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                            />
                        </div>

                        <div className="col-12">
                            <label htmlFor="inputPassword4" className="form-label">Mật khẩu</label>
                            <input 
                                type="password" 
                                className="form-control" 
                                id="inputPassword4" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                            />
                        </div>

                        <div className="col-12">
                            <label htmlFor="inputCity" className="form-label">User Name</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                id="inputCity" 
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)} 
                            />
                        </div>

                        <div className="col-12">
                            <label htmlFor="inputState" className="form-label">Role</label>
                            <select 
                                id="inputState" 
                                className="form-select" 
                                value={role} 
                                onChange={(e) => setRole(e.target.value)}>
                                <option value="Admin">Admin</option>
                                <option value="User">User</option>
                            </select>
                        </div>

                        <div className="col-12">
                            <label 
                                className="form-label label-upload" 
                                htmlFor="labelUpLoad">
                                <FcPlus /> UpLoad File Image
                            </label>
                            <input 
                                type="file" 
                                id="labelUpLoad" 
                                hidden 
                                onChange={(even) => handleImageUpload(even)} // Xử lý khi chọn file
                                accept="image/*" // Tùy chọn: Giới hạn cho file hình ảnh
                            />
                        </div>  


                        {/* <div className="col-md-12">
                            {previewImage ?
                                <img src={previewImage} alt="Xem trước" style={{ maxWidth: '25%' }} />
                                : <span>Chưa có hình ảnh nào được tải lên.</span>
                            }
                        </div> */}

                        <div className="col-md-12">
                            {previewImage ?
                                <img 
                                style={{ maxWidth: '25%' }} 
                                src={previewImage} />
                                : <span>Chưa có hình ảnh nào được tải lên.</span>
                            }
                        </div>


                        {/* <div className="col-12 img-preview">
                            {imagePreview ? (
                                <img 
                                    src={imagePreview} 
                                    alt="Xem trước" 
                                    style={{ maxWidth: '25%' }} 
                                />
                            ) : (
                                <span>Chưa có hình ảnh nào được tải lên.</span>
                            )}
                        </div> */}



                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Đóng</Button>
                    <Button variant="primary" onClick={handleClose}>Lưu</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModalCreateUser;