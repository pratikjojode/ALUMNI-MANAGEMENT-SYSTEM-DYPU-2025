import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Student from "../models/Student.js";
import Alumni from "../models/Alumni.js";

dotenv.config();

export const registerAdminUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const newAdmin = new Admin({
      name,
      email,
      password,
    });

    await newAdmin.save();

    const students = await Student.find();
    const alumni = await Alumni.find();

    newAdmin.students = students.map((student) => student._id);
    newAdmin.alumni = alumni.map((alumnus) => alumnus._id);

    await newAdmin.save();

    const token = jwt.sign(
      { id: newAdmin._id, role: newAdmin.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Admin registered successfully",
      token,
      admin: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Admin registration failed", error: err.message });
  }
};

export const loginAdminUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: "Email not found" });

    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Admin login successful",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Admin login failed", error: err.message });
  }
};

export const approveAlumni = async (req, res) => {
  const { id } = req.params;

  try {
    const alumni = await Alumni.findById(id);
    if (!alumni) {
      return res.status(404).json({ message: "Alumni not found" });
    }

    alumni.isApproved = true;
    await alumni.save();

    res.status(200).json({
      message: "Alumni approved successfully",
      alumni: {
        id: alumni._id,
        name: alumni.name,
        email: alumni.email,
        isApproved: alumni.isApproved,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Approval failed", error: err.message });
  }
};
