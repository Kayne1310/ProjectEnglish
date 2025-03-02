import React, { useState } from "react";
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

const QuizPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const quizzes = [
    {
      quiz: "Quiz Math",
      description: "Mathematics",
      country: "Vietnam",
      image: "Face2",
      difficulty: "Medium",
    },
  ];

  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz.quiz.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="main-panel">
      <div className="content-wrapper">
        <Row>
          <Col lg={12} className="grid-margin stretch-card">
            <Card>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="card-title fw-bold fs-2">QUIZ</h4>
                  <div
                    className="d-flex align-items-center gap-2"
                    style={{ maxWidth: "450px" }}
                  >
                    <Form.Control
                      type="text"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ maxWidth: "70%" }}
                    />
                    <Button
                      variant="primary"
                      onClick={() => setShowCreateModal(true)}
                    >
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
                        <td>{quiz.quiz}</td>
                        <td>{quiz.description}</td>
                        <td>{quiz.country}</td>
                        <td>
                          <img src={quiz.image} alt="quiz" width="50" />
                        </td>
                        <td>{quiz.difficulty}</td>
                        <td>
                          <i
                            className="bi bi-pencil-square text-warning me-3 fs-4"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              setSelectedQuiz(quiz);
                              setShowEditModal(true);
                            }}
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
        <Modal
          show={showCreateModal}
          onHide={() => setShowCreateModal(false)}
          dialogClassName="custom-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title>Create Quiz</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-2">
                <Form.Label>Quiz</Form.Label>
                <Form.Control type="text" placeholder="Enter your quiz" />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Description</Form.Label>
                <Form.Control type="text" placeholder="Enter your description" />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Country Name</Form.Label>
                <Form.Select>
                  <option>Select Country</option>
                  <option value={"Vietnam"}>Vietnam</option>
                  <option value={"Korea"}>Korea</option>
                  <option value={"China"}>China</option>
                  <option value={"Japan"}>Japan</option>
                  <option value={"UK"}>UK</option>
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
                <Form.Select>
                  <option>Select Difficulty</option>
                  <option value={"Esay"}>Easy</option>
                  <option value={"Medium"}>Medium</option>
                  <option value={"Hard"}>Hard</option>
                </Form.Select>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer className="d-flex justify-content-end gap-2">
            <Button variant="light" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button variant="primary">Submit</Button>
          </Modal.Footer>
        </Modal>

        {/* Edit Modal */}
        <Modal
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
          dialogClassName="custom-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit Quiz</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Quiz</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={selectedQuiz?.quiz}
                  placeholder="Enter your quiz"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={selectedQuiz?.description}
                  placeholder="Enter your description"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Country Name</Form.Label>
                <Form.Select defaultValue={selectedQuiz?.country}>
                  <option>Select Country</option>
                  <option>Vietnam</option>
                  <option>Korea</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
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
              <Form.Group className="mb-3">
                <Form.Label>Difficulty</Form.Label>
                <Form.Select defaultValue={selectedQuiz?.difficulty}>
                  <option>Select Difficulty</option>
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </Form.Select>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer className="d-flex justify-content-end gap-2">
            <Button variant="light" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button variant="primary">Save Changes</Button>
          </Modal.Footer>
        </Modal>

        {/* Delete Modal */}
        <Modal
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          dialogClassName="custom-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title>Confirm Deletion</Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center">
            <p>Do you want to delete this Quiz?</p>
          </Modal.Body>
          <Modal.Footer className="d-flex justify-content-end gap-2">
            <Button variant="light" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="primary">Delete</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default QuizPage;