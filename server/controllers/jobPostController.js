// controllers/jobPostController.js
import JobPost from "../models/JobPost.js";
import Alumni from "../models/Alumni.js";

// Create a new job post
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
    res.status(200).json(jobPosts);
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

    const jobPost = await JobPost.findById(jobPostId);
    if (!jobPost) {
      return res.status(404).json({ message: "Job post not found" });
    }

    jobPost.status = status;
    await jobPost.save();

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
