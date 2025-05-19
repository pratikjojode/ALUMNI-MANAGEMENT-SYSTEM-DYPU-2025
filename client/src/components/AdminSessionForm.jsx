import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "../styles/AdminSessionForm.css";

const formatDateTimeLocal = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const isSameDay = (d1, d2) => {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

const AdminSessionFormModal = ({ adminId }) => {
  const [showModal, setShowModal] = useState(false);
  const [loginTime, setLoginTime] = useState("");
  const [logoutTime, setLogoutTime] = useState("");
  const [loading, setLoading] = useState(false);

  const minDateTime = formatDateTimeLocal(new Date());

  useEffect(() => {
    if (!adminId) return;

    const checkTodaySession = async () => {
      try {
        const res = await axios.get(`/api/v1/admin-session/${adminId}`);
        const sessions = res.data;

        const today = new Date();

        const hasTodaySession = sessions.some((session) =>
          isSameDay(new Date(session.loginTime), today)
        );

        if (!hasTodaySession) {
          setShowModal(true);
        }
      } catch (err) {
        console.error("Failed to check today's session:", err);
      }
    };

    checkTodaySession();
  }, [adminId]);

  const openModal = () => setShowModal(true);
  const closeModal = () => {
    setLoginTime("");
    setLogoutTime("");
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!loginTime || !logoutTime) {
      toast.error("Both login and logout time are required");
      return;
    }

    if (new Date(loginTime) >= new Date(logoutTime)) {
      toast.error("Logout time must be after login time");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("/api/v1/admin-session/admin-session", {
        admin: adminId,
        loginTime,
        logoutTime,
      });

      if (res.status === 201) {
        toast.success("Session saved successfully");
        setLoginTime("");
        setLogoutTime("");
        setShowModal(false);
      } else {
        toast.error(res.data.message || "Failed to save session");
      }
    } catch (err) {
      console.error("API Error:", err);
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("An unexpected error occurred. Failed to save session.");
      }
    } finally {
      setLoading(false);
    }
  };

  const storedUser = localStorage.getItem("user");
  let adminName = "Admin";
  if (storedUser) {
    try {
      adminName = JSON.parse(storedUser).name || "Admin";
    } catch {
      adminName = "Admin";
    }
  }

  return (
    <>
      <button className="open-modal-btn" onClick={openModal}>
        {`Add ${adminName} Session`}
      </button>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeModal}>
              &times;
            </button>

            <h3>{`${adminName} Session Time Entry`}</h3>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="loginTime">Login Time:</label>
                <input
                  type="datetime-local"
                  id="loginTime"
                  value={loginTime}
                  onChange={(e) => setLoginTime(e.target.value)}
                  required
                  min={minDateTime}
                />
              </div>

              <div className="form-group">
                <label htmlFor="logoutTime">Logout Time:</label>
                <input
                  type="datetime-local"
                  id="logoutTime"
                  value={logoutTime}
                  onChange={(e) => setLogoutTime(e.target.value)}
                  required
                  min={minDateTime}
                />
              </div>

              <button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Submit"}
              </button>

              <button
                type="button"
                className="cancel-btn"
                onClick={closeModal}
                disabled={loading}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminSessionFormModal;
