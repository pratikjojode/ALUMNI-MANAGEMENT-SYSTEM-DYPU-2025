import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaUser,
  FaBriefcase,
  FaGraduationCap,
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
  const [meetups, setMeetups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlumniData = async () => {
      try {
        const alumniResponse = await axios.get(
          "http://localhost:5000/api/v1/alumni/all",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setAlumniList(alumniResponse.data.alumni);
        setTotalAlumni(alumniResponse.data.total);

        const profileResponse = await axios.get(
          "http://localhost:5000/api/v1/alumni/profile",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setAlumniProfile(profileResponse.data.alumni);

        const jobResponse = await axios.get(
          "http://localhost:5000/api/v1/jobsPosting/job-posts",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setTotalJobPostings(jobResponse.data.totalJobPosts);

        // Fetch events
        const eventsResponse = await axios.get(
          "http://localhost:5000/api/v1/events/get",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setEvents(eventsResponse.data.events);

        setMeetups([
          {
            id: 1,
            title: "Alumni Meetup: San Francisco",
            date: "2025-05-01",
            location: "San Francisco, CA",
            description: "A casual meetup for alumni living in the Bay Area.",
          },
          {
            id: 2,
            title: "Alumni Meetup: Boston",
            date: "2025-05-10",
            location: "Boston, MA",
            description: "An alumni meetup to discuss industry trends.",
          },
        ]);
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
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading alumni data...</p>
      </div>
    );
  }

  if (!alumniList.length && !alumniProfile) {
    return <div className="no-data">No alumni data found</div>;
  }

  return (
    <div className="alumni-profile-container">
      {/* Stats Cards */}
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon">
            <FaUser />
          </div>
          <div className="stat-info">
            <h3>{totalAlumni}</h3>
            <p>Total Alumni</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaBriefcase />
          </div>
          <div className="stat-info">
            <h3>{totalJobPostings}</h3>
            <p>Job Postings</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="profile-content">
        {/* Profile Section */}
        {alumniProfile && (
          <div className="profile-section">
            <div className="profile-card">
              <div className="profile-header">
                <div className="avatar">
                  {alumniProfile.name.charAt(0).toUpperCase()}
                </div>
                <div className="profile-info">
                  <h2>{alumniProfile.name}</h2>
                  <p className="education">
                    <FaUniversity /> {alumniProfile.college} -{" "}
                    {alumniProfile.branch}, Class of {alumniProfile.passoutYear}
                  </p>
                  <p className="current-job">
                    <FaBriefcase /> {alumniProfile.currentCompany} |{" "}
                    {alumniProfile.designation}
                  </p>
                  <p className="location">
                    <FaMapMarkerAlt /> {alumniProfile.location}
                  </p>
                </div>
              </div>

              <div className="profile-details">
                <div className="detail-item">
                  <FaEnvelope className="detail-icon" />
                  <div>
                    <h4>Email</h4>
                    <p>{alumniProfile.email}</p>
                  </div>
                </div>

                <div className="detail-item">
                  <FaPhone className="detail-icon" />
                  <div>
                    <h4>Contact</h4>
                    <p>{alumniProfile.contactNo || "Not provided"}</p>
                  </div>
                </div>

                {alumniProfile.LinkedIn && (
                  <div className="detail-item">
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
                  <div className="detail-item">
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

        {/* Alumni List */}
        <div className="alumni-list-section">
          <h3 className="section-title">Alumni Network</h3>
          <div className="alumni-grid">
            {alumniList.map((alumni) => (
              <div key={alumni._id} className="alumni-card">
                <div className="alumni-avatar">
                  {alumni.name.charAt(0).toUpperCase()}
                </div>
                <div className="alumni-info">
                  <h4>{alumni.name}</h4>
                  <p className="alumni-company">{alumni.currentCompany}</p>
                  <p className="alumni-role">{alumni.designation}</p>
                  <p className="alumni-location">
                    <FaMapMarkerAlt /> {alumni.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Events and Meetups */}
        <div className="events-section">
          <div className="events-column">
            <h3 className="section-title">
              <FaCalendarAlt /> Upcoming Events
            </h3>
            {events.map((event) => (
              <div key={event.id} className="event-card">
                <div className="event-date">
                  <span className="event-day">
                    {new Date(event.date).getDate()}
                  </span>
                  <span className="event-month">
                    {new Date(event.date).toLocaleString("default", {
                      month: "short",
                    })}
                  </span>
                </div>
                <div className="event-details">
                  <h4>{event.title}</h4>
                  <p className="event-location">
                    <FaMapMarkerAlt /> {event.location}
                  </p>
                  <p className="event-description">{event.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="meetups-column">
            <h3 className="section-title">
              <FaCalendarAlt /> Alumni Meetups
            </h3>
            {meetups.map((meetup) => (
              <div key={meetup.id} className="meetup-card">
                <div className="meetup-date">
                  <span className="meetup-day">
                    {new Date(meetup.date).getDate()}
                  </span>
                  <span className="meetup-month">
                    {new Date(meetup.date).toLocaleString("default", {
                      month: "short",
                    })}
                  </span>
                </div>
                <div className="meetup-details">
                  <h4>{meetup.title}</h4>
                  <p className="meetup-location">
                    <FaMapMarkerAlt /> {meetup.location}
                  </p>
                  <p className="meetup-description">{meetup.description}</p>
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
