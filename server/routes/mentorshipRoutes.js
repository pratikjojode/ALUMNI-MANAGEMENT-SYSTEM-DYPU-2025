import express from "express";
import {
  requestMentorship,
  getMentorshipRequestsForMentor,
  updateRequestStatus,
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
router.put("/requests/:requestId/status", updateRequestStatus);

export default router;
