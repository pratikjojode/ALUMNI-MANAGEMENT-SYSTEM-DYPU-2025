import express from "express";
import {
  createAppointment,
  deleteAppointment,
  getAllAppointments,
  getMyAppointment,
  updateAppointmentStatus,
} from "../controllers/appointmentController.js";

const router = express.Router();

router.post("/create", createAppointment);

router.get("/all", getAllAppointments);

router.put("/:id/status", updateAppointmentStatus);

router.get("/my/:alumniId", getMyAppointment);

router.delete("/:id", deleteAppointment);

export default router;
