import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  alumniId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Alumni",
    required: true,
  },
  slot: { type: mongoose.Schema.Types.ObjectId, ref: "Slot", required: true },
  appointmentDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
});

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;
