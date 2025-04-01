import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Table,
  Form,
  Button,
  Modal,
  Alert,
  Pagination,
} from "react-bootstrap";
import { getAllQuiz } from "../../../service/QuestionWithAnswersService";
import { createQuiz, updateQuiz, deleteQuizWithQuestionsAndAnswers } from "../../../service/QuizletService";

const QuizPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState('name');
  const [sortAscending, setSortAscending] = useState(true);
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
        setError("Không tìm thấy ID của Quiz cần xóa!");
        return;
      }

      // Gọi API để xóa quiz
      await deleteQuizWithQuestionsAndAnswers(selectedQuiz.quiz_id);

      // Tính toán lại currentPage sau khi xóa
      const newTotalItems = totalItems - 1;
      const newTotalPages = Math.ceil(newTotalItems / pageSize);
      
      // Nếu xóa item cuối cùng của trang hiện tại và không phải trang đầu tiên
      if (quizzes.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else if (currentPage > newTotalPages) {
        setCurrentPage(newTotalPages);
      }

      // Cập nhật danh sách quiz sau khi xóa
      const updatedQuizList = await getAllQuiz(
        currentPage > newTotalPages ? newTotalPages : currentPage, 
        pageSize, 
        sortBy, 
        sortAscending
      );

      if (updatedQuizList && updatedQuizList.items) {
        setQuizzes(updatedQuizList.items);
        setTotalItems(updatedQuizList.totalItems);
        setTotalPages(updatedQuizList.totalPages);
      }

      // Đóng modal và reset state
      setShowDeleteModal(false);
      setSelectedQuiz(null);
      setError(null);

      // Hiển thị thông báo thành công
      alert("Xóa Quiz thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa quiz:", error);
      setError("Không thể xóa Quiz: " + (error.response?.data?.message || error.message));
      setShowDeleteModal(false);
    }
  };

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await getAllQuiz(currentPage, pageSize, sortBy, sortAscending);
        setQuizzes(response.items);
        setTotalItems(response.totalItems);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
        setError("Failed to fetch quizzes: " + error.message);
      }
    };

    fetchQuizzes();
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

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Lọc quiz dựa trên search term, xử lý lỗi toLowerCase
  const filteredQuizzes = Array.isArray(quizzes) ? quizzes.filter((quiz) =>
    quiz?.name?.toLowerCase().includes(searchTerm.toLowerCase() || "")
  ) : [];

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

  // Thêm hàm xử lý xóa preview
  const handleRemovePreview = () => {
    setImagePreview(null);
    // Reset file input trong form tạo mới hoặc chỉnh sửa
    if (showCreateModal) {
      setNewQuiz({ ...newQuiz, image: null });
    } else if (showEditModal) {
      setEditQuiz({ ...editQuiz, image: null });
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  // Xử lý submit form tạo quiz
  const handleCreateQuiz = async (e) => {
    if (isSubmitting) return;

    e.preventDefault();

    // Validation đầy đủ
    if (!newQuiz.name.trim()) {
      setError("Vui lòng nhập tên Quiz!");
      return;
    }
    if (!newQuiz.description.trim()) {
      setError("Vui lòng nhập mô tả Quiz!");
      return;
    }
    if (!newQuiz.countryName) {
      setError("Vui lòng chọn quốc gia!");
      return;
    }
    if (!newQuiz.difficulty) {
      setError("Vui lòng chọn độ khó!");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await createQuiz(newQuiz);
      if (response && !response.error) {
        // Cập nhật danh sách quiz sau khi tạo
        const updatedQuizList = await getAllQuiz(currentPage, pageSize, sortBy, sortAscending);
        if (updatedQuizList && updatedQuizList.items) {
          setQuizzes(updatedQuizList.items);
          setTotalItems(updatedQuizList.totalItems);
          setTotalPages(updatedQuizList.totalPages);
        }

        // Reset form và đóng modal
        setShowCreateModal(false);
        setNewQuiz({
          name: "",
          description: "",
          countryName: "",
          difficulty: "",
          image: null
        });
        setImagePreview(null);
        setError(null);

        // Hiển thị thông báo thành công
        alert("Tạo Quiz thành công!");
      } else {
        setError("Không thể tạo Quiz. Vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Lỗi khi tạo quiz:", error);
      setError("Đã xảy ra lỗi khi tạo Quiz: " + (error.response?.data?.message || error.message));
    } finally {
      setIsSubmitting(false);
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

    // Validation đầy đủ
    if (!editQuiz.name.trim()) {
      setError("Vui lòng nhập tên Quiz!");
      return;
    }
    if (!editQuiz.description.trim()) {
      setError("Vui lòng nhập mô tả Quiz!");
      return;
    }
    if (!editQuiz.countryName) {
      setError("Vui lòng chọn quốc gia!");
      return;
    }
    if (!editQuiz.difficulty) {
      setError("Vui lòng chọn độ khó!");
      return;
    }

    try {
      const quizData = {
        quiz_id: selectedQuiz.quiz_id,
        name: editQuiz.name,
        description: editQuiz.description,
        image: editQuiz.image,
        difficulty: editQuiz.difficulty,
        countryName: editQuiz.countryName,
      };

      const response = await updateQuiz(quizData);
      if (response && !response.error) {
        // Cập nhật danh sách quiz sau khi edit
        const updatedQuizList = await getAllQuiz(currentPage, pageSize, sortBy, sortAscending);
        if (updatedQuizList && updatedQuizList.items) {
          setQuizzes(updatedQuizList.items);
          setTotalItems(updatedQuizList.totalItems);
          setTotalPages(updatedQuizList.totalPages);
        }

        // Reset form và đóng modal
        setShowEditModal(false);
        setEditQuiz({
          name: "",
          description: "",
          countryName: "",
          difficulty: "",
          image: null
        });
        setImagePreview(null);
        setError(null);

        // Hiển thị thông báo thành công
        alert("Cập nhật Quiz thành công!");
      } else {
        setError("Không thể cập nhật Quiz. Vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật quiz:", error);
      setError("Đã xảy ra lỗi khi cập nhật Quiz: " + (error.response?.data?.message || error.message));
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
                      <th
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleSort('name')}
                      >
                        Quiz <SortIcon field="name" />
                      </th>
                      <th>Description</th>
                      <th
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleSort('countryName')}
                      >
                        Country Name <SortIcon field="countryName" />
                      </th>
                      <th>Image</th>
                      <th
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleSort('difficulty')}
                      >
                        Difficulty <SortIcon field="difficulty" />
                      </th>
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

        {/* Create Modal */}
        <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title style={{ color: "white", fontWeight: "bold", fontSize: "20px" }}>Create New Quiz</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleCreateQuiz}>
              <Form.Group className="mb-2">
                <Form.Label>Quiz Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Quiz Name"
                  value={newQuiz.name}
                  onChange={(e) => setNewQuiz({ ...newQuiz, name: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Description Quiz"
                  value={newQuiz.description}
                  onChange={(e) => setNewQuiz({ ...newQuiz, description: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Language</Form.Label>
                <Form.Select
                  value={newQuiz.countryName}
                  onChange={(e) => setNewQuiz({ ...newQuiz, countryName: e.target.value })}
                  style={{ height: "46px" }}
                  required
                >
                  <option value="">Select Language</option>
                  <option value="Vietnam">Vietnamese</option>
                  <option value="Korea">Korean</option>
                  <option value="China">Chinese</option>
                  <option value="Japan">Japanese</option>
                  <option value="UK">English</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Difficulty</Form.Label>
                <Form.Select
                  value={newQuiz.difficulty}
                  onChange={(e) => setNewQuiz({ ...newQuiz, difficulty: e.target.value })}
                  style={{ height: "46px" }}
                  required
                >
                  <option value="">Select Difficulty</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label style={{
                  fontWeight: "bold",
                  fontSize: "16px",
                  color: "#4B49AC",
                  marginBottom: "8px"
                }}>
                  Quiz Image
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
                    accept="image/*"
                    onChange={handleImageChange}
                    required
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

                {imagePreview && (
                  <div style={{
                    marginTop: "10px",
                    padding: "10px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "6px",
                    border: "1px solid #dee2e6"
                  }}>
                    <div className="d-flex align-items-center gap-2">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                          borderRadius: "4px",
                          cursor: "pointer"
                        }}
                        onClick={handleRemovePreview}
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
                        <p style={{
                          margin: "0",
                          fontSize: "12px",
                          color: "#6c757d"
                        }}>
                          Click image to remove
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </Form.Group>
              <Modal.Footer className="d-flex justify-content-end gap-2 pr-0">
                <Button variant="light" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create"}
                </Button>
              </Modal.Footer>
            </Form>
          </Modal.Body>
        </Modal>

        {/* Edit Modal */}
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title style={{ color: "white", fontWeight: "bold", fontSize: "20px" }}>Edit Quiz</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleUpdateQuiz}>
              <Form.Group className="mb-2">
                <Form.Label>Quiz Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Quiz Name"
                  value={editQuiz.name}
                  onChange={(e) => setEditQuiz({ ...editQuiz, name: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Description Quiz"
                  value={editQuiz.description}
                  onChange={(e) => setEditQuiz({ ...editQuiz, description: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Language</Form.Label>
                <Form.Select
                  value={editQuiz.countryName}
                  onChange={(e) => setEditQuiz({ ...editQuiz, countryName: e.target.value })}
                  style={{ height: "46px" }}
                  required
                >
                  <option value="">Select Language</option>
                  <option value="Vietnam">Vietnamese</option>
                  <option value="Korea">Korean</option>
                  <option value="China">Chinese</option>
                  <option value="Japan">Japanese</option>
                  <option value="UK">English</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Difficulty</Form.Label>
                <Form.Select
                  value={editQuiz.difficulty}
                  onChange={(e) => setEditQuiz({ ...editQuiz, difficulty: e.target.value })}
                  style={{ height: "46px" }}
                  required
                >
                  <option value="">Select Difficulty</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label style={{
                  fontWeight: "bold",
                  fontSize: "16px",
                  color: "#4B49AC",
                  marginBottom: "8px"
                }}>
                  Quiz Image
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
                    accept="image/*"
                    onChange={handleImageChange}
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

                {imagePreview && (
                  <div style={{
                    marginTop: "10px",
                    padding: "10px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "6px",
                    border: "1px solid #dee2e6"
                  }}>
                    <div className="d-flex align-items-center gap-2">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                          borderRadius: "4px",
                          cursor: "pointer"
                        }}
                        onClick={handleRemovePreview}
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
                        <p style={{
                          margin: "0",
                          fontSize: "12px",
                          color: "#6c757d"
                        }}>
                          Click image to remove
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </Form.Group>
              <Modal.Footer className="d-flex justify-content-end gap-2 pr-0">
                <Button variant="light" onClick={() => setShowEditModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Save changes
                </Button>
              </Modal.Footer>
            </Form>
          </Modal.Body>
        </Modal>

        {/* Delete Modal */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title style={{ color: "white", fontWeight: "bold", fontSize: "20px" }}>Confirm Quiz deletion</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>Are you sure you want to delete Quiz: "<b>{selectedQuiz?.name}</b>"?</h4>
            <h5 className="text-danger"><b><i class="bi bi-exclamation-triangle"></i> Warning:</b> This action will permanently delete the <b><em>Quiz and all associated questions!</em></b></h5>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="light" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteQuiz}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default QuizPage;