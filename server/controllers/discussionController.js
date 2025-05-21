import mongoose from "mongoose";
import Admin from "../models/Admin.js";
import Alumni from "../models/Alumni.js";
import Discussion from "../models/Discussion.js";
import Student from "../models/Student.js";
import sendDiscussionDeletionEmail from "../utils/sendDiscussionDeletionEmail.js";
import sendDiscussionNotificationEmail from "../utils/sendDiscussionNotificationEmail.js";
import InboxNotification from "../models/InboxNotification.js";

export const createDiscussion = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    if (!req.user || !req.user.id) {
      return res.status(400).json({ message: "User not authenticated" });
    }

    const createdByModel = req.user.role === "alumni" ? "Alumni" : "Student";

    const discussion = new Discussion({
      title,
      description,
      category,
      createdBy: req.user.id,
      createdByModel,
    });

    await discussion.save();

    let populatedDiscussion = await Discussion.findById(discussion._id)
      .populate({
        path: "createdBy",
        model: createdByModel,
        select: "name email",
      })
      .lean();

    if (!populatedDiscussion || !populatedDiscussion.createdBy) {
      return res
        .status(500)
        .json({ message: "Failed to populate user details" });
    }

    const notification = new InboxNotification({
      title: "New Discussion Posted",
      message: `${populatedDiscussion.createdBy.name} started a discussion: ${title}`,
      createdAt: new Date(),
      isRead: false,
    });
    await notification.save();

    const adminEmails = await Admin.find().select("email -_id");
    const studentEmails = await Student.find().select("email -_id");
    const alumniEmails = await Alumni.find().select("email -_id");

    const allEmails = [
      ...adminEmails.map((u) => u.email),
      ...studentEmails.map((u) => u.email),
      ...alumniEmails.map((u) => u.email),
    ];

    await sendDiscussionNotificationEmail(allEmails, {
      title: populatedDiscussion.title,
      content: populatedDiscussion.description,
      postedBy: populatedDiscussion.createdBy.name,
    });

    res.status(201).json({
      message: "Discussion created successfully",
      discussion: populatedDiscussion,
    });
  } catch (error) {
    console.error("Error creating discussion:", error);
    res.status(500).json({
      message: "Error creating discussion",
      error: error.message,
    });
  }
};

export const getAllDiscussions = async (req, res) => {
  try {
    const discussions = await Discussion.find().lean();

    const populatedDiscussions = await Promise.all(
      discussions.map(async (discussion) => {
        let createdByUser = null;

        if (discussion.createdByModel === "Student") {
          createdByUser = await Student.findById(discussion.createdBy)
            .select("name email")
            .lean();
        } else if (discussion.createdByModel === "Alumni") {
          createdByUser = await Alumni.findById(discussion.createdBy)
            .select("name email")
            .lean();
        }

        return {
          ...discussion,
          createdBy: createdByUser,
        };
      })
    );

    res.status(200).json({ discussions: populatedDiscussions });
  } catch (error) {
    console.error("Error fetching discussions:", error);
    res
      .status(500)
      .json({ message: "Error fetching discussions", error: error.message });
  }
};

export const getDiscussionsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const discussions = await Discussion.find({ category })
      .populate("createdBy", "name email")
      .exec();

    res.status(200).json({ discussions });
  } catch (error) {
    console.error("Error fetching discussions:", error);
    res
      .status(500)
      .json({ message: "Error fetching discussions", error: error.message });
  }
};

export const getDiscussionById = async (req, res) => {
  try {
    const { discussionId } = req.params;
    const discussion = await Discussion.findById(discussionId)
      .populate("createdBy", "name email")
      .exec();

    if (!discussion) {
      return res.status(404).json({ message: "Discussion not found" });
    }

    res.status(200).json({ discussion });
  } catch (error) {
    console.error("Error fetching discussion:", error);
    res
      .status(500)
      .json({ message: "Error fetching discussion", error: error.message });
  }
};

export const toggleLikeDiscussion = async (req, res) => {
  try {
    const { discussionId } = req.params;
    const userId = req.user.id;
    const userModel = req.user.role === "alumni" ? "Alumni" : "Student";

    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
      return res.status(404).json({ message: "Discussion not found" });
    }

    const hasLiked = discussion.likes.includes(userId);

    if (hasLiked) {
      discussion.likes.pull(userId);
    } else {
      discussion.likes.push(userId);
    }

    await discussion.save();

    res.status(200).json({
      message: hasLiked ? "Unliked discussion" : "Liked discussion",
      likesCount: discussion.likes.length,
    });
  } catch (error) {
    console.error("Error toggling like:", error);
    res
      .status(500)
      .json({ message: "Error toggling like", error: error.message });
  }
};

export const deleteDiscussion = async (req, res) => {
  try {
    const discussionId = req.params.id;

    // 1. Find discussion before deleting
    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
      return res.status(404).json({ message: "Discussion not found" });
    }

    // 2. Find creator’s name
    const CreatorModel = mongoose.model(discussion.createdByModel);
    const creator = await CreatorModel.findById(discussion.createdBy).select(
      "name"
    );

    // 3. Send deletion email
    await sendDiscussionDeletionEmail({
      title: discussion.title,
      category: discussion.category,
      postedBy: creator?.name || "Unknown",
    });

    // 4. Delete discussion
    const deletedDiscussion = await Discussion.findByIdAndDelete(discussionId);

    res.status(200).json({
      message: "Discussion deleted successfully",
      deletedDiscussion,
    });
  } catch (error) {
    console.error("Error deleting discussion:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateDiscussionController = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category } = req.body;

    const discussion = await Discussion.findById(id);
    if (!discussion) {
      return res.status(404).json({ message: "Discussion not found" });
    }

    if (title) discussion.title = title;
    if (description) discussion.description = description;
    if (category) discussion.category = category;

    const updatedDiscussion = await discussion.save();

    res.status(200).json({
      message: "Discussion updated successfully",
      updatedDiscussion,
    });
  } catch (error) {
    console.error("Error updating discussion:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
