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

const EventManager = () => {
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
      toast.success("Events fetched successfully");
    } catch (err) {
      toast.error("Error fetching events", err);
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
      toast.success("Event created successfully");
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

  // Function to get the current date and time in the format required for the min attribute
  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <div className="event-manager-container">
      <div className="event-manager-header">
        <h2 className="event-manager-title">
          <FaCalendarAlt className="event-title-icon" />
          Alumni/Admin Events Management
        </h2>

        <div className="event-manager-tabs">
          <button
            className={`event-tab-button ${
              activeTab === "upcoming" ? "event-tab-active" : ""
            }`}
            onClick={() => setActiveTab("upcoming")}
          >
            Upcoming Events
          </button>
          <button
            className={`event-tab-button ${
              activeTab === "past" ? "event-tab-active" : ""
            }`}
            onClick={() => setActiveTab("past")}
          >
            Past Events
          </button>
        </div>
      </div>

      {/* Create Event Form */}
      <div className="event-creation-card">
        <h3 className="event-form-title">Create New Event</h3>
        <form onSubmit={handleCreate} className="event-creation-form">
          <div className="event-form-group">
            <input
              type="text"
              placeholder="Event Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              className="event-form-input"
            />
          </div>

          <div className="event-form-group">
            <textarea
              placeholder="Event Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
              className="event-form-textarea"
            />
          </div>

          <div className="event-form-row">
            <div className="event-form-group">
              <div className="event-input-with-icon">
                <FaMapMarkerAlt className="event-input-icon" />
                <input
                  type="text"
                  placeholder="Location"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  required
                  className="event-form-input"
                />
              </div>
            </div>

            <div className="event-form-group">
              <input
                type="datetime-local"
                value={formData.date}
                min={getCurrentDateTime()} // Restrict to allow only future dates
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
                className="event-form-input"
              />
            </div>
          </div>

          <button type="submit" className="event-create-button">
            <FaPlus /> Create Event
          </button>
        </form>
      </div>

      {/* Send Reminder Button */}
      <button onClick={sendReminder} className="event-reminder-button">
        <FaBell /> Send Reminders to All
      </button>

      {/* Event List */}
      {loading ? (
        <div className="event-loading-state">
          <div className="event-loading-spinner"></div>
          <p>Loading events...</p>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="event-empty-state">
          <p>No {activeTab} events found.</p>
        </div>
      ) : (
        <div className="event-list-grid">
          {filteredEvents.map((event) => (
            <div key={event._id} className="event-card">
              <div className="event-card-header">
                <h3 className="event-card-title">{event.title}</h3>
                <div className="event-card-date">
                  {new Date(event.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>

              <p className="event-card-description">{event.description}</p>

              <div className="event-card-details">
                <div className="event-detail-item">
                  <FaMapMarkerAlt className="event-detail-icon" />
                  <span>{event.location}</span>
                </div>

                <div className="event-detail-item">
                  <FaUsers className="event-detail-icon" />
                  <span>
                    {event.rsvps?.filter((r) => r.status === "yes").length}{" "}
                    attending
                  </span>
                </div>
              </div>

              <div className="event-card-actions">
                <button
                  onClick={() => handleRSVP(event._id, "yes")}
                  className="event-rsvp-button event-rsvp-yes"
                >
                  <FaCheck /> Going
                </button>
                <button
                  onClick={() => handleRSVP(event._id, "no")}
                  className="event-rsvp-button event-rsvp-no"
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

export default EventManager;
