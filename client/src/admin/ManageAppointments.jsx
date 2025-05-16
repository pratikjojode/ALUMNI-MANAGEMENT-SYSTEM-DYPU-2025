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
  const [processingId, setProcessingId] = useState(null);

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
      setShowDeleteModal(false);
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
      <div className="ma-loading-container">
        <div className="ma-spinner">
          <FaSpinner className="ma-loading-icon" />
        </div>
        <p>Loading appointments...</p>
      </div>
    );
  }

  return (
    <div className="ma-container">
      <div className="ma-header">
        <h2>Manage Appointments</h2>
        <div className="ma-view-toggle">
          <button
            className={`ma-toggle-btn ${
              viewMode === "table" ? "ma-active" : ""
            }`}
            onClick={() => setViewMode("table")}
          >
            Table View
          </button>
          <button
            className={`ma-toggle-btn ${
              viewMode === "card" ? "ma-active" : ""
            }`}
            onClick={() => setViewMode("card")}
          >
            Card View
          </button>
        </div>
      </div>

      <div className="ma-filter">
        <label>Filter by Slot Date: </label>
        <select
          value={selectedSlot}
          onChange={(e) => setSelectedSlot(e.target.value)}
          className="ma-dropdown"
        >
          {uniqueSlotDates.map((date, index) => (
            <option key={index} value={date}>
              {date}
            </option>
          ))}
        </select>
      </div>

      {filteredAppointments.length === 0 ? (
        <div className="ma-empty">
          <p>No appointments found</p>
        </div>
      ) : viewMode === "table" ? (
        <div className="ma-table-wrapper">
          <table className="ma-table">
            <thead>
              <tr>
                <th>Alumni Name</th>
                <th>Email</th>
                <th>Slot Date & Time</th>
                <th>Status</th>
                <th>appointmentDate</th>
                <th>Confirm</th>
                <th>Reject</th>
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
                      className={`ma-status ma-status-${appt.status.toLowerCase()}`}
                    >
                      {appt.status}
                    </span>
                  </td>
                  <td>{appt.appointmentDate}</td>
                  <td>
                    {appt.status !== "Confirmed" ? (
                      <button
                        onClick={() => updateStatus(appt._id, "Confirmed")}
                        className="ma-btn ma-confirm-btn"
                        disabled={processingId === appt._id}
                      >
                        {processingId === appt._id && (
                          <FaSpinner className="ma-processing-icon" />
                        )}
                        {processingId !== appt._id && <FaCheck />}
                      </button>
                    ) : (
                      <span className="ma-action-disabled">
                        <FaCheck />
                      </span>
                    )}
                  </td>
                  <td>
                    {appt.status !== "Rejected" ? (
                      <button
                        onClick={() => updateStatus(appt._id, "Rejected")}
                        className="ma-btn ma-reject-btn"
                        disabled={processingId === appt._id}
                      >
                        {processingId === appt._id && (
                          <FaSpinner className="ma-processing-icon" />
                        )}
                        {processingId !== appt._id && <FaTimes />}
                      </button>
                    ) : (
                      <span className="ma-action-disabled">
                        <FaTimes />
                      </span>
                    )}
                  </td>
                  <td className="ma-actions-cell">
                    <button
                      onClick={() => {
                        setAppointmentToDelete(appt._id);
                        setShowDeleteModal(true);
                      }}
                      className="ma-btn ma-delete-btn"
                      disabled={processingId === appt._id}
                    >
                      {processingId === appt._id && (
                        <FaSpinner className="ma-processing-icon" />
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
        <div className="ma-cards">
          {filteredAppointments.map((appt) => (
            <div key={appt._id} className="ma-card">
              <div className="ma-card-header">
                <img
                  src={appt.alumniId?.profilePhoto}
                  alt="profile"
                  className="ma-avatar"
                />
                <div>
                  <h3>{appt.alumniId?.name || "N/A"}</h3>
                  <span
                    className={`ma-status ma-status-${appt.status.toLowerCase()}`}
                  >
                    {appt.status}
                  </span>
                </div>
              </div>
              <div className="ma-card-body">
                <div className="ma-card-row">
                  <span className="ma-label">Email:</span>
                  <span className="ma-value">
                    {appt.alumniId?.email || "N/A"}
                  </span>
                </div>
                <div className="ma-card-row">
                  <span className="ma-label">Contact:</span>
                  <span className="ma-value">
                    {appt.alumniId?.contactNo || "N/A"}
                  </span>
                </div>
                <div className="ma-card-row">
                  <span className="ma-label">Slot Date & Time:</span>
                  <span className="ma-value">
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
              <div className="ma-card-actions">
                {appt.status !== "Confirmed" && (
                  <button
                    className="ma-btn ma-confirm-btn"
                    onClick={() => updateStatus(appt._id, "Confirmed")}
                    disabled={processingId === appt._id}
                  >
                    {processingId === appt._id && (
                      <FaSpinner className="ma-processing-icon" />
                    )}
                    {processingId !== appt._id && <FaCheck />} Confirm
                  </button>
                )}
                {appt.status !== "Rejected" && (
                  <button
                    className="ma-btn ma-reject-btn"
                    onClick={() => updateStatus(appt._id, "Rejected")}
                    disabled={processingId === appt._id}
                  >
                    {processingId === appt._id && (
                      <FaSpinner className="ma-processing-icon" />
                    )}
                    {processingId !== appt._id && <FaTimes />} Reject
                  </button>
                )}
                <button
                  className="ma-btn ma-delete-btn"
                  onClick={() => {
                    setAppointmentToDelete(appt._id);
                    setShowDeleteModal(true);
                  }}
                  disabled={processingId === appt._id}
                >
                  {processingId === appt._id && (
                    <FaSpinner className="ma-processing-icon" />
                  )}
                  {processingId !== appt._id && <FaTrash />} Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showDeleteModal && (
        <div className="ma-modal-overlay">
          <div className="ma-modal">
            <p>Are you sure you want to delete this appointment?</p>
            <div className="ma-modal-actions">
              <button
                onClick={() => deleteAppointment(appointmentToDelete)}
                className="ma-btn ma-confirm-btn"
                disabled={processingId === appointmentToDelete}
              >
                {processingId === appointmentToDelete && (
                  <FaSpinner className="ma-processing-icon" />
                )}
                {processingId !== appointmentToDelete && "Yes, Delete"}
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="ma-btn ma-cancel-btn"
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
