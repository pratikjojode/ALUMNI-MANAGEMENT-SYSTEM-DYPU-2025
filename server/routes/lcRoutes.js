import express from "express";
import {
  createLCRequest,
  getAllLCRequests,
  approveLCRequest,
  downloadLcFromCloudinary,
  generateNoDuesPdf,
  getLcById,
} from "../controllers/lcController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/apply", protect, createLCRequest);
router.get("/getAllLc", protect, adminOnly, getAllLCRequests);
router.put("/approve/:id", protect, adminOnly, approveLCRequest);
router.post("/generate-pdf/:id", protect, adminOnly, generateNoDuesPdf);
router.get("/download/:id", protect, downloadLcFromCloudinary);
router.get("/getLc", protect, getLcById);
export default router;
