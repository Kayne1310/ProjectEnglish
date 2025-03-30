import { useState, useEffect } from "react";
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
  const [quizPageSize] = useState(7);
  const [quizSortBy, setQuizSortBy] = useState("name");
  const [quizSortAscending, setQuizSortAscending] = useState(true);
  const [quizTotalPages, setQuizTotalPages] = useState(0);
  const [quizTotalItems, setQuizTotalItems] = useState(0);

  // Pagination state cho QUIZ QUESTIONS
  const [questionCurrentPage, setQuestionCurrentPage] = useState(1);
  const [questionPageSize] = useState(7);
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

  const handleInputChange = (e, index = null) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setQuizData({ ...quizData, image: files[0] });
    } else if (index !== null) {
      const newAnswers = [...quizData.answers];
      if (name === "description") newAnswers[index].description = value;
      else if (name === "correct_answer") newAnswers[index].correct_answer = value === "true";
      setQuizData({ ...quizData, answers: newAnswers });
    } else {
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
    // Nếu đang submit thì không cho thực hiện tiếp
    if (isSubmitting) return;

    try {
      // Bật trạng thái loading
      setIsSubmitting(true);

      const result = await createQuizQuestionWithAnswers(quizData);
      if (result && result.returnCode === 1) {
        alert("Quiz created successfully!");
        setShowCreateModal(false);
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
        if (selectedQuizId) {
          const updatedQuestions = await getQuestionsByQuizId(selectedQuizId);
          setQuestions(updatedQuestions || []);
        }
      } else {
        alert("Failed to create quiz: " + (result.error || result.ReturnMessage));
      }
    } catch (error) {
      alert("An error occurred: " + error.message);
    } finally {
      // Tắt trạng thái loading dù thành công hay thất bại
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



  return (
    <div className="main-panel">
      <div className="content-wrapper">
        <Row className="h-100">
          <Col lg={4} className="grid-margin stretch-card">
            <Card className="h-100">
              <Card.Body className="d-flex flex-column">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="card-title fw-bold fs-2">ALL QUIZZES</h4>
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
                                verticalAlign: "middle"
                              }}
                              onClick={() => handleQuizClick(quiz.quiz_id)}
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
                    {quizTotalPages > 1 && (
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

          <Col lg={8} className="grid-margin stretch-card">
            <Card className="h-100">
              <Card.Body className="d-flex flex-column">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="card-title fw-bold fs-2">QUIZ QUESTIONS</h4>
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
                          Description <SortIcon field="description" />
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
        <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} dialogClassName="custom-modal">
          <Modal.Header closeButton>
            <Modal.Title>Create Quiz Question</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Quiz</Form.Label>
                <Form.Select
                  name="quiz_id"
                  value={quizData.quiz_id}
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
                <Form.Label>Question</Form.Label>
                <Form.Control
                  type="text"
                  name="description"
                  value={quizData.description}
                  onChange={handleInputChange}
                  placeholder="Enter your question"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Image</Form.Label>
                <Form.Control
                  type="file"
                  name="image"
                  onChange={handleInputChange}
                  accept="image/*"
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
            </Form>
          </Modal.Body>
          <Modal.Footer className="d-flex justify-content-end gap-2">
            <Button variant="light" onClick={() => setShowCreateModal(false)}>
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
            <Modal.Title>Edit Quiz Question</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Quiz</Form.Label>
                <Form.Select
                  name="quiz_id"
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
                <Form.Label>Question</Form.Label>
                <Form.Control
                  type="text"
                  name="description"
                  value={selectedQuestion?.description || ""}
                  onChange={(e) => setSelectedQuestion({ ...selectedQuestion, description: e.target.value })}
                  placeholder="Enter your question"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Image</Form.Label>
                <Form.Control
                  type="file"
                  name="image"
                  onChange={(e) => setSelectedQuestion({ ...selectedQuestion, image: e.target.files[0] })}
                  accept="image/*"
                />
                {selectedQuestion?.image && typeof selectedQuestion.image === "string" && (
                  <div className="d-flex justify-content-center mt-2">
                    <img src={selectedQuestion.image} alt="Current question image" width="100" />
                  </div>
                )}
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
            </Form>
          </Modal.Body>
          <Modal.Footer className="d-flex justify-content-end gap-2">
            <Button variant="light" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
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
                    if (selectedQuizId) {
                      const updatedQuestions = await getQuestionsByQuizId(selectedQuizId);
                      setQuestions(updatedQuestions || []);
                    }
                  } else {
                    alert("Failed to update quiz: " + (result?.error || result?.ReturnMessage || "Unknown error"));
                  }
                } catch (error) {
                  alert("Error updating quiz: " + error.message);
                }
              }}
            >
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Delete Modal */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} dialogClassName="custom-modal">
          <Modal.Header closeButton>
            <Modal.Title>Confirm Deletion</Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center">
            <p>Do you want to delete this Question?</p>
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
                  await deleteQuizQuestionWithAnswers(selectedQuestion.question_id);
                  setShowDeleteModal(false);
                  // xử lý load UI khi xóa question bằng cách gọi lại id quiz để lấy lại danh sách câu hỏi mới nhất
                  if (selectedQuizId) {
                    const updatedQuestions = await getQuestionsByQuizId(selectedQuizId);
                    setQuestions(updatedQuestions || []);
                  }
                } catch (error) {
                  alert("Failed to delete question: " + error.message);
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
            <Modal.Title>View Answers</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Table striped>
              <thead>
                <tr>
                  <th>Answer</th>
                  <th>Correct Answer</th>
                </tr>
              </thead>
              <tbody>
                {selectedQuestion?.answers?.map((answer, index) => (
                  <tr key={index}>
                    <td>{answer.description}</td>
                    <td>
                      <span
                        className={`badge ${answer.correct_answer ? "bg-success" : "bg-danger"} badge-uniform`}
                      >
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