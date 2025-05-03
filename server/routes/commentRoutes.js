import express from "express";
import {
  postComment,
  getCommentsForDiscussion,
  getCommentById,
  replyToComment,
  deleteCommentById,
} from "../controllers/commentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", protect, postComment);

router.get("/discussion/:discussionId", protect, getCommentsForDiscussion);

router.get("/:commentId", protect, getCommentById);

router.post("/reply", protect, replyToComment);

router.delete("/deleteComment/:commentId", deleteCommentById);
export default router;
