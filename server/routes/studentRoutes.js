import express from "express";
import {
  registerStudent,
  loginStudent,
  getStudentProfile,
} from "../controllers/studentController.js";
import upload from "../middleware/upload.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/registerStudent", upload.single("profilePhoto"), registerStudent);
router.post("/login", loginStudent);

router.get("/profile", protect, getStudentProfile);
export default router;
