import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Form } from 'react-bootstrap';
import { getAllUser } from '../../../service/UserListService';


const UserlistPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]); // Khởi tạo mảng rỗng thay vì object

  // Sử dụng useEffect để gọi API khi component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userData = await getAllUser();
        console.log("check userData: ", userData)
        setUsers(userData); // Cập nhật state với dữ liệu từ API
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []); // Dependency array rỗng để chỉ chạy một lần khi mount

  const filteredUsers = users.filter(user => 
    (user?.userName?.toLowerCase()?.includes(searchTerm.toLowerCase()) || 
     user?.email?.toLowerCase()?.includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="main-panel">
      <div className="content-wrapper">
        <Row>
          <Col lg={12} className="grid-margin stretch-card">
            <Card>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="card-title fw-bold fs-2">USER</h4>
                  <Form.Control
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ maxWidth: '300px' }}
                  />
                </div>
                <Table striped responsive>
                  <thead>
                    <tr>
                      <th>User name</th>
                      <th>Email</th>
                      <th>Picture</th>
                      <th>Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user, index) => (
                      <tr key={index}>
                        <td>{user.userName}</td>
                        <td>{user.email}</td>
                        <td><img src={user.picture} alt="user" /></td>
                        <td>{user.role}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default UserlistPage;