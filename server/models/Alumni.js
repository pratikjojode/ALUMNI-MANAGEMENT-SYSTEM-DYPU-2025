import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const alumniSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    contactNo: {
      type: String,
      required: true,
    },
    profilePhoto: {
      type: String,
      default: "",
    },
    college: {
      type: String,
      required: true,
    },
    branch: {
      type: String,
      required: true,
    },
    passoutYear: {
      type: Number,
      required: true,
    },
    currentCompany: {
      type: String,
      default: "",
    },
    designation: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    LinkedIn: {
      type: String,
      default: "",
    },
    Instagram: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["alumni"],
      default: "alumni",
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

alumniSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export default mongoose.model("Alumni", alumniSchema);
