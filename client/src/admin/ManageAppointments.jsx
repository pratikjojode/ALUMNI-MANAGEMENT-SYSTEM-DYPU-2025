import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "../styles/ManageAppointments.css";

const ManageAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'card'

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        "http://localhost:5000/api/v1/appointments/all"
      );
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
    try {
      await axios.put(
        `http://localhost:5000/api/v1/appointments/${id}/status`,
        { status }
      );
      toast.success(`Appointment ${status.toLowerCase()} successfully`);
      fetchAppointments();
    } catch {
      toast.error("Failed to update status");
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
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

      {appointments.length === 0 ? (
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
                <th>Date & Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => (
                <tr key={appt._id}>
                  <td>{appt.alumniId?.name || "N/A"}</td>
                  <td>{appt.alumniId?.email || "N/A"}</td>
                  <td>
                    {new Date(appt.appointmentDate).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td>
                    <span
                      className={`status-badge ${appt.status.toLowerCase()}`}
                    >
                      {appt.status}
                    </span>
                  </td>
                  <td className="actions-cell">
                    {appt.status !== "Confirmed" && (
                      <button
                        onClick={() => updateStatus(appt._id, "Confirmed")}
                        className="btn confirm-btn"
                      >
                        Confirm
                      </button>
                    )}
                    {appt.status !== "Rejected" && (
                      <button
                        onClick={() => updateStatus(appt._id, "Rejected")}
                        className="btn reject-btn"
                      >
                        Reject
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="appointments-card-container">
          {appointments.map((appt) => (
            <div key={appt._id} className="appointment-card">
              <div className="card-header">
                <h3>{appt.alumniId?.name || "N/A"}</h3>
                <span className={`status-badge ${appt.status.toLowerCase()}`}>
                  {appt.status}
                </span>
              </div>
              <div className="card-body">
                <div className="card-row">
                  <span className="card-label">Email:</span>
                  <span className="card-value">
                    {appt.alumniId?.email || "N/A"}
                  </span>
                </div>
                <div className="card-row">
                  <span className="card-label">Date & Time:</span>
                  <span className="card-value">
                    {new Date(appt.appointmentDate).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
              <div className="card-actions">
                {appt.status !== "Confirmed" && (
                  <button
                    onClick={() => updateStatus(appt._id, "Confirmed")}
                    className="btn confirm-btn"
                  >
                    Confirm
                  </button>
                )}
                {appt.status !== "Rejected" && (
                  <button
                    onClick={() => updateStatus(appt._id, "Rejected")}
                    className="btn reject-btn"
                  >
                    Reject
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageAppointments;
