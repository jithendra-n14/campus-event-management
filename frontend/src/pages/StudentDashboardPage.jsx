import { useEffect, useState } from "react";
import api from "../api/axios";
import { Card, Button, Table, Alert, Spinner, Form } from "react-bootstrap";

function StudentDashboardPage() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [feedbacks, setFeedbacks] = useState({});

  const studentId = "68bbd1a99eac9229fcf98765"; // hardcoded for now
  const collegeId = "68bbcc0a09815f215b71a73a";

  useEffect(() => {
    fetchMyRegistrations();
  }, []);

  const fetchMyRegistrations = async () => {
    try {
      const res = await api.get(
        `/registrations?studentId=${studentId}&collegeId=${collegeId}`
      );
      // add attended flag if missing
      const withAttendance = res.data.map((reg) => ({
        ...reg,
        attended: reg.attended || false,
      }));
      setRegistrations(withAttendance);
    } catch (err) {
      console.error("Fetch registrations error:", err);
    } finally {
      setLoading(false);
    }
  };

  const unregisterEvent = async (regId) => {
    try {
      await api.delete(`/registrations/${regId}`);
      setMessage("⚠️ Unregistered successfully!");
      fetchMyRegistrations();
    } catch {
      setMessage("❌ Failed to unregister.");
    }
  };

  const markAttendance = async (eventId) => {
    try {
      await api.post("/attendance", { studentId, collegeId, eventId });

      // update state immediately
      setRegistrations((prev) =>
        prev.map((reg) =>
          reg.eventId._id === eventId ? { ...reg, attended: true } : reg
        )
      );

      setMessage("✅ Attendance marked!");
    } catch {
      setMessage("❌ Could not mark attendance (maybe already marked).");
    }
  };

  const handleFeedbackChange = (eventId, field, value) => {
    setFeedbacks((prev) => ({
      ...prev,
      [eventId]: {
        ...prev[eventId],
        [field]: value,
      },
    }));
  };

  const submitFeedback = async (eventId) => {
    const feedback = feedbacks[eventId] || { rating: 5, text: "" };
    try {
      await api.post("/feedback", {
        studentId,
        collegeId,
        eventId,
        rating: feedback.rating,
        comments: feedback.text,
      });
      setMessage("✅ Feedback submitted!");
    } catch {
      setMessage("❌ Feedback failed (maybe already given).");
    }
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );

  return (
    <div className="container mt-4">
      <h2 className="mb-4">🎓 Student Dashboard</h2>
      {message && <Alert variant="info">{message}</Alert>}

      {registrations.length === 0 ? (
        <Alert variant="warning">
          You haven’t registered for any events yet.
        </Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Event</th>
              <th>Type</th>
              <th>Status</th>
              <th>Starts</th>
              <th>Ends</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((reg) => (
              <tr key={reg._id}>
                <td>{reg.eventId?.title}</td>
                <td>{reg.eventId?.type}</td>
                <td>{reg.eventId?.status}</td>
                <td>{new Date(reg.eventId?.startsAt).toLocaleString()}</td>
                <td>{new Date(reg.eventId?.endsAt).toLocaleString()}</td>
                <td>
                  <div className="mb-2">
                    <Button
                      variant="danger"
                      size="sm"
                      className="me-2"
                      onClick={() => unregisterEvent(reg._id)}
                      disabled={reg.attended} // disable unregister after attended
                    >
                      Unregister
                    </Button>
                    <Button
  variant={reg.attended ? "secondary" : "success"}
  size="sm"
  onClick={() => reg.eventId && markAttendance(reg.eventId._id)}
  disabled={reg.attended || !reg.eventId}
>
  {reg.attended
    ? "✅ Attended"
    : reg.eventId
    ? "Mark Attendance"
    : "N/A"}
</Button>
                  </div>

                  {/* Feedback form */}
<Form
  onSubmit={(e) => {
    e.preventDefault();
    if (reg.eventId) submitFeedback(reg.eventId._id);
  }}
>
  {reg.eventId ? (
    <>
      <Form.Select
        value={feedbacks[reg.eventId._id]?.rating || 5}
        onChange={(e) =>
          handleFeedbackChange(reg.eventId._id, "rating", Number(e.target.value))
        }
        size="sm"
        className="me-2 mb-1"
      >
        {[1, 2, 3, 4, 5].map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </Form.Select>
      <Form.Control
        type="text"
        placeholder="Comment"
        size="sm"
        value={feedbacks[reg.eventId._id]?.text || ""}
        onChange={(e) =>
          handleFeedbackChange(reg.eventId._id, "text", e.target.value)
        }
        className="mb-1"
      />
      <Button type="submit" variant="primary" size="sm">
        Submit Feedback
      </Button>
    </>
  ) : (
    <Alert variant="warning" className="p-1 m-0">
      Event no longer exists
    </Alert>
  )}
</Form>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}

export default StudentDashboardPage;
