// backend/models/Registration.js
import mongoose from "mongoose";

const RegistrationSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  collegeId: { type: mongoose.Schema.Types.ObjectId, ref: "College", required: true },
}, { timestamps: true });

// Prevent duplicate registration (same student, same event)
RegistrationSchema.index({ eventId: 1, studentId: 1 }, { unique: true });

export default mongoose.model("Registration", RegistrationSchema);
