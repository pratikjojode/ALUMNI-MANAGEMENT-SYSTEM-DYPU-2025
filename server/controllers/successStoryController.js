import Alumni from "../models/Alumni.js";
import InboxNotification from "../models/InboxNotification.js";
import Student from "../models/Student.js";
import SuccessStory from "../models/SuccessStory.js";
import { uploadImage } from "../utils/cloudinary.js";
import sendDeleteSuccessStoryEmail from "../utils/sendDeleteSuccessStoryEmail.js";
import sendSuccessStoryEmail from "../utils/success.js";

export const createSuccessStory = async (req, res) => {
  try {
    const { alumni, name, shortDescription, fullDescription } = req.body;

    let imageUrl = "";
    if (req.file) {
      const uploadResult = await uploadImage(req.file.buffer);
      imageUrl = uploadResult.secure_url;
    }

    const newSuccessStory = await SuccessStory.create({
      alumni,
      name,
      shortDescription,
      fullDescription,
      image: imageUrl,
    });

    await InboxNotification.create({
      user: alumni,
      type: "success-story-created",
      message: `Your success story "${name}" has been published successfully.`,
      relatedId: newSuccessStory._id,
    });

    const studentUsers = await Student.find({}, "email");
    const alumniUsers = await Alumni.find({}, "email");

    const allEmails = [
      ...studentUsers.map((user) => user.email),
      ...alumniUsers.map((al) => al.email),
    ];

    await sendSuccessStoryEmail(allEmails, {
      name,
      shortDescription,
      fullDescription,
    });

    res.status(201).json({
      message: "🎉 Success story created successfully and emails sent!",
      newSuccessStory,
    });
  } catch (error) {
    res.status(500).json({
      message: "❌ Failed to create success story",
      error: error.message,
    });
  }
};

export const getAllSuccessStories = async (req, res) => {
  try {
    const stories = await SuccessStory.find().populate("alumni", "name email");
    res.status(200).json({ success: true, stories });
  } catch (error) {
    res.status(500).json({
      message: "❌ Failed to fetch success stories",
      error: error.message,
    });
  }
};

export const getSuccessStories = async (req, res) => {
  try {
    const successStories = await SuccessStory.find()
      .populate("alumni", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(successStories);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching success stories", error: err.message });
  }
};

export const getSuccessStoryById = async (req, res) => {
  try {
    const successStory = await SuccessStory.findById(req.params.id).populate(
      "alumni",
      "name email"
    );

    if (!successStory) {
      return res.status(404).json({ message: "Success story not found" });
    }

    res.status(200).json(successStory);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching success story", error: err.message });
  }
};

export const deleteSuccessStory = async (req, res) => {
  try {
    const successStory = await SuccessStory.findById(req.params.id).populate(
      "alumni"
    );

    if (!successStory) {
      return res.status(404).json({ message: "Success story not found" });
    }

    const emailData = {
      name: successStory.name,
      shortDescription: successStory.shortDescription,
      fullDescription: successStory.fullDescription,
      alumni: successStory.alumni,
    };

    await successStory.deleteOne();

    const recipients = [successStory.alumni?.email].filter(Boolean);
    await sendDeleteSuccessStoryEmail(recipients, emailData);

    res
      .status(200)
      .json({ message: "Success story deleted and email notification sent." });
  } catch (err) {
    res.status(500).json({
      message: "Error deleting success story",
      error: err.message,
    });
  }
};

export const updateStory = async (req, res) => {
  try {
    const { storyId } = req.params;
    const { name, shortDescription, fullDescription, alumniId } = req.body;
    const updatedImage = req.file ? req.file.path : null;

    const story = await SuccessStory.findById(storyId);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    if (story.alumni.toString() !== alumniId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this story" });
    }

    // Update the story's data
    story.name = name || story.name;
    story.shortDescription = shortDescription || story.shortDescription;
    story.fullDescription = fullDescription || story.fullDescription;

    if (updatedImage) {
      story.image = updatedImage;
    }

    // Save the updated story
    await story.save();

    res.status(200).json({
      message: "Success story updated successfully",
      data: story,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getOutstandingStories = async (req, res) => {
  try {
    const outstandingStories = await SuccessStory.find({ isOutstanding: true })
      .populate("alumni", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      stories: outstandingStories,
    });
  } catch (error) {
    res.status(500).json({
      message: "❌ Failed to fetch outstanding success stories",
      error: error.message,
    });
  }
};

export const markAsOutstanding = async (req, res) => {
  try {
    const { storyId } = req.params;
    const { isOutstanding } = req.body;

    const story = await SuccessStory.findById(storyId);
    if (!story) {
      return res.status(404).json({ message: "Success story not found" });
    }

    story.isOutstanding = isOutstanding;
    await story.save();

    res.status(200).json({
      message: `Story ${isOutstanding ? "marked" : "unmarked"} as outstanding`,
      data: story,
    });
  } catch (error) {
    res.status(500).json({
      message: "❌ Failed to update outstanding status",
      error: error.message,
    });
  }
};

export const getOutstandingStoriesByAlumni = async (req, res) => {
  try {
    const alumniId = req.params.alumniId;
    const outstandingStories = await SuccessStory.find({
      alumni: alumniId,
      isOutstanding: true,
    })
      .populate("alumni", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      stories: outstandingStories,
    });
  } catch (error) {
    res.status(500).json({
      message: "❌ Failed to fetch outstanding alumni success stories",
      error: error.message,
    });
  }
};

export const updateSuccessStory = async (req, res) => {
  const { id } = req.params;
  const { name, shortDescription, fullDescription, image, isOutstanding } =
    req.body;

  try {
    const story = await SuccessStory.findById(id);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    story.name = name || story.name;
    story.shortDescription = shortDescription || story.shortDescription;
    story.fullDescription = fullDescription || story.fullDescription;
    story.image = image || story.image;
    story.isOutstanding =
      isOutstanding !== undefined ? isOutstanding : story.isOutstanding;

    await story.save();
    res.status(200).json({ message: "Story updated successfully", story });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update the story", error: error.message });
  }
};

export const getSuccessStoryByAlumniId = async (req, res) => {
  const { alumniId } = req.params;

  try {
    const stories = await SuccessStory.find({ alumni: alumniId })
      .populate("alumni", "name email")
      .sort({ createdAt: -1 });

    if (!stories) {
      return res
        .status(404)
        .json({ message: "No stories found for this alumni" });
    }

    res.status(200).json(stories);
  } catch (error) {
    res.status(500).json({
      message: "❌ Failed to fetch success stories",
      error: error.message,
    });
  }
};

export const updateSuccessStoryByAlumniId = async (req, res) => {
  const { alumniId } = req.params;
  const { name, shortDescription, fullDescription, image } = req.body;

  try {
    const story = await SuccessStory.findOneAndUpdate(
      { alumni: alumniId },
      { name, shortDescription, fullDescription, image },
      { new: true }
    );

    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    res.status(200).json({ message: "Story updated successfully", story });
  } catch (error) {
    res.status(500).json({
      message: "❌ Failed to update success story",
      error: error.message,
    });
  }
};
