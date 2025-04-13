import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUsers,
  FaCheck,
  FaTimes,
  FaPlus,
  FaBell,
} from "react-icons/fa";
import "../styles/Events.css";
import toast from "react-hot-toast";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
  });
  const [activeTab, setActiveTab] = useState("upcoming");

  const token = localStorage.getItem("token");

  const fetchEvents = async () => {
    try {
      const res = await axios.get("/api/v1/events/get", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEvents(res.data.events);
      toast.success("events fetched succefully");
    } catch (err) {
      toast.err("Error fetching events", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRSVP = async (eventId, status) => {
    try {
      await axios.post(
        `/api/v1/events/rsvp/${eventId}`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchEvents();
    } catch (err) {
      console.error("RSVP error", err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        date: new Date(formData.date).toISOString(),
      };

      const res = await axios.post("/api/v1/events/create", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEvents([res.data.event, ...events]);

      setFormData({ title: "", description: "", location: "", date: "" });

      await fetchEvents(); // Refetch
      toast.success("Event creatd succefully");
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const sendReminder = async () => {
    try {
      await axios.post("api/v1/events/send-reminders");
      toast.success("Reminders sent successfully!");
    } catch (err) {
      console.error("Reminder error", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const filteredEvents = events
    .filter((event) => {
      if (!event.date) return false;
      const now = new Date();
      const eventDate = new Date(event.date);

      return activeTab === "upcoming" ? eventDate >= now : eventDate < now;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="events-container">
      <div className="events-header">
        <h2 className="events-title">
          <FaCalendarAlt className="title-icon" />
          Alumni/Admin Events Management
        </h2>

        <div className="events-tabs">
          <button
            className={`tab-button ${activeTab === "upcoming" ? "active" : ""}`}
            onClick={() => setActiveTab("upcoming")}
          >
            Upcoming Events
          </button>
          <button
            className={`tab-button ${activeTab === "past" ? "active" : ""}`}
            onClick={() => setActiveTab("past")}
          >
            Past Events
          </button>
        </div>
      </div>

      {/* Create Event Form */}
      <div className="event-form-card">
        <h3 className="form-title">Create New Event</h3>
        <form onSubmit={handleCreate} className="event-form">
          <div className="form-group">
            <input
              type="text"
              placeholder="Event Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <textarea
              placeholder="Event Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
              className="form-textarea"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <div className="input-with-icon">
                <FaMapMarkerAlt className="input-icon" />
                <input
                  type="text"
                  placeholder="Location"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  required
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <input
                type="datetime-local"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
                className="form-input"
              />
            </div>
          </div>

          <button type="submit" className="create-button">
            <FaPlus /> Create Event
          </button>
        </form>
      </div>

      {/* Send Reminder Button */}
      <button onClick={sendReminder} className="reminder-button">
        <FaBell /> Send Reminders to All
      </button>

      {/* Event List */}
      {loading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading events...</p>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="empty-state">
          <p>No {activeTab} events found.</p>
        </div>
      ) : (
        <div className="events-grid">
          {filteredEvents.map((event) => (
            <div key={event._id} className="event-card">
              <div className="event-header">
                <h3 className="event-title">{event.title}</h3>
                <div className="event-date">
                  {new Date(event.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>

              <p className="event-description">{event.description}</p>

              <div className="event-details">
                <div className="detail-item">
                  <FaMapMarkerAlt className="detail-icon" />
                  <span>{event.location}</span>
                </div>

                <div className="detail-item">
                  <FaUsers className="detail-icon" />
                  <span>
                    {event.rsvps?.filter((r) => r.status === "yes").length}{" "}
                    attending
                  </span>
                </div>
              </div>

              <div className="event-actions">
                <button
                  onClick={() => handleRSVP(event._id, "yes")}
                  className="rsvp-button going"
                >
                  <FaCheck /> Going
                </button>
                <button
                  onClick={() => handleRSVP(event._id, "no")}
                  className="rsvp-button not-going"
                >
                  <FaTimes /> Can't Go
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;
