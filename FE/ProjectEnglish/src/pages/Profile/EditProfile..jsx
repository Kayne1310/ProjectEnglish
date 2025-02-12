import { Row, Col, Card, Form, Button, Breadcrumb } from "react-bootstrap";
import "../../assets/css/Profile/edit-profile.css"; // Import CSS tùy chỉnh
import avatar from "../../assets/image/default-avatar.png";

const EditProfile = () => {
  return (
    <div className="editprofile-body">
      <div className="container py-4 editprofile-container">
        {/* Breadcrumb */}
        <Breadcrumb>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item active>Edit Profile</Breadcrumb.Item>
        </Breadcrumb>

        <Row className="g-3">
          {/* Profile Card */}
          <Col lg={4}>
            <Card className="h-100">
              <Card.Body className="text-center">
                <div className="editprofile-user-profile">
                  <div className="editprofile-user-avatar mb-3">
                    <img
                      src={avatar}
                      className="rounded-circle img-fluid"
                      alt="User Avatar"
                    />
                  </div>
                  <h5 className="editprofile-user-name">Yuki Hayashi</h5>
                  <h6 className="editprofile-user-email text-muted">
                    yuki@Maxwell.com
                  </h6>
                  <div className="editprofile-about mt-3">
                    <h5>About</h5>
                    <p>I&apos;m Yuki, a Full Stack Designer...</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Edit Form */}
          <Col lg={8}>
            <Card className="h-100">
              <Card.Body>
                <h6 className="mb-3 text-primary">Personal Details</h6>
                <Form>
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Label htmlFor="fullName">Full Name</Form.Label>
                      <Form.Control
                        type="text"
                        id="fullName"
                        placeholder="Enter full name"
                      />
                    </Col>
                    <Col md={6}>
                      <Form.Label htmlFor="eMail">Email</Form.Label>
                      <Form.Control
                        type="email"
                        id="eMail"
                        placeholder="Enter email ID"
                      />
                    </Col>
                    <Col md={6}>
                      <Form.Label htmlFor="phone">Phone</Form.Label>
                      <Form.Control
                        type="text"
                        id="phone"
                        placeholder="Enter phone number"
                      />
                    </Col>
                    <Col md={6}>
                      <Form.Label htmlFor="website">Website URL</Form.Label>
                      <Form.Control
                        type="url"
                        id="website"
                        placeholder="Website url"
                      />
                    </Col>
                  </Row>

                  <h6 className="mt-4 mb-3 text-primary">Address</h6>
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Label htmlFor="Street">Street</Form.Label>
                      <Form.Control
                        type="text"
                        id="Street"
                        placeholder="Enter Street"
                      />
                    </Col>
                    <Col md={6}>
                      <Form.Label htmlFor="ciTy">City</Form.Label>
                      <Form.Control
                        type="text"
                        id="ciTy"
                        placeholder="Enter City"
                      />
                    </Col>
                    <Col md={6}>
                      <Form.Label htmlFor="sTate">State</Form.Label>
                      <Form.Control
                        type="text"
                        id="sTate"
                        placeholder="Enter State"
                      />
                    </Col>
                    <Col md={6}>
                      <Form.Label htmlFor="zIp">Zip Code</Form.Label>
                      <Form.Control
                        type="text"
                        id="zIp"
                        placeholder="Zip Code"
                      />
                    </Col>
                  </Row>

                  <div className="d-flex justify-content-end mt-4">
                    <Button variant="secondary" className="me-2">
                      Cancel
                    </Button>
                    <Button variant="primary">Update</Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default EditProfile;
