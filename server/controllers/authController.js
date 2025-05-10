// controllers/authController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { transporter } from "../utils/mailService.js";
import otpStore from "../utils/otpStore.js";
import Admin from "../models/Admin.js";
import Alumni from "../models/Alumni.js";
import Student from "../models/Student.js";
import dotenv from "dotenv";
dotenv.config();

export const loginUser = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    let user;
    if (role === "admin") user = await Admin.findOne({ email });
    else if (role === "alumni") user = await Alumni.findOne({ email });
    else if (role === "student") user = await Student.findOne({ email });
    else return res.status(400).json({ message: "Invalid role" });

    if (!user) return res.status(400).json({ message: "Email not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Wrong password" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000;

    otpStore.set(email, { otp, expiresAt });

    await transporter.sendMail({
      from: `"DY Patil University, Pune (Ambi)" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🔐 Login OTP Verification - DY Patil University",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f6f8;">
          <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
            <div style="background-color: #003366; color: white; padding: 20px; text-align: center;">
              <h2 style="margin: 0;">DY Patil University, Pune (Ambi)</h2>
              <p style="margin: 5px 0;">Secure Login OTP</p>
            </div>
            <div style="padding: 30px; text-align: center;">
              <h3 style="margin-top: 0;">Hello 👋,</h3>
              <p style="font-size: 16px;">Use the OTP below to continue your login process:</p>
              <div style="font-size: 28px; margin: 20px 0; font-weight: bold; letter-spacing: 4px; color: #003366;">
                ${otp}
              </div>
              <p>This OTP is valid for <strong>5 minutes</strong>.</p>
              <p style="color: #888;">If you did not initiate this request, you can safely ignore this email.</p>
            </div>
            <div style="background-color: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; color: #777;">
              &copy; ${new Date().getFullYear()} DY Patil University, Pune (Ambi). All rights reserved.
            </div>
          </div>
        </div>
      `,
    });

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp, role } = req.body;

  const stored = otpStore.get(email);

  console.log("Stored OTP:", stored ? stored.otp : null);
  console.log("OTP Expiry Time:", stored ? new Date(stored.expiresAt) : null);

  if (!stored)
    return res.status(400).json({ message: "No OTP found for this email" });

  if (Date.now() > stored.expiresAt) {
    otpStore.delete(email);
    return res.status(400).json({ message: "OTP expired" });
  }

  if (stored.otp !== otp)
    return res.status(400).json({ message: "Invalid OTP" });

  let user;
  if (role === "admin") user = await Admin.findOne({ email });
  else if (role === "alumni") user = await Alumni.findOne({ email });
  else if (role === "student") user = await Student.findOne({ email });

  if (!user) return res.status(400).json({ message: "User not found" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  otpStore.delete(email);

  res.status(200).json({
    message: "OTP verified successfully",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

export const forgotPassword = async (req, res) => {
  const { email, role } = req.body;

  try {
    let user;
    if (role === "admin") user = await Admin.findOne({ email });
    else if (role === "alumni") user = await Alumni.findOne({ email });
    else if (role === "student") user = await Student.findOne({ email });
    else return res.status(400).json({ message: "Invalid role" });

    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000;

    otpStore.set(email, { otp, expiresAt });

    await transporter.sendMail({
      from: `"DY Patil University, Pune (Ambi)" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🔐 Password Reset OTP - DY Patil University",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f6f8;">
          <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
            <div style="background-color: #003366; color: white; padding: 20px; text-align: center;">
              <h2 style="margin: 0;">DY Patil University, Pune (Ambi)</h2>
              <p style="margin: 5px 0;">Reset Password OTP</p>
            </div>
            <div style="padding: 30px; text-align: center;">
              <h3 style="margin-top: 0;">Hello 👋,</h3>
              <p style="font-size: 16px;">Use the OTP below to reset your password:</p>
              <div style="font-size: 28px; margin: 20px 0; font-weight: bold; letter-spacing: 4px; color: #003366;">
                ${otp}
              </div>
              <p>This OTP is valid for <strong>5 minutes</strong>.</p>
              <p style="color: #888;">If you didn’t request this, just ignore it.</p>
            </div>
            <div style="background-color: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; color: #777;">
              &copy; ${new Date().getFullYear()} DY Patil University, Pune (Ambi). All rights reserved.
            </div>
          </div>
        </div>
      `,
    });

    res.status(200).json({ message: "OTP sent to email for password reset" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to send OTP", error: error.message });
  }
};

export const resetPassword = async (req, res) => {
  const { email, role, otp, newPassword } = req.body;

  try {
    const stored = otpStore.get(email);

    if (!stored) {
      return res.status(400).json({ message: "No OTP found" });
    }

    if (Date.now() > stored.expiresAt) {
      otpStore.delete(email);
      return res.status(400).json({ message: "OTP expired" });
    }

    if (stored.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    let user;
    if (role === "admin") user = await Admin.findOne({ email });
    else if (role === "alumni") user = await Alumni.findOne({ email });
    else if (role === "student") user = await Student.findOne({ email });
    else return res.status(400).json({ message: "Invalid role" });

    if (!user) return res.status(404).json({ message: "User not found" });

    // ✅ Don't hash manually — let the pre("save") do it
    user.password = newPassword;
    await user.save();

    otpStore.delete(email);

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
