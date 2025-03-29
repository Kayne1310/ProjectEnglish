import React, { useState, useEffect } from "react";
import {
  Container,
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

const QuizQuestionAnswerPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [questions, setQuestions] = useState([]);
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
        const quizList = await getAllQuiz();
        console.log("Raw API Response from getAllQuiz:", quizList);
        setQuizzes(Array.isArray(quizList) ? quizList : quizList.data || []);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };
    fetchQuizzes();
  }, []);

  useEffect(() => {
    if (selectedQuizId) {
      const fetchQuestions = async () => {
        try {
          const questionList = await getQuestionsByQuizId(selectedQuizId);
          console.log("Questions Data for Quiz ID", selectedQuizId, ":", questionList);
          setQuestions(questionList || []); // Đảm bảo luôn set mảng, tránh undefined
        } catch (error) {
          console.error("Error fetching questions for Quiz ID", selectedQuizId, ":", error);
          setQuestions([]); // Đặt về mảng rỗng nếu có lỗi
        }
      };
      fetchQuestions();
    } else {
      setQuestions([]);
    }
  }, [selectedQuizId]);

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

  return (
    <div className="main-panel">
      <div className="content-wrapper">
        <Row>
          <Col lg={4} className="grid-margin stretch-card">
            <Card>
              <Card.Body>
                <h4 className="card-title fw-bold fs-2">ALL QUIZZES</h4>
                <Table striped responsive>
                  <thead>
                    <tr>
                      <th>Quiz Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quizzes.length > 0 ? (
                      quizzes.map((quiz) => (
                        <tr key={quiz.quiz_id}>
                          <td
                            style={{ cursor: "pointer", fontSize: 15 }}
                            onClick={() => handleQuizClick(quiz.quiz_id)}
                          >
                            {quiz.name}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td>No quizzes available</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={8} className="grid-margin stretch-card">
            <Card>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <h4 className="card-title fw-bold fs-2">QUIZ QUESTIONS</h4>
                  <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                    Create
                  </Button>
                </div>
                <Table striped responsive>
                  <thead>
                    <tr>
                      <th>Question</th>
                      <th>Image</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {questions.length > 0 ? (
                      questions.map((q, index) => (
                        <tr key={q.question_id || index}>
                          <td
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
                              setShowDetailModal(true);
                            }}
                          >
                            {q.description}
                          </td>
                          <td>
                            {q.image && <img src={q.image} alt="question" width="50" />}
                          </td>
                          <td>
                            <i
                              className="bi bi-pencil-square text-warning me-3 fs-4"
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                setSelectedQuestion({
                                  ...q,
                                  question_id: q.question_id,
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
                        <td colSpan="3">
                          {selectedQuizId
                            ? "No questions available for this quiz."
                            : "Please select a quiz to view questions."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
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