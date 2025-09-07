import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Card, Row, Col } from "react-bootstrap";

function LoginPage() {
  const [role, setRole] = useState("student"); // default role
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (role === "admin") {
      navigate("/admin");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <Container fluid className="vh-100 d-flex flex-column justify-content-center align-items-center bg-light">
      {/* Header Section */}
      <Row className="mb-4 text-center">
        <h1 className="display-5 fw-bold">🎓 Welcome to Campus Event Management</h1>
        <p className="lead text-muted">
          Simplifying event registrations, attendance, and reporting for students and admins.
        </p>
      </Row>

      {/* Content Section */}
      <Row className="w-100 justify-content-center">
        <Col md={6} lg={4}>
          <Card className="p-4 shadow-lg border-0 rounded-4">
            <h3 className="text-center mb-3">Login</h3>
            <Form onSubmit={handleLogin}>
              <Form.Group className="mb-3">
                <Form.Label>Select Role</Form.Label>
                <Form.Select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="student">Student</option>
                  <option value="admin">Admin</option>
                </Form.Select>
              </Form.Group>

              <Button type="submit" variant="primary" className="w-100">
                Continue
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>

      {/* Footer */}
      <footer className="mt-5 text-muted small">
        Powered by <strong>Webknot</strong>
      </footer>
    </Container>
  );
}

export default LoginPage;
