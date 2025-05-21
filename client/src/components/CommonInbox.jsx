import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/CommonInbox.css";
import Navbar from "./Navbar";

const CommonInbox = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("/api/v1/inboxNotification")
      .then((res) => {
        setNotifications(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching notifications:", err);
        setError("Failed to load notifications.");
        setLoading(false);
      });
  }, []);

  if (loading)
    return <div className="ci-loading">Loading notifications...</div>;

  if (error) return <div className="ci-error">{error}</div>;

  if (notifications.length === 0)
    return <div className="ci-empty">No notifications found.</div>;

  return (
    <>
      <Navbar />
      <div className="ci-wrapper">
        <h2 className="ci-title">Common Inbox</h2>
        <ul className="ci-list">
          {notifications.map((notif) => (
            <li key={notif._id} className="ci-item">
              <div className="ci-item-header">{notif.title}</div>
              <div className="ci-item-body">{notif.message}</div>
              <div className="ci-item-footer">
                <small>{new Date(notif.createdAt).toLocaleString()}</small>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default CommonInbox;
