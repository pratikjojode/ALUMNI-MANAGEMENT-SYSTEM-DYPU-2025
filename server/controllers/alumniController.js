import Alumni from "../models/Alumni.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import Admin from "../models/Admin.js";

dotenv.config();

export const registerAlumniUser = async (req, res) => {
  const {
    name,
    email,
    contactNo,
    profilePhoto,
    college,
    branch,
    passoutYear,
    currentCompany,
    designation,
    location,
    LinkedIn,
    password,
  } = req.body;

  try {
    const existingAlumni = await Alumni.findOne({ email });
    if (existingAlumni)
      return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAlumni = new Alumni({
      name,
      email,
      contactNo,
      profilePhoto,
      college,
      branch,
      passoutYear,
      currentCompany,
      designation,
      location,
      LinkedIn,
      password: hashedPassword,
    });

    await newAlumni.save();

    const admin = await Admin.findOne();
    if (admin) {
      admin.alumni.push(newAlumni._id);
      await admin.save();
    }

    res.status(201).json({
      message: "Alumni registered successfully",
      alumni: {
        id: newAlumni._id,
        name: newAlumni.name,
        email: newAlumni.email,
        contactNo: newAlumni.contactNo,
        profilePhoto: newAlumni.profilePhoto,
        college: newAlumni.college,
        branch: newAlumni.branch,
        passoutYear: newAlumni.passoutYear,
        currentCompany: newAlumni.currentCompany,
        designation: newAlumni.designation,
        location: newAlumni.location,
        LinkedIn: newAlumni.LinkedIn,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Alumni registration failed", error: err.message });
  }
};

export const loginAlumniUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const alumni = await Alumni.findOne({ email });
    if (!alumni) return res.status(400).json({ message: "Email not found" });

    const match = await bcrypt.compare(password, alumni.password);
    if (!match) return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign(
      { id: alumni._id, role: alumni.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Alumni login successful",
      token,
      alumni: {
        id: alumni._id,
        name: alumni.name,
        email: alumni.email,
        role: alumni.role,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Alumni login failed", error: err.message });
  }
};
