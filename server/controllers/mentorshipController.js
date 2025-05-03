import mongoose from "mongoose";
import Mentor from "../models/mentorModel.js";
import MentorshipRequest from "../models/mentorshipRequestModel.js";
import Alumni from "../models/Alumni.js";
import { sendMentorshipEmail } from "../utils/mentorshipEmailConfig.js";

export const requestMentorship = async (req, res) => {
  const { mentorId, studentId, slotId, message } = req.body;

  try {
    const mentor = await Mentor.findById(mentorId).populate("alumni");
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
      alumni: mentor.alumni._id,
    });

    slot.isBooked = true;
    await mentor.save();

    const populatedRequest = await MentorshipRequest.findById(newRequest._id)
      .populate("student", "name email")
      .populate({
        path: "mentor",
        populate: { path: "alumni", select: "name email" },
      });

    const studentName = populatedRequest.student?.name || "Student";
    const studentEmail = populatedRequest.student?.email;
    const mentorName = populatedRequest.mentor.alumni?.name || "Mentor";
    const mentorEmail = populatedRequest.mentor.alumni?.email || null;
    const slotTime = slot.time;

    // ✅ Send Email to Student
    await sendMentorshipEmail({
      to: studentEmail,
      subject: "Your Mentorship Request has been Received!",
      text: `
Hello ${studentName},

Thank you for requesting a mentorship session with ${mentorName} at DY Patil Institute of Engineering and Technology (DYPIET), Ambi Pune.

Your selected slot: ${slotTime}

Message: ${message}

We will notify you once your request is accepted or rejected.

Best regards,  
DY Alumni Team  
DY Patil Institute of Engineering and Technology, Ambi Pune  
      `,
    });

    // ✅ Send Email to Admin
    await sendMentorshipEmail({
      to: "dypualumni@gmail.com",
      subject: "New Mentorship Request - DYPIET Ambi Pune",
      text: `
A new mentorship request has been submitted.

Student: ${studentName}
Mentor: ${mentorName}
Slot: ${slotTime}
Message: ${message}

Please review it in the admin panel.

Best regards,  
DY Alumni Team  
DY Patil Institute of Engineering and Technology, Ambi Pune  
      `,
    });

    // ✅ Send Email to Mentor (if mentor email exists)
    if (mentorEmail) {
      await sendMentorshipEmail({
        to: mentorEmail,
        subject: "New Mentorship Request from DY Alumni System",
        text: `
Hello ${mentorName},

You have received a new mentorship request from ${studentName} at DY Patil Institute of Engineering and Technology, Ambi Pune.

Slot: ${slotTime}
Message: ${message}

Please log into the DY Alumni System to accept or reject this request.

Best regards,  
DY Alumni Team  
DY Patil Institute of Engineering and Technology, Ambi Pune  
        `,
      });
    }

    res.status(201).json({
      message: "Mentorship request sent successfully",
      request: newRequest,
    });
  } catch (error) {
    console.error("Mentorship Request Error:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getMentorshipRequestsForMentor = async (req, res) => {
  try {
    const { alumniId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(alumniId)) {
      return res.status(400).json({ message: "Invalid alumniId" });
    }

    const alumni = await Alumni.findById(alumniId);
    if (!alumni) {
      return res.status(404).json({ message: "Alumni not found" });
    }

    const mentor = await Mentor.findOne({ alumni: alumniId });
    if (!mentor) {
      return res
        .status(404)
        .json({ message: "No mentor found for this alumni" });
    }

    const requests = await MentorshipRequest.find({ mentor: mentor._id })
      .populate("student", "name email")
      .populate({
        path: "mentor",
        model: "Mentor",
        select: "alumni bio expertise slots",
      })
      .sort({ createdAt: -1 });

    const processedRequests = requests.map((request) => {
      const slot = mentor.slots.find(
        (s) => s._id.toString() === request.slotId.toString()
      );
      if (slot) {
        request.slotId = slot;
      }
      return request;
    });

    res.status(200).json(processedRequests);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching requests",
      error: error.message,
    });
  }
};

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
    )
      .populate("student", "name email")
      .populate({
        path: "mentor",
        populate: {
          path: "alumni",
          select: "name email bio specialization college expertise",
        },
      });

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    const studentEmail = request.student?.email;
    const studentName = request.student?.name || "Student";


    if (!studentEmail) {
      return res.status(400).json({ message: "Student email not found" });
    }

    // Extract mentor (alumni) info with fallback values
    const alumni = request.mentor?.alumni || {};
    const mentorName = alumni.name || "N/A";
    const mentorEmail = alumni.email || "N/A";
    const mentorBio = alumni.bio || "N/A";
    const mentorSpecialization = alumni.specialization || "N/A";
    const mentorCollege = alumni.college || "N/A";
    const mentorExpertise =
      Array.isArray(alumni.expertise) && alumni.expertise.length > 0
        ? alumni.expertise.join(", ")
        : "N/A";

 
    const studentSubject = `Your mentorship request has been ${status}`;
    const studentText = `
Dear ${studentName},

Your mentorship request has been ${status}. 

${
  status === "accepted"
    ? "🎉 Congratulations! You have been matched with the following mentor. We will contact you shortly with next steps."
    : "🙏 Thank you for applying. We encourage you to try again in the future."
}

Mentor Information:
- Name: ${mentorName}
- Email: ${mentorEmail}
- Bio: ${mentorBio}
- Specialization: ${mentorSpecialization}
- College: ${mentorCollege}
- Expertise: ${mentorExpertise}

Available Slots:
No slots available

Regards,  
DY Alumni Management Team
`;

    // ✅ Admin Email Content
    const adminSubject = `Mentorship Request ${status.toUpperCase()} - ${studentName}`;
    const adminText = `
Hello Admin,

The mentorship request from ${studentName} (Request ID: ${requestId}) has been marked as '${status}'.

Mentor Details:
- Name: ${mentorName}
- Email: ${mentorEmail}
- Bio: ${mentorBio}
- Specialization: ${mentorSpecialization}
- College: ${mentorCollege}
- Expertise: ${mentorExpertise}

Available Slots:
No slots available

Student Details:
- Name: ${studentName}
- Email: ${studentEmail}

Please log into the admin panel to view the full details.

Regards,  
DY Alumni System
`;

    // ✅ Send Emails
    await sendMentorshipEmail({
      to: studentEmail,
      subject: studentSubject,
      text: studentText,
    });

    await sendMentorshipEmail({
      to: "dypualumni@gmail.com",
      subject: adminSubject,
      text: adminText,
    });

    // Respond with success
    res
      .status(200)
      .json({ message: "Request status updated and emails sent", request });
  } catch (error) {
    console.error("Email Error:", error);
    res
      .status(500)
      .json({ message: "Error updating request", error: error.message });
  }
};
