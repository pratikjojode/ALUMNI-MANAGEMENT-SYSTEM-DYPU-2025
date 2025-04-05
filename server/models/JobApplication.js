// models/JobApplication.js
import mongoose from "mongoose";

const jobApplicationSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    jobPostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobPost",
      required: true,
    },
    resume: { type: String, required: true }, // Path to the uploaded resume file
    applicationDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("JobApplication", jobApplicationSchema);
