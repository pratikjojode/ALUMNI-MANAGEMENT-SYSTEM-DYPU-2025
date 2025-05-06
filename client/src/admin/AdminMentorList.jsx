import React, { useEffect, useState } from "react";
import axios from "axios";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import "../styles/AdminMentorList.css";
import toast from "react-hot-toast";
import {
  FaSearch,
  FaGripHorizontal,
  FaListUl,
  FaEye,
  FaPhone,
  FaTrash,
  FaTimesCircle,
} from "react-icons/fa";

const AdminMentorList = () => {
  const [mentors, setMentors] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      title: "Confirm Delete",
      message: "Are you sure you want to delete this mentor?",
      buttons: [
        {
          label: "Yes, Delete",
          onClick: async () => {
            try {
              await axios.delete(`/api/v1/mentors/${mentorId}`);
              setMentors(mentors.filter((mentor) => mentor._id !== mentorId));
              toast.success("Mentor deleted successfully");
            } catch (err) {
              console.error("Error deleting mentor:", err);
              toast.error("Failed to delete mentor");
            }
          },
        },
        {
          label: "Cancel",
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
      toast.success(response.data.message);
      fetchMentors(); // Refresh mentor list after cancellation
    } catch (err) {
      console.error("Error canceling booking:", err);
      toast.error("Failed to cancel booking");
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

  const openModal = (mentor) => {
    setSelectedMentor(mentor);
    setIsModalOpen(true);
    document.body.classList.add("modal-open"); // Prevent scrolling behind modal
  };

  const closeModal = () => {
    setSelectedMentor(null);
    setIsModalOpen(false);
    document.body.classList.remove("modal-open");
  };

  return (
    <div className="admin-mentor-container">
      <div className="admin-header">
        <h2 className="admin-title">Registered Mentors</h2>
        <div className="controls">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search mentors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="view-toggle">
            <button
              className={viewMode === "grid" ? "active" : ""}
              onClick={() => setViewMode("grid")}
              title="Grid View"
            >
              <FaGripHorizontal />
            </button>
            <button
              className={viewMode === "table" ? "active" : ""}
              onClick={() => setViewMode("table")}
              title="Table View"
            >
              <FaListUl />
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner">Loading mentors...</div>
      ) : filteredMentors.length === 0 ? (
        <div className="no-results">
          {searchTerm
            ? "No matching mentors found"
            : "No mentors registered yet"}
        </div>
      ) : viewMode === "grid" ? (
        <div className="mentor-cards-grid">
          {filteredMentors.map((mentor) => (
            <div key={mentor._id} className="mentor-card">
              <div className="mentor-header">
                <img
                  src={mentor.alumni?.profilePhoto || "/default-profile.png"}
                  alt={mentor.alumni?.name}
                  className="mentor-photo"
                />
                <div className="mentor-info-short">
                  <h3>{mentor.alumni?.name || "Unknown"}</h3>
                  <p className="position-short">
                    {mentor.alumni?.designation || "Not specified"}
                  </p>
                </div>
              </div>
              <div className="mentor-actions-short">
                <button
                  className="view-details-btn"
                  onClick={() => openModal(mentor)}
                  title="View Details"
                >
                  <FaEye />
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteMentor(mentor._id)}
                  title="Delete Mentor"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMentors.map((mentor) => (
                <tr key={mentor._id}>
                  <td>
                    <div className="table-mentor-info">
                      <img
                        src={
                          mentor.alumni?.profilePhoto || "/default-profile.png"
                        }
                        alt={mentor.alumni?.name}
                        className="table-mentor-photo"
                      />
                      <div>
                        <strong>{mentor.alumni?.name || "Unknown"}</strong>
                        <p className="email-table">
                          {mentor.alumni?.email || "Not provided"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <p className="designation-table">
                      {mentor.alumni?.designation || "Not specified"}
                    </p>
                    <p className="company-table">
                      {mentor.alumni?.currentCompany || "Not specified"}
                    </p>
                  </td>
                  <td className="expertise-table">
                    {mentor.expertise?.slice(0, 2).join(", ") ||
                      "Not specified"}
                    {mentor.expertise?.length > 2 && (
                      <span className="more-expertise">...</span>
                    )}
                  </td>
                  <td>
                    <div className="table-slot-status">
                      <div className="slot-progress">
                        <div
                          className="progress-bar"
                          style={{
                            width: `${
                              (getSlotStatus(mentor.slots).bookedSlots /
                                getSlotStatus(mentor.slots).totalSlots) *
                                100 || 0
                            }%`,
                          }}
                        ></div>
                      </div>
                      <div className="slot-numbers">
                        <span className="booked">
                          {getSlotStatus(mentor.slots).bookedSlots} booked
                        </span>
                        <span className="available">
                          {getSlotStatus(mentor.slots).availableSlots} available
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button
                        className="view-btn"
                        onClick={() => openModal(mentor)}
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteMentor(mentor._id)}
                        title="Delete Mentor"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && selectedMentor && (
        <MentorDetailsModal
          mentor={selectedMentor}
          onClose={closeModal}
          onDelete={handleDeleteMentor}
          handleCancelBooking={handleCancelBooking}
          slotStatus={getSlotStatus(selectedMentor.slots)}
          formatDate={(dateString) => {
            const options = { year: "numeric", month: "short", day: "numeric" };
            return new Date(dateString).toLocaleDateString(undefined, options);
          }}
        />
      )}
    </div>
  );
};

const MentorDetailsModal = ({
  mentor,
  onClose,
  onDelete,
  handleCancelBooking,
  slotStatus,
  formatDate,
}) => {
  return (
    <div className="mentor-modal-overlay">
      <div className="mentor-modal">
        <button className="close-modal-btn" onClick={onClose} title="Close">
          <FaTimesCircle />
        </button>
        <div className="modal-header">
          <img
            src={mentor.alumni?.profilePhoto || "/default-profile.png"}
            alt={mentor.alumni?.name}
            className="modal-mentor-photo"
          />
          <div className="modal-mentor-info">
            <h2>{mentor.alumni?.name || "Unknown"}</h2>
            <p className="modal-position">
              {mentor.alumni?.designation || "Not specified"}{" "}
              {mentor.alumni?.currentCompany &&
                `at ${mentor.alumni.currentCompany}`}
            </p>
            <div className="modal-contact-info">
              <p>
                <FaPhone /> {mentor.alumni?.contactNo || "Not provided"}
              </p>
              <p>✉️ {mentor.alumni?.email || "Not provided"}</p>
            </div>
          </div>
        </div>

        <div className="modal-details">
          <div className="detail-section modal-slot-status">
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
              <ul className="slots-list modal-slots-list">
                {mentor.slots.map((slot) => (
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
                        onClick={() =>
                          handleCancelBooking(mentor._id, slot._id)
                        }
                      >
                        Cancel Booking
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No slots available</p>
            )}
          </div>

          <div className="modal-actions">
            <button className="delete-btn" onClick={() => onDelete(mentor._id)}>
              Delete Mentor
            </button>
            <button className="close-btn" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMentorList;
