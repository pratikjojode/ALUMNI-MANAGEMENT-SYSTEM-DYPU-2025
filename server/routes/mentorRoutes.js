import express from "express";
import {
  registerMentor,
  getAllMentors,
} from "../controllers/mentorController.js";

const router = express.Router();

router.post("/register", registerMentor);
router.get("/allMentor", getAllMentors);

export default router;
