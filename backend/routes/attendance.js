// backend/routes/attendance.js
import express from "express";
import mongoose from "mongoose";
import Attendance from "../models/Attendance.js";
import Registration from "../models/Registration.js";


const router = express.Router();

// Mark attendance
router.post("/", async (req, res) => {
  try {
    const { eventId, studentId, collegeId, status } = req.body;

    if (!eventId || !studentId || !collegeId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(eventId) || !mongoose.Types.ObjectId.isValid(studentId) || !mongoose.Types.ObjectId.isValid(collegeId)) {
      return res.status(400).json({ message: "Invalid IDs" });
    }

    // Ensure student is registered for this event
    const registered = await Registration.findOne({ eventId, studentId });
    if (!registered) {
      return res.status(400).json({ message: "Student not registered for this event" });
    }

    // Mark attendance
    const attendance = new Attendance({
      eventId,
      studentId,
      collegeId,
      status: status || "present"
    });

    await attendance.save();
    return res.status(201).json(attendance);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Attendance already marked for this student" });
    }
    console.error("❌ Attendance error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// List attendance (optionally filter by studentId, eventId, collegeId)
router.get("/", async (req, res) => {
  try {
    const { studentId, eventId, collegeId } = req.query;
    const filter = {};
    if (studentId) filter.studentId = studentId;
    if (eventId) filter.eventId = eventId;
    if (collegeId) filter.collegeId = collegeId;

    const records = await Attendance.find(filter)
      .populate("eventId")     // gives you event details
      .populate("studentId");  // gives you student details

    res.json(records);
  } catch (err) {
    console.error("❌ Get attendance error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
export default router;
