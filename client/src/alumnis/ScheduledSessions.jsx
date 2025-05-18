import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/ScheduledSessions.css";

const ScheduledSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSessions = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found in localStorage");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          "/api/v1/mentorship/mentorship/scheduled",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setSessions(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching scheduled sessions:", err);
        setError("Failed to fetch scheduled mentorship sessions.");
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  if (loading)
    return <p className="ss-loading">Loading scheduled sessions...</p>;
  if (error) return <p className="ss-error">{error}</p>;

  return (
    <div className="ss-container">
      <h2 className="ss-heading">Scheduled Mentorship Sessions</h2>
      {sessions.length === 0 ? (
        <p className="ss-no-sessions">No scheduled sessions available.</p>
      ) : (
        <ul className="ss-list">
          {sessions.map((session) => (
            <li key={session._id} className="ss-item">
              {/* Student Info */}
              <div className="ss-section">
                <h3>👨‍🎓 Student Info</h3>
                <p>
                  <strong>Name:</strong> {session.student.name}
                </p>
                <p>
                  <strong>Email:</strong> {session.student.email}
                </p>
                <p>
                  <strong>Message:</strong> {session.message}
                </p>
              </div>

              <div className="ss-section">
                <h3>🧑‍🏫 Mentor Info</h3>
                <p>
                  <strong>Alumni ID:</strong> {session.mentor.alumni}
                </p>
                <p>
                  <strong>Bio:</strong> {session.mentor.bio}
                </p>
                <p>
                  <strong>Expertise:</strong>{" "}
                  {session.mentor.expertise.join(", ")}
                </p>
              </div>

              {/* Session Details */}
              <div className="ss-section">
                <h3>📅 Session Details</h3>
                <p>
                  <strong>Status:</strong>{" "}
                  <span className={`ss-status ss-status-${session.status}`}>
                    {session.status}
                  </span>
                </p>
                <p>
                  <strong>Scheduled Date & Time:</strong>{" "}
                  {new Date(session.scheduledDateTime).toLocaleString()}
                </p>
                <p>
                  <strong>Meeting Link:</strong>{" "}
                  <a
                    href={session.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {session.meetingLink}
                  </a>
                </p>
                <p>
                  <strong>Scheduled By:</strong>{" "}
                  {session.scheduledByAdmin ? "Admin" : "Student"}
                </p>
              </div>

              <div className="ss-section">
                <h3>🕒 Slot Info</h3>
                {session.mentor.slots.map(
                  (slot) =>
                    slot._id === session.slotId && (
                      <p key={slot._id}>
                        <strong>Slot:</strong> {slot.date} at {slot.time} (
                        {slot.isBooked ? "Booked" : "Available"})
                      </p>
                    )
                )}
              </div>

              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ScheduledSessions;
