import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Student name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    contactNo: {
      type: String,
      required: [true, "Contact number is required"],
    },
    profilePhoto: {
      type: String, // URL from Cloudinary
      default: "",
    },
    college: {
      type: String,
      required: [true, "College name is required"],
    },
    branch: {
      type: String,
      required: [true, "Branch is required"],
    },
    admissionYear: {
      type: Number,
      required: [true, "Admission year is required"],
    },
    passoutYear: {
      type: Number,
      required: [true, "Passout year is required"],
    },
    prn: {
      type: String,
      required: [true, "PRN is required"],
      unique: true,
      trim: true,
      sparse: true, // ← optional safeguard
    },
    projectIdea: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["student", "admin", "alumni"],
      default: "student",
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
  },
  {
    timestamps: true,
  }
);

studentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export default mongoose.model("Student", studentSchema);
