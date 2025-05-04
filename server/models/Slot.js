import mongoose from "mongoose";

const slotSchema = new mongoose.Schema({
  date: { type: Date, required: true, unique: true },
  status: {
    type: String,
    enum: ["available", "full"],
    default: "available",
  },
  capacity: {
    type: Number,
    required: true,
  },
  bookedCount: {
    type: Number,
    default: 0,
  },
});

export default mongoose.model("Slot", slotSchema);
