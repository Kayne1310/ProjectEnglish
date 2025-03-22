import { useContext, useState } from 'react';
import logo from '../../../assets/image/logo.png';
import bear from '../../../assets/image/bear.jpeg';
import { AuthContext } from '../../../components/layout/context/authContext';
import { handleLoginAdmin } from '../../../helpers/authHandlers';
import { useNavigate } from 'react-router-dom';
import Loading from 'react-loading';
import { Container, Row, Col, Form, Button, Image } from "react-bootstrap";

const LoginAdminPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLoginAdmin(email, password, setError, setIsLoading, setUser, navigate);
  };

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
              <div className="left-side" style={{ height: '100%', overflow: 'hidden' }}>
                <Image
                  src={bear}
                  alt="bear"
                  fluid
                  className="rounded-start-4"
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover' 
                  }}
                />
              </div>
            </Col>
            <Col md={7} className="p-4">
              <div className="logo-container text-center mb-2">
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
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-1">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="rounded-3"
                    />
                  </Form.Group>

                  <Form.Group className="mb-1">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="rounded-3"
                    />
                    <Form.Check 
                      type="checkbox"
                      label="Show Password"
                      checked={showPassword}
                      onChange={handleShowPassword}
                      className="mt-2"
                    />
                  </Form.Group>

                  <Button
                    variant="dark"
                    type="submit"
                    className="w-100 rounded-3"
                  >
                    Sign in
                  </Button>
                  {isLoading && (
                    <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
                      <Loading type="spin" color="#13d420" height={30} width={30} />
                    </div>
                  )}
                  {!isLoading && error && <p style={{ color: "red" }}>{error}</p>}
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