import express from "express";
import {
  registerAlumniUser,
  loginAlumniUser,
  updateAlumniProfile,
  searchAlumni,
  getAlumniProfile,
  getAllAlumni,
  deleteAlumni,
  modifyAlumniProfile,
} from "../controllers/alumniController.js";
import upload from "../middleware/upload.js";
import {
  adminOnly,
  alumniOnly,
  protect,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/registerAlumni",
  upload.single("profilePhoto"),
  registerAlumniUser
);
router.post("/login", loginAlumniUser);
router.put("/update-profile", protect, alumniOnly, updateAlumniProfile);

router.get("/search", searchAlumni);

router.get("/profile", protect, alumniOnly, getAlumniProfile);

router.get("/all", getAllAlumni);
router.delete("/deleteAlumni/:id", protect, adminOnly, deleteAlumni);

router.put("/updateProfile/:id", protect, modifyAlumniProfile);

export default router;
