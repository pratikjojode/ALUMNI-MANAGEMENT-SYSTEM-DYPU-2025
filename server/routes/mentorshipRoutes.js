import express from "express";
import {
  requestMentorship,
  getMentorshipRequestsForMentor,
  updateRequestStatus,
  alreadyMentor,
} from "../controllers/mentorshipController.js";
import { alumniOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/request", requestMentorship);
router.get(
  "/requests/:alumniId",
  protect,
  alumniOnly,
  getMentorshipRequestsForMentor
);
router.get("/already-mentor/:alumniId", alreadyMentor);
router.put("/requests/:requestId/status", updateRequestStatus);

export default router;
