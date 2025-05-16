import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "../styles/CreateSlot.css";

const CreateSlot = () => {
  const [slotDate, setSlotDate] = useState("");
  const [capacity, setCapacity] = useState(30);
  const [filter, setFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(false);
  const [allSlots, setAllSlots] = useState([]);
  const [filteredSlots, setFilteredSlots] = useState([]);

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
        capacity,
      });
      toast.success("Slot created successfully!");
      setSlotDate("");
      setCapacity(30);
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
      getAllSlots();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting slot");
    }
  };

  const applyFilter = () => {
    if (filter === "All") {
      setFilteredSlots(allSlots);
    } else {
      const updatedSlots = allSlots.filter((slot) => slot.status === filter);
      setFilteredSlots(updatedSlots);
    }
  };

  useEffect(() => {
    getAllSlots();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [filter, allSlots]);

  return (
    <div className="cs-create-slot-container">
      <h2 className="cs-create-slot-title">Create New Slot</h2>
      <div className="cs-form-group">
        <label htmlFor="slotDateTime" className="cs-label">
          Select Date & Time
        </label>
        <input
          type="datetime-local"
          id="slotDateTime"
          className="cs-datetime-input"
          value={slotDate}
          onChange={(e) => setSlotDate(e.target.value)}
          min={new Date().toISOString().slice(0, 16)}
        />
      </div>

      <div className="cs-form-group">
        <label htmlFor="capacity" className="cs-label">
          Slot Capacity
        </label>
        <input
          type="number"
          id="capacity"
          className="cs-capacity-input"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          min="1"
        />
      </div>

      <button
        onClick={handleCreate}
        className="cs-btn cs-create-btn"
        disabled={isLoading || !slotDate || !capacity}
      >
        {isLoading ? (
          <>
            <span className="cs-spinner"></span>
            Creating...
          </>
        ) : (
          "Create Slot"
        )}
      </button>

      <div className="cs-all-slots-section">
        <h3 className="cs-available-slots-title">Available Slots</h3>

        <div className="cs-filter-section">
          <label htmlFor="slotFilter" className="cs-label">
            Filter by Status:
          </label>
          <select
            id="slotFilter"
            className="cs-select-filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="available">Available</option>
            <option value="booked">Booked</option>
          </select>
        </div>

        {filteredSlots.length === 0 ? (
          <p className="cs-empty-state">No slots match the selected filter.</p>
        ) : (
          <>
            <table className="cs-slots-table">
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
                {filteredSlots.map((slot) => (
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
                      <span className={`cs-status cs-status-${slot.status}`}>
                        {slot.status}
                      </span>
                    </td>
                    <td data-label="Capacity">{slot.capacity}</td>
                    <td data-label="Booked">{slot.bookedCount}</td>
                    <td data-label="Actions">
                      <button
                        className="cs-btn cs-delete-btn"
                        onClick={() => handleDeleteSlot(slot._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="cs-slots-card-view">
              {filteredSlots.map((slot) => (
                <div key={slot._id} className="cs-slot-card">
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
                      className={`cs-status cs-status-${slot.status}`}
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
                    className="cs-btn cs-delete-btn"
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
