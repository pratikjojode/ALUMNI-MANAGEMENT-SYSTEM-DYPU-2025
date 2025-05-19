import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "../styles/AdminSessionList.css";

const AdminSessionList = ({ adminId }) => {
  const [showListModal, setShowListModal] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const openListModal = () => setShowListModal(true);
  const closeListModal = () => setShowListModal(false);

  const fetchSessions = async () => {
    if (!adminId) {
      setSessions([]);
      setError("");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(`/api/v1/admin-session/${adminId}`);
      setSessions(res.data);
    } catch (err) {
      console.error("Failed to fetch sessions:", err);
      setError("Failed to load sessions");
      toast.error("Failed to load sessions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (adminId && showListModal) {
      fetchSessions();
    } else if (!adminId) {
      setSessions([]);
      setError("");
    }
  }, [adminId, showListModal]);

  const storedUser = localStorage.getItem("user");
  let adminName = "Admin";
  if (storedUser) {
    try {
      adminName = JSON.parse(storedUser).name || "Admin";
    } catch {
      adminName = "Admin";
    }
  }

  // Format Date and Time nicely
  const formatDateTime = (dateStr) => {
    const date = new Date(dateStr);
    return {
      date: date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      time: date.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  return (
    <>
      <button className="open-modal-btn" onClick={openListModal}>
        {`View ${adminName} Session`}
      </button>

      {showListModal && (
        <div className="modal-overlay" onClick={closeListModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeListModal}>
              &times;
            </button>

            <h3>{`${adminName} Sessions`}</h3>

            {loading ? (
              <p>Loading sessions...</p>
            ) : error ? (
              <p style={{ color: "red" }}>{error}</p>
            ) : sessions.length === 0 ? (
              <p>No sessions found for this admin.</p>
            ) : (
              <div className="session-table-container">
                <table className="session-table">
                  <thead>
                    <tr>
                      <th>Login Date</th>
                      <th>Login Time</th>
                      <th>Logout Date</th>
                      <th>Logout Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessions.map(({ _id, loginTime, logoutTime }) => {
                      const login = formatDateTime(loginTime);
                      const logout = formatDateTime(logoutTime);
                      return (
                        <tr key={_id}>
                          <td>{login.date}</td>
                          <td>{login.time}</td>
                          <td>{logout.date}</td>
                          <td>{logout.time}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AdminSessionList;
