import express from "express";
import {
  registerAlumniUser,
  loginAlumniUser,
} from "../controllers/alumniController.js";

const router = express.Router();

router.post("/registerAlumni", registerAlumniUser);
router.post("/login", loginAlumniUser);

export default router;
