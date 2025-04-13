import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/AdminMentorList.css";

const AdminMentorList = () => {
  const [mentors, setMentors] = useState([]);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'table'
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios
      .get("/api/v1/mentors/allMentor")
      .then((res) => {
        setMentors(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching mentors:", err);
        setLoading(false);
      });
  }, []);

  const filteredMentors = mentors.filter(
    (mentor) =>
      mentor.alumni?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.alumni?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.expertise
        ?.join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-mentor-container">
      <div className="admin-header">
        <h2 className="admin-title">All Registered Mentors</h2>
        <div className="controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search mentors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>
          <div className="view-toggle">
            <button
              className={viewMode === "grid" ? "active" : ""}
              onClick={() => setViewMode("grid")}
            >
              Grid View
            </button>
            <button
              className={viewMode === "table" ? "active" : ""}
              onClick={() => setViewMode("table")}
            >
              Table View
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner">Loading...</div>
      ) : filteredMentors.length === 0 ? (
        <div className="no-results">
          {searchTerm
            ? "No matching mentors found"
            : "No mentors registered yet"}
        </div>
      ) : viewMode === "grid" ? (
        <div className="mentor-cards-grid">
          {filteredMentors.map((mentor) => (
            <MentorCard key={mentor._id} mentor={mentor} />
          ))}
        </div>
      ) : (
        <div className="mentor-table-container">
          <table className="mentor-table">
            <thead>
              <tr>
                <th>Mentor</th>
                <th>Details</th>
                <th>Expertise</th>
                <th>Available Slots</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMentors.map((mentor) => (
                <MentorTableRow key={mentor._id} mentor={mentor} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const MentorCard = ({ mentor }) => (
  <div className="mentor-card">
    <div className="mentor-header">
      <img
        src={mentor.alumni?.profilePhoto || "/default-profile.png"}
        alt={mentor.alumni?.name}
        className="mentor-photo"
      />
      <div className="mentor-info">
        <h3>{mentor.alumni?.name || "Unknown"}</h3>
        <p className="position">
          {mentor.alumni?.designation || "Not specified"}{" "}
          {mentor.alumni?.currentCompany &&
            `at ${mentor.alumni.currentCompany}`}
        </p>
        <div className="contact-info">
          <p>✉️ {mentor.alumni?.email || "Not provided"}</p>
          <p>📞 {mentor.alumni?.contactNo || "Not provided"}</p>
        </div>
      </div>
    </div>

    <div className="mentor-details">
      <div className="detail-section">
        <label>Bio:</label>
        <p>{mentor.bio || "No bio provided"}</p>
      </div>

      <div className="detail-section">
        <label>Expertise:</label>
        <div className="expertise-tags">
          {mentor.expertise?.map((skill, i) => (
            <span key={i} className="tag">
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="detail-section">
        <label>Available Slots:</label>
        {mentor.slots?.length > 0 ? (
          <ul className="slots-list">
            {mentor.slots.slice(0, 3).map((slot) => (
              <li key={slot._id}>
                {new Date(slot.date).toLocaleDateString()} - {slot.time}
              </li>
            ))}
            {mentor.slots.length > 3 && (
              <li className="more-slots">+{mentor.slots.length - 3} more</li>
            )}
          </ul>
        ) : (
          <p>No slots available</p>
        )}
      </div>

      {(mentor.alumni?.LinkedIn || mentor.alumni?.Instagram) && (
        <div className="social-links">
          {mentor.alumni?.LinkedIn && (
            <a
              href={mentor.alumni.LinkedIn}
              target="_blank"
              rel="noreferrer"
              className="social-link linkedin"
            >
              LinkedIn
            </a>
          )}
          {mentor.alumni?.Instagram && (
            <a
              href={mentor.alumni.Instagram}
              target="_blank"
              rel="noreferrer"
              className="social-link instagram"
            >
              Instagram
            </a>
          )}
        </div>
      )}
    </div>
  </div>
);

const MentorTableRow = ({ mentor }) => (
  <tr>
    <td>
      <div className="table-mentor-info">
        <img
          src={mentor.alumni?.profilePhoto || "/default-profile.png"}
          alt={mentor.alumni?.name}
          className="table-mentor-photo"
        />
        <div>
          <strong>{mentor.alumni?.name || "Unknown"}</strong>
          <p>{mentor.alumni?.email || "Not provided"}</p>
        </div>
      </div>
    </td>
    <td>
      <p>{mentor.alumni?.designation || "Not specified"}</p>
      <p>{mentor.alumni?.currentCompany || "Not specified"}</p>
    </td>
    <td>
      <div className="table-expertise">
        {mentor.expertise?.join(", ") || "Not specified"}
      </div>
    </td>
    <td>
      {mentor.slots?.length > 0 ? (
        <div className="table-slots">
          {mentor.slots.slice(0, 2).map((slot) => (
            <div key={slot._id} className="table-slot">
              {new Date(slot.date).toLocaleDateString()} - {slot.time}
            </div>
          ))}
          {mentor.slots.length > 2 && (
            <div className="table-more-slots">
              +{mentor.slots.length - 2} more
            </div>
          )}
        </div>
      ) : (
        <span className="no-slots">No slots</span>
      )}
    </td>
    <td>
      <div className="table-actions">
        <button className="view-btn">View</button>
        <button className="contact-btn">Contact</button>
      </div>
    </td>
  </tr>
);

export default AdminMentorList;
