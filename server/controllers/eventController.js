import Alumni from "../models/Alumni.js";
import { Event } from "../models/Event.js";
import sendEmail from "../utils/sendEventEmail.js";

export const createEvent = async (req, res) => {
  try {
    const { title, description, location, date } = req.body;

    const newEvent = await Event.create({
      title,
      description,
      location,
      date,
      createdBy: req.user._id,
      creatorModel: req.user.role === "alumni" ? "Alumni" : "Admin",
    });

    res.status(201).json({ success: true, event: newEvent });
  } catch (error) {
    res.status(500).json({ message: "Failed to create event", error });
  }
};

export const getEvents = async (req, res) => {
  try {
    const events = await Event.find().populate("createdBy", "name email");
    res.status(200).json({ success: true, events });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch events", error });
  }
};

export const rsvpEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { status } = req.body;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const alreadyRSVP = event.rsvps.find(
      (r) => r.alumni.toString() === req.user._id
    );
    if (alreadyRSVP) {
      alreadyRSVP.status = status;
    } else {
      event.rsvps.push({ alumni: req.user._id, status });
    }

    await event.save();

    res.status(200).json({ success: true, message: "RSVP updated" });
  } catch (error) {
    res.status(500).json({ message: "Failed to RSVP", error });
  }
};

export const sendReminders = async (req, res) => {
  try {
    const upcomingEvents = await Event.find({
      date: {
        $gte: new Date(),
        $lte: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      }, // 2 days
      reminderSent: false,
    });

    for (let event of upcomingEvents) {
      const alumniRSVP = event.rsvps.map((r) => r.alumni);
      const alumniList = await Alumni.find({ _id: { $in: alumniRSVP } });

      for (let alumni of alumniList) {
        await sendEmail(
          alumni.email,
          `Reminder: ${event.title}`,
          `<h3>Hi ${
            alumni.name
          },</h3><p>This is a reminder for the event: <strong>${
            event.title
          }</strong> happening on <strong>${new Date(
            event.date
          ).toLocaleString()}</strong> at <strong>${
            event.location
          }</strong>.</p>`
        );
      }

      event.reminderSent = true;
      await event.save();
    }

    res.status(200).json({ success: true, message: "Reminders sent" });
  } catch (error) {
    res.status(500).json({ message: "Failed to send reminders", error });
  }
};
