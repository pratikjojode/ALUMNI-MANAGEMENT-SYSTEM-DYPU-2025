// models/InboxNotification.js

import mongoose from "mongoose";

const inboxNotificationSchema = new mongoose.Schema(
  {
    title: String,
    message: String,
    senderType: String,
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "senderType",
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("InboxNotification", inboxNotificationSchema);
