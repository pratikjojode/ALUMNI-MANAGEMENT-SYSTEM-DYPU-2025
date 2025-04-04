import express from "express";
import {
  protect,
  adminOnly,
  studentOnly,
  alumniOnly,
} from "../middleware/authMiddleware.js";
import Admin from "../models/Admin.js";

const router = express.Router();

export const getAdminDashboard = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id)
      .populate("students")
      .populate("alumni");

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Check if students or alumni are empty
    if (admin.students.length === 0) {
      console.log("No students assigned to the admin.");
    }

    if (admin.alumni.length === 0) {
      console.log("No alumni assigned to the admin.");
    }

    res.status(200).json({
      message: "Welcome to the Admin Dashboard",
      user: admin,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching dashboard", error: err.message });
  }
};

// ✅ ADD THIS LINE TO FIX THE ISSUE
router.get("/admin", protect, adminOnly, getAdminDashboard);

router.get("/student", protect, studentOnly, (req, res) => {
  res.json({ message: "Welcome to the Student Dashboard", user: req.user });
});

router.get("/alumni", protect, alumniOnly, (req, res) => {
  res.json({ message: "Welcome to the Alumni Dashboard", user: req.user });
});

export default router;
