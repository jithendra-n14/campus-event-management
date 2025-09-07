import { useEffect, useState } from "react";
import api from "../api/axios";
import { Card, Form, Button, Table, Alert, Spinner } from "react-bootstrap";

function AdminPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Form state
  const [title, setTitle] = useState("");
  const [eventCode, setEventCode] = useState("");
  const [type, setType] = useState("Workshop");
  const [capacity, setCapacity] = useState(50);
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");

  const collegeId = "68bbcc0a09815f215b71a73a"; // Hardcoded for now

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

  const createEvent = async (e) => {
    e.preventDefault();
    try {
      await api.post("/events", {
        collegeId,
        title,
        eventCode,
        type,
        capacity,
        startsAt,
        endsAt,
        status: "active",
      });
      setMessage("✅ Event created successfully!");
      fetchEvents();
      // Reset form
      setTitle(""); setEventCode(""); setType("Workshop");
      setCapacity(50); setStartsAt(""); setEndsAt("");
    } catch (err) {
      console.error("Create event error:", err);
      setMessage("❌ Failed to create event (maybe duplicate code?).");
    }
  };

  const cancelEvent = async (id) => {
    try {
      await api.patch(`/events/${id}/cancel`);
      setMessage("⚠️ Event cancelled!");
      fetchEvents();
    } catch {
      setMessage("❌ Failed to cancel event.");
    }
  };

  const activateEvent = async (id) => {
    try {
      await api.patch(`/events/${id}/activate`);
      setMessage("✅ Event reactivated!");
      fetchEvents();
    } catch {
      setMessage("❌ Failed to activate event.");
    }
  };

  const deleteEvent = async (id) => {
  try {
    await api.delete(`/events/${id}`);
    setMessage("🗑️ Event deleted!");
    fetchEvents();
  } catch {
    setMessage("❌ Failed to delete event.");
  }
};

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">🛠️ Admin Event Management</h2>
      {message && <Alert variant="info">{message}</Alert>}

      {/* Create Event Form */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Card.Title>Create New Event</Card.Title>
          <Form onSubmit={createEvent}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control value={title} onChange={(e) => setTitle(e.target.value)} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Event Code</Form.Label>
              <Form.Control value={eventCode} onChange={(e) => setEventCode(e.target.value)} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Select value={type} onChange={(e) => setType(e.target.value)}>
                <option>Workshop</option>
                <option>Seminar</option>
                <option>Fest</option>
                <option>Hackathon</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Capacity</Form.Label>
              <Form.Control type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Start Date & Time</Form.Label>
              <Form.Control type="datetime-local" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>End Date & Time</Form.Label>
              <Form.Control type="datetime-local" value={endsAt} onChange={(e) => setEndsAt(e.target.value)} />
            </Form.Group>

            <Button type="submit" variant="success">Create Event</Button>
            
          </Form>
        </Card.Body>
      </Card>

      {/* Existing Events */}
      <Card className="shadow-sm">
        <Card.Body>
          <Card.Title>All Events</Card.Title>
          {events.length === 0 ? (
            <Alert variant="warning">No events found.</Alert>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Code</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Capacity</th>
                  <th>Starts</th>
                  <th>Ends</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((ev) => (
                  <tr key={ev._id}>
                    <td>{ev.title}</td>
                    <td>{ev.eventCode}</td>
                    <td>{ev.type}</td>
                    <td className={ev.status === "active" ? "text-success" : "text-danger"}>
                      {ev.status}
                    </td>
                    <td>{ev.capacity}</td>
                    <td>{new Date(ev.startsAt).toLocaleString()}</td>
                    <td>{new Date(ev.endsAt).toLocaleString()}</td>
                    <td>
                        
                      {ev.status === "active" ? (
                        <Button variant="danger" size="sm" onClick={() => cancelEvent(ev._id)}>Cancel</Button>
                      ) : (
                        <Button variant="success" size="sm" onClick={() => activateEvent(ev._id)}>Activate</Button>
                      )                      }
                      <Button
  variant="outline-danger"
  size="sm"
  className="ms-2"
  onClick={() => deleteEvent(ev._id)}
>
  Delete
</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}

export default AdminPage;
