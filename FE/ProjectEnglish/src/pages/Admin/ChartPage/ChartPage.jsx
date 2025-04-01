import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import "../../../assets/css/AdminCss/Reponsive.css" // Import CSS file

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

const ChartPage = () => {
  const lineData = {
    labels: ['January', 'February', 'March', 'April', 'May'],
    datasets: [{ label: 'Sales', data: [12, 19, 3, 5, 2], borderColor: '#4B49AC', fill: false }],
  };

  const barData = {
    labels: ['Red', 'Blue', 'Yellow', 'Green'],
    datasets: [{ label: 'Votes', data: [12, 19, 3, 5], backgroundColor: '#4B49AC' }],
  };

  const doughnutData = {
    labels: ['Red', 'Blue', 'Yellow'],
    datasets: [{ data: [300, 50, 100], backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'] }],
  };

  // Thêm options cho responsive
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 10,
          padding: 10,
          font: {
            size: window.innerWidth < 768 ? 10 : 12
          }
        }
      }
    }
  };

  return (
    <div className="main-panel">
      <div className="content-wrapper">
        <Row>
          <Col lg={6} className="grid-margin stretch-card">
            <Card>
              <Card.Body>
                <Card.Title>Line Chart</Card.Title>
                <div style={{ height: '300px' }}>
                  <Line data={lineData} options={chartOptions} />
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={6} className="grid-margin stretch-card">
            <Card>
              <Card.Body>
                <Card.Title>Bar Chart</Card.Title>
                <div style={{ height: '300px' }}>
                  <Bar data={barData} options={chartOptions} />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col lg={6} className="grid-margin stretch-card">
            <Card>
              <Card.Body>
                <Card.Title>Doughnut Chart</Card.Title>
                <div style={{ height: '300px' }}>
                  <Doughnut data={doughnutData} options={chartOptions} />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ChartPage;