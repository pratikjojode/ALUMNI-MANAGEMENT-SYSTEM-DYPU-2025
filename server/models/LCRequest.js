import mongoose from "mongoose";

const lcRequestSchema = new mongoose.Schema({
  alumni: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Alumni",
    required: true,
  },
  reason: {
    type: String,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  lcPdfUrl: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("LCRequest", lcRequestSchema);
