import express from "express";
import {
  registerMentor,
  getAllMentors,
  cancelBooking,
  deleteMentor,
} from "../controllers/mentorController.js";

const router = express.Router();

router.post("/register", registerMentor);
router.get("/allMentor", getAllMentors);
router.put("/:mentorId/slots/:slotId/cancelBooking", cancelBooking);
router.delete("/:mentorId", deleteMentor);

export default router;
