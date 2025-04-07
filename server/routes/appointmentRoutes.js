// src/routes/appointmentRoutes.js
import express from "express";
import {
  createAppointment,
  getAllAppointments,
  getMyAppointment,
  updateAppointmentStatus,
} from "../controllers/appointmentController.js";

const router = express.Router();

router.post("/create", createAppointment);

router.get("/all", getAllAppointments);

router.put("/:id/status", updateAppointmentStatus);

router.get("/my/:alumniId", getMyAppointment);

export default router;
