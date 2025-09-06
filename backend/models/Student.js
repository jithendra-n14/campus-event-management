// backend/models/Student.js
import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
  collegeId: { type: mongoose.Schema.Types.ObjectId, ref: "College", required: true },
  rollNumber: { type: String, required: true }, // unique within a college
  name: { type: String, required: true },
  email: { type: String, required: true },
  year: { type: Number }, // e.g. 1, 2, 3, 4
}, { timestamps: true });

// Ensure no duplicate rollNumbers within a college
StudentSchema.index({ collegeId: 1, rollNumber: 1 }, { unique: true });

export default mongoose.model("Student", StudentSchema);
