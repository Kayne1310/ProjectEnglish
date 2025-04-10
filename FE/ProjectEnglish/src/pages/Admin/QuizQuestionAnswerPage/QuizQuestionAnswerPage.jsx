import React, { useState, useEffect } from "react";
import "../../../assets/css/AdminCss/Reponsive.css";

import {
  Row,
  Col,
  Card,
  Table,
  Form,
  Button,
  Modal,
} from "react-bootstrap";
import {
  getAllQuiz,
  getQuestionsByQuizId,
  createQuizQuestionWithAnswers,
  updateQuizQuestionWithAnswers,
  deleteQuizQuestionWithAnswers,
} from "../../../service/QuestionWithAnswersService";
import PropTypes from "prop-types";
import Pagination from "../../../components/Pagination/Pagination";

const QuizQuestionAnswerPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [quizSearchTerm, setQuizSearchTerm] = useState("");
  const [questionSearchTerm, setQuestionSearchTerm] = useState("");

  // Pagination state cho ALL QUIZZES
  const [quizCurrentPage, setQuizCurrentPage] = useState(1);
  const [quizPageSize] = useState(5);
  const [quizSortBy, setQuizSortBy] = useState("name");
  const [quizSortAscending, setQuizSortAscending] = useState(true);
  const [quizTotalPages, setQuizTotalPages] = useState(0);
  const [quizTotalItems, setQuizTotalItems] = useState(0);

  // Pagination state cho QUIZ QUESTIONS
  const [questionCurrentPage, setQuestionCurrentPage] = useState(1);
  const [questionPageSize] = useState(5);
  const [questionSortBy, setQuestionSortBy] = useState("description");
  const [questionSortAscending, setQuestionSortAscending] = useState(true);
  const [questionTotalPages, setQuestionTotalPages] = useState(0);
  const [questionTotalItems, setQuestionTotalItems] = useState(0);

  const [selectedQuestion, setSelectedQuestion] = useState({
    description: "",
    quiz_id: "",
    image: null,
    answers: [
      { description: "", correct_answer: false },
      { description: "", correct_answer: false },
      { description: "", correct_answer: false },
      { description: "", correct_answer: false },
    ],
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [quizData, setQuizData] = useState({
    description: "",
    quiz_id: "",
    image: null,
    answers: [
      { description: "", correct_answer: false },
      { description: "", correct_answer: false },
      { description: "", correct_answer: false },
      { description: "", correct_answer: false },
    ],
  });

  const [imagePreview, setImagePreview] = useState(null);

  const handleInputChange = (e, index = null) => {
    const { name, value, files } = e.target;
    
    if (name === "image") {
      const file = files[0];
      if (file) {
        // Kiểm tra kích thước file (giới hạn 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert("Kích thước ảnh không được vượt quá 5MB!");
          return;
        }

        // Kiểm tra định dạng file
        const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!validTypes.includes(file.type)) {
          alert("Chỉ chấp nhận file ảnh định dạng JPEG, PNG hoặc GIF!");
          return;
        }

        // Tạo URL preview cho ảnh
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
        setQuizData({ ...quizData, image: file });
      }
    } else if (index !== null) {
      // Xử lý cho answers
      const newAnswers = [...quizData.answers];
      if (name === "description") {
        newAnswers[index].description = value;
      } else if (name === "correct_answer") {
        newAnswers[index].correct_answer = value === "true";
      }
      setQuizData({ ...quizData, answers: newAnswers });
    } else {
      // Xử lý cho các trường input khác
      setQuizData({ ...quizData, [name]: value });
    }
  };

  const handleCorrectAnswerChange = (selectedIndex) => {
    setQuizData((prevData) => ({
      ...prevData,
      answers: prevData.answers.map((answer, index) => ({
        ...answer,
        correct_answer: index === selectedIndex,
      })),
    }));
  };

  // Thêm state để theo dõi trạng thái loading
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      const result = await createQuizQuestionWithAnswers(quizData);
      if (result && result.returnCode === 1) {
        alert("Quiz created successfully!");
        setShowCreateModal(false);
        // Reset form data và xóa preview
        setImagePreview(null);
        setQuizData({
          description: "",
          quiz_id: "",
          image: null,
          answers: [
            { description: "", correct_answer: false },
            { description: "", correct_answer: false },
            { description: "", correct_answer: false },
            { description: "", correct_answer: false },
          ],
        });

        // Cập nhật lại danh sách câu hỏi
        if (selectedQuizId) {
          try {
            const response = await getQuestionsByQuizId(
              selectedQuizId,
              questionCurrentPage,
              questionPageSize,
              questionSortBy,
              questionSortAscending
            );

            if (response && response.items) {
              setQuestions(response.items);
              setQuestionTotalItems(response.totalItems || 0);
              setQuestionTotalPages(response.totalPages || 0);
            } else {
              setQuestions([]);
              setQuestionTotalItems(0);
              setQuestionTotalPages(0);
            }
          } catch (error) {
            console.error("Error fetching updated questions:", error);
            setQuestions([]);
            setQuestionTotalItems(0);
            setQuestionTotalPages(0);
          }
        }
      } else {
        alert("Failed to create quiz: " + (result.error || result.ReturnMessage));
      }
    } catch (error) {
      alert("An error occurred: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Lọc quizzes dựa trên search term
  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz?.name?.toLowerCase().includes(quizSearchTerm.toLowerCase() || "")
  );

  // Lọc questions dựa trên search term
  const filteredQuestions = questions.filter(q =>
    q.description?.toLowerCase().includes(questionSearchTerm.toLowerCase() || "")
  );

  const handleQuizPageChange = (pageNumber) => {
    setQuizCurrentPage(pageNumber);
  };

  const handleQuizSort = (field) => {
    if (quizSortBy === field) {
      setQuizSortAscending(!quizSortAscending);
    } else {
      setQuizSortBy(field);
      setQuizSortAscending(true);
    }
  };

  const handleQuestionPageChange = (pageNumber) => {
    setQuestionCurrentPage(pageNumber);
  };

  const handleQuestionSort = (field) => {
    if (questionSortBy === field) {
      setQuestionSortAscending(!questionSortAscending);
    } else {
      setQuestionSortBy(field);
      setQuestionSortAscending(true);
    }
  };

  const SortIcon = ({ field }) => {
    if (questionSortBy !== field) return <span className="ms-1">↕</span>;
    return questionSortAscending ? <span className="ms-1">↑</span> : <span className="ms-1">↓</span>;
  };

  SortIcon.propTypes = {
    field: PropTypes.string.isRequired
  };

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await getAllQuiz(quizCurrentPage, quizPageSize, quizSortBy, quizSortAscending);
        console.log("Raw API Response from getAllQuiz:", response);
        if (response && response.items) {
          setQuizzes(response.items);
          setQuizTotalItems(response.totalItems);
          setQuizTotalPages(response.totalPages);
          console.log("Current page:", quizCurrentPage);
          console.log("Page size:", quizPageSize);
          console.log("Total items:", response.totalItems);
          console.log("Total pages:", response.totalPages);
        } else {
          setQuizzes([]);
          setQuizTotalItems(0);
          setQuizTotalPages(0);
        }
      } catch (error) {
        console.error("Error fetching quizzes:", error);
        setQuizzes([]);
        setQuizTotalItems(0);
        setQuizTotalPages(0);
      }
    };
    fetchQuizzes();
  }, [quizCurrentPage, quizPageSize, quizSortBy, quizSortAscending]);

  useEffect(() => {
    if (selectedQuizId) {
      const fetchQuestions = async () => {
        try {
          const response = await getQuestionsByQuizId(
            selectedQuizId,
            questionCurrentPage,
            questionPageSize,
            questionSortBy,
            questionSortAscending
          );
          console.log("Questions response:", response);

          if (response && response.items) {
            setQuestions(response.items);
            setQuestionTotalItems(response.totalItems);
            setQuestionTotalPages(response.totalPages);
            console.log("Current page:", response.currentPage);
            console.log("Page size:", response.pageSize);
            console.log("Total items:", response.totalItems);
            console.log("Total pages:", response.totalPages);
          } else {
            setQuestions([]);
            setQuestionTotalItems(0);
            setQuestionTotalPages(0);
          }
        } catch (error) {
          console.error("Error fetching questions for Quiz ID", selectedQuizId, ":", error);
          setQuestions([]);
          setQuestionTotalItems(0);
          setQuestionTotalPages(0);
        }
      };
      fetchQuestions();
    } else {
      setQuestions([]);
      setQuestionTotalItems(0);
      setQuestionTotalPages(0);
    }
  }, [selectedQuizId, questionCurrentPage, questionPageSize, questionSortBy, questionSortAscending]);

  const handleQuizClick = (quizId) => {
    console.log("Attempting to select Quiz ID:", quizId);
    setSelectedQuizId(quizId)
  };

  useEffect(() => {
    return () => {
      // Cleanup URL khi component unmount hoặc imagePreview thay đổi
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setImagePreview(null);
    setQuizData({
      description: "",
      quiz_id: "",
      image: null,
      answers: [
        { description: "", correct_answer: false },
        { description: "", correct_answer: false },
        { description: "", correct_answer: false },
        { description: "", correct_answer: false },
      ],
    });
  };

  return (
    <div className="main-panel">
      <div className="content-wrapper">
        <Row className="h-100">
          <Col lg={5} className="grid-margin stretch-card">
            <Card className="h-100">
              <Card.Body className="d-flex flex-column">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="card-title fw-bold fs-2">All QUIZ</h4>
                  <div className="d-flex align-items-center gap-2">
                    <Form.Control
                      type="text"
                      placeholder="Search quizzes..."
                      value={quizSearchTerm}
                      onChange={(e) => setQuizSearchTerm(e.target.value)}
                      style={{ maxWidth: "200px" }}
                    />
                  </div>
                </div>
                <div className="flex-grow-1" style={{ overflowY: "auto" }}>
                  <Table striped responsive>
                    <thead>
                      <tr>
                        <th
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleQuizSort('name')}
                        >
                          Quiz Name <SortIcon field="name" />
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredQuizzes.length > 0 ? (
                        filteredQuizzes.map((quiz) => (
                          <tr key={quiz.quiz_id}>
                            <td
                              style={{
                                cursor: "pointer",
                                fontSize: 15,
                                height: "35px",
                                lineHeight: "35px",
                                verticalAlign: "middle",
                                maxWidth: "200px",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis"
                              }}
                              onClick={() => handleQuizClick(quiz.quiz_id)}
                              title={quiz.name}
                            >
                              {quiz.name}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td style={{ height: "35px", lineHeight: "35px" }}>No quizzes available</td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                  {/* Thêm container chung cho cả hai phần pagination */}
                  <div className="pagination-container" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '1rem',
                    padding: '0 1rem'
                  }}>
                    {/* Pagination cho ALL QUIZZES */}
                    {quizTotalPages > 0 && (
                      <div className="quiz-pagination" style={{ flex: 1 }}>
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="text-muted" style={{ fontSize: "0.875rem" }}>
                            Showing {((quizCurrentPage - 1) * quizPageSize) + 1} to {Math.min(quizCurrentPage * quizPageSize, quizTotalItems)} of {quizTotalItems} entries
                          </div>
                          <Pagination
                            currentPage={quizCurrentPage}
                            totalPages={quizTotalPages}
                            onPageChange={handleQuizPageChange}
                            maxVisiblePages={3}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={7} className="grid-margin stretch-card">
            <Card className="h-100">
              <Card.Body className="d-flex flex-column">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="card-title fw-bold fs-2">QUESTIONS</h4>
                  <div className="d-flex align-items-center gap-2">
                    <Form.Control
                      type="text"
                      placeholder="Search questions..."
                      value={questionSearchTerm}
                      onChange={(e) => setQuestionSearchTerm(e.target.value)}
                      style={{ maxWidth: "200px" }}
                    />
                    <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                      Create
                    </Button>
                  </div>
                </div>
                <div className="flex-grow-1" style={{ overflowY: "auto" }}>
                  <Table striped responsive>
                    <thead>
                      <tr>
                        <th
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleQuestionSort('description')}
                        >
                          Question Name <SortIcon field="description" />
                        </th>
                        <th>Image</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredQuestions.length > 0 ? (
                        filteredQuestions.map((q, index) => (
                          <tr key={q.question_id || index}>
                            <td
                              style={{
                                cursor: "pointer",
                                height: "30px",
                                lineHeight: "30px",
                                verticalAlign: "middle",
                                maxWidth: "200px",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis"
                              }}
                              onClick={() => {
                                setSelectedQuestion({
                                  ...q,
                                  answers: q.answers || [
                                    { description: "", correct_answer: false },
                                    { description: "", correct_answer: false },
                                    { description: "", correct_answer: false },
                                    { description: "", correct_answer: false },
                                  ],
                                });
                                setShowDetailModal(true);
                              }}
                              title={q.description}
                            >
                              {q.description}
                            </td>
                            <td style={{ height: "50px", verticalAlign: "middle" }}>
                              {q.image && <img src={q.image} alt="question" width="50" height="40" style={{ objectFit: "cover" }} />}
                            </td>
                            <td style={{ height: "50px", verticalAlign: "middle" }}>
                              <i
                                className="bi bi-pencil-square text-warning me-3 fs-4"
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                  setSelectedQuestion({
                                    ...q,
                                    answers: q.answers || [
                                      { description: "", correct_answer: false },
                                      { description: "", correct_answer: false },
                                      { description: "", correct_answer: false },
                                      { description: "", correct_answer: false },
                                    ],
                                  });
                                  setShowEditModal(true);
                                }}
                              />
                              <i
                                className="bi bi-trash text-danger fs-4"
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                  setSelectedQuestion({
                                    ...q,
                                    question_id: q.question_id,
                                  });
                                  setShowDeleteModal(true);
                                }}
                              />
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" style={{ height: "35px", lineHeight: "35px" }}>
                            {selectedQuizId
                              ? "No questions available for this quiz."
                              : "Please select a quiz to view questions."}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                  {/* Thêm container chung cho cả hai phần pagination */}
                  {filteredQuestions.length > 0 && (
                    <div className="pagination-container" style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: '1rem',
                      padding: '0 1rem'
                    }}>
                      <div className="question-pagination" style={{ flex: 1 }}>
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="text-muted" style={{ fontSize: "0.875rem" }}>
                            Showing {((questionCurrentPage - 1) * questionPageSize) + 1} to {Math.min(questionCurrentPage * questionPageSize, questionTotalItems)} of {questionTotalItems} entries
                          </div>
                          <Pagination
                            currentPage={questionCurrentPage}
                            totalPages={questionTotalPages}
                            onPageChange={handleQuestionPageChange}
                            maxVisiblePages={3}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Create Modal */}
        <Modal show={showCreateModal} onHide={handleCloseCreateModal} dialogClassName="custom-modal">
          <Modal.Header closeButton>
            <Modal.Title style={{ color: "white", fontWeight: "bold", fontSize: "20px" }}>Create Question & Answers</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Quiz Name</Form.Label>
                <Form.Select
                  name="quiz_id"
                  value={quizData.quiz_id}
                  style={{ height: "46px" }}
                  onChange={handleInputChange}
                >
                  <option value="">Select a quiz</option>
                  {quizzes.map((quiz) => (
                    <option key={quiz.quiz_id} value={quiz.quiz_id}>
                      {quiz.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Question Name</Form.Label>
                <Form.Control
                  type="text"
                  name="description"
                  value={quizData.description}
                  onChange={handleInputChange}
                  placeholder="Enter your question"
                />
              </Form.Group>
              <Row>
                {quizData.answers.map((answer, index) => (
                  <Col md={6} key={index}>
                    <Form.Group className="mb-3">
                      <Form.Label>Answer {index + 1}</Form.Label>
                      <div className="d-flex align-items-center gap-4">
                        <Form.Control
                          type="text"
                          name="description"
                          value={answer.description}
                          onChange={(e) => handleInputChange(e, index)}
                          placeholder={`Answer ${index + 1}`}
                        />
                        <Form.Check
                          className="mb-4"
                          type="radio"
                          name="correct_answer"
                          checked={answer.correct_answer}
                          onChange={() => handleCorrectAnswerChange(index)}
                        />
                      </div>
                    </Form.Group>
                  </Col>
                ))}
              </Row>
              <Form.Group className="mb-3">
                <Form.Label style={{
                  fontWeight: "bold",
                  fontSize: "16px",
                  color: "#4B49AC",
                  marginBottom: "8px"
                }}>
                  Question Image
                </Form.Label>
                <div style={{
                  border: "2px dashed #dee2e6",
                  borderRadius: "8px",
                  backgroundColor: "#f8f9fa",
                  padding: "15px",
                  position: "relative",
                  minHeight: "46px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <Form.Control
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        // Kiểm tra kích thước file (giới hạn 5MB)
                        if (file.size > 5 * 1024 * 1024) {
                          alert("Kích thước ảnh không được vượt quá 5MB!");
                          return;
                        }

                        // Kiểm tra định dạng file
                        const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
                        if (!validTypes.includes(file.type)) {
                          alert("Chỉ chấp nhận file ảnh định dạng JPEG, PNG hoặc GIF!");
                          return;
                        }

                        // Tạo URL preview cho ảnh
                        const previewUrl = URL.createObjectURL(file);
                        setImagePreview(previewUrl);
                        setQuizData({ ...quizData, image: file });
                      }
                    }}
                    style={{
                      opacity: 0,
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      cursor: "pointer",
                      zIndex: 2
                    }}
                  />
                  <div style={{
                    textAlign: "center",
                    color: "#6c757d",
                    pointerEvents: "none"
                  }}>
                    <i className="bi bi-cloud-upload fs-4"></i>
                    <p style={{ margin: "0", fontSize: "14px" }}>Click to upload or drag and drop</p>
                    <p style={{ margin: "0", fontSize: "12px" }}>SVG, PNG, JPG (max. 800x400px)</p>
                  </div>
                </div>

                {(imagePreview || (quizData?.image && typeof quizData.image === "string")) && (
                  <div style={{
                    marginTop: "10px",
                    padding: "10px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "6px",
                    border: "1px solid #dee2e6"
                  }}>
                    <div className="d-flex align-items-center gap-2">
                      <img
                        src={imagePreview || quizData.image}
                        alt="Preview"
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                          borderRadius: "4px",
                          cursor: "pointer"
                        }}
                        onClick={() => {
                          setImagePreview(null);
                          setQuizData({ ...quizData, image: null });
                        }}
                      />
                      <div>
                        <p style={{
                          margin: "0",
                          fontSize: "14px",
                          color: "#198754",
                          fontWeight: "500"
                        }}>
                          <i className="bi bi-check-circle me-1"></i>
                          Image uploaded successfully
                        </p>
                        <button 
                          type="button"
                          className="btn btn-link p-0"
                          style={{
                            fontSize: "12px",
                            color: "#6c757d",
                            textDecoration: "none",
                            cursor: "default"
                          }}
                        >
                          Click image to remove preview
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer className="d-flex justify-content-end gap-2">
            <Button variant="light" onClick={handleCloseCreateModal}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Quiz"}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Edit Modal */}
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)} dialogClassName="custom-modal">
          <Modal.Header closeButton>
            <Modal.Title style={{ color: "white", fontWeight: "bold", fontSize: "20px" }}>Edit Question & Answers</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Quiz Name</Form.Label>
                <Form.Select
                  name="quiz_id"
                  style={{ height: "46px" }}
                  value={selectedQuestion?.quiz_id || ""}
                  onChange={(e) => setSelectedQuestion({ ...selectedQuestion, quiz_id: e.target.value })}
                >
                  <option value="">Select a quiz</option>
                  {quizzes.map((quiz) => (
                    <option key={quiz.quiz_id} value={quiz.quiz_id}>
                      {quiz.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Question Name</Form.Label>
                <Form.Control
                  type="text"
                  name="description"
                  value={selectedQuestion?.description || ""}
                  onChange={(e) => setSelectedQuestion({ ...selectedQuestion, description: e.target.value })}
                  placeholder="Enter your question"
                />
              </Form.Group>
              <Row>
                {selectedQuestion?.answers?.map((answer, index) => (
                  <Col md={6} key={index}>
                    <Form.Group className="mb-3">
                      <Form.Label>Answer {index + 1}</Form.Label>
                      <div className="d-flex align-items-center gap-4">
                        <Form.Control
                          type="text"
                          name="description"
                          value={answer.description || ""}
                          onChange={(e) => {
                            const newAnswers = [...selectedQuestion.answers];
                            newAnswers[index].description = e.target.value;
                            setSelectedQuestion({ ...selectedQuestion, answers: newAnswers });
                          }}
                          placeholder={`Answer ${index + 1}`}
                        />
                        <Form.Check
                          className="mb-4"
                          type="radio"
                          name="correct_answer"
                          checked={answer.correct_answer || false}
                          onChange={() => {
                            const newAnswers = [...selectedQuestion.answers];
                            newAnswers.forEach((a, i) => (a.correct_answer = i === index));
                            setSelectedQuestion({ ...selectedQuestion, answers: newAnswers });
                          }}
                        />
                      </div>
                    </Form.Group>
                  </Col>
                ))}
              </Row>
              <Form.Group className="mb-3">
                <Form.Label style={{
                  fontWeight: "bold",
                  fontSize: "16px",
                  color: "#4B49AC",
                  marginBottom: "8px"
                }}>
                  Question Image
                </Form.Label>
                <div style={{
                  border: "2px dashed #dee2e6",
                  borderRadius: "8px",
                  backgroundColor: "#f8f9fa",
                  padding: "15px",
                  position: "relative",
                  minHeight: "46px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <Form.Control
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        // Kiểm tra kích thước file (giới hạn 5MB)
                        if (file.size > 5 * 1024 * 1024) {
                          alert("Kích thước ảnh không được vượt quá 5MB!");
                          return;
                        }

                        // Kiểm tra định dạng file
                        const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
                        if (!validTypes.includes(file.type)) {
                          alert("Chỉ chấp nhận file ảnh định dạng JPEG, PNG hoặc GIF!");
                          return;
                        }

                        // Tạo URL preview cho ảnh
                        const previewUrl = URL.createObjectURL(file);
                        setImagePreview(previewUrl);
                        setSelectedQuestion({ ...selectedQuestion, image: file });
                      }
                    }}
                    style={{
                      opacity: 0,
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      cursor: "pointer",
                      zIndex: 2
                    }}
                  />
                  <div style={{
                    textAlign: "center",
                    color: "#6c757d",
                    pointerEvents: "none"
                  }}>
                    <i className="bi bi-cloud-upload fs-4"></i>
                    <p style={{ margin: "0", fontSize: "14px" }}>Click to upload or drag and drop</p>
                    <p style={{ margin: "0", fontSize: "12px" }}>SVG, PNG, JPG (max. 800x400px)</p>
                  </div>
                </div>

                {(imagePreview || (selectedQuestion?.image && typeof selectedQuestion.image === "string")) && (
                  <div style={{
                    marginTop: "10px",
                    padding: "10px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "6px",
                    border: "1px solid #dee2e6"
                  }}>
                    <div className="d-flex align-items-center gap-2">
                      <img
                        src={imagePreview || selectedQuestion.image}
                        alt="Preview"
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                          borderRadius: "4px",
                          cursor: "pointer"
                        }}
                        onClick={() => {
                          setImagePreview(null);
                          setSelectedQuestion({ ...selectedQuestion, image: null });
                        }}
                      />
                      <div>
                        <p style={{
                          margin: "0",
                          fontSize: "14px",
                          color: "#198754",
                          fontWeight: "500"
                        }}>
                          <i className="bi bi-check-circle me-1"></i>
                          Image uploaded successfully
                        </p>
                        <button 
                          type="button"
                          className="btn btn-link p-0"
                          style={{
                            fontSize: "12px",
                            color: "#6c757d",
                            textDecoration: "none",
                            cursor: "default"
                          }}
                        >
                          Click image to remove preview
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer className="d-flex justify-content-end gap-2">
            <Button variant="light" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              disabled={isSubmitting}
              onClick={async () => {
                try {
                  if (!selectedQuestion.question_id) {
                    alert("Question ID is missing!");
                    return;
                  }
                  const result = await updateQuizQuestionWithAnswers(selectedQuestion);
                  if (result && result.returnCode === 1) {
                    alert("Quiz updated successfully!");
                    setShowEditModal(false);
                    setImagePreview(null);
                    
                    // Sửa phần này để lấy danh sách câu hỏi sau khi cập nhật
                    if (selectedQuizId) {
                      try {
                        const response = await getQuestionsByQuizId(
                          selectedQuizId,
                          questionCurrentPage,
                          questionPageSize,
                          questionSortBy,
                          questionSortAscending
                        );

                        if (response && response.items) {
                          setQuestions(response.items);
                          setQuestionTotalItems(response.totalItems || 0);
                          setQuestionTotalPages(response.totalPages || 0);
                        } else {
                          setQuestions([]);
                          setQuestionTotalItems(0);
                          setQuestionTotalPages(0);
                        }
                      } catch (error) {
                        console.error("Error fetching updated questions:", error);
                        setQuestions([]);
                        setQuestionTotalItems(0);
                        setQuestionTotalPages(0);
                      }
                    }
                  } else {
                    alert("Failed to update quiz: " + (result?.error || result?.ReturnMessage || "Unknown error"));
                  }
                } catch (error) {
                  alert("Error updating quiz: " + error.message);
                }
              }}
            >
              {isSubmitting ? "Updating..." : "Save Changes"}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Delete Modal */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} dialogClassName="custom-modal">
          <Modal.Header closeButton>
            <Modal.Title style={{ color: "white", fontWeight: "bold", fontSize: "20px" }}>Confirm Deletion</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <h4>Are you sure you want to delete Question: "<b>{selectedQuestion?.description}</b>"?</h4>
          <h5 className="text-danger"><b><i class="bi bi-exclamation-triangle"></i> Warning:</b> This action will permanently delete the <b><em>Question and all associated answers!</em></b></h5>
          </Modal.Body>
          <Modal.Footer className="d-flex justify-content-end gap-2">
            <Button variant="light" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={async () => {
                try {
                  if (!selectedQuestion?.question_id) {
                    alert("Question ID is missing!");
                    return;
                  }

                  const result = await deleteQuizQuestionWithAnswers(selectedQuestion.question_id);
                  if (result && result.returnCode === 1) {
                    alert("Question deleted successfully!");
                    setShowDeleteModal(false);

                    // Cập nhật lại danh sách câu hỏi sau khi xóa
                    if (selectedQuizId) {
                      try {
                        const newTotalItems = questionTotalItems - 1;
                        const newTotalPages = Math.ceil(newTotalItems / questionPageSize);
                        
                        if (questionCurrentPage > newTotalPages && newTotalPages > 0) {
                          setQuestionCurrentPage(newTotalPages);
                        } else if (newTotalPages === 0) {
                          setQuestionCurrentPage(1);
                        }

                        const response = await getQuestionsByQuizId(
                          selectedQuizId,
                          questionCurrentPage > newTotalPages ? newTotalPages || 1 : questionCurrentPage,
                          questionPageSize,
                          questionSortBy,
                          questionSortAscending
                        );

                        if (response && response.items) {
                          setQuestions(response.items);
                          setQuestionTotalItems(response.totalItems || 0);
                          setQuestionTotalPages(response.totalPages || 0);
                        } else {
                          setQuestions([]);
                          setQuestionTotalItems(0);
                          setQuestionTotalPages(0);
                        }
                      } catch (error) {
                        console.error("Error fetching updated questions after delete:", error);
                        setQuestions([]);
                        setQuestionTotalItems(0);
                        setQuestionTotalPages(0);
                      }
                    }
                  } else {
                    alert("Failed to delete question: " + (result?.error || result?.ReturnMessage || "Unknown error"));
                  }
                } catch (error) {
                  alert("Error deleting question: " + error.message);
                }
              }}
            >
              Delete
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Detail Modal */}
        <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} dialogClassName="custom-modal">
          <Modal.Header closeButton>
            <Modal.Title style={{ color: "white", fontWeight: "bold", fontSize: "20px" }}>View Answers</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Table striped responsive>
              <thead>
                <tr>
                  <th>Answer</th>
                  <th>Correct Answer</th>
                </tr>
              </thead>
              <tbody>
                {selectedQuestion?.answers?.map((answer, index) => (
                  <tr key={index}>
                    <td className="answer-cell">
                      <div className="answer-text" 
                        style={{
                          maxWidth: "200px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis"
                        }}
                        title={answer.description}
                      >
                        {answer.description}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${answer.correct_answer ? "bg-success" : "bg-danger"} badge-uniform`}>
                        {answer.correct_answer ? "True" : "False"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Modal.Body>
          <Modal.Footer className="d-flex justify-content-end gap-2">
            <Button variant="light" onClick={() => setShowDetailModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default QuizQuestionAnswerPage;