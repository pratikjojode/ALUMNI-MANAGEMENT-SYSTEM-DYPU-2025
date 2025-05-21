import mongoose from "mongoose";
import { Project } from "../models/Project.js";
import Alumni from "../models/Alumni.js";
import Student from "../models/Student.js";
import { sendProjectCreationEmail } from "../utils/emailSenderProjects.js";

export const createProject = async (req, res) => {
  try {
    const { title, description, studentId, donationGoal } = req.body;

    if (!title || !description || !studentId) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    const project = await Project.create({
      title,
      description,
      studentId,
      donationGoal,
    });

    const student = await Student.findById(studentId);
    const alumni = await Alumni.findOne({ branch: student.branch });

    if (student && alumni) {
      await sendProjectCreationEmail(
        student.email,
        alumni.email,
        process.env.ADMIN_EMAIL,
        {
          title: project.title,
          description: project.description,
          donationGoal: project.donationGoal || 0,
        }
      );
    }

    return res.status(201).json({
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate(
      "studentId",
      "name email prn"
    );
    if (!projects || projects.length === 0) {
      return res.status(404).json({ message: "No projects found" });
    }
    return res.status(200).json({
      message: "Projects fetched successfully",
      projects,
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getAllProjectForAdmin = async (req, res) => {
  try {
    const projects = await Project.find().populate(
      "studentId",
      "name email contactNo college branch"
    );

    if (!projects || projects.length === 0) {
      return res.status(404).json({ message: "No projects found" });
    }

    return res.status(200).json({
      message: "Projects fetched successfully",
      projects,
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
export const getProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;

    console.log("Received project ID:", projectId);

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    const project = await Project.findById(projectId).populate(
      "studentId",
      "name email prn"
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    return res.status(200).json({
      message: "Project fetched successfully",
      project,
    });
  } catch (error) {
    console.error("Error fetching project:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
export const updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, donationGoal } = req.body;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    const project = await Project.findByIdAndUpdate(
      projectId,
      { title, description, donationGoal },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    return res.status(200).json({
      message: "Project updated successfully",
      project,
    });
  } catch (error) {
    console.error("Error updating project:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
export const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    const project = await Project.findByIdAndDelete(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    return res.status(200).json({
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting project:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
export const getProjectsByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ message: "Invalid student ID" });
    }

    const projects = await Project.find({ studentId }).populate(
      "studentId",
      "name email prn"
    );

    if (!projects || projects.length === 0) {
      return res.status(404).json({ message: "No projects found" });
    }

    return res.status(200).json({
      message: "Projects fetched successfully",
      projects,
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
