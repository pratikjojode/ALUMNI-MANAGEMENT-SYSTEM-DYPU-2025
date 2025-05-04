import express from "express";
import {
  createSlot,
  deleteSlot,
  getallslots,
  getAvailableSlots,
} from "../controllers/slotController.js";

const router = express.Router();

router.post("/create", createSlot);

router.get("/allSlots", getallslots);

router.get("/available", getAvailableSlots);

router.delete("/:id", deleteSlot);

export default router;
