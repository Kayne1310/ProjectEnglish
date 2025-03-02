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


const QuizQuestionAnswerPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const questions = [
    { quiz: "Quiz Math", question: "1 + 1 = ?", image: "Face1" },
  ];

  const filteredQuestions = questions.filter((q) =>
    q.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="main-panel">
      <div className="content-wrapper">
        <Row>
          <Col lg={12} className="grid-margin stretch-card">
            <Card>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="card-title fw-bold fs-2">QUIZ QUESTION</h4>
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
                      <th>Question</th>
                      <th>Answer</th>
                      <th>Image</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredQuestions.map((q, index) => (
                      <tr key={index}>
                        <td>{q.quiz}</td>
                        <td>{q.question}</td>
                        <td>
                          <a
                            style={{ color: "blue", cursor: "pointer" }}
                            onClick={() => setShowDetailModal(true)}
                          >
                            detail
                          </a>
                        </td>
                        <td>
                          <img src={q.image} alt="question" width="50" />
                        </td>
                        <td>
                          <i
                            className="bi bi-pencil-square text-warning me-3 fs-4"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              setSelectedQuestion(q);
                              setShowEditModal(true);
                            }}
                          />
                          <i
                            className="bi bi-trash text-danger fs-4"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              setSelectedQuestion(q);
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
            <Modal.Title>Create Quiz Question</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Question</Form.Label>
                <Form.Control type="text" placeholder="Enter your question" />
              </Form.Group>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Answer 1</Form.Label>
                    <Form.Control type="text" placeholder="Answer 1" />
                    <Form.Select className="mt-2">
                      <option>Select status</option>
                      <option value={"true"}>True</option>
                      <option value={"false"}>False</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Answer 2</Form.Label>
                    <Form.Control type="text" placeholder="Answer 2" />
                    <Form.Select className="mt-2">
                      <option>Select status</option>
                      <option value={"true"}>True</option>
                      <option value={"false"}>False</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Answer 3</Form.Label>
                    <Form.Control type="text" placeholder="Answer 3" />
                    <Form.Select className="mt-2">
                      <option>Select status</option>
                      <option value={"true"}>True</option>
                      <option value={"false"}>False</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Answer 4</Form.Label>
                    <Form.Control type="text" placeholder="Answer 4" />
                    <Form.Select className="mt-2">
                      <option>Select status</option>
                      <option value={"true"}>True</option>
                      <option value={"false"}>False</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
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
            <Modal.Title>Edit Quiz Question</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Question</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={selectedQuestion?.question}
                  placeholder="Enter your question"
                />
              </Form.Group>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Answer 1</Form.Label>
                    <Form.Control type="text" placeholder="Answer 1" />
                    <Form.Select className="mt-2">
                      <option>Select status</option>
                      <option>True</option>
                      <option>False</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Answer 2</Form.Label>
                    <Form.Control type="text" placeholder="Answer 2" />
                    <Form.Select className="mt-2">
                      <option>Select status</option>
                      <option>True</option>
                      <option>False</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Answer 3</Form.Label>
                    <Form.Control type="text" placeholder="Answer 3" />
                    <Form.Select className="mt-2">
                      <option>Select status</option>
                      <option>True</option>
                      <option>False</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Answer 4</Form.Label>
                    <Form.Control type="text" placeholder="Answer 4" />
                    <Form.Select className="mt-2">
                      <option>Select status</option>
                      <option>True</option>
                      <option>False</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
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
            <p>Do you want to delete this Question?</p>
          </Modal.Body>
          <Modal.Footer className="d-flex justify-content-end gap-2">
            <Button variant="light" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="primary">Delete</Button>
          </Modal.Footer>
        </Modal>

        {/* Detail Modal */}
        <Modal
          show={showDetailModal}
          onHide={() => setShowDetailModal(false)}
          dialogClassName="custom-modal"
        >
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
                <tr>
                  <td>= 2</td>
                  <td>
                    <span className="badge bg-success badge-uniform">True</span>
                  </td>
                </tr>
                <tr>
                  <td>= 1</td>
                  <td>
                    <span className="badge bg-danger badge-uniform">False</span>
                  </td>
                </tr>
                <tr>
                  <td>= 3</td>
                  <td>
                    <span className="badge bg-danger badge-uniform">False</span>
                  </td>
                </tr>
                <tr>
                  <td>= 4</td>
                  <td>
                    <span className="badge bg-danger badge-uniform">False</span>
                  </td>
                </tr>
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