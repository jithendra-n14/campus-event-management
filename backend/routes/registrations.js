// backend/routes/registrations.js
import express from "express";
import mongoose from "mongoose";
import Registration from "../models/Registration.js";
import Event from "../models/Event.js";
import Student from "../models/Student.js";


const router = express.Router();

// Register a student for an event
router.post("/", async (req, res) => {
  try {
    const { eventId, studentId, collegeId } = req.body;

    if (!eventId || !studentId || !collegeId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(eventId) || !mongoose.Types.ObjectId.isValid(studentId) || !mongoose.Types.ObjectId.isValid(collegeId)) {
      return res.status(400).json({ message: "Invalid IDs" });
    }

    // Check event status + capacity
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });
    if (event.status !== "active") return res.status(400).json({ message: "Event is not active" });

    const count = await Registration.countDocuments({ eventId });
    if (count >= event.capacity) {
      return res.status(400).json({ message: "Event is full" });
    }

    // Create registration
    const registration = new Registration({ eventId, studentId, collegeId });
    await registration.save();

    return res.status(201).json(registration);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Student already registered for this event" });
    }
    console.error("❌ Registration error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// List registrations (optionally filter by studentId, eventId, collegeId)
// backend/routes/registrations.js
router.get("/", async (req, res) => {
  try {
    const { studentId, collegeId } = req.query;
    const filter = {};
    if (studentId) filter.studentId = studentId;
    if (collegeId) filter.collegeId = collegeId;

    const regs = await Registration.find(filter)
      .populate("eventId", "title type status startsAt endsAt");

    res.json(regs);
  } catch (err) {
    console.error("Get registrations error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /registrations/:id
router.delete("/:id", async (req, res) => {
  try {
    const reg = await Registration.findByIdAndDelete(req.params.id);
    if (!reg) return res.status(404).json({ message: "Registration not found" });
    res.json({ message: "Unregistered successfully" });
  } catch (err) {
    console.error("Delete registration error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
export default router;
