import express from "express";
import {
  registerAlumniUser,
  loginAlumniUser,
} from "../controllers/alumniController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post(
  "/registerAlumni",
  upload.single("profilePhoto"),
  registerAlumniUser
);
router.post("/login", loginAlumniUser);

export default router;
