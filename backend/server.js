import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import eventsRouter from "./routes/events.js";
import studentsRouter from "./routes/students.js";
import registrationsRouter from "./routes/registrations.js";
import attendanceRouter from "./routes/attendance.js";
import feedbackRouter from "./routes/feedback.js";
import reportsRouter from "./routes/reports.js";



dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// connect (you already have this)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// mount routes (prefix with /api)
app.use("/api/events", eventsRouter);
app.use("/api/students", studentsRouter);
app.use("/api/registrations", registrationsRouter);
app.use("/api/attendance", attendanceRouter);
app.use("/api/feedback", feedbackRouter);
app.use("/api/reports", reportsRouter);

// health
app.get("/", (req, res) => res.send("Campus Events API running..."));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
