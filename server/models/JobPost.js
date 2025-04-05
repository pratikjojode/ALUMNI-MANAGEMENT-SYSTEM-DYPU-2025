// models/JobPost.js
import mongoose from "mongoose";

const jobPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    requirements: { type: String },
    applicationDeadline: { type: Date, required: true },
    location: { type: String },
    companyName: { type: String, required: true },
    jobType: {
      type: String,
      enum: ["Full-time", "Part-time", "Internship"],
      required: true,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Alumni",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("JobPost", jobPostSchema);
