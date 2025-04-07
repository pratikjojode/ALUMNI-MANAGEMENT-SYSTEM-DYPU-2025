import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import "../styles/BookAppointment.css"; // We'll create this CSS file

const BookAppointment = () => {
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [existingAppointment, setExistingAppointment] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const token = localStorage.getItem("token");
  let alumniId = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      alumniId = decoded.id || decoded.alumniId;
    } catch {
      console.error("Invalid token");
      toast.error("Invalid login session");
    }
  }

  // Fetch available slots
  useEffect(() => {
    if (!alumniId) return;
    axios
      .get("http://localhost:5000/api/v1/slots/available")
      .then((res) => setSlots(res.data))
      .catch(() => toast.error("Failed to fetch slots"));
  }, [alumniId]);

  useEffect(() => {
    if (!alumniId) return;
    axios
      .get(`http://localhost:5000/api/v1/appointments/my/${alumniId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.data) {
          setExistingAppointment(res.data);
        }
      })
      .catch(() => {});
  }, [alumniId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post(
        "http://localhost:5000/api/v1/appointments/create",
        {
          alumniId,
          slotId: selectedSlot, // 🔥 FIXED: send slotId, not appointmentDate
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Appointment requested successfully!");
      setSelectedSlot("");

      // Refresh appointment
      const res = await axios.get(
        `http://localhost:5000/api/v1/appointments/my/${alumniId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setExistingAppointment(res.data);
    } catch {
      toast.error("Failed to create appointment");
    } finally {
      setIsLoading(false);
    }
  };

  if (!alumniId) {
    return (
      <div className="login-required-container">
        <h2>Book LC Appointment</h2>
        <div className="login-message">
          <p>Login required to book appointment</p>
          <button
            className="btn login-btn"
            onClick={() => (window.location.href = "/login")}
          >
            Login Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="appointment-container">
      <h2>Book LC Appointment</h2>

      <form onSubmit={handleSubmit} className="appointment-form">
        <div className="form-group">
          <label htmlFor="appointment-slot">Select Available Slot</label>
          <select
            id="appointment-slot"
            className="slot-select"
            value={selectedSlot}
            onChange={(e) => setSelectedSlot(e.target.value)}
            required
            disabled={isLoading}
          >
            <option value="">Select a time slot</option>
            {slots.map((slot) => (
              <option key={slot._id} value={slot._id}>
                {" "}
                {/* FIXED: use slot._id as value */}
                {new Date(slot.date).toLocaleString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="btn submit-btn"
          disabled={!selectedSlot || isLoading}
        >
          {isLoading ? (
            <>
              <span className="spinner"></span>
              Booking...
            </>
          ) : (
            "Request Appointment"
          )}
        </button>
      </form>

      {/* Existing Appointment */}
      {existingAppointment && (
        <div className="existing-appointment">
          <h3>Your Current Appointment</h3>
          <div className="appointment-details">
            <div className="detail-row">
              <span className="detail-label">Date & Time:</span>
              <span className="detail-value">
                {new Date(existingAppointment.appointmentDate).toLocaleString(
                  "en-US",
                  {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Status:</span>
              <span
                className={`status-tag ${existingAppointment.status.toLowerCase()}`}
              >
                {existingAppointment.status}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookAppointment;
