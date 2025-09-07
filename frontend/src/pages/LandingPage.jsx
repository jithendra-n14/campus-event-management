// src/pages/LandingPage.jsx
import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <Container className="text-center mt-5">
      <h1 className="mb-4">🎓 Campus Event Management</h1>
      <p className="lead mb-5">
        Manage campus events, register for activities, mark attendance, give feedback, and view reports — all in one place.
      </p>

      <div className="d-flex justify-content-center gap-3">
        <Button as={Link} to="/events" variant="primary">
          Browse Events
        </Button>
        <Button as={Link} to="/dashboard" variant="success">
          My Dashboard
        </Button>
        <Button as={Link} to="/admin" variant="dark">
          Admin Panel
        </Button>
      </div>
    </Container>
  );
}

export default LandingPage;
