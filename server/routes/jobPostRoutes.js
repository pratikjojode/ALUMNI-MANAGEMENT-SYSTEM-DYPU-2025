// routes/jobPostRoutes.js
import express from "express";
import {
  createJobPost,
  getJobPosts,
  reviewAndApproveJobPost,
} from "../controllers/jobPostController.js";
import {
  protect,
  alumniOnly,
  adminOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/job-post", protect, alumniOnly, createJobPost);

router.get("/job-posts", getJobPosts);

router.put("/approve", protect, adminOnly, reviewAndApproveJobPost);
export default router;
