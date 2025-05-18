import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/AdminScheduleMentorship.css";

const AdminScheduleMentorship = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [schedulingId, setSchedulingId] = useState(null);
  const [scheduledDateTime, setScheduledDateTime] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [scheduleError, setScheduleError] = useState(null);
  const [scheduleLoading, setScheduleLoading] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get(
          "/api/v1/mentorship/mentorshipRequests/accepted"
        );

        const dataWithSlots = res.data.map((req) => {
          if (
            req.mentor &&
            req.mentor.slots &&
            typeof req.slotId === "string"
          ) {
            const slotObj = req.mentor.slots.find(
              (slot) => slot._id === req.slotId
            );
            return { ...req, slotId: slotObj || req.slotId };
          }
          return req;
        });

        setRequests(dataWithSlots);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const getCurrentDateTimeLocal = () => {
    const now = new Date();
    now.setSeconds(0, 0);
    return now.toISOString().substring(0, 16);
  };

  const minDateTime = getCurrentDateTimeLocal();

  const handleScheduleClick = (id) => {
    setSchedulingId(id);

    const req = requests.find((r) => r._id === id);
    setScheduledDateTime(
      req?.scheduledDateTime
        ? new Date(req.scheduledDateTime).toISOString().substring(0, 16)
        : ""
    );
    setMeetingLink(req?.meetingLink || "");
    setScheduleError(null);
  };

  const handleCancel = () => {
    setSchedulingId(null);
    setScheduledDateTime("");
    setMeetingLink("");
    setScheduleError(null);
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    setScheduleError(null);

    if (!scheduledDateTime || !meetingLink) {
      setScheduleError("Please provide both date/time and meeting link.");
      return;
    }

    if (new Date(scheduledDateTime) < new Date()) {
      setScheduleError("Scheduled date/time cannot be in the past.");
      return;
    }

    setScheduleLoading(true);
    try {
      const res = await axios.put(
        `/api/v1/mentorship/schedule/${schedulingId}`,
        {
          scheduledDateTime,
          meetingLink,
        }
      );

      setRequests((prev) =>
        prev.map((req) =>
          req._id === schedulingId ? res.data.mentorshipRequest : req
        )
      );

      handleCancel();
    } catch (err) {
      setScheduleError(err.response?.data?.message || err.message);
    } finally {
      setScheduleLoading(false);
    }
  };

  if (loading)
    return <p className="admin-loading">Loading mentorship requests...</p>;
  if (error) return <p className="admin-error">Error: {error}</p>;

  return (
    <div className="admin-container">
      <h2>Accepted Mentorship Requests</h2>
      {requests.length === 0 ? (
        <p>No accepted mentorship requests found.</p>
      ) : (
        requests.map((req) => (
          <div key={req._id} className="admin-request-card">
            <h3>
              Student: {req.student.name} ({req.student.email})
            </h3>
            <p>
              <strong>Mentor Bio:</strong> {req.mentor.bio}
            </p>
            <p>
              <strong>Mentor Expertise:</strong>{" "}
              {req.mentor.expertise.join(", ")}
            </p>
            <p>
              <strong>Requested Message:</strong> {req.message}
            </p>
            <p>
              <strong>Scheduled Time:</strong>{" "}
              {req.scheduledDateTime
                ? new Date(req.scheduledDateTime).toLocaleString()
                : "Not scheduled yet"}
            </p>
            <p>
              <strong>Meeting Link:</strong>{" "}
              {req.meetingLink ? (
                <a href={req.meetingLink} target="_blank" rel="noreferrer">
                  {req.meetingLink}
                </a>
              ) : (
                "N/A"
              )}
            </p>
            <p>
              <strong>Slot:</strong> {req.slotId.date} at {req.slotId.time}
            </p>

            {schedulingId === req._id ? (
              <form
                onSubmit={handleScheduleSubmit}
                className="admin-schedule-form"
              >
                <label>
                  Scheduled Date & Time:
                  <input
                    type="datetime-local"
                    value={scheduledDateTime}
                    min={minDateTime}
                    onChange={(e) => setScheduledDateTime(e.target.value)}
                    onPaste={(e) => e.preventDefault()}
                    required
                  />
                </label>
                <label>
                  Meeting Link:
                  <input
                    type="url"
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    placeholder="https://zoom.us/j/123456789"
                    required
                  />
                </label>
                {scheduleError && <p className="error">{scheduleError}</p>}
                <button
                  type="submit"
                  className="admin-btn"
                  disabled={scheduleLoading}
                >
                  {scheduleLoading ? "Scheduling..." : "Schedule"}
                </button>
                <button
                  type="button"
                  className="admin-btn admin-cancel-btn"
                  onClick={handleCancel}
                  disabled={scheduleLoading}
                >
                  Cancel
                </button>
              </form>
            ) : (
              <button
                className="admin-btn"
                onClick={() => handleScheduleClick(req._id)}
              >
                {req.scheduledDateTime ? "Reschedule" : "Schedule"}
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default AdminScheduleMentorship;
