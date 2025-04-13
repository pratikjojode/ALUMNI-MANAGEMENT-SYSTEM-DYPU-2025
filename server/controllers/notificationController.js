import JobPost from "../models/JobPost.js";
import { Event } from "../models/Event.js";

export const getAdminNotifications = async (req, res) => {
  try {
    const jobPosts = await JobPost.find({ status: "approved" }).sort({
      createdAt: -1,
    });
    const events = await Event.find().sort({ createdAt: -1 });

    const jobNotifications = jobPosts.map((job) => ({
      type: "job",
      title: job.title,
      message: `New Job Posted: ${job.title} at ${job.companyName}`,
      id: job._id,
      createdAt: job.createdAt,
    }));

    const eventNotifications = events.map((event) => ({
      type: "event",
      title: event.title,
      message: `New Event: ${event.title}`,
      id: event._id,
      createdAt: event.createdAt,
    }));

    const allNotifications = [...jobNotifications, ...eventNotifications].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    return res.status(200).json({
      success: true,
      message: "Admin notifications fetched successfully",
      data: allNotifications,
    });
  } catch (error) {
    console.error("Error fetching admin notifications:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching admin notifications",
    });
  }
};
