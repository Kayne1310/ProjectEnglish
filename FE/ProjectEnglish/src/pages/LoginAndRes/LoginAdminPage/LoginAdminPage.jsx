import { useState } from "react";
import { Container, Row, Col, Form, Button, Image } from "react-bootstrap";
import logo from "../../../assets/image/logo.png";
import bear from "../../../assets/image/bear.jpeg";
import "./LoginAdminPage.css";

const LoginAdminPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = (e) => {
    setShowPassword(e.target.checked);
  };

  return (
    <div className="body">
      <Container
        fluid
        className="h-100 d-flex align-items-center justify-content-center"
      >
        <main className="bg-white rounded-4 shadow">
          <Row>
            <Col md={5} className="p-0 d-none d-md-block">
              <div className="left-side">
                <Image
                  src={bear}
                  alt="bear"
                  fluid
                  className="rounded-start-4"
                />
              </div>
            </Col>
            <Col md={7} className="p-4">
              <div className="logo-container text-center mb-3">
                <Image
                  src={logo}
                  alt="logo"
                  fluid
                  style={{ maxWidth: "150px" }}
                />
              </div>
              <h1 className="login-title text-center mb-1">Login Admin</h1>
              <h5 className="login-subtitle text-center mb-4">
                Sign in to experience Quizzet better.
              </h5>

              <div className="container w-75 mx-auto">
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter Email"
                      name="email"
                      required
                      className="rounded-3"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter Password"
                      name="password"
                      id="password"
                      required
                      className="rounded-3"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3 d-flex align-items-center">
                    <Form.Check
                      type="checkbox"
                      id="showPassword"
                      checked={showPassword}
                      onChange={handleShowPassword}
                      className="me-3"
                      label=""
                    />
                    <Form.Label htmlFor="showPassword" className="mb-0">
                      Show Password
                    </Form.Label>
                  </Form.Group>

                  <Button
                    variant="dark"
                    type="submit"
                    className="w-100 rounded-3"
                  >
                    Sign in
                  </Button>
                </Form>
              </div>
            </Col>
          </Row>
        </main>
      </Container>
    </div>
  );
};

export default LoginAdminPage;
