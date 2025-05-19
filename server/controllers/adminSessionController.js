import AdminSession from "../models/AdminSession.js";

export const createAdminSession = async (req, res) => {
  try {
    const { admin, loginTime, logoutTime } = req.body;

    if (!admin || !loginTime || !logoutTime) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    if (new Date(logoutTime) <= new Date(loginTime)) {
      return res
        .status(400)
        .json({ message: "Logout time must be after login time" });
    }

    const session = new AdminSession({
      admin,
      loginTime,
      logoutTime,
    });

    await session.save();

    return res.status(201).json(session);
  } catch (error) {
    console.error("Error creating admin session:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAdminSessions = async (req, res) => {
  try {
    const { adminId } = req.params;
    const sessions = await AdminSession.find({ admin: adminId }).sort({
      loginTime: -1,
    });
    res.status(200).json(sessions);
  } catch (error) {
    console.error("Error fetching admin sessions:", error);
    res.status(500).json({ message: "Server error" });
  }
};
