import express from "express";
import { getAdminNotifications } from "../controllers/notificationController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/admin", protect, adminOnly, getAdminNotifications);

export default router;
