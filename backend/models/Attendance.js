// backend/models/Attendance.js
import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  collegeId: { type: mongoose.Schema.Types.ObjectId, ref: "College", required: true },
  status: { type: String, enum: ["present", "absent"], default: "present" }
}, { timestamps: true });

// Prevent duplicate attendance records
AttendanceSchema.index({ eventId: 1, studentId: 1 }, { unique: true });

export default mongoose.model("Attendance", AttendanceSchema);
