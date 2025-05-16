import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaUser,
  FaBriefcase,
  FaCalendarAlt,
  FaLinkedin,
  FaInstagram,
  FaEnvelope,
  FaPhone,
  FaUniversity,
  FaMapMarkerAlt,
} from "react-icons/fa";
import "../styles/AlumniDashboard.css";

const AlumniProfile = () => {
  const [alumniList, setAlumniList] = useState([]);
  const [alumniProfile, setAlumniProfile] = useState(null);
  const [totalAlumni, setTotalAlumni] = useState(0);
  const [totalJobPostings, setTotalJobPostings] = useState(0);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlumniData = async () => {
      try {
        const alumniResponse = await axios.get("/api/v1/alumni/all", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setAlumniList(alumniResponse.data.alumni);
        setTotalAlumni(alumniResponse.data.total);

        const profileResponse = await axios.get("/api/v1/alumni/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setAlumniProfile(profileResponse.data.alumni);

        const jobResponse = await axios.get("/api/v1/jobsPosting/job-posts", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setTotalJobPostings(jobResponse.data.totalCount);

        const eventsResponse = await axios.get("/api/v1/events/get", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setEvents(eventsResponse.data.events);
      } catch (err) {
        console.error("Error fetching alumni data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlumniData();
  }, []);

  if (loading) {
    return (
      <div className="loading-wrapper">
        <div className="loading-spinner"></div>
        <p>Loading alumni data...</p>
      </div>
    );
  }

  if (!alumniList.length && !alumniProfile) {
    return <div className="no-data-wrapper">No alumni data found</div>;
  }

  const alumniData = JSON.parse(localStorage.getItem("user"));
  console.log("alumni Data:", alumniData);

  return (
    <div className="alumni-dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome to Your Alumni Dashboard: {alumniData.name}</h1>
        <p className="dashboard-subtitle">
          Track your professional journey and connect with fellow alumni
        </p>
        <p>Here's your detailed alumni information.</p>
      </div>
      <div className="dashboard-stats-wrapper">
        <div className="dashboard-stat-card">
          <div className="stat-icon-wrapper">
            <FaUser />
          </div>
          <div className="stat-content">
            <h3>{totalAlumni}</h3>
            <p>Total Alumni</p>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="stat-icon-wrapper">
            <FaBriefcase />
          </div>
          <div className="stat-content">
            <h3>{totalJobPostings}</h3>
            <p>Job Postings</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content-wrapper">
        {/* Profile Section */}
        {alumniProfile && (
          <div className="alumni-profile-wrapper">
            <div className="profile-card-wrapper">
              <div className="profile-header-wrapper">
                <div className="profile-avatar-dashboard">
                  {alumniProfile.profilePhoto ? (
                    <img
                      src={alumniProfile.profilePhoto}
                      alt={alumniProfile.name}
                      className="profile-image-alumni"
                    />
                  ) : (
                    alumniProfile.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="profile-header-content">
                  <h2>{alumniProfile.name}</h2>
                  <p className="profile-education">
                    <FaUniversity /> {alumniProfile.college} -{" "}
                    {alumniProfile.branch}, Class of {alumniProfile.passoutYear}
                  </p>
                  <p className="profile-job">
                    <FaBriefcase /> {alumniProfile.currentCompany} |{" "}
                    {alumniProfile.designation}
                  </p>
                  <p className="profile-location">
                    <FaMapMarkerAlt /> {alumniProfile.location}
                  </p>
                </div>
              </div>

              <div className="profile-details-wrapper">
                <div className="profile-detail-item">
                  <FaEnvelope className="detail-icon" />
                  <div>
                    <h4>Email</h4>
                    <p>{alumniProfile.email}</p>
                  </div>
                </div>

                <div className="profile-detail-item">
                  <FaPhone className="detail-icon" />
                  <div>
                    <h4>Contact</h4>
                    <p>{alumniProfile.contactNo || "Not provided"}</p>
                  </div>
                </div>

                {alumniProfile.LinkedIn && (
                  <div className="profile-detail-item">
                    <FaLinkedin className="detail-icon" />
                    <div>
                      <h4>LinkedIn</h4>
                      <a
                        href={alumniProfile.LinkedIn}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Profile
                      </a>
                    </div>
                  </div>
                )}

                {alumniProfile.Instagram && (
                  <div className="profile-detail-item">
                    <FaInstagram className="detail-icon" />
                    <div>
                      <h4>Instagram</h4>
                      <a
                        href={alumniProfile.Instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Profile
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Alumni Network Section */}
        <div className="alumni-network-wrapper">
          <h3 className="network-section-title">Alumni Network</h3>
          <div className="alumni-network-grid">
            {alumniList.map((alumni) => (
              <div key={alumni._id} className="alumni-network-card">
                <div className="network-avatar">
                  {alumni.profilePhoto ? (
                    <img
                      src={alumni.profilePhoto}
                      alt={alumni.name}
                      className="network-image"
                    />
                  ) : (
                    alumni.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="network-info">
                  <h4>{alumni.name}</h4>
                  <p className="network-company">{alumni.currentCompany}</p>
                  <p className="network-role">{alumni.designation}</p>
                  <p className="network-location">
                    <FaMapMarkerAlt /> {alumni.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Events and Meetups */}
        <div className="events-wrapper">
          <div className="events-column">
            <h3 className="events-section-title">
              <FaCalendarAlt /> Upcoming Events
            </h3>
            {events.map((event) => (
              <div key={event.id} className="event-card-wrapper">
                <div className="event-date-wrapper">
                  <span className="event-date-day">
                    {new Date(event.date).getDate()}
                  </span>
                  <span className="event-date-month">
                    {new Date(event.date).toLocaleString("default", {
                      month: "short",
                    })}
                  </span>
                </div>
                <div className="event-details-wrapper">
                  <h4>{event.title}</h4>
                  <p className="event-location">
                    <FaMapMarkerAlt /> {event.location}
                  </p>
                  <p className="event-description">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlumniProfile;
