import mongoose from "mongoose";

const donationSchema = new mongoose.Schema({
  amount: { type: Number, required: true },

  alumniId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Alumni",
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },

  paymentId: { type: String }, // Razorpay payment ID
  orderId: { type: String }, // Razorpay order ID
  status: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pending",
  },

  createdAt: { type: Date, default: Date.now },
});

export const Donation = mongoose.model("Donation", donationSchema);
