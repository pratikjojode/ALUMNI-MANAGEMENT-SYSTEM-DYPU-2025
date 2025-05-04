import dotenv from "dotenv";
import nodemailer from "nodemailer";
import Appointment from "../models/Appointment.js";
import Alumni from "../models/Alumni.js";
import Slot from "../models/Slot.js";
import mongoose from "mongoose";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendAppointmentEmail = async (
  alumniEmail,
  alumniName,
  appointmentDate,
  status = "scheduled"
) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: alumniEmail,
    subject: `Your Appointment Status - ${status}`,
    text: `Dear ${alumniName},\n\nYour appointment for receiving your Leaving Certificate has been ${status} for ${new Date(
      appointmentDate
    ).toLocaleString()}.\n\nBest regards,\nThe School Team.`,
  };

  await transporter.sendMail(mailOptions);
};

export const createAppointment = async (req, res) => {
  const { alumniId, slotId } = req.body;

  try {
    const alumni = await Alumni.findById(alumniId);
    if (!alumni) {
      return res.status(404).json({ message: "Alumni not found" });
    }

    const existingAppointment = await Appointment.findOne({ alumniId });
    if (existingAppointment) {
      return res
        .status(400)
        .json({ message: "You already have an existing appointment." });
    }

    const slot = await Slot.findById(slotId);
    if (!slot || slot.status === "booked") {
      return res.status(400).json({ message: "Slot is not available" });
    }

    if (slot.bookedCount >= slot.capacity) {
      return res
        .status(400)
        .json({ message: "Slot is full, please choose another" });
    }

    const newAppointment = new Appointment({
      alumniId,
      appointmentDate: slot.date,
      slot: slotId,
    });

    await newAppointment.save();

    slot.bookedCount += 1;
    if (slot.bookedCount === slot.capacity) {
      slot.status = "full";
    }
    await slot.save();

    await sendAppointmentEmail(
      alumni.email,
      alumni.name,
      slot.date,
      "scheduled"
    );

    res.status(201).json({ message: "Appointment scheduled successfully." });
  } catch (err) {
    console.error("Error occurred:", err);
    res
      .status(500)
      .json({ message: "Error scheduling appointment", error: err.message });
  }
};

export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("alumniId")
      .populate("slot");

    res.status(200).json(appointments);
  } catch (err) {
    console.error("Error occurred:", err);
    res
      .status(500)
      .json({ message: "Error fetching appointments", error: err.message });
  }
};

export const updateAppointmentStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    const alumni = await Alumni.findById(appointment.alumniId);
    if (alumni) {
      await sendAppointmentEmail(
        alumni.email,
        alumni.name,
        appointment.appointmentDate,
        status
      );
    }

    res.status(200).json(appointment);
  } catch (err) {
    console.error("Error occurred:", err);
    res.status(500).json({
      message: "Error updating appointment status",
      error: err.message,
    });
  }
};

export const getMyAppointment = async (req, res) => {
  const { alumniId } = req.params;

  try {
    const appointment = await Appointment.findOne({
      alumniId: new mongoose.Types.ObjectId(alumniId),
    }).populate("slot");

    res.json(appointment);
  } catch (error) {
    console.error("Error fetching appointment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteAppointment = async (req, res) => {
  const { id } = req.params;

  try {
    const appointment = await Appointment.findByIdAndDelete(id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const slot = await Slot.findById(appointment.slot);
    if (slot) {
      slot.bookedCount -= 1;
      if (slot.status === "full") {
        slot.status = "available";
      }
      await slot.save();
    }

    const alumni = await Alumni.findById(appointment.alumniId);
    if (alumni) {
      await sendAppointmentEmail(
        alumni.email,
        alumni.name,
        appointment.appointmentDate,
        "canceled"
      );
    }

    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    res.status(500).json({ message: "Server error" });
  }
};
