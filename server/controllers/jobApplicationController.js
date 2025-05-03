import JobApplication from "../models/JobApplication.js";
import { uploadImage } from "../utils/cloudinary.js";
import JobPost from "../models/JobPost.js";
import {
  sendMailToAdmin,
  sendMailToAlumni,
  sendMailToStudent,
} from "../utils/sendMailToAdmin.js";
import Student from "../models/Student.js";

import Alumni from "../models/Alumni.js";
import sendJobEmail from "../utils/jobMailer.js";

export const applyForJob = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Resume is required" });
    }

    const { jobPostId } = req.body;

    if (!jobPostId) {
      return res.status(400).json({ message: "Job Post ID is required" });
    }

    const jobPost = await JobPost.findById(jobPostId).populate("postedBy");
    if (!jobPost) {
      return res.status(404).json({ message: "Job post not found" });
    }

    const file = req.file;
    const uploadResult = await uploadImage(file.buffer);

    const application = new JobApplication({
      jobPostId,
      studentId: req.user._id,
      resume: uploadResult.secure_url,
    });

    await application.save();

    const student = await Student.findById(req.user._id);
    const alumni = jobPost.postedBy;

    await sendMailToAdmin({
      adminEmail: "dypualumni@gmail.com",
      studentName: student.name,
      studentEmail: student.email,
      jobTitle: jobPost.title,
      resumeUrl: uploadResult.secure_url,
    });

    await sendMailToStudent({
      studentEmail: student.email,
      studentName: student.name,
      jobTitle: jobPost.title,
    });

    if (alumni && alumni.email) {
      await sendMailToAlumni({
        alumniEmail: alumni.email,
        alumniName: alumni.name,
        jobTitle: jobPost.title,
        studentName: student.name,
        studentEmail: student.email,
        resumeUrl: uploadResult.secure_url,
      });
    } else {
      console.log("No alumni email found");
    }

    res.status(201).json({
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .json({ message: "Error applying for job", error: error.message });
  }
};

export const getAppliedJobs = async (req, res) => {
  try {
    const applications = await JobApplication.find()
      .populate("jobPostId", "title companyName location postedBy")
      .populate("studentId", "name email")
      .populate("jobPostId.postedBy", "name email")
      .sort({ applicationDate: -1 });

    if (!applications || applications.length === 0) {
      return res.status(404).json({
        message: "No applied jobs found",
      });
    }

    return res.status(200).json({
      message: "All applied jobs fetched successfully",
      data: applications,
    });
  } catch (error) {
    console.error("Error fetching applied jobs:", error);
    return res.status(500).json({
      message: "Failed to fetch applied jobs",
      error: error.message,
    });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !["pending", "accepted", "rejected"].includes(status)) {
      return res.status(400).json({
        status: "fail",
        message:
          "Please provide a valid status (pending, accepted, or rejected)",
      });
    }

    const updatedApplication = await JobApplication.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    )
      .populate("studentId")
      .populate("jobPostId");

    if (!updatedApplication) {
      return res.status(404).json({
        status: "fail",
        message: "No job application found with that ID",
      });
    }

    const jobCreator = await Alumni.findById(
      updatedApplication.jobPostId.postedBy
    );

    const applicantName = updatedApplication.studentId.name;
    const jobTitle = updatedApplication.jobPostId.title;
    const jobLocation = updatedApplication.jobPostId.location;
    const jobCompany = updatedApplication.jobPostId.companyName;

    const applicantText = `
      Dear ${applicantName},

      We wanted to inform you that the status of your job application for the position of ${jobTitle} at ${jobCompany} has been updated to ${status}.
      
      Job Location: ${jobLocation}
      
      We wish you the best and will be in touch if you are selected for further stages.
      
      Regards,
      The Recruitment Team
    `;

    const applicantHtml = `
      <p>Dear <strong>${applicantName}</strong>,</p>
      <p>We wanted to inform you that the status of your job application for the position of <strong>${jobTitle}</strong> at <strong>${jobCompany}</strong> has been updated to <strong>${status}</strong>.</p>
      <p><strong>Job Location:</strong> ${jobLocation}</p>
      <p>We wish you the best and will be in touch if you are selected for further stages.</p>
      <p>Regards,</p>
      <p>The Recruitment Team</p>
    `;

    await sendJobEmail(
      updatedApplication.studentId.email,
      `Your Job Application Status for ${jobTitle}`,
      applicantText,
      applicantHtml
    );

    const jobCreatorName = jobCreator.name;

    const jobCreatorText = `
      Dear ${jobCreatorName},

      We wanted to inform you that the job application from ${applicantName} for your job posting titled "${jobTitle}" has been updated to ${status}.
      
      Job Location: ${jobLocation}
      Applicant Email: ${updatedApplication.studentId.email}
      
      Thank you for your engagement with our recruitment process. We will notify you about any further updates.
      
      Regards,
      The Recruitment Team
    `;

    const jobCreatorHtml = `
      <p>Dear <strong>${jobCreatorName}</strong>,</p>
      <p>We wanted to inform you that the job application from <strong>${applicantName}</strong> for your job posting titled "<strong>${jobTitle}</strong>" has been updated to <strong>${status}</strong>.</p>
      <p><strong>Job Location:</strong> ${jobLocation}</p>
      <p><strong>Applicant Email:</strong> ${updatedApplication.studentId.email}</p>
      <p>Thank you for your engagement with our recruitment process. We will notify you about any further updates.</p>
      <p>Regards,</p>
      <p>The Recruitment Team</p>
    `;

    // Send email to the job creator
    await sendJobEmail(
      jobCreator.email, // Job creator's email (alumni)
      `Job Application Status Update for ${jobTitle}`,
      jobCreatorText,
      jobCreatorHtml
    );

    res.status(200).json({
      status: "success",
      data: updatedApplication,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await JobApplication.findByIdAndDelete(id)
      .populate("studentId")
      .populate("jobPostId");

    if (!application) {
      return res.status(404).json({
        status: "fail",
        message: "No job application found with that ID",
      });
    }

    const jobCreator = await Alumni.findById(application.jobPostId.postedBy);
    const student = application.studentId;

    const studentSubject = `Your Application for ${application.jobPostId.title} has been Deleted`;
    const studentText = `Dear ${student.name},\n\nYour job application for the position of "${application.jobPostId.title}" has been deleted. If you have any questions, please contact us.\n\nBest regards,\nYour Job Portal Team`;
    const studentHtml = `<p>Dear ${student.name},</p><p>Your job application for the position of "<strong>${application.jobPostId.title}</strong>" has been deleted. If you have any questions, please contact us.</p><p>Best regards,<br>Your Job Portal Team</p>`;

    await sendJobEmail(student.email, studentSubject, studentText, studentHtml);

    const creatorSubject = `Job Application for "${application.jobPostId.title}" has been Deleted`;
    const creatorText = `Dear ${jobCreator.name},\n\nThe job application for the position of "${application.jobPostId.title}" by ${student.name} has been deleted. Please review your job post or contact support if needed.\n\nBest regards,\nYour Job Portal Team`;
    const creatorHtml = `<p>Dear ${jobCreator.name},</p><p>The job application for the position of "<strong>${application.jobPostId.title}</strong>" by ${student.name} has been deleted. Please review your job post or contact support if needed.</p><p>Best regards,<br>Your Job Portal Team</p>`;

    await sendJobEmail(
      jobCreator.email,
      creatorSubject,
      creatorText,
      creatorHtml
    );

    // Respond with success
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const getApplicationsByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;

    const applications = await JobApplication.find({ studentId })
      .populate("studentId", "name email")
      .populate("jobPostId", "title companyName location");

    if (applications.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "No job applications found for this student",
      });
    }

    res.status(200).json({
      status: "success",
      data: applications,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
