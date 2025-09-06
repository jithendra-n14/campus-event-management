// backend/routes/students.js
import express from "express";
import mongoose from "mongoose";
import Student from "../models/Student.js";

const router = express.Router();

// Create student
router.post("/", async (req, res) => {
  try {
    const { collegeId, rollNumber, name, email, year } = req.body;

    if (!collegeId || !rollNumber || !name || !email) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    if (!mongoose.Types.ObjectId.isValid(collegeId)) {
      return res.status(400).json({ message: "Invalid collegeId" });
    }

    const student = new Student({ collegeId, rollNumber, name, email, year });
    await student.save();
    return res.status(201).json(student);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Roll number already exists in this college" });
    }
    console.error("❌ Create student error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// List students (optional filter: collegeId)
router.get("/", async (req, res) => {
  try {
    const { collegeId } = req.query;
    const filter = {};
    if (collegeId) filter.collegeId = collegeId;

    const students = await Student.find(filter).sort({ name: 1 });
    return res.json(students);
  } catch (err) {
    console.error("❌ Get students error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
