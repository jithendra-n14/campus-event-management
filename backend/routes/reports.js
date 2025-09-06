// backend/routes/reports.js
import express from "express";
import Registration from "../models/Registration.js";
import Event from "../models/Event.js";

const router = express.Router();

// Event Popularity Report
router.get("/events/popularity", async (req, res) => {
  try {
    const data = await Registration.aggregate([
      { $group: { _id: "$eventId", registrations: { $sum: 1 } } },
      {
        $lookup: {
          from: "events",
          localField: "_id",
          foreignField: "_id",
          as: "event"
        }
      },
      { $unwind: "$event" },
      { $sort: { registrations: -1 } }
    ]);

    res.json(
      data.map((r) => ({
        eventTitle: r.event.title,
        eventCode: r.event.eventCode,
        type: r.event.type,
        registrations: r.registrations,
      }))
    );
  } catch (err) {
    console.error("Popularity report error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Student Participation Report
router.get("/students/participation", async (req, res) => {
  try {
    const data = await Registration.aggregate([
      { $group: { _id: "$studentId", eventsRegistered: { $sum: 1 } } },
      {
        $lookup: {
          from: "students",
          localField: "_id",
          foreignField: "_id",
          as: "student"
        }
      },
      { $unwind: "$student" }
    ]);

    res.json(
      data.map((r) => ({
        studentName: r.student.name,
        studentEmail: r.student.email,
        eventsRegistered: r.eventsRegistered,
      }))
    );
  } catch (err) {
    console.error("Participation report error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Top 3 Most Active Students
router.get("/students/top", async (req, res) => {
  try {
    const data = await Registration.aggregate([
      { $group: { _id: "$studentId", eventsRegistered: { $sum: 1 } } },
      { $sort: { eventsRegistered: -1 } },
      { $limit: 3 },
      {
        $lookup: {
          from: "students",
          localField: "_id",
          foreignField: "_id",
          as: "student"
        }
      },
      { $unwind: "$student" }
    ]);

    res.json(
      data.map((r) => ({
        studentName: r.student.name,
        studentEmail: r.student.email,
        eventsRegistered: r.eventsRegistered,
      }))
    );
  } catch (err) {
    console.error("Top students report error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
