import express from "express";
import {
  registerAdminUser,
  loginAdminUser,
  approveAlumni,
  getAllStudentsAdmin,
  deleteStudentById,
  updateStudentById,
  getAdminProfile,
  editAdminProfile,
  deleteAdminById,
  getAlladmin,
  adminRegisterAlumniExcel,
} from "../controllers/adminController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/registerAdmin", registerAdminUser);
router.post("/login", loginAdminUser);
router.post("/upload-alumni", adminRegisterAlumniExcel);
router.put("/approve-alumni/:id", protect, adminOnly, approveAlumni);

router.get("/allStudents", protect, adminOnly, getAllStudentsAdmin);

router.delete("/delete-student/:id", protect, adminOnly, deleteStudentById);
router.put("/update-student/:id", protect, adminOnly, updateStudentById);

router.get("/getAdminProfile", protect, adminOnly, getAdminProfile);

router.put("/updateAdminProfile", protect, adminOnly, editAdminProfile);

router.delete("/deleteMe", protect, adminOnly, deleteAdminById);

router.get("/allAdmin", protect, getAlladmin);

export default router;
