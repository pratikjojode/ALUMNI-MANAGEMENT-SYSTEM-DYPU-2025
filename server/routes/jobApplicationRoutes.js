// routes/jobApplicationRoutes.js
import express from "express";
import { applyForJob } from "../controllers/jobApplicationController.js";
import upload from "../middleware/upload.js";
import { protect, studentOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/apply",
  protect,
  studentOnly,
  upload.single("resume"),
  applyForJob
);

export default router;
