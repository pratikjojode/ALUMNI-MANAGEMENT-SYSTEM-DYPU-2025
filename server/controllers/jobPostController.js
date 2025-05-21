import Admin from "../models/Admin.js";
import Alumni from "../models/Alumni.js";
import InboxNotification from "../models/InboxNotification.js";
import JobPost from "../models/JobPost.js";
import Student from "../models/Student.js";
import {
  sendJobPostEmail,
  sendJobPostStatusEmail,
} from "../utils/jobPostEmailService.js";

export const createJobPost = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      applicationDeadline,
      location,
      companyName,
      jobType,
    } = req.body;

    const newJobPost = new JobPost({
      title,
      description,
      requirements,
      applicationDeadline,
      location,
      companyName,
      jobType,
      postedBy: req.user._id,
    });

    await newJobPost.save();

    await sendJobPostEmail(newJobPost);

    const adminEmails = await Admin.find().select("email -_id");
    const studentEmails = await Student.find().select("email -_id");
    const alumniEmails = await Alumni.find().select("email -_id");

    const allUsersEmails = [
      ...adminEmails.map((a) => a.email),
      ...studentEmails.map((s) => s.email),
      ...alumniEmails.map((al) => al.email),
    ];

    const notification = new InboxNotification({
      title: "New Job Posted",
      message: `A new job titled "${title}" has been posted by ${companyName}. Check it out!`,
      recipients: allUsersEmails,
      type: "job_post",
      relatedId: newJobPost._id,
      date: new Date(),
      isReadBy: [],
    });

    await notification.save();

    res.status(201).json({
      message: "Job posting created successfully",
      jobPost: newJobPost,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating job post", error: err.message });
  }
};

export const getJobPosts = async (req, res) => {
  try {
    const jobPosts = await JobPost.find().populate("postedBy", "name").exec();

    if (jobPosts.length === 0) {
      return res.status(404).json({ message: "No approved job posts found" });
    }

    console.log("Fetched job posts:", jobPosts);
    res.status(200).json({
      message: "Job posts fetched successfully",
      data: jobPosts,
      totalCount: jobPosts.length,
    });
  } catch (err) {
    console.error("Error fetching job posts:", err);
    res.status(500).json({
      message: "Error fetching job posts",
      error: err.message,
    });
  }
};

export const reviewAndApproveJobPost = async (req, res) => {
  try {
    const { jobPostId, status } = req.body;

    if (!jobPostId || !status) {
      return res
        .status(400)
        .json({ message: "Job Post ID and status are required" });
    }

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const jobPost = await JobPost.findById(jobPostId).populate("postedBy");
    if (!jobPost) {
      return res.status(404).json({ message: "Job post not found" });
    }

    jobPost.status = status;
    await jobPost.save();

    await sendJobPostStatusEmail(jobPost, status);

    const adminEmails = await Admin.find().select("email -_id");
    const studentEmails = await Student.find().select("email -_id");
    const alumniEmails = await Alumni.find().select("email -_id");

    const allEmails = [
      ...adminEmails.map((u) => u.email),
      ...studentEmails.map((u) => u.email),
      ...alumniEmails.map((u) => u.email),
    ];

    await sendEmail({
      to: allEmails,
      subject: `Job Post "${jobPost.title}" ${status}`,
      text: `The job post titled "${jobPost.title}" has been ${status}. Please check the portal for details.`,
    });

    if (jobPost.postedBy) {
      const notification = new InboxNotification({
        user: jobPost.postedBy._id,
        type: "job_post_status",
        message: `Your job post "${jobPost.title}" has been ${status}.`,
        data: { jobPostId: jobPost._id, status },
        read: false,
        createdAt: new Date(),
      });
      await notification.save();
    }

    res.status(200).json({
      message: `Job post has been ${status} successfully`,
      jobPost,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error reviewing and approving job post",
      error: error.message,
    });
  }
};

export const getApprovedJobPosts = async (req, res) => {
  try {
    const jobPosts = await JobPost.find({ status: "approved" })
      .populate("postedBy", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Approved job posts fetched successfully",
      data: jobPosts,
      totalCount: jobPosts.length,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch job posts",
      error: error.message,
    });
  }
};
