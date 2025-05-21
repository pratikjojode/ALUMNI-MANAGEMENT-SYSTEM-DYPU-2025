import Admin from "../models/Admin.js";
import Comment from "../models/Comment.js";
import Discussion from "../models/Discussion.js";
import InboxNotification from "../models/InboxNotification.js";

export const postComment = async (req, res) => {
  try {
    const { content, discussionId, replyTo } = req.body;
    const { user } = req;

    if (!user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (!content || !discussionId) {
      return res
        .status(400)
        .json({ message: "Content and discussionId are required." });
    }

    const comment = new Comment({
      content,
      discussionId,
      createdBy: user.id,
      createdByModel: user.role === "alumni" ? "Alumni" : "Student",
      replyTo: replyTo || null,
    });

    await comment.save();

    const populatedComment = await Comment.findById(comment._id)
      .populate("createdBy", "name email")
      .exec();

    await Discussion.findByIdAndUpdate(discussionId, {
      $push: { comments: comment._id },
    });

    // ✅ Add inbox notification for Admins
    const admins = await Admin.find();
    const notifications = admins.map((admin) => ({
      user: admin._id,
      title: "New Comment Posted",
      message: `${populatedComment.createdBy.name} posted a comment in a discussion.`,
      type: "comment",
    }));

    await InboxNotification.insertMany(notifications);

    res.status(201).json({
      message: "Comment posted successfully",
      comment: populatedComment,
    });
  } catch (error) {
    console.error("Error posting comment:", error);
    res
      .status(500)
      .json({ message: "Error posting comment", error: error.message });
  }
};

export const getCommentsForDiscussion = async (req, res) => {
  try {
    const { discussionId } = req.params;

    const discussion = await Discussion.findById(discussionId)
      .populate({
        path: "comments",
        populate: {
          path: "createdBy",
          select: "name email",
        },
      })
      .exec();

    if (!discussion) {
      return res.status(404).json({ message: "Discussion not found" });
    }

    res.status(200).json({ comments: discussion.comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res
      .status(500)
      .json({ message: "Error fetching comments", error: error.message });
  }
};

export const getCommentById = async (req, res) => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId)
      .populate("createdBy", "name email")
      .exec();

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.status(200).json({ comment });
  } catch (error) {
    console.error("Error fetching comment:", error);
    res
      .status(500)
      .json({ message: "Error fetching comment", error: error.message });
  }
};

export const replyToComment = async (req, res) => {
  try {
    const { content, commentId } = req.body;
    const { user } = req;

    if (!content || !commentId) {
      return res
        .status(400)
        .json({ message: "Content and commentId are required." });
    }

    const parentComment = await Comment.findById(commentId);

    if (!parentComment) {
      return res.status(404).json({ message: "Comment not found." });
    }

    const reply = new Comment({
      content,
      discussionId: parentComment.discussionId,
      createdBy: user.id,
      createdByModel: user.role === "alumni" ? "Alumni" : "Student",
      replyTo: commentId,
    });

    await reply.save();

    const populatedReply = await Comment.findById(reply._id)
      .populate("createdBy", "name email")
      .exec();

    await Comment.findByIdAndUpdate(commentId, {
      $push: { replies: reply._id },
    });

    res
      .status(201)
      .json({ message: "Reply posted successfully", reply: populatedReply });
  } catch (error) {
    console.error("Error posting reply:", error);
    res
      .status(500)
      .json({ message: "Error posting reply", error: error.message });
  }
};

export const deleteCommentById = async (req, res) => {
  try {
    const { commentId } = req.params;

    const deleted = await Comment.findByIdAndDelete(commentId);

    if (!deleted) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.status(200).json({
      message: "Comment deleted successfully",
      deletedComment: deleted,
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res
      .status(500)
      .json({ message: "Server error deleting comment", error: error.message });
  }
};
