
import React, { useState } from 'react';
import { Container, Row, Col, Card, Table, Form } from 'react-bootstrap';


const UserList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const users = [
    { name: 'Toàn', email: 'toan@example.com', picture: "Face1", role: 'User' },
    { name: 'Trọng', email: 'trong@example.com', picture: "Face1", role: 'Admin' },
    { name: 'Khánh', email: 'khanh@example.com', picture: "Face1", role: 'User' },
  ];

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
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
                        <td>{user.name}</td>
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

export default UserList;