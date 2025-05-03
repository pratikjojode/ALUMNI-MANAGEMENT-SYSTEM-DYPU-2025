import express from "express";
import {
  createSuccessStory,
  getSuccessStories,
  getSuccessStoryById,
  deleteSuccessStory,
  updateStory,
  getOutstandingStories,
  markAsOutstanding,
  updateSuccessStory,
} from "../controllers/successStoryController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/create", upload.single("image"), createSuccessStory);

router.get("/all", getSuccessStories);

router.delete("/:id", deleteSuccessStory);

router.put("/:storyId", upload.single("image"), updateStory);

router.get("/outstanding", getOutstandingStories);

router.get("/:id", getSuccessStoryById);

router.put("/:storyId/outstanding", markAsOutstanding);

router.put("/update/:id", updateSuccessStory);

export default router;
