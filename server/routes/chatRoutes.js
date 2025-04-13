import express from "express";
import { sendMessage, getChat } from "../controllers/chatController.js";

const router = express.Router();

router.post("/send", sendMessage);
router.get("/:mentorId/:studentId", getChat);

export default router;
