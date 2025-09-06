// backend/routes/feedback.js
import express from "express";
import mongoose from "mongoose";
import Feedback from "../models/Feedback.js";
import Registration from "../models/Registration.js";

const router = express.Router();

// Submit feedback
router.post("/", async (req, res) => {
  try {
    const { eventId, studentId, collegeId, rating, comment } = req.body;

    if (!eventId || !studentId || !collegeId || !rating) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    // Ensure student is registered for this event
    const registered = await Registration.findOne({ eventId, studentId });
    if (!registered) {
      return res.status(400).json({ message: "Student not registered for this event" });
    }

    const feedback = new Feedback({ eventId, studentId, collegeId, rating, comment });
    await feedback.save();
    return res.status(201).json(feedback);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Feedback already submitted for this event" });
    }
    console.error("❌ Feedback error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }

  
});

// Get feedback (filter by eventId or studentId)
router.get("/", async (req, res) => {
  try {
    const { eventId, studentId } = req.query;
    const filter = {};
    if (eventId) filter.eventId = eventId;
    if (studentId) filter.studentId = studentId;

    const feedbacks = await Feedback.find(filter)
      .populate("studentId", "name rollNumber")
      .populate("eventId", "title eventCode");

    return res.json(feedbacks);
  } catch (err) {
    console.error("❌ Get feedback error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// Get feedback summary for an event
router.get("/summary/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: "Invalid eventId" });
    }

    const summary = await Feedback.aggregate([
      { $match: { eventId: new mongoose.Types.ObjectId(eventId) } },
      {
        $group: {
          _id: "$eventId",
          averageRating: { $avg: "$rating" },
          totalFeedback: { $sum: 1 }
        }
      }
    ]);

    if (summary.length === 0) {
      return res.json({ eventId, averageRating: 0, totalFeedback: 0 });
    }

    return res.json(summary[0]);
  } catch (err) {
    console.error("❌ Feedback summary error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
