import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "../styles/ManageAppointments.css";
import { FaCheck, FaTimes, FaTrash, FaSpinner } from "react-icons/fa";

const ManageAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState("table");
  const [selectedSlot, setSelectedSlot] = useState("All");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);
  const [processingId, setProcessingId] = useState(null); // To track processing actions

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("/api/v1/appointments/all");
      setAppointments(res.data);
    } catch {
      toast.error("Error fetching appointments");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const updateStatus = async (id, status) => {
    setProcessingId(id);
    try {
      await axios.put(`/api/v1/appointments/${id}/status`, { status });
      toast.success(`Appointment ${status.toLowerCase()} successfully`);
      fetchAppointments();
    } catch {
      toast.error("Failed to update status");
    } finally {
      setProcessingId(null);
    }
  };

  const deleteAppointment = async (id) => {
    setProcessingId(id);
    try {
      await axios.delete(`/api/v1/appointments/${id}`);
      toast.success("Appointment deleted successfully");
      setShowDeleteModal(false); // Close the modal after deletion
      fetchAppointments();
    } catch {
      toast.error("Failed to delete appointment");
    } finally {
      setProcessingId(null);
    }
  };

  const uniqueSlotDates = [
    "All",
    ...new Set(
      appointments.map((appt) =>
        appt.slot
          ? new Date(appt.slot.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "No Slot Assigned"
      )
    ),
  ];

  const filteredAppointments =
    selectedSlot === "All"
      ? appointments
      : appointments.filter((appt) => {
          const slotDate = appt.slot
            ? new Date(appt.slot.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "No Slot Assigned";
          return slotDate === selectedSlot;
        });

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner">
          <FaSpinner className="loading-icon" />
        </div>
        <p>Loading appointments...</p>
      </div>
    );
  }

  return (
    <div className="manage-appointments-container">
      <div className="header-section">
        <h2>Manage Appointments</h2>
        <div className="view-toggle">
          <button
            className={`toggle-btn ${viewMode === "table" ? "active" : ""}`}
            onClick={() => setViewMode("table")}
          >
            Table View
          </button>
          <button
            className={`toggle-btn ${viewMode === "card" ? "active" : ""}`}
            onClick={() => setViewMode("card")}
          >
            Card View
          </button>
        </div>
      </div>

      <div className="slot-filter">
        <label>Filter by Slot Date: </label>
        <select
          value={selectedSlot}
          onChange={(e) => setSelectedSlot(e.target.value)}
          className="slot-dropdown"
        >
          {uniqueSlotDates.map((date, index) => (
            <option key={index} value={date}>
              {date}
            </option>
          ))}
        </select>
      </div>

      {filteredAppointments.length === 0 ? (
        <div className="empty-state">
          <p>No appointments found</p>
        </div>
      ) : viewMode === "table" ? (
        <div className="appointments-table-container">
          <table className="appointments-table">
            <thead>
              <tr>
                <th>Alumni Name</th>
                <th>Email</th>
                <th>Slot Date & Time</th>
                <th>Status</th>
                <th>Confirm</th> {/* New Confirm Header */}
                <th>Reject</th> {/* New Reject Header */}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((appt) => (
                <tr key={appt._id}>
                  <td>{appt.alumniId?.name || "N/A"}</td>
                  <td>{appt.alumniId?.email || "N/A"}</td>
                  <td>
                    {appt.slot
                      ? new Date(appt.slot.date).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "No Slot Assigned"}
                  </td>
                  <td>
                    <span
                      className={`status-badge ${appt.status.toLowerCase()}`}
                    >
                      {appt.status}
                    </span>
                  </td>
                  <td>
                    {appt.status !== "Confirmed" ? (
                      <button
                        onClick={() => updateStatus(appt._id, "Confirmed")}
                        className="btn confirm-btn"
                        disabled={processingId === appt._id}
                      >
                        {processingId === appt._id && (
                          <FaSpinner className="processing-icon" />
                        )}
                        {processingId !== appt._id && <FaCheck />}
                      </button>
                    ) : (
                      <span className="action-disabled">
                        <FaCheck />
                      </span>
                    )}
                  </td>
                  <td>
                    {appt.status !== "Rejected" ? (
                      <button
                        onClick={() => updateStatus(appt._id, "Rejected")}
                        className="btn reject-btn"
                        disabled={processingId === appt._id}
                      >
                        {processingId === appt._id && (
                          <FaSpinner className="processing-icon" />
                        )}
                        {processingId !== appt._id && <FaTimes />}
                      </button>
                    ) : (
                      <span className="action-disabled">
                        <FaTimes />
                      </span>
                    )}
                  </td>
                  <td className="actions-cell">
                    <button
                      onClick={() => {
                        setAppointmentToDelete(appt._id);
                        setShowDeleteModal(true);
                      }}
                      className="btn delete-btn"
                      disabled={processingId === appt._id}
                    >
                      {processingId === appt._id && (
                        <FaSpinner className="processing-icon" />
                      )}
                      {processingId !== appt._id && <FaTrash />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="appointments-card-container">
          {filteredAppointments.map((appt) => (
            <div key={appt._id} className="appointment-card">
              <div className="card-header">
                <img
                  src={appt.alumniId?.profilePhoto}
                  alt="profile"
                  className="card-avatar"
                />
                <div>
                  <h3>{appt.alumniId?.name || "N/A"}</h3>
                  <span className={`status-badge ${appt.status.toLowerCase()}`}>
                    {appt.status}
                  </span>
                </div>
              </div>
              <div className="card-body">
                <div className="card-row">
                  <span className="card-label">Email:</span>
                  <span className="card-value">
                    {appt.alumniId?.email || "N/A"}
                  </span>
                </div>
                <div className="card-row">
                  <span className="card-label">Contact:</span>
                  <span className="card-value">
                    {appt.alumniId?.contactNo || "N/A"}
                  </span>
                </div>
                <div className="card-row">
                  <span className="card-label">Slot Date & Time:</span>
                  <span className="card-value">
                    {appt.slot
                      ? new Date(appt.slot.date).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "No Slot Assigned"}
                  </span>
                </div>
              </div>
              <div className="card-actions">
                {appt.status !== "Confirmed" && (
                  <button
                    className="btn confirm-btn"
                    onClick={() => updateStatus(appt._id, "Confirmed")}
                    disabled={processingId === appt._id}
                  >
                    {processingId === appt._id && (
                      <FaSpinner className="processing-icon" />
                    )}
                    {processingId !== appt._id && <FaCheck />} Confirm
                  </button>
                )}
                {appt.status !== "Rejected" && (
                  <button
                    className="btn reject-btn"
                    onClick={() => updateStatus(appt._id, "Rejected")}
                    disabled={processingId === appt._id}
                  >
                    {processingId === appt._id && (
                      <FaSpinner className="processing-icon" />
                    )}
                    {processingId !== appt._id && <FaTimes />} Reject
                  </button>
                )}
                <button
                  className="btn delete-btn"
                  onClick={() => {
                    setAppointmentToDelete(appt._id);
                    setShowDeleteModal(true);
                  }}
                  disabled={processingId === appt._id}
                >
                  {processingId === appt._id && (
                    <FaSpinner className="processing-icon" />
                  )}
                  {processingId !== appt._id && <FaTrash />} Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showDeleteModal && (
        <div className="modal-container">
          <div className="modal">
            <p>Are you sure you want to delete this appointment?</p>
            <div className="modal-actions">
              <button
                onClick={() => deleteAppointment(appointmentToDelete)}
                className="btn confirm-btn"
                disabled={processingId === appointmentToDelete}
              >
                {processingId === appointmentToDelete && (
                  <FaSpinner className="processing-icon" />
                )}
                {processingId !== appointmentToDelete && "Yes, Delete"}
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn cancel-btn"
                disabled={processingId}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAppointments;
