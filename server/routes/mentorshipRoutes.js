import express from "express";
import {
  requestMentorship,
  getMentorshipRequestsForMentor,
  updateRequestStatus,
} from "../controllers/mentorshipController.js";

const router = express.Router();

router.post("/request", requestMentorship);
router.get("/requests/:mentorId", getMentorshipRequestsForMentor);
router.put("/requests/:requestId/status", updateRequestStatus);

export default router;
