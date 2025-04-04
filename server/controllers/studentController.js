import Student from "../models/Student.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Admin from "../models/Admin.js";

dotenv.config();

export const registerStudent = async (req, res) => {
  const {
    name,
    email,
    contactNo,
    profilePhoto,
    college,
    branch,
    admissionYear,
    passoutYear,
    PRN,
    projectIdea,
    password,
  } = req.body;

  try {
    const existing = await Student.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already registered" });

    const newStudent = new Student({
      name,
      email,
      contactNo,
      profilePhoto,
      college,
      branch,
      admissionYear,
      passoutYear,
      PRN,
      projectIdea,
      password,
    });

    await newStudent.save();

    // ✅ Add student to the admin's students array
    const admin = await Admin.findOne();
    if (admin) {
      admin.students.push(newStudent._id);
      await admin.save();
    }

    res
      .status(201)
      .json({ message: "Registered successfully", student: newStudent });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Registration failed", error: err.message });
  }
};

export const loginStudent = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const user = await Student.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email not found" });

    if (user.role !== role)
      return res.status(403).json({ message: `You are not a ${role}` });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: `${role} login success`,
      token,
      user,
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};
