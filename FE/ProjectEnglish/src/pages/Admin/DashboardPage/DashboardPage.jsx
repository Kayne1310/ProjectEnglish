

import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const Dashboard = () => {
  return (
    <div className="main-panel">
      <div className="content-wrapper">
        <Row>
          <Col md={6} className="grid-margin stretch-card">
            <Card>
              <Card.Body>
                <Card.Title>Order Details</Card.Title>
                <Card.Text>
                  The total number of sessions within the date range. It is the period time a user is actively engaged with your website, page or app, etc
                </Card.Text>
                <div className="d-flex flex-wrap mb-5">
                  <div className="me-5 mt-3">
                    <p className="text-muted">Order value</p>
                    <h3 className="text-primary fs-4 fw-medium">12.3k</h3>
                  </div>
                  <div className="me-5 mt-3">
                    <p className="text-muted">Orders</p>
                    <h3 className="text-primary fs-4 fw-medium">14k</h3>
                  </div>
                  <div className="me-5 mt-3">
                    <p className="text-muted">Users</p>
                    <h3 className="text-primary fs-4 fw-medium">71.56%</h3>
                  </div>
                  <div className="mt-3">
                    <p className="text-muted">Downloads</p>
                    <h3 className="text-primary fs-4 fw-medium">34040</h3>
                  </div>
                </div>
                <canvas id="order-chart"></canvas>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} className="grid-margin stretch-card">
            <Card>
              <Card.Body>
                <Card.Text>
                  The total number of sessions within the date range. It is the period time a user is actively engaged with your website, page or app, etc
                </Card.Text>
                <canvas id="sales-chart"></canvas>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Dashboard;