import mongoose from "mongoose";

const mentorshipRequestSchema = new mongoose.Schema(
  {
    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mentor",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    slotId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    message: String, // optional message from student
  },
  { timestamps: true }
);

const MentorshipRequest = mongoose.model(
  "MentorshipRequest",
  mentorshipRequestSchema
);
export default MentorshipRequest;
