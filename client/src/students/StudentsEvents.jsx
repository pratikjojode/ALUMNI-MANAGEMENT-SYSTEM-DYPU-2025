import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/StudentsEvents.css";
import toast from "react-hot-toast";

const StudentsEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("cards");
  const [rsvps, setRsvps] = useState({}); // Track RSVP status for each event

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get("/api/v1/events/get", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Events fetched successfully");
        setEvents(data.events);
        // Initialize RSVP status (you might fetch existing RSVPs from the backend)
        const initialRsvps = {};
        data.events.forEach((event) => {
          initialRsvps[event._id] = null; // Initially not responded
        });
        setRsvps(initialRsvps);
      } catch (error) {
        toast.error("Error fetching events");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleRsvp = async (eventId, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `/api/v1/events/${eventId}/rsvp`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(`RSVP updated to "${status}"`);
      // Update the local state to reflect the change
      setRsvps({ ...rsvps, [eventId]: status });
      setEvents(
        events.map((event) =>
          event._id === eventId
            ? {
                ...event,
                rsvps:
                  status === "coming"
                    ? [...(event.rsvps || []), { user: "currentUserId" }]
                    : (event.rsvps || []).filter(
                        (rsvp) => rsvp.user !== "currentUserId"
                      ), // Basic local update
              }
            : event
        )
      );
    } catch (error) {
      toast.error("Error updating RSVP");
      console.error(error);
    }
  };

  return (
    <div className="students-events-container">
      <div className="view-controls">
        <h2 className="events-title">Upcoming Events</h2>
        <div className="view-toggle">
          <button
            className={`view-btn ${viewMode === "cards" ? "active" : ""}`}
            onClick={() => setViewMode("cards")}
          >
            <i className="fas fa-th-large"></i> Card View
          </button>
          <button
            className={`view-btn ${viewMode === "table" ? "active" : ""}`}
            onClick={() => setViewMode("table")}
          >
            <i className="fas fa-table"></i> Table View
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading events...</p>
        </div>
      ) : events.length === 0 ? (
        <div className="no-events">
          <i className="fas fa-calendar-times"></i>
          <p>No events available at the moment. Check back later!</p>
        </div>
      ) : viewMode === "cards" ? (
        <div className="events-list">
          {events.map((event, index) => (
            <div key={index} className="event-card">
              <div className="event-header">
                <h3 className="event-title">{event.title}</h3>
                <span className="event-date">
                  <i className="fas fa-calendar-alt"></i>
                  {new Date(event.date).toLocaleDateString()}
                  <br /> {/* Added line break here */}
                  {new Date(event.date).toLocaleTimeString()}
                </span>
              </div>
              <p className="event-description">{event.description}</p>
              <p className="event-location">
                <i className="fas fa-map-marker-alt"></i> {event.location}
              </p>
              <div className="event-footer">
                <small className="event-author">
                  <i className="fas fa-user"></i> Posted by:{" "}
                  {event.createdBy?.name} ({event.createdBy?.email})
                </small>
                <small className="event-meta">
                  <i className="fas fa-id-badge"></i> Role: {event.creatorModel}
                </small>
                <small className="event-meta">
                  <i className="fas fa-clock"></i> Created at:{" "}
                  {new Date(event.createdAt).toLocaleString()}
                </small>
                <small className="event-meta">
                  <i className="fas fa-bell"></i> Reminder Sent:{" "}
                  {event.reminderSent ? "Yes" : "No"}
                </small>
                <small className="event-meta">
                  <i className="fas fa-users"></i> RSVPs:{" "}
                  {event.rsvps?.length || 0}
                </small>
              </div>
              <div className="event-actions">
                <button
                  className={`rsvp-button ${
                    rsvps[event._id] === "coming" ? "active" : ""
                  }`}
                  onClick={() => handleRsvp(event._id, "coming")}
                >
                  <i className="fas fa-check"></i> Coming
                </button>
                <button
                  className={`rsvp-button ${
                    rsvps[event._id] === "not_coming" ? "active" : ""
                  }`}
                  onClick={() => handleRsvp(event._id, "not_coming")}
                >
                  <i className="fas fa-times"></i> Not Coming
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="events-table-container">
          <table className="events-table">
            <thead>
              <tr>
                <th>
                  <i className="fas fa-heading"></i> Title
                </th>
                <th>
                  <i className="fas fa-calendar"></i> Date
                </th>
                <th>
                  <i className="fas fa-map-marker-alt"></i> Location
                </th>
                <th>
                  <i className="fas fa-align-left"></i> Description
                </th>
                <th>
                  <i className="fas fa-user"></i> Posted By
                </th>
                <th>
                  <i className="fas fa-id-badge"></i> Creator Role
                </th>
                <th>
                  <i className="fas fa-clock"></i> Created At
                </th>
                <th>
                  <i className="fas fa-bell"></i> Reminder
                </th>
                <th>
                  <i className="fas fa-users"></i> RSVPs
                </th>
                <th>
                  <i className="fas fa-handshake"></i> RSVP
                </th>
              </tr>
            </thead>
            <tbody>
              {events.map((event, index) => (
                <tr key={index} className="event-table-row">
                  <td>{event.title}</td>
                  <td>{new Date(event.date).toLocaleString()}</td>
                  <td>{event.location}</td>
                  <td>{event.description}</td>
                  <td>
                    {event.createdBy?.name} ({event.createdBy?.email})
                  </td>
                  <td>{event.creatorModel}</td>
                  <td>{new Date(event.createdAt).toLocaleString()}</td>
                  <td>{event.reminderSent ? "Yes" : "No"}</td>
                  <td>{event.rsvps?.length || 0}</td>
                  <td>
                    <button
                      className={`rsvp-button small ${
                        rsvps[event._id] === "coming" ? "active" : ""
                      }`}
                      onClick={() => handleRsvp(event._id, "coming")}
                    >
                      <i className="fas fa-check"></i>
                    </button>
                    <button
                      className={`rsvp-button small ${
                        rsvps[event._id] === "not_coming" ? "active" : ""
                      }`}
                      onClick={() => handleRsvp(event._id, "not_coming")}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StudentsEvents;
