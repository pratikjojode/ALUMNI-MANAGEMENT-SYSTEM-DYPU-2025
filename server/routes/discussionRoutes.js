import express from "express";
import {
  createDiscussion,
  getAllDiscussions,
  getDiscussionsByCategory,
  getDiscussionById,
  toggleLikeDiscussion,
  deleteDiscussion,
  updateDiscussionController,
} from "../controllers/discussionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/createDis", protect, createDiscussion);

router.get("/getDis", protect, getAllDiscussions);

router.get("/category/:category", protect, getDiscussionsByCategory);

router.get("/:discussionId", protect, getDiscussionById);

router.patch("/like/:discussionId", protect, toggleLikeDiscussion);

router.delete("/delete-discussion/:id", deleteDiscussion);

router.put(
  "/update-discussion/:id",
  updateDiscussionController
);

export default router;
