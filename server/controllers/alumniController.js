import Alumni from "../models/Alumni.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import Admin from "../models/Admin.js";
import { uploadImage } from "../utils/cloudinary.js";
import sendEmail from "../utils/sendEmail.js";
import InboxNotification from "../models/InboxNotification.js";

dotenv.config();

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
    // Check if alumni already exists
    const existingAlumni = await Alumni.findOne({ email });
    if (existingAlumni)
      return res.status(400).json({ message: "Email already registered" });

    let profilePhotoUrl = "";
    let resultUrl = "";

    // Upload profile photo if exists
    if (req.files?.profilePhoto && req.files.profilePhoto[0]?.buffer) {
      const uploadRes = await uploadImage(req.files.profilePhoto[0].buffer);
      profilePhotoUrl = uploadRes.secure_url;
    }

    // Academic result is required
    if (!req.files?.academicResult || !req.files.academicResult[0]?.buffer) {
      return res
        .status(400)
        .json({ message: "Academic result is required for registration" });
    }

    const resultUploadRes = await uploadImage(
      req.files.academicResult[0].buffer
    );
    resultUrl = resultUploadRes.secure_url;

    // Create alumni object
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
      academicResult: resultUrl,
      isApproved: false,
      isVisible,
    });

    await newAlumni.save();

    // Create inbox notification
    await InboxNotification.create({
      title: "New Alumni Registered",
      message: `${name} has registered and is awaiting approval.`,
      senderType: "Alumni",
      senderId: newAlumni._id,
    });

    // Notify admin
    const admin = await Admin.findOne();
    if (admin) {
      admin.alumni.push(newAlumni._id);
      await admin.save();

      await sendEmail({
        to: admin.email || process.env.EMAIL_USER,
        subject: "New Alumni Registration Pending Approval",
        text: `A new alumni has registered and is pending approval:\n\nName: ${name}\nEmail: ${email}\nCollege: ${college}\nBranch: ${branch}\nPassout Year: ${passoutYear}\nCompany: ${currentCompany}\nDesignation: ${designation}\n\nAcademic Result: ${resultUrl}`,
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
        academicResult: newAlumni.academicResult,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: "Alumni registration failed",
      error: err.message,
    });
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

export const deleteAlumni = async (req, res) => {
  try {
    const alumniId = req.params.id;

    const alumni = await Alumni.findByIdAndDelete(alumniId);

    if (!alumni) {
      return res.status(404).json({ message: "Alumni not found" });
    }

    // Return a success message
    res.status(200).json({ message: "Alumni deleted successfully" });
  } catch (err) {
    console.error("Error deleting alumni:", err);
    res.status(500).json({ message: "Server error, please try again later" });
  }
};

export const modifyAlumniProfile = async (req, res) => {
  try {
    const updates = req.body;

    if (
      req.user._id.toString() !== req.params.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "You can only update your own profile or you must be an admin",
      });
    }

    const alumni = await Alumni.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!alumni) {
      return res.status(404).json({ message: "Alumni not found" });
    }

    res.status(200).json({ message: "Profile updated successfully", alumni });
  } catch (err) {
    console.error("Error modifying alumni profile:", err);
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};
