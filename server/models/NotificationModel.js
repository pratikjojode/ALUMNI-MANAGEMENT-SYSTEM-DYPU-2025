import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  message: { type: String, required: true },
  type: { type: String, enum: ["admin", "student", "alumni"], required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, refPath: "type" },
  jobPostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "JobPost",
    required: false,
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: false,
  },
  createdAt: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
});

export default mongoose.model("Notification", notificationSchema);
