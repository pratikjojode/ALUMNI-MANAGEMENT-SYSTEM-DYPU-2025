import Student from "../models/Student.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Admin from "../models/Admin.js";
import { uploadImage } from "../utils/cloudinary.js";
import sendEmail from "../utils/sendEmail.js";

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
    // Check if PRN is provided and is not null or empty
    if (!prn || prn.trim() === "") {
      return res.status(400).json({ message: "PRN is required" });
    }

    // Check if email is already registered
    const existingEmail = await Student.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Check if PRN already exists
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
        text: `📣 A new student has registered in the Alumni Management System!

        👤 Name: ${name}
        📧 Email: ${email}
        📱 Contact No: ${contactNo}
        🏫 College: ${college}
        📚 Branch: ${branch}
        📅 Admission Year: ${admissionYear}
        
        🆔 PRN: ${prn}
     

        Please check the admin dashboard for more details.`,
      });
    }

    // Return success response
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
    const student = await Student.findById(req.user.id); // Assuming req.user.id contains the student's ID

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(student); // Send the student data back as a response
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching student profile", error: err.message });
  }
};
