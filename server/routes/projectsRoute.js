import express from "express";
import {
  createProject,
  deleteProject,
  getAllProjectForAdmin,
  getAllProjects,
  getProjectById,
  getProjectsByStudentId,
  updateProject,
} from "../controllers/projectController.js";

const router = express.Router();

router.post("/create", createProject);

router.get("/getProjects", getAllProjects);

router.get("/getAllProjectsForAdmin", getAllProjectForAdmin);

router.get("/:projectId", getProjectById);
router.put("/:projectId", updateProject);
router.delete("/:projectId", deleteProject);
router.get("/studentProjects/:studentId", getProjectsByStudentId);

export default router;
