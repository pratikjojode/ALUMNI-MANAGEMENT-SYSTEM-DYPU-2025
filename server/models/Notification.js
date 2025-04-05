// models/Notification.js
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  message: { type: String, required: true },
  type: { type: String, enum: ["student", "alumni"], required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, refPath: "type" },
  createdAt: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
});

export default mongoose.model("Notification", notificationSchema);
