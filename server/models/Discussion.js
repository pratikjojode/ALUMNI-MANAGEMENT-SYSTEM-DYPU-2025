import mongoose from "mongoose";

const discussionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: [
        "Career",
        "Networking",
        "Higher Studies",
        "Internships",
        "General",
        "Other",
      ],
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "createdByModel",
    },
    createdByModel: {
      type: String,
      required: true,
      enum: ["Alumni", "Student"],
    },
    likes: [
      { type: mongoose.Schema.Types.ObjectId, refPath: "createdByModel" },
    ],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  },

  { timestamps: true }
);

const Discussion = mongoose.model("Discussion", discussionSchema);

export default Discussion;
