import { useEffect, useState } from "react";
import api from "../api/axios";
import { Card, Button, Alert, Spinner } from "react-bootstrap";

function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const studentId = "68bbd1a99eac9229fcf98765";
  const collegeId = "68bbcc0a09815f215b71a73a";

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await api.get("/events");
      setEvents(res.data);
    } catch (err) {
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

const registerForEvent = async (eventId) => {
  try {
    await api.post("/registrations", { eventId, studentId, collegeId });
    setEvents(events.map(ev =>
      ev._id === eventId ? { ...ev, registered: true } : ev
    ));
    setMessage("✅ Registered successfully!");
  } catch (err) {
    if (err.response && err.response.status === 409) {
      setEvents(events.map(ev =>
        ev._id === eventId ? { ...ev, registered: true } : ev
      ));
      setMessage("⚠️ Already registered for this event.");
    } else {
      setMessage("❌ Failed to register.");
    }
  }
};
  if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Available Events</h2>
      {message && <Alert variant="info">{message}</Alert>}

      <div className="row">
        {events.map((event) => (
          <div className="col-md-4 mb-4" key={event._id}>
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title>{event.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {event.type} | Code: {event.eventCode}
                </Card.Subtitle>
                <Card.Text>
                  <strong>Date:</strong>{" "}
                  {new Date(event.startsAt).toLocaleString()} -{" "}
                  {new Date(event.endsAt).toLocaleString()} <br />
                  <strong>Status:</strong>{" "}
                  {event.status === "active" ? (
                    <span className="text-success">Active</span>
                  ) : (
                    <span className="text-danger">Cancelled</span>
                  )} <br />
                  <strong>Capacity:</strong> {event.capacity}
                </Card.Text>
                {event.status === "active" && (
                <Button
  variant={event.registered ? "secondary" : "primary"}
  disabled={event.registered}
  onClick={() => registerForEvent(event._id)}
>
  {event.registered ? "✅ Registered" : "Register"}
</Button>
                )}
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EventsPage;
