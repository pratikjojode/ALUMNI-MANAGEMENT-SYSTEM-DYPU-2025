import Alumni from "../models/Alumni.js";
import { Event } from "../models/Event.js";
import InboxNotification from "../models/InboxNotification.js";
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

    const notification = new InboxNotification({
      title: "New Event Created",
      message: `${req.user.name} created a new event: ${title} on ${new Date(
        date
      ).toLocaleDateString()}.`,
      createdAt: new Date(),
      isRead: false,
    });

    await notification.save();

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
      },
      reminderSent: false,
    });

    if (upcomingEvents.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No upcoming events requiring reminders",
      });
    }

    const allAlumni = await Alumni.find(
      { email: { $exists: true, $ne: "" } },
      "name email"
    );

    if (allAlumni.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No alumni with valid emails to send reminders to",
      });
    }

    const results = {
      eventsSent: 0,
      totalEmailsSent: 0,
      totalEmailsFailed: 0,
      eventDetails: [],
    };

    for (let event of upcomingEvents) {
      const eventResult = {
        eventId: event._id,
        eventTitle: event.title,
        emailsSent: 0,
        emailsFailed: 0,
        failedEmails: [],
      };

      for (let alumni of allAlumni) {
        try {
          const emailResult = await sendEmail({
            to: alumni.email,
            subject: `Reminder: ${event.title}`,
            html: `<h3>Hi ${alumni.name},</h3>
              <p>This is a reminder for the event: <strong>${
                event.title
              }</strong> happening on <strong>${new Date(
              event.date
            ).toLocaleString()}</strong> at <strong>${
              event.location
            }</strong>.</p>`,
          });

          if (emailResult) {
            eventResult.emailsSent++;
            results.totalEmailsSent++;
          } else {
            eventResult.emailsFailed++;
            eventResult.failedEmails.push(alumni.email);
            results.totalEmailsFailed++;
          }
        } catch (e) {
          console.error(`Failed to send to ${alumni.email}:`, e.message);
          eventResult.emailsFailed++;
          eventResult.failedEmails.push(alumni.email);
          results.totalEmailsFailed++;
        }
      }

      if (eventResult.emailsSent > 0) {
        event.reminderSent = true;
        await event.save();
        results.eventsSent++;
      }

      results.eventDetails.push(eventResult);
    }

    const message =
      results.totalEmailsSent > 0
        ? `Successfully sent ${results.totalEmailsSent} reminders (${results.totalEmailsFailed} failed)`
        : "Failed to send any reminders";

    res.status(200).json({
      success: results.totalEmailsSent > 0,
      message,
      details: results,
    });
  } catch (error) {
    console.error("Send reminders error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send reminders",
      error: error.message,
    });
  }
};
