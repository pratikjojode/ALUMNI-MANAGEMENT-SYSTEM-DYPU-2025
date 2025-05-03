import express from "express";
import {
  applyForJob,
  deleteApplication,
  getApplicationsByStudentId,
  getAppliedJobs,
  updateApplicationStatus,
} from "../controllers/jobApplicationController.js";
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

router.get("/getAppliedJobs", protect, getAppliedJobs);
router.get(
  "/getApplicationsByStudent/:studentId",
  protect,
  getApplicationsByStudentId
);

router.patch("/:id", updateApplicationStatus);
router.delete("/:id", deleteApplication);
export default router;
