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
      ref: "Mentor",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    message: String,
    alumni: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Alumni",
    },
    scheduledDateTime: {
      type: Date,
      default: null,
    },
    meetingLink: {
      type: String,
      default: "",
    },
    scheduledByAdmin: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true }
);

const MentorshipRequest = mongoose.model(
  "MentorshipRequest",
  mentorshipRequestSchema
);

export default MentorshipRequest;
