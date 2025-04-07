// src/controllers/appointmentController.js
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

const sendAppointmentEmail = async (alumniEmail, appointmentDate) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: alumniEmail,
    subject: "Appointment Scheduled for LC",
    text: `Your appointment for receiving your Leaving Certificate has been scheduled for ${new Date(
      appointmentDate
    ).toLocaleString()}.`,
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

    const slot = await Slot.findById(slotId);
    if (!slot || slot.status === "booked") {
      return res.status(400).json({ message: "Slot is not available" });
    }

    const newAppointment = new Appointment({
      alumniId,
      appointmentDate: slot.date,
      slot: slotId,
    });

    await newAppointment.save();

    // Mark the slot as booked
    slot.status = "booked";
    await slot.save();

    await sendAppointmentEmail(alumni.email, slot.date);

    res.status(201).json({ message: "Appointment scheduled successfully." });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error scheduling appointment", error: err });
  }
};

export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().populate("alumniId");
    res.status(200).json(appointments);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching appointments", error: err });
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
    res.status(200).json(appointment);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating appointment status", error: err });
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
