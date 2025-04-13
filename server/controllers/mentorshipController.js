import Mentor from "../models/mentorModel.js";
import MentorshipRequest from "../models/mentorshipRequestModel.js";

export const requestMentorship = async (req, res) => {
  const { mentorId, studentId, slotId, message } = req.body;

  try {
    const mentor = await Mentor.findById(mentorId);
    if (!mentor) return res.status(404).json({ message: "Mentor not found" });

    const slot = mentor.slots.id(slotId);
    if (!slot || slot.isBooked) {
      return res.status(400).json({ message: "Slot is not available" });
    }

    const newRequest = await MentorshipRequest.create({
      mentor: mentorId,
      student: studentId,
      slotId,
      message,
    });

    slot.isBooked = true;
    await mentor.save();

    res.status(201).json({
      message: "Mentorship request sent successfully",
      request: newRequest,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get all requests for a mentor
export const getMentorshipRequestsForMentor = async (req, res) => {
  try {
    const { mentorId } = req.params;

    const requests = await MentorshipRequest.find({ mentor: mentorId })
      .populate("student", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching requests", error: error.message });
  }
};

// Update request status (accept or reject)
export const updateRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const request = await MentorshipRequest.findByIdAndUpdate(
      requestId,
      { status },
      { new: true }
    );

    if (!request) return res.status(404).json({ message: "Request not found" });

    res.status(200).json({ message: "Request status updated", request });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating request", error: error.message });
  }
};
