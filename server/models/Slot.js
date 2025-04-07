// src/models/Slot.js
import mongoose from "mongoose";

const slotSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  status: { type: String, default: "available" },
});

export default mongoose.model("Slot", slotSchema);
