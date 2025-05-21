import express from "express";
import {
  registerStudent,
  loginStudent,
  getStudentProfile,
  updateStudentProfileOnId,
} from "../controllers/studentController.js";
import upload from "../middleware/upload.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/registerStudent", upload.single("profilePhoto"), registerStudent);
router.post("/login", loginStudent);

router.get("/profile", protect, getStudentProfile);

router.put("/updateStudentProfile/:id", updateStudentProfileOnId);

export default router;
