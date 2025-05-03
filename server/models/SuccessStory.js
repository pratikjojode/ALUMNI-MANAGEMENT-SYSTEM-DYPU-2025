// models/SuccessStory.js
import mongoose from "mongoose";

const successStorySchema = new mongoose.Schema({
  alumni: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Alumni",
    required: true,
  },
  name: { type: String, required: true },
  shortDescription: { type: String, required: true },
  fullDescription: { type: String, required: false },
  image: { type: String, required: false },
  isOutstanding: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("SuccessStory", successStorySchema);
