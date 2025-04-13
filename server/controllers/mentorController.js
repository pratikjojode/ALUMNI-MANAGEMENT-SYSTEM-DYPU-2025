import Mentor from "../models/mentorModel.js";

export const registerMentor = async (req, res) => {
  const { alumniId, bio, expertise, slots } = req.body;

  try {
    const exists = await Mentor.findOne({ alumni: alumniId });
    if (exists) {
      return res
        .status(400)
        .json({ message: "This alumni is already registered as a mentor." });
    }

    const mentor = await Mentor.create({
      alumni: alumniId,
      bio,
      expertise,
      slots,
    });

    res.status(201).json({
      message: "Mentor registered successfully",
      mentor,
    });
  } catch (error) {
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
