import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "../styles/CreateSlot.css";

const CreateSlot = () => {
  const [slotDate, setSlotDate] = useState("");
  const [capacity, setCapacity] = useState(30); // Default capacity is 30
  const [isLoading, setIsLoading] = useState(false);
  const [allSlots, setAllSlots] = useState([]);

  const handleCreate = async () => {
    if (!slotDate) {
      toast.error("Please select a date and time");
      return;
    }

    if (!capacity || capacity <= 0) {
      toast.error("Please enter a valid capacity");
      return;
    }

    setIsLoading(true);
    try {
      await axios.post("/api/v1/slots/create", {
        date: slotDate,
        capacity, // Send custom capacity
      });
      toast.success("Slot created successfully!");
      setSlotDate("");
      setCapacity(30); // Reset to default capacity after creating the slot
      getAllSlots();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create slot");
    } finally {
      setIsLoading(false);
    }
  };

  const getAllSlots = async () => {
    try {
      const res = await axios.get("/api/v1/slots/allSlots");
      if (res.data.success) {
        setAllSlots(res.data.slots || []);
      } else {
        toast.error("Failed to fetch slots");
      }
    } catch (error) {
      console.error("Error fetching slots", error);
      toast.error("Error fetching slots");
    }
  };

  const handleDeleteSlot = async (slotId) => {
    try {
      await axios.delete(`/api/v1/slots/${slotId}`);
      toast.success("Slot deleted successfully!");
      getAllSlots(); // Refresh the slots list
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting slot");
    }
  };

  useEffect(() => {
    getAllSlots();
  }, []);

  return (
    <div className="create-slot-container">
      <h2>Create New Slot</h2>
      <div className="form-group">
        <label htmlFor="slotDateTime">Select Date & Time</label>
        <input
          type="datetime-local"
          id="slotDateTime"
          className="datetime-input"
          value={slotDate}
          onChange={(e) => setSlotDate(e.target.value)}
          min={new Date().toISOString().slice(0, 16)}
        />
      </div>

      {/* Capacity Input */}
      <div className="form-group">
        <label htmlFor="capacity">Slot Capacity</label>
        <input
          type="number"
          id="capacity"
          className="capacity-input"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          min="1" // Ensure the capacity is at least 1
        />
      </div>

      <button
        onClick={handleCreate}
        className="btn create-btn"
        disabled={isLoading || !slotDate || !capacity}
      >
        {isLoading ? (
          <>
            <span className="spinner"></span>
            Creating...
          </>
        ) : (
          "Create Slot"
        )}
      </button>

      <div className="all-slots-section">
        <h3>Available Slots</h3>
        {allSlots.length === 0 ? (
          <p className="empty-state">No slots created yet.</p>
        ) : (
          <>
            <table className="slots-table">
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Status</th>
                  <th>Capacity</th>
                  <th>Booked</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {allSlots.map((slot) => (
                  <tr key={slot._id}>
                    <td data-label="Date & Time">
                      {new Date(slot.date).toLocaleString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td data-label="Status">
                      <span className={`status ${slot.status}`}>
                        {slot.status}
                      </span>
                    </td>
                    <td data-label="Capacity">{slot.capacity}</td>
                    <td data-label="Booked">{slot.bookedCount}</td>
                    <td data-label="Actions">
                      <button
                        className="btn delete-btn"
                        onClick={() => handleDeleteSlot(slot._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="slots-card-view">
              {allSlots.map((slot) => (
                <div key={slot._id} className="slot-card">
                  <p>
                    <strong>Date & Time:</strong>
                    <br />
                    {new Date(slot.date).toLocaleString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p>
                    <strong>Status:</strong>
                    <span
                      className={`status ${slot.status}`}
                      style={{ marginLeft: "8px" }}
                    >
                      {slot.status}
                    </span>
                  </p>
                  <p>
                    <strong>Capacity:</strong> {slot.capacity}
                  </p>
                  <p>
                    <strong>Booked:</strong> {slot.bookedCount}
                  </p>
                  <button
                    className="btn delete-btn"
                    style={{ marginTop: "10px" }}
                    onClick={() => handleDeleteSlot(slot._id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CreateSlot;
