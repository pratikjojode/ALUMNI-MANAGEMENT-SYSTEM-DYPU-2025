import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Student from "../models/Student.js";
import Alumni from "../models/Alumni.js";
import { sendAdminConfirmationEmail } from "../utils/adminMailer.js";

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

    sendAdminConfirmationEmail(newAdmin.email, newAdmin.name);

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
    res.status(500).json({
      message: "Admin registration failed",
      error: err.message,
    });
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
  try {
    const alumni = await Alumni.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );
    if (!alumni) {
      return res.status(404).json({ message: "Alumni not found" });
    }
    res.status(200).json({ message: "Alumni approved successfully", alumni });
  } catch (error) {
    res.status(500).json({ message: "Error approving alumni", error });
  }
};

export const getAllStudentsAdmin = async (req, res) => {
  try {
    const students = await Student.find();
    if (students.length === 0) {
      return res.status(404).json({ message: "No students found" });
    }
    res
      .status(200)
      .json({ message: "Students fetched successfully", students });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching students", error: error.message });
  }
};

export const deleteStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findByIdAndDelete(id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({ message: "Student deleted successfully", student });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting student", error: error.message });
  }
};

export const updateStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedStudent = await Student.findByIdAndUpdate(id, updateData, {
      new: true, // return the updated document
      runValidators: true,
    });

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({
      message: "Student updated successfully",
      student: updatedStudent,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating student", error: error.message });
  }
};

export const getAdminProfile = async (req, res) => {
  try {
    const adminId = req.user._id;

    const admin = await Admin.findById(adminId).select("-password");

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({ admin });
  } catch (error) {
    console.error("Error fetching admin profile:", error); // ✅ Log full error
    res
      .status(500)
      .json({ message: "Error fetching admin profile", error: error.message });
  }
};

export const editAdminProfile = async (req, res) => {
  try {
    const adminId = req.user._id; // Assuming auth middleware adds user to req

    const { name, email } = req.body;

    // Validate input (optional)
    if (!name || !email) {
      return res.status(400).json({ message: "Name and Email are required." });
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(
      adminId,
      {
        name,
        email,
      },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedAdmin) {
      return res.status(404).json({ message: "Admin not found." });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      admin: updatedAdmin,
    });
  } catch (error) {
    console.error("Error updating admin profile:", error);
    res
      .status(500)
      .json({ message: "Error updating admin profile", error: error.message });
  }
};

export const deleteAdminById = async (req, res) => {
  try {
    const adminId = req.user._id;

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    await Admin.findByIdAndDelete(adminId);

    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (error) {
    console.error("Error deleting admin:", error);
    res
      .status(500)
      .json({ message: "Error deleting admin", error: error.message });
  }
};

export const getAlladmin = async (req, res) => {
  try {
    const admins = await Admin.find().select("-password");
    if (admins.length === 0) {
      return res.status(404).json({ message: "No admins found" });
    }
    res.status(200).json({ message: "Admins fetched successfully", admins });
  } catch (error) {
    res.status(500).json({ message: "Error fetching admins", error });
  }
};
