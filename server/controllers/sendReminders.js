import { Event } from "../models/Event.js";
import sendEmail from "../utils/sendEmail.js"; // your reusable mail function
import moment from "moment";

export const sendEventReminders = async (req, res) => {
  try {
    const now = moment();
    const nextDay = moment().add(1, "days");

    const events = await Event.find({
      reminderSent: false,
      date: { $gte: now.toDate(), $lte: nextDay.toDate() },
    }).populate("rsvps.alumni");

    for (const event of events) {
      const attendees = event.rsvps.filter((r) => r.status === "yes");

      for (const attendee of attendees) {
        const alumni = attendee.alumni;
        if (alumni?.email) {
          await sendEmail({
            to: alumni.email,
            subject: `Reminder: ${event.title}`,
            text: `Hey ${
              alumni.name
            },\n\nThis is a reminder for the upcoming event: ${
              event.title
            } on ${moment(event.date).format("MMMM Do YYYY, h:mm A")} at ${
              event.location
            }. We look forward to seeing you there!\n\n- Alumni Management System`,
          });
        }
      }

      event.reminderSent = true;
      await event.save();
    }

    res
      .status(200)
      .json({ success: true, message: "Reminders sent successfully" });
  } catch (error) {
    console.error("Error sending reminders:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send reminders",
      error: error.message,
    });
  }
};
