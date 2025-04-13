import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/AdminMessages.css";

const AdminMessages = () => {
  const [notifications, setNotifications] = useState([]);

  // Get stored read status from localStorage
  const getReadStatus = () => {
    const storedStatus = localStorage.getItem("notificationReadStatus");
    return storedStatus ? JSON.parse(storedStatus) : {};
  };

  // Save read status to localStorage
  const saveReadStatus = (status) => {
    localStorage.setItem("notificationReadStatus", JSON.stringify(status));
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get("/api/v1/notifications/admin", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (res.data.success) {
          const readStatus = getReadStatus();
          const notificationsWithStatus = res.data.data.map((notification) => ({
            ...notification,
            read: readStatus[notification.id] || false,
          }));
          setNotifications(notificationsWithStatus);
        }
      } catch (error) {
        console.error("Failed to fetch notifications", error);
      }
    };

    fetchNotifications();
  }, []);

  const toggleReadStatus = (notificationId, isRead) => {
    const updatedNotifications = notifications.map((notification) =>
      notification.id === notificationId
        ? { ...notification, read: isRead }
        : notification
    );

    setNotifications(updatedNotifications);

    // Update localStorage
    const readStatus = getReadStatus();
    readStatus[notificationId] = isRead;
    saveReadStatus(readStatus);
  };

  return (
    <div className="admin-notifications-container">
      <h2 className="admin-notifications-header">🔔 Admin Notifications</h2>

      {notifications.length === 0 ? (
        <p className="empty-notifications">No notifications yet</p>
      ) : (
        <>
          <div className="notification-actions">
            <button
              onClick={() => {
                notifications.forEach(
                  (n) => !n.read && toggleReadStatus(n.id, true)
                );
              }}
              className="mark-all-read"
            >
              Mark All as Read
            </button>
            <button
              onClick={() => {
                notifications.forEach(
                  (n) => n.read && toggleReadStatus(n.id, false)
                );
              }}
              className="mark-all-unread"
            >
              Mark All as Unread
            </button>
          </div>

          <ul className="notifications-list">
            {notifications.map((n) => (
              <li
                key={n.id}
                className={`notification-item ${n.read ? "read" : "unread"}`}
              >
                <div
                  className="notification-content"
                  onClick={() => toggleReadStatus(n.id, !n.read)}
                >
                  <strong className="notification-type">
                    {n.type === "job" ? "🧑‍💼 Job" : "📅 Event"}:
                  </strong>{" "}
                  <span className="notification-message">{n.message}</span>
                  <small className="notification-time">
                    {new Date(n.createdAt).toLocaleString()}
                  </small>
                </div>
                <div className="notification-actions">
                  {n.read ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleReadStatus(n.id, false);
                      }}
                      className="mark-unread-btn"
                    >
                      Mark Unread
                    </button>
                  ) : (
                    <span className="unread-badge">New</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default AdminMessages;
