import Admin from "../models/Admin.js";
import Alumni from "../models/Alumni.js";
import Student from "../models/Student.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

export const loginUser = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    let user;

    if (role === "admin") {
      user = await Admin.findOne({ email });
    } else if (role === "alumni") {
      user = await Alumni.findOne({ email });
    } else if (role === "student") {
      user = await Student.findOne({ email });
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (!user) return res.status(400).json({ message: "Email not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};
