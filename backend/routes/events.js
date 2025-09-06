// backend/routes/events.js
import express from "express";
import mongoose from "mongoose";
import Event from "../models/Event.js";

const router = express.Router();

// Create event
router.post("/", async (req, res) => {
  try {
    const { collegeId, eventCode, title, type, description, startsAt, endsAt, capacity } = req.body;

    // basic validation
    if (!collegeId || !eventCode || !title || !type || !startsAt || !endsAt) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    if (!mongoose.Types.ObjectId.isValid(collegeId)) {
      return res.status(400).json({ message: "Invalid collegeId" });
    }

    const event = new Event({
      collegeId,
      eventCode,
      title,
      type,
      description,
      startsAt: new Date(startsAt),
      endsAt: new Date(endsAt),
      capacity
    });

    await event.save();
    return res.status(201).json(event);
  } catch (err) {
    // duplicate index error
    if (err.code === 11000) {
      return res.status(409).json({ message: "Event code already exists for this college" });
    }
    console.error("Create event error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// List events (optional filters: collegeId, type, status)
router.get("/", async (req, res) => {
  try {
    const { collegeId, type, status } = req.query;
    const filter = {};
    if (collegeId) filter.collegeId = collegeId;
    if (type) filter.type = type;
    if (status) filter.status = status;

    const events = await Event.find(filter).sort({ startsAt: 1 });
    return res.json(events);
  } catch (err) {
    console.error("Get events error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});


// PATCH /api/events/:id/cancel
router.patch("/:id/cancel", async (req, res) => {
  try {
    const { id } = req.params;

    // Validate eventId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.status === "cancelled") {
      return res.status(400).json({ message: "Event is already cancelled" });
    }

    event.status = "cancelled";
    await event.save();

    return res.json({ message: "Event cancelled successfully", event });
  } catch (err) {
    console.error("❌ Cancel event error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});


// Reactivate event (set status = active)
router.patch("/:id/activate", async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findByIdAndUpdate(
      id,
      { status: "active" },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({ message: "Event reactivated successfully", event });
  } catch (err) {
    console.error("❌ Reactivate event error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Permanently delete an event
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Event.findByIdAndDelete(id);
    res.json({ message: "🗑️ Event deleted successfully" });
  } catch (err) {
    console.error("Delete event error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
