import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { getAllUser } from '../../../service/UserListService';
import { getAllHistory, getQuizById } from '../../../service/historyService';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const ChartPage = () => {
  const [userStats, setUserStats] = useState({
    labels: [],
    data: []
  });

  const [quizStats, setQuizStats] = useState({
    labels: [],
    data: []
  });

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const response = await getAllUser();
        const users = response.items;

        // Khởi tạo mảng 12 tháng với giá trị 0
        const monthsData = Array(12).fill(0);
        
        // Đếm số lượng user đăng ký theo từng tháng
        users.forEach(user => {
          const date = new Date(user.createdAt);
          const month = date.getMonth(); // 0-11
          monthsData[month]++;
        });

        // Tạo labels cho 12 tháng
        const monthLabels = [
          'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 
          'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8',
          'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
        ];

        // Tìm tháng có số đăng ký cao nhất và thấp nhất
        const maxMonth = monthsData.indexOf(Math.max(...monthsData));
        const minMonth = monthsData.indexOf(Math.min(...monthsData));

        setUserStats({
          labels: monthLabels,
          data: monthsData,
          maxMonth: monthLabels[maxMonth],
          maxValue: monthsData[maxMonth],
          minMonth: monthLabels[minMonth],
          minValue: monthsData[minMonth]
        });

      } catch (error) {
        console.error('Error fetching user statistics:', error);
      }
    };

    fetchUserStats();
  }, []);

  useEffect(() => {
    const fetchQuizStats = async () => {
      try {
        // 1. Lấy tất cả history
        const response = await getAllHistory();
        console.log("Raw API response:", response);

        // 2. Đếm số lượng user unique cho mỗi quiz
        const quizUserCount = {};
        
        Object.values(response).forEach(history => {
          if (history.quiz_id) {
            if (!quizUserCount[history.quiz_id]) {
              quizUserCount[history.quiz_id] = {
                userSet: new Set(),
                count: 0
              };
            }
            quizUserCount[history.quiz_id].userSet.add(history.userId);
            quizUserCount[history.quiz_id].count = quizUserCount[history.quiz_id].userSet.size;
          }
        });

        // 3. Chuyển đổi thành mảng và sắp xếp
        const sortedQuizData = await Promise.all(
          Object.entries(quizUserCount)
            .map(async ([quizId, data]) => {
              try {
                // Loại bỏ các ký tự đặc biệt và khoảng trắng từ quizId
                const cleanQuizId = quizId.trim().replace(/['"]/g, '');
                console.log("Clean Quiz ID:", cleanQuizId); // Kiểm tra ID sau khi clean

                // Gọi API với ID đã được clean
                const quizResponse = await getQuizById(cleanQuizId);
                console.log("Quiz Response:", quizResponse);

                const quizName = quizResponse?.data?.name || 
                                quizResponse?.name || 
                                `Quiz ${cleanQuizId.substring(0, 6)}...`;
                
                return {
                  quizId: cleanQuizId,
                  quizName,
                  count: data.count
                };
              } catch (error) {
                console.error(`Error fetching quiz ${quizId}:`, error);
                // Log thêm thông tin về error
                console.log("Error details:", {
                  quizId,
                  errorMessage: error.message,
                  errorResponse: error.response
                });
                
                return {
                  quizId,
                  quizName: `Quiz ${quizId.substring(0, 6)}...`,
                  count: data.count
                };
              }
            })
        );


        // 4. Sắp xếp theo số lượng và lấy top 5
        const top5Quizzes = sortedQuizData
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        console.log("Top 5 quizzes:", top5Quizzes);

        // 5. Cập nhật state
        setQuizStats({
          labels: top5Quizzes.map(quiz => quiz.quizName),
          data: top5Quizzes.map(quiz => quiz.count)
        });

      } catch (error) {
        console.error('Error fetching quiz statistics:', error);
      }
    };

    fetchQuizStats();
  }, []);

  const lineData = {
    labels: userStats.labels,
    datasets: [
      {
        label: 'Số lượng đăng ký',
        data: userStats.data,
        borderColor: '#4B49AC',
        backgroundColor: 'rgba(75, 73, 172, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Thống kê số lượng đăng ký theo tháng'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Số lượng: ${context.parsed.y} người dùng`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  const barData = {
    labels: quizStats.labels,
    datasets: [
      {
        label: 'Số lượng người làm bài',
        data: quizStats.data,
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Top 5 Quiz được làm nhiều nhất trong 1 tháng'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Số lượng làm bài: ${context.parsed.y}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      },
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45
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
                <Card.Title>Thống kê đăng ký theo tháng</Card.Title>
                {userStats.data.length > 0 && (
                  <>
                    <Line data={lineData} options={options} />
                    <div className="mt-3">
                      <p className="text-success">
                        Tháng có nhiều đăng ký nhất: {userStats.maxMonth} ({userStats.maxValue} người dùng)
                      </p>
                      <p className="text-danger">
                        Tháng có ít đăng ký nhất: {userStats.minMonth} ({userStats.minValue} người dùng)
                      </p>
                    </div>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
          <Col lg={6} className="grid-margin stretch-card">
            <Card>
              <Card.Body>
                <Card.Title>Thống kê lượt làm Quiz</Card.Title>
                {quizStats.data.length > 0 ? (
                  <>
                    <Bar data={barData} options={barOptions} />
                    <div className="mt-3">
                      <p className="text-success">
                        Quiz được làm nhiều nhất: {quizStats.labels[0]} ({quizStats.data[0]} lượt)
                      </p>
                    </div>
                  </>
                ) : (
                  <p>Đang tải dữ liệu...</p>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ChartPage;