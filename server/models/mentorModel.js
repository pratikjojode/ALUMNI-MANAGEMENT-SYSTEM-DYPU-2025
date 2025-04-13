import mongoose from "mongoose";

const mentorSchema = new mongoose.Schema({
  alumni: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Alumni",
    required: true,
    unique: true,
  },
  bio: String,
  expertise: [String],
  slots: [
    {
      date: String,
      time: String,
      isBooked: { type: Boolean, default: false },
    },
  ],
});

const Mentor = mongoose.model("Mentor", mentorSchema);
export default Mentor;
