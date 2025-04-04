import Student from "../models/Student.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Admin from "../models/Admin.js";
import { uploadImage } from "../utils/cloudinary.js"; // Import the Cloudinary upload function

dotenv.config();

export const registerStudent = async (req, res) => {
  const {
    name,
    email,
    contactNo,
    college,
    branch,
    admissionYear,
    passoutYear,
    PRN,
    projectIdea,
    password, // Password will be handled by schema
  } = req.body;

  const profilePhoto = req.file; // This is the file uploaded from the frontend

  try {
    // Check if the student with the given email already exists
    const existing = await Student.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already registered" });

    // Upload image to Cloudinary if provided
    let profilePhotoUrl = "";
    if (profilePhoto) {
      const cloudinaryResponse = await uploadImage(profilePhoto.buffer); // Upload image buffer to Cloudinary
      profilePhotoUrl = cloudinaryResponse.secure_url; // Get the URL of the uploaded image
    }

    const newStudent = new Student({
      name,
      email,
      contactNo,
      profilePhoto: profilePhotoUrl, // Store the Cloudinary image URL
      college,
      branch,
      admissionYear,
      passoutYear,
      PRN,
      projectIdea,
      password, // Password will be hashed if defined in schema
    });

    await newStudent.save();

    // If an admin exists, associate the student with the admin
    const admin = await Admin.findOne();
    if (admin) {
      admin.students.push(newStudent._id);
      await admin.save();
    }

    res.status(201).json({
      message: "Student Registered Successfully",
      student: newStudent,
    });
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
