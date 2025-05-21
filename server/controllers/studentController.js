import Student from "../models/Student.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Admin from "../models/Admin.js";
import { uploadImage } from "../utils/cloudinary.js";
import sendEmail from "../utils/sendEmail.js";
import mongoose from "mongoose";
import InboxNotification from "../models/InboxNotification.js";
dotenv.config();

export const registerStudent = async (req, res) => {
  const {
    name,
    email,
    contactNo,
    college,
    branch,
    admissionYear,
    prn,
    password,
  } = req.body;

  const profilePhoto = req.file;

  try {
    if (!prn || prn.trim() === "") {
      return res.status(400).json({ message: "PRN is required" });
    }

    const existingEmail = await Student.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const existingPRN = await Student.findOne({ prn });
    if (existingPRN) {
      return res.status(400).json({ message: "PRN already exists" });
    }

    let profilePhotoUrl = "";
    if (profilePhoto) {
      const cloudinaryResponse = await uploadImage(profilePhoto.buffer);
      profilePhotoUrl = cloudinaryResponse.secure_url;
    }

    const newStudent = new Student({
      name,
      email,
      contactNo,
      profilePhoto: profilePhotoUrl,
      college,
      branch,
      admissionYear,
      prn,
      password,
    });

    await newStudent.save();

    const admin = await Admin.findOne();
    if (admin) {
      admin.students.push(newStudent._id);
      await admin.save();

      await sendEmail({
        to: admin.email || process.env.EMAIL_USER,
        subject: "New Student Registered",
        text: `📣 A new student has registered in the Alumni Management System!\n\nName: ${name}\nEmail: ${email}\nContact No: ${contactNo}\nCollege: ${college}\nBranch: ${branch}\nAdmission Year: ${admissionYear}\nPRN: ${prn}\n\nPlease check the admin dashboard for more details.`,
      });

      const notification = new InboxNotification({
        title: "New Student Registered",
        message: `${name} has registered and is awaiting approval.`,
        createdAt: new Date(),
        isRead: false,
      });
      await notification.save();
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
      { expiresIn: "5d" }
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

export const getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(student);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching student profile", error: err.message });
  }
};

export const updateStudentProfileOnId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid student ID" });
    }

    const {
      name,
      email,
      contactNo,
      college,
      branch,
      admissionYear,
      prn,
      password,
    } = req.body;

    const updatedData = {
      ...(name && { name }),
      ...(email && { email }),
      ...(contactNo && { contactNo }),
      ...(college && { college }),
      ...(branch && { branch }),
      ...(admissionYear && { admissionYear }),
      ...(prn && { prn }),
      ...(password && { password }),
    };

    const updatedStudent = await Student.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Student profile updated successfully",
      student: updatedStudent,
    });
  } catch (error) {
    console.error("Error updating student profile:", error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};
