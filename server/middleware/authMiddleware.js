import jwt from "jsonwebtoken";
import Student from "../models/Student.js";
import Alumni from "../models/Alumni.js";
import Admin from "../models/Admin.js";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, token missing" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("Decoded JWT:", decoded);

    let user = await Student.findById(decoded.id).select("-password");
    if (!user) {
      user = await Alumni.findById(decoded.id).select("-password");
    }
    if (!user) {
      user = await Admin.findById(decoded.id).select("-password");
    }
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    console.log("User found:", user);

    req.user = user;
    next();
  } catch (err) {
    console.error("Error in protect middleware:", err);
    res
      .status(401)
      .json({ message: "Invalid/Expired token", error: err.message });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};

export const studentOnly = (req, res, next) => {
  if (req.user.role !== "student") {
    return res.status(403).json({ message: "Student access only" });
  }
  next();
};

export const alumniOnly = (req, res, next) => {
  if (req.user.role !== "alumni") {
    return res.status(403).json({ message: "Alumni access only" });
  }
  next();
};
