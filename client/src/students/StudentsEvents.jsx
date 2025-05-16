import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/StudentsEvents.css";
import toast from "react-hot-toast";

const StudentsEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("cards");
  const [rsvps, setRsvps] = useState({});
  const [loadingEventId, setLoadingEventId] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get("/api/v1/events/get", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents(data.events);
        setRsvps(
          data.events.reduce(
            (acc, event) => ({ ...acc, [event._id]: null }),
            {}
          )
        );
        toast.success("Events loaded successfully");
      } catch (error) {
        toast.error("Failed to load events");
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleRsvp = async (eventId, status) => {
    if (rsvps[eventId] === status) {
      toast(`You have already marked "${status}" for this event.`);
      return;
    }

    try {
      setLoadingEventId(eventId); // Disable buttons for this event
      const token = localStorage.getItem("token");
      await axios.post(
        `/api/v1/events/rsvp/${eventId}`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRsvps((prev) => ({ ...prev, [eventId]: status }));
      setEvents((prev) =>
        prev.map((event) =>
          event._id === eventId
            ? {
                ...event,
                rsvps:
                  status === "yes"
                    ? [...(event.rsvps || []), { user: "currentUserId" }]
                    : (event.rsvps || []).filter(
                        (rsvp) => rsvp.user !== "currentUserId"
                      ),
              }
            : event
        )
      );
      toast.success(`RSVP updated to "${status}"`);
    } catch (error) {
      toast.error("Failed to update RSVP");
      console.error("RSVP error:", error);
    } finally {
      setLoadingEventId(null); // Re-enable buttons
    }
  };

  const openModal = (event) => {
    setSelectedEvent(event);
  };

  const closeModal = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="events-students__container">
      <div className="events-students__view-controls">
        <h2 className="events-students__title">Upcoming Events</h2>
        <div className="events-students__toggle">
          <button
            className={`events-students__toggle-btn ${
              viewMode === "cards" && "events-students__toggle-btn--active"
            }`}
            onClick={() => setViewMode("cards")}
          >
            <i className="fas fa-th-large"></i> Cards
          </button>
          <button
            className={`events-students__toggle-btn ${
              viewMode === "table" && "events-students__toggle-btn--active"
            }`}
            onClick={() => setViewMode("table")}
          >
            <i className="fas fa-table"></i> Table
          </button>
        </div>
      </div>

      {loading ? (
        <div className="events-students__loading">
          <div className="events-students__spinner"></div>
          <p>Loading Events...</p>
        </div>
      ) : events.length === 0 ? (
        <div className="events-students__no-events">
          <i className="fas fa-calendar-times"></i>
          <p>No upcoming events found</p>
        </div>
      ) : viewMode === "cards" ? (
        <div className="events-students__list">
          {events.map((event) => (
            <div key={event._id} className="events-students__card">
              <div className="events-students__card-header">
                <h3 className="events-students__card-title">{event.title}</h3>
                <div className="events-students__card-meta">
                  <span className="events-students__card-date">
                    <i className="fas fa-calendar-alt"></i>
                    {new Date(event.date).toLocaleDateString()}
                  </span>
                  <span className="events-students__card-location">
                    <i className="fas fa-map-marker-alt"></i>
                    {event.location}
                  </span>
                </div>
                <button
                  className="events-students__expand-btn"
                  onClick={() => openModal(event)}
                >
                  Show More
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="events-students__table-container">
          <table className="events-students__table">
            <thead>
              <tr>
                <th>
                  <i className="fas fa-heading"></i> Title
                </th>
                <th>
                  <i className="fas fa-calendar-day"></i> Date
                </th>
                <th>
                  <i className="fas fa-map-pin"></i> Location
                </th>
                <th>
                  <i className="fas fa-users"></i> Attendees
                </th>
                <th>
                  <i className="fas fa-edit"></i> Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event._id} className="events-students__table-row">
                  <td>{event.title}</td>
                  <td>{new Date(event.date).toLocaleDateString()}</td>
                  <td>{event.location}</td>
                  <td>{event.rsvps?.length || 0}</td>
                  <td>
                    <button
                      className="events-students__expand-btn"
                      onClick={() => openModal(event)}
                    >
                      Show More
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedEvent && (
        <div className="events-students__modal-overlay">
          <div className="events-students__modal-content">
            <button
              className="events-students__modal-close-btn"
              onClick={closeModal}
            >
              &times;
            </button>
            <h3 className="events-students__modal-title">
              {selectedEvent.title}
            </h3>
            <p className="events-students__modal-description">
              {selectedEvent.description}
            </p>
            <div className="events-students__modal-info">
              <p>
                <strong>Date:</strong>{" "}
                {new Date(selectedEvent.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Location:</strong> {selectedEvent.location}
              </p>
              <p>
                <strong>Organizer:</strong> {selectedEvent.createdBy?.name}
              </p>
              <p>
                <strong>Attendees:</strong> {selectedEvent.rsvps?.length || 0}
              </p>
            </div>
            <div className="events-students__modal-actions">
              <button
                className={`events-students__rsvp-btn ${
                  rsvps[selectedEvent._id] === "yes"
                    ? "events-students__rsvp-btn--active"
                    : ""
                }`}
                onClick={() => handleRsvp(selectedEvent._id, "yes")}
                disabled={loadingEventId === selectedEvent._id}
              >
                <i className="fas fa-check-circle"></i> Attend
              </button>
              <button
                className={`events-students__rsvp-btn ${
                  rsvps[selectedEvent._id] === "no"
                    ? "events-students__rsvp-btn--active"
                    : ""
                }`}
                onClick={() => handleRsvp(selectedEvent._id, "no")}
                disabled={loadingEventId === selectedEvent._id}
              >
                <i className="fas fa-times-circle"></i> Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsEvents;
