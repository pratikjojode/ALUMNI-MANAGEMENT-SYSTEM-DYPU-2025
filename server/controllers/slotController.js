import Slot from "../models/Slot.js";
import Appointment from "../models/Appointment.js";
import InboxNotification from "../models/InboxNotification.js";

export const createSlot = async (req, res) => {
  const { date, capacity } = req.body;
  try {
    if (!capacity || capacity <= 0) {
      return res
        .status(400)
        .json({ message: "Capacity must be a positive number" });
    }

    const newSlot = new Slot({
      date,
      capacity,
      bookedCount: 0,
      status: "available",
    });

    await newSlot.save();

    const notification = new InboxNotification({
      title: "New Slot Created",
      message: `A new slot has been created for ${new Date(
        date
      ).toLocaleDateString()} with capacity ${capacity}.`,
      createdAt: new Date(),
      isRead: false,
    });

    await notification.save();

    res.status(201).json({ message: "Slot created successfully.", newSlot });
  } catch (err) {
    res.status(500).json({ message: "Error creating slot", error: err });
  }
};

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

    const updatedSlots = await Promise.all(
      slots.map(async (slot) => {
        const count = await Appointment.countDocuments({ slot: slot._id });
        return {
          ...slot.toObject(),
          bookedCount: count,
        };
      })
    );

    res.status(200).send({
      success: true,
      message: "All slots fetched successfully",
      slots: updatedSlots,
    });
  } catch (error) {
    console.error("Error fetching all slots:", error);
    return res.status(500).send({
      success: false,
      message: "Something went wrong while fetching the slots",
    });
  }
};

export const deleteSlot = async (req, res) => {
  const { id } = req.params;
  try {
    const slot = await Slot.findByIdAndDelete(id);
    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }
    res.status(200).json({ message: "Slot deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: "Error deleting slot", error: err });
  }
};
