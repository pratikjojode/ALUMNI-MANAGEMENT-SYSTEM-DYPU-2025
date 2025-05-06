import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "../styles/AlumniRegistermentor.css";

const AlumniRegistermentor = () => {
  const [mentorData, setMentorData] = useState({
    bio: "",
    expertise: "",
    slots: [],
  });
  const [newSlot, setNewSlot] = useState({ date: "", time: "" });
  const [alumniId, setAlumniId] = useState(null);
  const [isMentor, setIsMentor] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAlumniData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in localStorage.");
        setLoading(false);
        return;
      }

      try {
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        const id = decodedToken.id;
        if (!id) {
          console.error("Alumni ID not found in token.");
          setLoading(false);
          return;
        }
        setAlumniId(id);

        const response = await axios.get(
          `/api/v1/mentorship/already-mentor/${id}`
        );
        setIsMentor(response.data.isMentor);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    getAlumniData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMentorData({
      ...mentorData,
      [name]: value,
    });
  };

  const handleAddSlot = () => {
    if (mentorData.slots.length >= 2) {
      toast.error("Maximum of 2 slots allowed.");
      return;
    }

    if (newSlot.date && newSlot.time) {
      setMentorData({
        ...mentorData,
        slots: [...mentorData.slots, newSlot],
      });
      setNewSlot({ date: "", time: "" });
    } else {
      toast.error("Please select both date and time for the slot.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!alumniId) {
      toast.error("Alumni ID not found.");
      return;
    }

    if (mentorData.slots.length === 0) {
      toast.error("Please add at least one available time slot.");
      return;
    }

    const mentorDataWithId = {
      ...mentorData,
      alumniId: alumniId,
      expertise: mentorData.expertise
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item !== ""),
    };

    axios
      .post("/api/v1/mentors/register", mentorDataWithId)
      .then(() => {
        toast.success("Mentorship registration successful");
        setIsMentor(true);
        setMentorData({
          bio: "",
          expertise: "",
          slots: [],
        });
        setNewSlot({ date: "", time: "" });
      })
      .catch((error) => {
        toast.error(
          `Error registering mentor: ${
            error.response?.data?.message || error.message || "Unknown error"
          }`
        );
        console.error("Mentorship registration error:", error);
      });
  };

  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const minDate = `${year}-${month}-${day}`;

  const isAddSlotButtonDisabled = mentorData.slots.length >= 2;

  if (loading) {
    return <div className="mentor-register-loading">Loading...</div>;
  }

  if (isMentor) {
    return (
      <div className="mentor-already-registered">
        <p>You are already registered as a mentor!</p>
      </div>
    );
  }

  return (
    <div className="mentor-register-container">
      <div className="mentor-register-card">
        <h2 className="mentor-register-title">
          Register as a Mentor To Our Students
        </h2>

        <form onSubmit={handleSubmit} className="mentor-register-form">
          <div className="form-group">
            <label htmlFor="bio" className="form-label">
              Bio:
            </label>
            <textarea
              id="bio"
              name="bio"
              value={mentorData.bio}
              onChange={handleChange}
              placeholder="Write a short bio about yourself"
              required
              className="form-textarea"
            />
          </div>

          <div className="form-group">
            <label htmlFor="expertise" className="form-label">
              Expertise (e.g., MERN, React, MongoDB):
            </label>
            <input
              type="text"
              id="expertise"
              name="expertise"
              value={mentorData.expertise}
              onChange={handleChange}
              placeholder="List your areas of expertise, separated by commas"
              required
              className="form-input"
            />
          </div>

          <h3 className="section-title">Available Time Slots</h3>
          <div className="slot-input-group">
            <input
              type="date"
              value={newSlot.date}
              onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })}
              required
              className="form-input date-input"
              min={minDate}
              disabled={isAddSlotButtonDisabled}
            />
            <input
              type="time"
              value={newSlot.time}
              onChange={(e) => setNewSlot({ ...newSlot, time: e.target.value })}
              required
              className="form-input time-input"
              disabled={isAddSlotButtonDisabled}
            />
            <button
              type="button"
              onClick={handleAddSlot}
              className="add-slot-btn"
              disabled={isAddSlotButtonDisabled}
            >
              {isAddSlotButtonDisabled ? "Max 2 Slots Added" : "Add Slot"}
            </button>
          </div>

          <div className="slots-container">
            <h4 className="slots-title">
              Your Added Slots ({mentorData.slots.length}/2)
            </h4>
            <ul className="slots-list">
              {mentorData.slots.length > 0 ? (
                mentorData.slots.map((slot, index) => {
                  // Logic to format time to AM/PM
                  const [hours, minutes] = slot.time.split(":");
                  const dateObj = new Date();
                  dateObj.setHours(
                    parseInt(hours, 10),
                    parseInt(minutes, 10),
                    0,
                    0
                  );
                  const formattedTime = dateObj.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  });

                  return (
                    <li key={index} className="slot-item">
                      {new Date(slot.date).toLocaleDateString()} -{" "}
                      {formattedTime} {/* Use formatted time here */}
                      <button
                        className="remove-slot-btn"
                        onClick={() => {
                          const updatedSlots = [...mentorData.slots];
                          updatedSlots.splice(index, 1);
                          setMentorData({ ...mentorData, slots: updatedSlots });
                        }}
                      >
                        ×
                      </button>
                    </li>
                  );
                })
              ) : (
                <li className="no-slots">No slots added yet</li>
              )}
            </ul>
          </div>

          <button type="submit" className="submit-btn">
            Submit Mentorship Profile
          </button>
        </form>

        <p className="alumni-id">Alumni ID: {alumniId || "Not available"}</p>
      </div>
    </div>
  );
};

export default AlumniRegistermentor;
