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
  const [viewMode, setViewMode] = useState("table");

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

  const renderScheduleForm = () => (
    <form
      onSubmit={handleScheduleSubmit}
      className="admin-schedule-form mentorship-schedule-form"
    >
      <div className="form-group">
        <label className="admin-form-label">
          Scheduled Date & Time:
          <input
            type="datetime-local"
            value={scheduledDateTime}
            min={minDateTime}
            onChange={(e) => setScheduledDateTime(e.target.value)}
            onPaste={(e) => e.preventDefault()}
            className="admin-form-input"
            required
          />
        </label>
      </div>
      <div className="form-group">
        <label className="admin-form-label">
          Meeting Link:
          <input
            type="url"
            value={meetingLink}
            onChange={(e) => setMeetingLink(e.target.value)}
            placeholder="https://zoom.us/j/123456789"
            className="admin-form-input"
            required
          />
        </label>
      </div>
      {scheduleError && (
        <p className="error admin-schedule-error">{scheduleError}</p>
      )}
      <div className="admin-form-actions">
        <button
          type="submit"
          className="admin-btn admin-schedule-btn"
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
      </div>
    </form>
  );

  const renderTableView = () => (
    <div className="admin-requests-table-container">
      <table className="admin-requests-table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Mentor Details</th>
            <th>Request</th>
            <th>Scheduled</th>
            <th>Slot</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req._id}>
              <td>
                <div className="admin-table-student">
                  {req.student.name}
                  <div className="admin-student-email">{req.student.email}</div>
                </div>
              </td>
              <td>
                <div className="admin-table-bio">{req.mentor.bio}</div>
                <div className="admin-table-bio-full">{req.mentor.bio}</div>
                <div className="admin-table-expertise">
                  {req.mentor.expertise.map((exp, i) => (
                    <span key={i}>{exp}</span>
                  ))}
                </div>
              </td>
              <td>
                <div className="admin-table-message">{req.message}</div>
                <div className="admin-table-message-full">{req.message}</div>
              </td>
              <td>
                {req.scheduledDateTime ? (
                  <>
                    <div className="admin-scheduled-time">
                      {new Date(req.scheduledDateTime).toLocaleString()}
                    </div>
                    {req.meetingLink && (
                      <a
                        href={req.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="admin-table-link"
                      >
                        Meeting Link
                      </a>
                    )}
                  </>
                ) : (
                  <div className="admin-not-scheduled">Not scheduled yet</div>
                )}
              </td>
              <td>
                <div className="admin-table-slot">
                  {req.slotId.date} at {req.slotId.time}
                </div>
              </td>
              <td>
                {schedulingId === req._id ? (
                  renderScheduleForm(req._id)
                ) : (
                  <button
                    className="admin-btn admin-schedule-action-btn"
                    onClick={() => handleScheduleClick(req._id)}
                  >
                    {req.scheduledDateTime ? "Reschedule" : "Schedule"}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderCardView = () => (
    <div className="admin-requests-list">
      {requests.map((req) => (
        <div
          key={req._id}
          className="admin-request-card admin-mentorship-request-card"
        >
          <h3 className="admin-request-student">
            Student: {req.student.name} (
            <span className="admin-student-email">{req.student.email}</span>)
          </h3>
          <p className="admin-request-mentor-bio">
            <strong>Mentor Bio:</strong>{" "}
            <span className="admin-bio-text">{req.mentor.bio}</span>
          </p>
          <p className="admin-request-mentor-expertise">
            <strong>Mentor Expertise:</strong>{" "}
            <span className="admin-expertise-list">
              {req.mentor.expertise.join(", ")}
            </span>
          </p>
          <p className="admin-request-message">
            <strong>Requested Message:</strong>{" "}
            <span className="admin-message-text">{req.message}</span>
          </p>
          <p className="admin-request-scheduled-time">
            <strong>Scheduled Time:</strong>{" "}
            <span className="admin-scheduled-time-text">
              {req.scheduledDateTime
                ? new Date(req.scheduledDateTime).toLocaleString()
                : "Not scheduled yet"}
            </span>
          </p>
          <p className="admin-request-meeting-link">
            <strong>Meeting Link:</strong>{" "}
            <span className="admin-meeting-link-text">
              {req.meetingLink ? (
                <a
                  href={req.meetingLink}
                  target="_blank"
                  rel="noreferrer"
                  className="admin-meeting-link"
                >
                  {req.meetingLink}
                </a>
              ) : (
                "N/A"
              )}
            </span>
          </p>
          <p className="admin-request-slot">
            <strong>Slot:</strong>{" "}
            <span className="admin-slot-details">
              {req.slotId.date} at {req.slotId.time}
            </span>
          </p>

          {schedulingId === req._id ? (
            renderScheduleForm(req._id)
          ) : (
            <button
              className="admin-btn admin-schedule-action-btn"
              onClick={() => handleScheduleClick(req._id)}
            >
              {req.scheduledDateTime ? "Reschedule" : "Schedule"}
            </button>
          )}
        </div>
      ))}
    </div>
  );

  if (loading)
    return (
      <p className="admin-loading admin-status-message">
        Loading mentorship requests...
      </p>
    );
  if (error)
    return <p className="admin-error admin-status-message">Error: {error}</p>;

  return (
    <div className="admin-container admin-schedule-mentorship-container">
      <div className="admin-header">
        <h2 className="admin-page-title">Accepted Mentorship Requests</h2>
        <div className="admin-view-toggle">
          <button
            className={`admin-view-btn ${viewMode === "table" ? "active" : ""}`}
            onClick={() => setViewMode("table")}
          >
            Table View
          </button>
          <button
            className={`admin-view-btn ${viewMode === "card" ? "active" : ""}`}
            onClick={() => setViewMode("card")}
          >
            Card View
          </button>
        </div>
      </div>

      {requests.length === 0 ? (
        <p className="admin-no-requests admin-status-message">
          No accepted mentorship requests found.
        </p>
      ) : viewMode === "table" ? (
        renderTableView()
      ) : (
        renderCardView()
      )}
    </div>
  );
};

export default AdminScheduleMentorship;
