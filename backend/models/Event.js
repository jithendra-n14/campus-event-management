// backend/models/Event.js
import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  collegeId: { type: mongoose.Schema.Types.ObjectId, ref: "College", required: true },
  eventCode: { type: String, required: true }, // human-friendly code, unique per college
  title: { type: String, required: true },
  type: { type: String, enum: ["Workshop", "Hackathon", "Seminar", "Fest"], required: true },
  description: { type: String },
  startsAt: { type: Date, required: true },
  endsAt: { type: Date, required: true },
  capacity: { type: Number, default: 100 },
  status: { type: String, enum: ["active", "cancelled"], default: "active" }
}, { timestamps: true });

// Ensure eventCode is unique within a college
EventSchema.index({ collegeId: 1, eventCode: 1 }, { unique: true });

export default mongoose.model("Event", EventSchema);
