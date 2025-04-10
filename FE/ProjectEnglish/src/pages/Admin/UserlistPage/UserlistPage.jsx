import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Form, Pagination } from 'react-bootstrap';
import { getAllUser } from '../../../service/UserListService';


const UserlistPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(7);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState('UserName');
  const [sortAscending, setSortAscending] = useState(true);

  // Sử dụng useEffect để gọi API khi component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUser(currentPage, pageSize, sortBy, sortAscending);
        setUsers(response.items);
        setTotalItems(response.totalItems);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [currentPage, pageSize, sortBy, sortAscending]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortAscending(!sortAscending);
    } else {
      setSortBy(field);
      setSortAscending(true);
    }
  };

  const SortIcon = ({ field }) => {
    if (sortBy !== field) return <span className="ms-1">↕</span>;
    return sortAscending ? <span className="ms-1">↑</span> : <span className="ms-1">↓</span>;
  };

  const filteredUsers = users.filter(user => 
    (user?.userName?.toLowerCase()?.includes(searchTerm.toLowerCase()) || 
     user?.email?.toLowerCase()?.includes(searchTerm.toLowerCase()))
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

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
                      <th 
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleSort('UserName')}
                      >
                        User name <SortIcon field="UserName" />
                      </th>
                      <th 
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleSort('Email')}
                      >
                        Email <SortIcon field="Email" />
                      </th>
                      <th>Picture</th>
                      <th>Phone</th>
                      <th>Gender</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user, index) => (
                      <tr key={index}>
                        <td>{user.userName}</td>
                        <td>{user.email}</td>
                        <td><img src={user.picture} alt="user" style={{ width: '35px', height: '35px', objectFit: 'cover' }} /></td>
                        <td>{user.phone || ''}</td>
                        <td>{user.gender || ''}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <div>
                    Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalItems)} of {totalItems} entries
                  </div>
                  <Pagination>
                    <Pagination.First 
                      onClick={() => handlePageChange(1)} 
                      disabled={currentPage === 1}
                    />
                    <Pagination.Prev 
                      onClick={() => handlePageChange(currentPage - 1)} 
                      disabled={currentPage === 1}
                    />
                    {[...Array(totalPages)].map((_, index) => (
                      <Pagination.Item
                        key={index + 1}
                        active={currentPage === index + 1}
                        onClick={() => handlePageChange(index + 1)}
                      >
                        {index + 1}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next 
                      onClick={() => handlePageChange(currentPage + 1)} 
                      disabled={currentPage === totalPages}
                    />
                    <Pagination.Last 
                      onClick={() => handlePageChange(totalPages)} 
                      disabled={currentPage === totalPages}
                    />
                  </Pagination>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default UserlistPage;