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
        console.log(id);

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
    if (newSlot.date && newSlot.time) {
      setMentorData({
        ...mentorData,
        slots: [...mentorData.slots, newSlot],
      });
      setNewSlot({ date: "", time: "" });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!alumniId) {
      toast.error("Alumni ID not found.");
      return;
    }

    const mentorDataWithId = { ...mentorData, alumniId };

    axios
      .post("/api/v1/mentors/register", mentorDataWithId)
      .then(() => {
        toast.success("Mentorship registration successful");
        setIsMentor(true); // Update state to hide form
        setMentorData({
          bio: "",
          expertise: "",
          slots: [],
        });
        setNewSlot({ date: "", time: "" });
      })
      .catch((error) => {
        toast.error(
          `Error registering mentor: ${error.message || "Unknown error"}`
        );
      });
  };

  if (loading) {
    return <div className="mentor-register-loading">Loading...</div>; //  Loading indicator
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
          Register as a Mentor To Our students
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
              placeholder="List your areas of expertise"
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
            />
            <input
              type="time"
              value={newSlot.time}
              onChange={(e) => setNewSlot({ ...newSlot, time: e.target.value })}
              required
              className="form-input time-input"
            />
            <button
              type="button"
              onClick={handleAddSlot}
              className="add-slot-btn"
            >
              Add Slot
            </button>
          </div>

          <div className="slots-container">
            <h4 className="slots-title">Your Available Slots</h4>
            <ul className="slots-list">
              {mentorData.slots.length > 0 ? (
                mentorData.slots.map((slot, index) => (
                  <li key={index} className="slot-item">
                    {new Date(slot.date).toLocaleDateString()} - {slot.time}
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
                ))
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
