import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createEvent,
  getEvents,
  rsvpEvent,
  sendReminders,
} from "../controllers/eventController.js";

const router = express.Router();

router.post("/create", protect, createEvent);
router.get("/get", protect, getEvents);
router.post("/rsvp/:eventId", protect, rsvpEvent);
router.post("/send-reminders", sendReminders);

export default router;
