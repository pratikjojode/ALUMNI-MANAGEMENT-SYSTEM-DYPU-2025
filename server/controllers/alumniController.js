import Alumni from "../models/Alumni.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import Admin from "../models/Admin.js";
import { uploadImage } from "../utils/cloudinary.js";
import sendEmail from "../utils/sendEmail.js";

dotenv.config();

// Register alumni user
export const registerAlumniUser = async (req, res) => {
  const {
    name,
    email,
    contactNo,
    college,
    branch,
    passoutYear,
    currentCompany,
    designation,
    location,
    LinkedIn,
    Instagram,
    password,
    isVisible = true,
  } = req.body;

  try {
    const existingAlumni = await Alumni.findOne({ email });
    if (existingAlumni)
      return res.status(400).json({ message: "Email already registered" });

    let profilePhotoUrl = "";
    if (req.file && req.file.buffer) {
      const uploadRes = await uploadImage(req.file.buffer);
      profilePhotoUrl = uploadRes.secure_url;
    }

    const newAlumni = new Alumni({
      name,
      email,
      contactNo,
      profilePhoto: profilePhotoUrl,
      college,
      branch,
      passoutYear,
      currentCompany,
      designation,
      location,
      LinkedIn,
      Instagram,
      password,
      role: "alumni",
      isApproved: false, // Initially false, pending approval
      isVisible, // Default to true (but can be updated later)
    });

    await newAlumni.save();

    const admin = await Admin.findOne();
    if (admin) {
      admin.alumni.push(newAlumni._id);
      await admin.save();

      // Notify admin of new alumni
      await sendEmail({
        to: admin.email || process.env.EMAIL_USER,
        subject: "New Alumni Registration Pending Approval",
        text: `A new alumni has registered and is pending approval:\n\nName: ${name}\nEmail: ${email}\nCollege: ${college}\nBranch: ${branch}\nPassout Year: ${passoutYear}\nCompany: ${currentCompany}\nDesignation: ${designation}`,
      });
    }

    res.status(201).json({
      message: "Alumni registered successfully. Awaiting admin approval.",
      alumni: {
        id: newAlumni._id,
        name: newAlumni.name,
        email: newAlumni.email,
        isApproved: newAlumni.isApproved,
        isVisible: newAlumni.isVisible,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: "Alumni registration failed",
      error: err.message,
    });
  }
};

// Alumni login
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
        isVisible: alumni.isVisible,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Alumni login failed", error: err.message });
  }
};

// Update alumni profile
export const updateAlumniProfile = async (req, res) => {
  try {
    const updates = req.body;
    const alumni = await Alumni.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.status(200).json({ message: "Profile updated successfully", alumni });
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};

// Search alumni
export const searchAlumni = async (req, res) => {
  try {
    const {
      name,
      passoutYear,
      designation,
      location,
      page = 1,
      limit = 10,
    } = req.query;

    const query = {
      isApproved: true,
      isVisible: true,
    };

    if (name) query.name = { $regex: name, $options: "i" };
    if (passoutYear) query.passoutYear = passoutYear;
    if (designation) query.designation = { $regex: designation, $options: "i" };
    if (location) query.location = { $regex: location, $options: "i" };

    const skip = (page - 1) * limit;

    const alumniList = await Alumni.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .select("-password");

    res.status(200).json({
      message: "Alumni fetched successfully",
      total: alumniList.length,
      alumni: alumniList,
    });
  } catch (err) {
    res.status(500).json({ message: "Search failed", error: err.message });
  }
};

// Get individual alumni profile
export const getAlumniProfile = async (req, res) => {
  try {
    const alumni = await Alumni.findById(req.user._id).select("-password");
    res.status(200).json({ alumni });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching profile", error: err.message });
  }
};

export const getAllAlumni = async (req, res) => {
  try {
    const alumniList = await Alumni.find().select("-password");

    res.status(200).json({
      message: "All alumni fetched successfully",
      total: alumniList.length,
      alumni: alumniList,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch alumni",
      error: error.message,
    });
  }
};
