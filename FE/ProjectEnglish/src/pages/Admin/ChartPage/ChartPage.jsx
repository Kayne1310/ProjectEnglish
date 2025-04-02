import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { getAllUser } from '../../../service/UserListService';
import { getAllHistory, getQuizById } from '../../../service/historyService';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import "../../../assets/css/AdminCss/Reponsive.css" // Import CSS file


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const ChartPage = () => {
  const [userStats, setUserStats] = useState({
    labels: [],
    data: []
  });

  const [quizStats, setQuizStats] = useState({
    labels: [],
    data: [],
    quarterInfo: '',
    hasData: true,
    error: null
  });
  console.log("check quizStats", quizStats);
  const [sortedQuizzes, setSortedQuizzes] = useState([]);

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

        // Kiểm tra nếu response rỗng hoặc không hợp lệ
        if (!response || Object.keys(response).length === 0) {
          setQuizStats({
            labels: [],
            data: [],
            quarterInfo: getCurrentQuarterInfo(),
            hasData: false,
            errorMessage: "Không tìm thấy dữ liệu lịch sử làm quiz nào."
          });
          console.log("Không có dữ liệu lịch sử làm quiz");
          return;
        }

        // 2. Lọc lịch sử trong quý hiện tại
        const currentDate = new Date();
        const currentQuarter = Math.floor(currentDate.getMonth() / 3);
        const startMonth = currentQuarter * 3;
        const endMonth = startMonth + 2;
        
        const startDate = new Date(currentDate.getFullYear(), startMonth, 1);
        const endDate = new Date(currentDate.getFullYear(), endMonth + 1, 0);
        
        // 3. Đếm số lượng user unique cho mỗi quiz trong quý
        const quizUserCount = {};
        let validHistoryCount = 0;
        
        Object.values(response).forEach(history => {
          // Cập nhật để kiểm tra đúng cấu trúc API history mới
          const createdAtValue = history.createAt || history.createdAt;
          if (!createdAtValue) {
            console.log("History missing creation date:", history);
            return;
          }

          const historyDate = new Date(createdAtValue);
          
          // Kiểm tra xem ngày có hợp lệ không
          if (isNaN(historyDate.getTime())) {
            console.log("Invalid date in history:", createdAtValue);
            return;
          }
          
          // Chỉ tính các history trong quý hiện tại
          if (historyDate >= startDate && historyDate <= endDate && history.quiz_id) {
            validHistoryCount++;
            if (!quizUserCount[history.quiz_id]) {
              quizUserCount[history.quiz_id] = {
                userSet: new Set(),
                count: 0
              };
            }
            // Sử dụng userID thay vì userId để phù hợp với API
            quizUserCount[history.quiz_id].userSet.add(history.userID);
            quizUserCount[history.quiz_id].count = quizUserCount[history.quiz_id].userSet.size;
          }
        });

        console.log(`Tìm thấy ${validHistoryCount} lịch sử hợp lệ trong quý hiện tại`);

        // Kiểm tra nếu không có quiz nào được làm trong quý
        if (Object.keys(quizUserCount).length === 0) {
          setQuizStats({
            labels: [],
            data: [],
            quarterInfo: `Q${currentQuarter + 1} (${startMonth + 1}-${endMonth + 1}/${currentDate.getFullYear()})`,
            hasData: false,
            errorMessage: "Không có quiz nào được làm trong quý hiện tại."
          });
          console.log("Không có quiz nào được làm trong quý hiện tại");
          return;
        }

        // 4. Chuyển đổi thành mảng và sắp xếp
        const quizPromises = Object.entries(quizUserCount).map(async ([quizId, data]) => {
          try {
            const cleanQuizId = quizId.trim().replace(/['"]/g, '');
            console.log("Đang lấy thông tin cho Quiz ID:", cleanQuizId);

            const quizResponse = await getQuizById(cleanQuizId);
            console.log("Quiz Response:", quizResponse);

            // Sử dụng cấu trúc response mới theo format bạn đã cung cấp
            const quizName = quizResponse?.name || 
                             `Quiz ${cleanQuizId.substring(0, 6)}...`;
            
            return {
              quizId: cleanQuizId,
              quizName,
              count: data.count,
              difficulty: quizResponse?.difficulty || 'N/A',
              countryName: quizResponse?.countryName || 'N/A'
            };
          } catch (error) {
            console.error(`Lỗi khi lấy thông tin quiz ${quizId}:`, error);
            
            return {
              quizId,
              quizName: `Quiz ${quizId.substring(0, 6)}...`,
              count: data.count,
              errorFetching: true
            };
          }
        });

        // Sử dụng Promise.allSettled thay vì Promise.all để tránh việc một promise bị từ chối làm hỏng tất cả
        const quizResults = await Promise.allSettled(quizPromises);
        
        const sortedQuizData = quizResults
          .filter(result => result.status === 'fulfilled')
          .map(result => result.value)
          .filter(quiz => quiz); // Lọc ra các giá trị null hoặc undefined
        
        console.log("Dữ liệu quiz đã xử lý:", sortedQuizData);
        
        // 5. Sắp xếp theo số lượng
        const sortedQuizzes = sortedQuizData.sort((a, b) => b.count - a.count);

        // 6. Cập nhật state với tất cả quiz
        setQuizStats({
          labels: sortedQuizzes.map(quiz => quiz.quizName),
          data: sortedQuizzes.map(quiz => quiz.count),
          quarterInfo: `Q${currentQuarter + 1} (${startMonth + 1}-${endMonth + 1}/${currentDate.getFullYear()})`,
          hasData: sortedQuizzes.length > 0,
          errorFetchingQuizNames: sortedQuizData.some(quiz => quiz.errorFetching)
        });

        setSortedQuizzes(sortedQuizzes);

      } catch (error) {
        console.error('Lỗi khi lấy thống kê quiz:', error);
        setQuizStats(prev => ({
          ...prev, 
          hasData: false, 
          error: error.message,
          errorMessage: "Đã xảy ra lỗi khi tải dữ liệu thống kê. Vui lòng thử lại sau."
        }));
      }
    };

    // Hàm để lấy thông tin quý hiện tại
    const getCurrentQuarterInfo = () => {
      const currentDate = new Date();
      const currentQuarter = Math.floor(currentDate.getMonth() / 3);
      const startMonth = currentQuarter * 3;
      const endMonth = startMonth + 2;
      return `Q${currentQuarter + 1} (${startMonth + 1}-${endMonth + 1}/${currentDate.getFullYear()})`;
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
        },
        title: {
          display: true,
          text: 'Số lượng người đăng kí'
        },
        grid: {
          display: false
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  const barData = {
    labels: quizStats.labels,
    datasets: [
      {
        label: 'Số lượng người dùng',
        data: quizStats.data,
        backgroundColor: quizStats.data.map((_, idx) => {
          const colors = [
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)',
            'rgba(255, 159, 64, 0.8)',
            'rgba(199, 199, 199, 0.8)',
            'rgba(83, 102, 255, 0.8)',
            'rgba(78, 121, 112, 0.8)',
            'rgba(255, 99, 255, 0.8)'
          ];
          return colors[idx % colors.length];
        }),
        borderColor: 'transparent',
        borderWidth: 0
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
        text: `Thống kê số người dùng làm Quiz trong ${quizStats.quarterInfo || 'quý hiện tại'}`
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const quiz = sortedQuizzes?.[context.dataIndex];
            let tooltipText = `Số người dùng: ${context.parsed.y}`;
            
            if (quiz?.difficulty && quiz.difficulty !== 'N/A') {
              tooltipText += ` | Độ khó: ${quiz.difficulty}`;
            }
            
            if (quiz?.countryName && quiz.countryName !== 'N/A') {
              tooltipText += ` | Quốc gia: ${quiz.countryName}`;
            }
            
            return tooltipText;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        },
        title: {
          display: true,
          text: 'Số người dùng khác nhau'
        },
        grid: {
          display: false
        }
      },
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45
        },
        grid: {
          display: false
        }
      }
    }
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

                {/* <Card.Title>Line Chart</Card.Title>
                <div style={{ height: '300px' }}>
                  <Line data={lineData} options={chartOptions} />
                </div> */}

              </Card.Body>
            </Card>
          </Col>
          <Col lg={6} className="grid-margin stretch-card">
            <Card>
              <Card.Body>

                <Card.Title>Thống kê lượt làm Quiz</Card.Title>
                {quizStats.hasData ? (
                  <>
                    <Bar data={barData} options={barOptions} />
                    <div className="mt-3">
                      <p className="text-success">
                        Quiz được nhiều người dùng làm nhất: {quizStats.labels[0]} ({quizStats.data[0]} người dùng)
                      </p>
                      <p>
                        <i>*Ghi chú: Biểu đồ hiển thị số lượng người dùng khác nhau đã tham gia mỗi quiz trong {quizStats.quarterInfo || 'quý hiện tại'}</i>
                      </p>
                      {quizStats.errorFetchingQuizNames && (
                        <p className="text-warning">
                          <i>*Lưu ý: Một số tên quiz có thể không chính xác do gặp lỗi khi truy xuất thông tin.</i>
                        </p>
                      )}
                    </div>
                  </>
                ) : quizStats.error ? (
                  <div className="text-center p-4">
                    <p className="text-danger">Đã xảy ra lỗi khi tải dữ liệu: {quizStats.error}</p>
                    <p>Vui lòng kiểm tra kết nối mạng và thử lại sau.</p>
                  </div>
                ) : (
                  <div className="text-center p-4">
                    <p className="mb-3">{quizStats.errorMessage || 'Không có dữ liệu quiz nào trong ' + (quizStats.quarterInfo || 'quý hiện tại')}</p>
                    <p>Có thể chưa có người dùng tham gia quiz nào trong khoảng thời gian này.</p>
                    <div className="mt-4 p-3 bg-light rounded">
                      <p className="font-weight-bold">Gợi ý:</p>
                      <ul className="text-left">
                        <li>Tạo thêm các quiz hấp dẫn để thu hút người dùng tham gia</li>
                        <li>Quảng bá các quiz hiện có đến nhiều người dùng hơn</li>
                        <li>Có thể xem xét mở rộng phạm vi thời gian (ví dụ: 6 tháng, 1 năm) để có thêm dữ liệu</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* <Card.Title>Bar Chart</Card.Title>
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
                </div> */}

              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ChartPage;