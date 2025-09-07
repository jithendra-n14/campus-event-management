// frontend/src/pages/ReportsPage.jsx
import { useEffect, useState } from "react";
import api from "../api/axios";
import { Card, Table, Spinner, Alert } from "react-bootstrap";

function ReportsPage() {
  const [popularity, setPopularity] = useState([]);
  const [participation, setParticipation] = useState([]);
  const [topStudents, setTopStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const [popRes, partRes, topRes] = await Promise.all([
        api.get("/reports/events/popularity"),
        api.get("/reports/students/participation"),
        api.get("/reports/students/top"),
      ]);
      setPopularity(popRes.data);
      setParticipation(partRes.data);
      setTopStudents(topRes.data);
    } catch (err) {
      console.error("Error fetching reports:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">📊 Reports Dashboard</h2>
        
      {/* Event Popularity */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Card.Title>🔥 Event Popularity</Card.Title>
          {popularity.length === 0 ? (
            <Alert variant="info">No events found.</Alert>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Type</th>
                  <th>Registrations</th>
                </tr>
              </thead>
              <tbody>
                {popularity.map((event, idx) => (
                  <tr key={idx}>
                    <td>{event.eventTitle}</td>
                    <td>{event.type}</td>
                    <td>{event.registrations}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Student Participation */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Card.Title>🙋 Student Participation</Card.Title>
          {participation.length === 0 ? (
            <Alert variant="info">No participation records yet.</Alert>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Email</th>
                  <th>Events Registered</th>
                </tr>
              </thead>
              <tbody>
                {participation.map((stu, idx) => (
                  <tr key={idx}>
                    <td>{stu.studentName}</td>
                    <td>{stu.studentEmail}</td>
                    <td>{stu.eventsRegistered}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Top 3 Most Active Students */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Card.Title>🏆 Top 3 Active Students</Card.Title>
          {topStudents.length === 0 ? (
            <Alert variant="info">No active students yet.</Alert>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Student</th>
                  <th>Email</th>
                  <th>Events Registered</th>
                </tr>
              </thead>
              <tbody>
                {topStudents.map((stu, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{stu.studentName}</td>
                    <td>{stu.studentEmail}</td>
                    <td>{stu.eventsRegistered}</td>
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

export default ReportsPage;
