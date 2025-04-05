import express from "express";
import {
  registerAdminUser,
  loginAdminUser,
  approveAlumni,
} from "../controllers/adminController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/registerAdmin", registerAdminUser);
router.post("/login", loginAdminUser);
router.put("/approve-alumni/:id", protect, adminOnly, approveAlumni);

export default router;
