import React, { useEffect, useState } from "react";
import axios from "axios";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import "../styles/AdminMentorList.css";
import toast from "react-hot-toast";

const AdminMentorList = () => {
  const [mentors, setMentors] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      const response = await axios.get("/api/v1/mentors/allMentor");
      setMentors(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching mentors:", err);
      setLoading(false);
    }
  };

  const filteredMentors = mentors.filter(
    (mentor) =>
      mentor.alumni?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.alumni?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.expertise
        ?.join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const handleDeleteMentor = async (mentorId) => {
    confirmAlert({
      title: "Confirm to delete",
      message: "Are you sure you want to delete this mentor?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              await axios.delete(`/api/v1/mentors/${mentorId}`);
              setMentors(mentors.filter((mentor) => mentor._id !== mentorId));
              toast("Mentor deleted successfully");
            } catch (err) {
              console.error("Error deleting mentor:", err);
              alert("Failed to delete mentor");
            }
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  const handleCancelBooking = async (mentorId, slotId) => {
    try {
      const response = await axios.put(
        `/api/v1/mentors/${mentorId}/slots/${slotId}/cancelBooking`
      );
      alert(response.data.message);
      fetchMentors(); // Refresh mentor list after cancellation
    } catch (err) {
      console.error("Error canceling booking:", err);
      alert("Failed to cancel booking");
    }
  };

  const getSlotStatus = (slots) => {
    const totalSlots = slots.length;
    const bookedSlots = slots.filter((slot) => slot.isBooked).length;
    return {
      totalSlots,
      bookedSlots,
      availableSlots: totalSlots - bookedSlots,
    };
  };

  return (
    <div className="admin-mentor-container">
      <div className="admin-header">
        <h2 className="admin-title">All Registered Mentors</h2>
        <div className="controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search mentors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>
          <div className="view-toggle">
            <button
              className={viewMode === "grid" ? "active" : ""}
              onClick={() => setViewMode("grid")}
            >
              Grid View
            </button>
            <button
              className={viewMode === "table" ? "active" : ""}
              onClick={() => setViewMode("table")}
            >
              Table View
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner">Loading...</div>
      ) : filteredMentors.length === 0 ? (
        <div className="no-results">
          {searchTerm
            ? "No matching mentors found"
            : "No mentors registered yet"}
        </div>
      ) : viewMode === "grid" ? (
        <div className="mentor-cards-grid">
          {filteredMentors.map((mentor) => (
            <MentorCard
              key={mentor._id}
              mentor={mentor}
              onDelete={handleDeleteMentor}
              handleCancelBooking={handleCancelBooking}
              slotStatus={getSlotStatus(mentor.slots)}
            />
          ))}
        </div>
      ) : (
        <div className="mentor-table-container">
          <table className="mentor-table">
            <thead>
              <tr>
                <th>Mentor</th>
                <th>Details</th>
                <th>Expertise</th>
                <th>Slots Status</th>
                <th>Available Slots</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMentors.map((mentor) => (
                <MentorTableRow
                  key={mentor._id}
                  mentor={mentor}
                  onDelete={handleDeleteMentor}
                  handleCancelBooking={handleCancelBooking}
                  slotStatus={getSlotStatus(mentor.slots)}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const MentorCard = ({ mentor, onDelete, handleCancelBooking, slotStatus }) => {
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="mentor-card">
      <div className="mentor-header">
        <img
          src={mentor.alumni?.profilePhoto || "/default-profile.png"}
          alt={mentor.alumni?.name}
          className="mentor-photo"
        />
        <div className="mentor-info">
          <h3>{mentor.alumni?.name || "Unknown"}</h3>
          <p className="position">
            {mentor.alumni?.designation || "Not specified"}{" "}
            {mentor.alumni?.currentCompany &&
              `at ${mentor.alumni.currentCompany}`}
          </p>
          <div className="contact-info">
            <p>✉️ {mentor.alumni?.email || "Not provided"}</p>
            <p>📞 {mentor.alumni?.contactNo || "Not provided"}</p>
          </div>
        </div>
      </div>

      <div className="mentor-details">
        <div className="detail-section slot-status">
          <label>Slots Status:</label>
          <div className="slot-stats">
            <span className="total">Total: {slotStatus.totalSlots}</span>
            <span className="booked">Booked: {slotStatus.bookedSlots}</span>
            <span className="available">
              Available: {slotStatus.availableSlots}
            </span>
          </div>
        </div>

        <div className="detail-section">
          <label>Bio:</label>
          <p>{mentor.bio || "No bio provided"}</p>
        </div>

        <div className="detail-section">
          <label>Expertise:</label>
          <div className="expertise-tags">
            {mentor.expertise?.map((skill, i) => (
              <span key={i} className="tag">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="detail-section">
          <label>Available Slots:</label>
          {mentor.slots?.length > 0 ? (
            <ul className="slots-list">
              {mentor.slots.slice(0, 3).map((slot) => (
                <li
                  key={slot._id}
                  className={slot.isBooked ? "booked" : "available"}
                >
                  {formatDate(slot.date)} - {slot.time}
                  <span className="slot-indicator">
                    {slot.isBooked ? "🔴 Booked" : "🟢 Available"}
                  </span>
                  {slot.isBooked && (
                    <button
                      className="cancel-btn"
                      onClick={() => handleCancelBooking(mentor._id, slot._id)}
                    >
                      Cancel Booking
                    </button>
                  )}
                </li>
              ))}
              {mentor.slots.length > 3 && (
                <li className="more-slots">+{mentor.slots.length - 3} more</li>
              )}
            </ul>
          ) : (
            <p>No slots available</p>
          )}
        </div>

        <div className="mentor-actions">
          <button className="delete-btn" onClick={() => onDelete(mentor._id)}>
            Delete Mentor
          </button>
        </div>
      </div>
    </div>
  );
};

const MentorTableRow = ({
  mentor,
  onDelete,
  handleCancelBooking,
  slotStatus,
}) => {
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <tr>
      <td>
        <div className="table-mentor-info">
          <img
            src={mentor.alumni?.profilePhoto || "/default-profile.png"}
            alt={mentor.alumni?.name}
            className="table-mentor-photo"
          />
          <div>
            <strong>{mentor.alumni?.name || "Unknown"}</strong>
            <p>{mentor.alumni?.email || "Not provided"}</p>
          </div>
        </div>
      </td>
      <td>
        <p>{mentor.alumni?.designation || "Not specified"}</p>
        <p>{mentor.alumni?.currentCompany || "Not specified"}</p>
      </td>
      <td>
        <div className="table-expertise">
          {mentor.expertise?.join(", ") || "Not specified"}
        </div>
      </td>
      <td>
        <div className="table-slot-status">
          <div className="slot-progress">
            <div
              className="progress-bar"
              style={{
                width: `${
                  (slotStatus.bookedSlots / slotStatus.totalSlots) * 100
                }%`,
              }}
            ></div>
          </div>
          <div className="slot-numbers">
            <span className="booked">{slotStatus.bookedSlots} booked</span>
            <span className="available">
              {slotStatus.availableSlots} available
            </span>
          </div>
        </div>
      </td>
      <td>
        {mentor.slots?.length > 0 ? (
          <div className="table-slots">
            {mentor.slots.slice(0, 2).map((slot) => (
              <div
                key={slot._id}
                className={`table-slot ${
                  slot.isBooked ? "booked" : "available"
                }`}
              >
                {formatDate(slot.date)} - {slot.time}
                <span className="slot-indicator">
                  {slot.isBooked ? "🔴" : "🟢"}
                </span>
                {slot.isBooked && (
                  <button
                    className="cancel-btn"
                    onClick={() => handleCancelBooking(mentor._id, slot._id)}
                  >
                    Cancel
                  </button>
                )}
              </div>
            ))}
            {mentor.slots.length > 2 && (
              <div className="table-more-slots">
                +{mentor.slots.length - 2} more
              </div>
            )}
          </div>
        ) : (
          <span className="no-slots">No slots</span>
        )}
      </td>
      <td>
        <div className="table-actions">
          <button className="view-btn">View</button>
          <button className="contact-btn">Contact</button>
          <button className="delete-btn" onClick={() => onDelete(mentor._id)}>
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

export default AdminMentorList;
