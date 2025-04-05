// controllers/jobApplicationController.js
import JobApplication from "../models/JobApplication.js";
import { uploadImage } from "../utils/cloudinary.js"; // Correct import for uploadImage function
import JobPost from "../models/JobPost.js"; // Import JobPost model for validation

export const applyForJob = async (req, res) => {
  try {
    // Validate that a resume file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: "Resume is required" });
    }

    const { jobPostId } = req.body;

    // Validate jobPostId
    if (!jobPostId) {
      return res.status(400).json({ message: "Job Post ID is required" });
    }

    const jobPost = await JobPost.findById(jobPostId);
    if (!jobPost) {
      return res.status(404).json({ message: "Job post not found" });
    }

    const file = req.file; // Resume file uploaded

    // Upload the resume to Cloudinary using the uploadImage function
    const uploadResult = await uploadImage(file.buffer); // Use uploadImage from cloudinary.js

    // Create a new JobApplication document
    const application = new JobApplication({
      jobPostId: jobPostId, // Correct field name as per JobApplication schema
      studentId: req.user._id, // Assuming req.user is populated with the logged-in student's data
      resume: uploadResult.secure_url, // Store the Cloudinary URL of the uploaded resume
    });

    // Save the application to the database
    await application.save();

    // Return success response
    res.status(201).json({
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    console.error(error); // Log error for debugging
    res
      .status(400)
      .json({ message: "Error applying for job", error: error.message });
  }
};
