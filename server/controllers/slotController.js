// src/controllers/slotController.js

import Slot from "../models/Slot.js";

// Admin creates an available slot
export const createSlot = async (req, res) => {
  const { date } = req.body;
  try {
    const newSlot = new Slot({ date });
    await newSlot.save();

    res.status(201).json({ message: "Slot created successfully." });
  } catch (err) {
    res.status(500).json({ message: "Error creating slot", error: err });
  }
};

// Admin gets all available slots
export const getAvailableSlots = async (req, res) => {
  try {
    const slots = await Slot.find({ status: "available" });
    res.status(200).json(slots);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching available slots", error: err });
  }
};

export const getallslots = async (req, res) => {
  try {
    const slots = await Slot.find().sort({ date: 1 });
    res.status(200).send({
      success: true,
      message: "All slots fetched successfully",
      slots,
    });
  } catch (error) {
    console.error("Error fetching all slots:", error);
    return res.status(500).send({
      success: false,
      message: "Something went wrong while fetching the slots",
    });
  }
};
