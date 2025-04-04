import express from "express";
import {
  registerAdminUser,
  loginAdminUser,
} from "../controllers/adminController.js";

const router = express.Router();

router.post("/registerAdmin", registerAdminUser);
router.post("/login", loginAdminUser);

export default router;
