import express from "express";
import {
  registerStudent,
  loginStudent,
} from "../controllers/studentController.js";

const router = express.Router();

router.post("/registerStudent", registerStudent);
router.post("/login", loginStudent);

export default router;
