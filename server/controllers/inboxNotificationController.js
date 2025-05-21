import InboxNotification from "../models/InboxNotification.js";

// @desc Get all notifications
export const getAllNotifications = async (req, res) => {
  try {
    const notifications = await InboxNotification.find()
      .sort({ createdAt: -1 })
      .limit(100); // optional
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

// @desc Mark notification as read
export const markNotificationAsRead = async (req, res) => {
  try {
    const notification = await InboxNotification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: "Failed to mark as read" });
  }
};

// @desc Delete a notification
export const deleteNotification = async (req, res) => {
  try {
    await InboxNotification.findByIdAndDelete(req.params.id);
    res.json({ message: "Notification deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete notification" });
  }
};
