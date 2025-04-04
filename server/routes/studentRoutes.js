import express from "express";
import {
  registerStudent,
  loginStudent,
} from "../controllers/studentController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/registerStudent", upload.single("profilePhoto"), registerStudent);
router.post("/login", loginStudent);

export default router;
