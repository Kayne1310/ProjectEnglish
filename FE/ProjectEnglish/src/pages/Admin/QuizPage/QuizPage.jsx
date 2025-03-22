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
  Alert,
} from "react-bootstrap";
import { getAllQuiz } from "../../../service/QuestionWithAnswersService";
import { createQuiz, updateQuiz, deleteQuizWithQuestionsAndAnswers } from "../../../service/QuizzService";

const QuizPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [newQuiz, setNewQuiz] = useState({
    name: "",
    description: "",
    countryName: "",
    difficulty: "",
    image: null,
  });
  const [editQuiz, setEditQuiz] = useState({
    name: "",
    description: "",
    countryName: "",
    difficulty: "",
    image: null,
  });
  const [error, setError] = useState(null);
  // Xử lý xóa quiz
  const handleDeleteQuiz = async () => {
    try {
      if (!selectedQuiz?.quiz_id) {
        setError("Quiz ID is missing!");
        return;
      }

      // Gọi API để xóa quiz cùng với các câu hỏi và đáp án
      await deleteQuizWithQuestionsAndAnswers(selectedQuiz.quiz_id);

      // Cập nhật danh sách quiz sau khi xóa
      const updatedQuizList = await getAllQuiz();
      setQuizzes(updatedQuizList || []);

      // Đóng modal và reset state
      setShowDeleteModal(false);
      setSelectedQuiz(null);
      setError(null);
    } catch (error) {
      console.error("Failed to delete quiz:", error);
      setError("Failed to delete quiz: " + (error.response?.data?.message || error.message));
    }
  };

  // Gọi API để lấy danh sách quiz khi component mount
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const data = await getAllQuiz();
        setQuizzes(data);
      } catch (error) {
        setQuizzes([]); // Đặt mảng rỗng nếu có lỗi
      }
    };
    fetchQuizzes();
  }, []);

  // Lọc quiz dựa trên search term, xử lý lỗi toLowerCase
  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz?.name?.toLowerCase().includes(searchTerm.toLowerCase() || "")
  );

  // Xử lý thay đổi file ảnh (chung cho cả create và edit)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      // Kiểm tra xem đang ở chế độ create hay edit để cập nhật state tương ứng
      if (showCreateModal) {
        setNewQuiz({ ...newQuiz, image: file });
      } else if (showEditModal) {
        setEditQuiz({ ...editQuiz, image: file });
      }
    }
  };

  // Xử lý submit form tạo quiz
  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    if (!newQuiz.name.trim()) {
      setError("Quiz name is required!");
      return;
    }
    if (!newQuiz.description.trim()) {
      setError("Description is required!");
      return;
    }
    try {
      const response = await createQuiz(newQuiz);
      if (response && !response.error) {
        setQuizzes([...quizzes, response]); // Thêm quiz mới vào danh sách
        setShowCreateModal(false); // Đóng modal
        setNewQuiz({ name: "", description: "", countryName: "", difficulty: "", image: null }); // Reset form
        setImagePreview(null); // Reset preview
        setError(null); // Xóa lỗi
        alert("Create Quiz Successful");

        // Cập nhật danh sách quiz sau khi create
        const updatedQuizList = await getAllQuiz();
        setQuizzes(updatedQuizList || []);
      } else {
        setError("Failed to create quiz. Please try again.");
      }
    } catch (error) {
      console.error("Failed to create quiz:", error);
      setError("An error occurred while creating the quiz.");
    }
  };

  // Xử lý khi mở modal Edit
  const handleEditClick = (quiz) => {
    setSelectedQuiz(quiz);
    setEditQuiz({
      name: quiz.name || "",
      description: quiz.description || "",
      countryName: quiz.countryName || "",
      difficulty: quiz.difficulty || "",
      image: null, // Không tự động set image, người dùng có thể chọn lại
    });
    setImagePreview(quiz.image ? quiz.image : null); // Preview image hiện tại
    setShowEditModal(true);
  };

  // Xử lý submit form Edit (cập nhật quiz)
  const handleUpdateQuiz = async (e) => {
    e.preventDefault();
    if (!editQuiz.name.trim()) {
      setError("Quiz name is required!");
      return;
    }
    if (!editQuiz.description.trim()) {
      setError("Description is required!");
      return;
    }
    try {
      const quizData = {
        quiz_id: selectedQuiz.quiz_id, // Lấy quiz_id từ quiz được chọn
        name: editQuiz.name,
        description: editQuiz.description,
        image: editQuiz.image,
        difficulty: editQuiz.difficulty,
        countryName: editQuiz.countryName,
      };
      const response = await updateQuiz(quizData); // Gọi updateQuiz với quizData
      if (response && !response.error) {
        // Cập nhật danh sách quizzes
        setQuizzes(quizzes.map((quiz) =>
          quiz.quiz_id === response.quiz_id ? response : quiz
        ));
        setShowEditModal(false); // Đóng modal
        setEditQuiz({ name: "", description: "", countryName: "", difficulty: "", image: null }); // Reset form
        setImagePreview(null); // Reset preview
        setError(null); // Xóa lỗi
        console.log("check res: ", response)
        alert("Update quiz successful");
        
        // Cập nhật danh sách quiz sau khi create
        const updatedQuizList = await getAllQuiz();
        setQuizzes(updatedQuizList || []);
      } else {
        setError("Failed to update quiz. Please try again.");
      }
    } catch (error) {
      console.error("Failed to update quiz:", error);
      setError("An error occurred while updating the quiz.");
    }
  };

  return (
    <div className="main-panel">
      <div className="content-wrapper">
        {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
        <Row>
          <Col lg={12} className="grid-margin stretch-card">
            <Card>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="card-title fw-bold fs-2">QUIZ</h4>
                  <div className="d-flex align-items-center gap-2" style={{ maxWidth: "450px" }}>
                    <Form.Control
                      type="text"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ maxWidth: "70%" }}
                    />
                    <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                      Create
                    </Button>
                  </div>
                </div>
                <Table striped responsive>
                  <thead>
                    <tr>
                      <th>Quiz</th>
                      <th>Description</th>
                      <th>Country Name</th>
                      <th>Image</th>
                      <th>Difficulty</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredQuizzes.map((quiz, index) => (
                      <tr key={index}>
                        <td>{quiz.name || "No name"}</td>
                        <td>{quiz.description || "No description"}</td>
                        <td>{quiz.countryName || "No country"}</td>
                        <td>
                          <img src={quiz.image || "default_image_url"} alt="quiz" width="50" />
                        </td>
                        <td>{quiz.difficulty || "No difficulty"}</td>
                        <td>
                          <i
                            className="bi bi-pencil-square text-warning me-3 fs-4"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleEditClick(quiz)}
                          />
                          <i
                            className="bi bi-trash text-danger fs-4"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              setSelectedQuiz(quiz);
                              setShowDeleteModal(true);
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Create Modal */}
        <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Create Quiz</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleCreateQuiz}>
              <Form.Group className="mb-2">
                <Form.Label>Quiz Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter quiz name"
                  value={newQuiz.name}
                  onChange={(e) => setNewQuiz({ ...newQuiz, name: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your description"
                  value={newQuiz.description}
                  onChange={(e) => setNewQuiz({ ...newQuiz, description: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Country Name</Form.Label>
                <Form.Select
                  value={newQuiz.countryName}
                  onChange={(e) => setNewQuiz({ ...newQuiz, countryName: e.target.value })}
                  required
                >
                  <option value="">Select Country</option>
                  <option value="Vietnam">Vietnam</option>
                  <option value="Korea">Korea</option>
                  <option value="China">China</option>
                  <option value="Japan">Japan</option>
                  <option value="UK">UK</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Image Quiz</Form.Label>
                <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="mt-2"
                    style={{ maxWidth: "100%", height: "auto" }}
                  />
                )}
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Difficulty</Form.Label>
                <Form.Select
                  value={newQuiz.difficulty}
                  onChange={(e) => setNewQuiz({ ...newQuiz, difficulty: e.target.value })}
                  required
                >
                  <option value="">Select Difficulty</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </Form.Select>
              </Form.Group>
              <Modal.Footer className="d-flex justify-content-end gap-2">
                <Button variant="light" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </Modal.Footer>
            </Form>
          </Modal.Body>
        </Modal>

        {/* Edit Modal */}
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Quiz</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleUpdateQuiz}>
              <Form.Group className="mb-2">
                <Form.Label>Quiz Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter quiz name"
                  value={editQuiz.name}
                  onChange={(e) => setEditQuiz({ ...editQuiz, name: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your description"
                  value={editQuiz.description}
                  onChange={(e) => setEditQuiz({ ...editQuiz, description: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Country Name</Form.Label>
                <Form.Select
                  value={editQuiz.countryName}
                  onChange={(e) => setEditQuiz({ ...editQuiz, countryName: e.target.value })}
                  required
                >
                  <option value="">Select Country</option>
                  <option value="Vietnam">Vietnam</option>
                  <option value="Korea">Korea</option>
                  <option value="China">China</option>
                  <option value="Japan">Japan</option>
                  <option value="UK">UK</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Image Quiz</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="mt-2"
                    style={{ maxWidth: "100%", height: "auto" }}
                  />
                )}
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Difficulty</Form.Label>
                <Form.Select
                  value={editQuiz.difficulty}
                  onChange={(e) => setEditQuiz({ ...editQuiz, difficulty: e.target.value })}
                  required
                >
                  <option value="">Select Difficulty</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </Form.Select>
              </Form.Group>
              <Modal.Footer className="d-flex justify-content-end gap-2">
                <Button variant="light" onClick={() => setShowEditModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Save Changes
                </Button>
              </Modal.Footer>
            </Form>
          </Modal.Body>
        </Modal>

        {/* Delete Modal */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Deletion</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Do you want to delete this Quiz?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="light" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleDeleteQuiz}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default QuizPage;