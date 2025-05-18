import express from "express";
import {
  requestMentorship,
  getMentorshipRequestsForMentor,
  updateRequestStatus,
  alreadyMentor,
  scheduleMentorshipSession,
  getAcceptedMentorshipRequests,
  getScheduledMentorshipSessionsForAlumni,
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

router.get(
  "/mentorshipRequests/accepted",

  getAcceptedMentorshipRequests
);
router.get(
  "/mentorship/scheduled",
  protect,

  getScheduledMentorshipSessionsForAlumni
);
router.get("/already-mentor/:alumniId", alreadyMentor);
router.put("/requests/:requestId/status", updateRequestStatus);
router.put("/schedule/:requestId", scheduleMentorshipSession);

export default router;
