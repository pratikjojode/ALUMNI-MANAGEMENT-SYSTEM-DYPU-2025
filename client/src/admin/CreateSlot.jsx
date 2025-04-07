import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "../styles/CreateSlot.css"; // Your custom styles

const CreateSlot = () => {
  const [slotDate, setSlotDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [allSlots, setAllSlots] = useState([]);

  const handleCreate = async () => {
    if (!slotDate) {
      toast.error("Please select a date and time");
      return;
    }

    setIsLoading(true);
    try {
      await axios.post("http://localhost:5000/api/v1/slots/create", {
        date: slotDate,
      });
      toast.success("Slot created successfully!");
      setSlotDate("");
      getAllSlots(); // Refresh slots after creation
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create slot");
    } finally {
      setIsLoading(false);
    }
  };

  const getAllSlots = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/v1/slots/allSlots"
      );
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
          min={new Date().toISOString().slice(0, 16)} // Prevent past dates
        />
      </div>
      <button
        onClick={handleCreate}
        className="btn create-btn"
        disabled={isLoading || !slotDate}
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

      {/* All Slots List */}
      <div className="all-slots-section">
        <h3>All Slots</h3>
        {allSlots.length === 0 ? (
          <p>No slots created yet.</p>
        ) : (
          <ul className="slot-list">
            {allSlots.map((slot) => (
              <li key={slot._id} className={`slot-item ${slot.status}`}>
                <strong>
                  {new Date(slot.date).toLocaleString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </strong>{" "}
                - <span className={`status ${slot.status}`}>{slot.status}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CreateSlot;
