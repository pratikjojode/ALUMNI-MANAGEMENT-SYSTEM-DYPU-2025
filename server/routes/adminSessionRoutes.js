import express from "express";
import {
  createAdminSession,
  getAdminSessions,
} from "../controllers/adminSessionController.js";

const router = express.Router();

router.post("/admin-session", createAdminSession);

router.get("/:adminId", getAdminSessions);

export default router;
