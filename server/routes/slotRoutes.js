// src/routes/slotRoutes.js
import express from "express";
import {
  createSlot,
  getallslots,
  getAvailableSlots,
} from "../controllers/slotController.js";

const router = express.Router();

router.post("/create", createSlot);

router.get("/allSlots", getallslots);

router.get("/available", getAvailableSlots);

export default router;
