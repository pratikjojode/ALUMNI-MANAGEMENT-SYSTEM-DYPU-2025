import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    location: String,
    date: { type: Date, required: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "creatorModel",
      required: true,
    },
    creatorModel: {
      type: String,
      required: true,
      enum: ["Admin", "Alumni"],
    },
    rsvps: [
      {
        alumni: { type: mongoose.Schema.Types.ObjectId, ref: "Alumni" },
        status: { type: String, enum: ["yes", "no", "maybe"], default: "yes" },
      },
    ],
    reminderSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Event = mongoose.model("Event", eventSchema);
