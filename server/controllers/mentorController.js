import InboxNotification from "../models/InboxNotification.js";
import Mentor from "../models/mentorModel.js";
import sendEmail from "../utils/sendEmail.js";

export const registerMentor = async (req, res) => {
  const { alumniId, bio, expertise, slots } = req.body;

  try {
    const exists = await Mentor.findOne({ alumni: alumniId });
    if (exists) {
      return res.status(400).json({
        message: "This alumni is already registered as a mentor.",
      });
    }

    const mentor = await Mentor.create({
      alumni: alumniId,
      bio,
      expertise,
      slots,
    });

    await mentor.populate("alumni", "name email");

    await sendEmail({
      to: "dypualumni@gmail.com",
      subject: "New Mentor Registered",
      text: `A new mentor has been registered on the platform.

Mentor Details:
- Name: ${mentor.alumni?.name || "N/A"}
- Email: ${mentor.alumni?.email || "N/A"}
- Bio: ${mentor.bio || "N/A"}
- Expertise: ${mentor.expertise?.join(", ") || "N/A"}
- Slots: ${mentor.slots
        .map((slot) => `${slot.date} at ${slot.time}`)
        .join(", ")}

Please review the mentor's profile.`,
    });

    const notification = new InboxNotification({
      title: "New Mentor Registered",
      message: `Mentor ${mentor.alumni?.name || "Unknown"} has registered.`,
      read: false,
      createdAt: new Date(),
    });

    await notification.save();

    res.status(201).json({
      message: "Mentor registered successfully",
      mentor,
      notification,
    });
  } catch (error) {
    console.error("Error in registerMentor:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getAllMentors = async (req, res) => {
  try {
    const mentors = await Mentor.find().populate("alumni");
    res.status(200).json(mentors);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch mentors", error: error.message });
  }
};

export const cancelBooking = async (req, res) => {
  const { mentorId, slotId } = req.params;

  try {
    const mentor = await Mentor.findById(mentorId);

    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    const slotIndex = mentor.slots.findIndex(
      (slot) => slot._id.toString() === slotId
    );

    if (slotIndex === -1) {
      return res.status(404).json({ message: "Slot not found" });
    }

    const slot = mentor.slots[slotIndex];

    if (!slot.isBooked) {
      return res.status(400).json({ message: "Slot is already available" });
    }

    mentor.slots[slotIndex].isBooked = false;

    await mentor.save();

    return res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteMentor = async (req, res) => {
  const { mentorId } = req.params;
  try {
    const mentor = await Mentor.findByIdAndDelete(mentorId);
    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }
    res.status(200).json({ message: "Mentor deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
