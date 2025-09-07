import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavbarComponent from "./components/NavbarComponent";
import FooterComponent from "./components/FooterComponent";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import EventsPage from "./pages/EventsPage";
import StudentDashboardPage from "./pages/StudentDashboardPage";
import ReportsPage from "./pages/ReportsPage";
import AdminPage from "./pages/AdminPage";

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <NavbarComponent />

        {/* Main content fills available space */}
        <div className="flex-grow-1">
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/dashboard" element={<StudentDashboardPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </div>

        {/* Footer stays at bottom */}
        <FooterComponent />
      </div>
    </Router>
  );
}


export default App;
