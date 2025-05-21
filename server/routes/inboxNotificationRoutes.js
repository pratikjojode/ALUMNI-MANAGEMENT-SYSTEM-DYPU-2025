// routes/inboxNotificationRoutes.js
import express from "express";
import {
  getAllNotifications,
  markNotificationAsRead,
  deleteNotification,
} from "../controllers/inboxNotificationController.js";

const router = express.Router();

router.get("/", getAllNotifications);
router.patch("/:id/read", markNotificationAsRead);
router.delete("/:id", deleteNotification);

export default router;
