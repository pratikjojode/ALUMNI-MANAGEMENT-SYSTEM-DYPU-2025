import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaLinkedin,
  FaInstagram,
  FaEnvelope,
  FaPhone,
  FaUniversity,
  FaGraduationCap,
  FaBuilding,
  FaBriefcase,
  FaMapMarkerAlt,
} from "react-icons/fa";
import "../styles/AlumniProfile.css";

const AlumniProfile = () => {
  const [alumni, setAlumni] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pdfError, setPdfError] = useState(false);
  const [userName, setUserName] = useState("");

  // Fetch user name from localStorage
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setUserName(user.name || "User");
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      }
    }
  }, []);

  // Fetch alumni data from the API
  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const res = await axios.get("/api/v1/alumni/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setAlumni(res.data.alumni);
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlumni();
  }, []);

  if (loading)
    return (
      <div className="profile-loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading profile data...</p>
      </div>
    );

  if (!alumni)
    return (
      <div className="profile-error-container">
        <h3 className="profile-error-heading">Profile Not Found</h3>
        <p className="profile-error-message">
          We couldn't retrieve the alumni profile. Please try again later.
        </p>
      </div>
    );

  return (
    <div className="alumni-profile-container">
      {/* Welcome Message */}
      <div className="welcome-message">
        <h1>Welcome to Your Profile, {userName}!</h1>
        <p>Here's your detailed alumni information.</p>
      </div>

      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar-wrapper">
          <img
            src={alumni.profilePhoto || "https://via.placeholder.com/150"}
            alt={alumni.name}
            className="profile-avatar"
          />
          {alumni.isPremium && <span className="premium-badge">PRO</span>}
        </div>

        <div className="profile-header-details">
          <h1 className="profile-name">{alumni.name}</h1>
          <p className="profile-title">
            {alumni.designation} at {alumni.currentCompany || "N/A"}
          </p>
          <div className="profile-location">
            <FaMapMarkerAlt className="location-icon" />
            <span className="location-text">{alumni.location || "N/A"}</span>
          </div>
        </div>
      </div>

      {/* Academic Result Section */}
      {alumni.academicResult ? (
        <div className="academic-result-section">
          <h3 className="academic-result-heading">Academic Result</h3>
          {alumni.academicResult.toLowerCase().endsWith(".pdf") ? (
            !pdfError ? (
              <embed
                src={alumni.academicResult}
                type="application/pdf"
                width="100%"
                height="500px"
                className="pdf-viewer"
                onError={() => setPdfError(true)}
              />
            ) : (
              <div className="pdf-error-container">
                <p className="pdf-error-text">
                  ⚠️ Failed to load PDF. You can download it below:
                </p>
                <a
                  href={alumni.academicResult}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="pdf-download-link"
                >
                  <button className="download-button">
                    Download Academic Result
                  </button>
                </a>
              </div>
            )
          ) : (
            <img
              src={alumni.academicResult}
              alt="Academic Result"
              className="academic-result-image"
            />
          )}
        </div>
      ) : (
        <p className="no-academic-result">Academic result not uploaded.</p>
      )}

      {/* Profile Details Grid */}
      <div className="profile-details-grid">
        <div className="detail-card">
          <div className="detail-icon">
            <FaEnvelope />
          </div>
          <div className="detail-content">
            <h4 className="detail-title">Email</h4>
            <p className="detail-value">{alumni.email}</p>
          </div>
        </div>

        <div className="detail-card">
          <div className="detail-icon">
            <FaPhone />
          </div>
          <div className="detail-content">
            <h4 className="detail-title">Contact</h4>
            <p className="detail-value">{alumni.contactNo || "Not provided"}</p>
          </div>
        </div>

        <div className="detail-card">
          <div className="detail-icon">
            <FaUniversity />
          </div>
          <div className="detail-content">
            <h4 className="detail-title">College</h4>
            <p className="detail-value">{alumni.college}</p>
          </div>
        </div>

        <div className="detail-card">
          <div className="detail-icon">
            <FaGraduationCap />
          </div>
          <div className="detail-content">
            <h4 className="detail-title">Branch & Year</h4>
            <p className="detail-value">
              {alumni.branch} ({alumni.passoutYear})
            </p>
          </div>
        </div>

        <div className="detail-card">
          <div className="detail-icon">
            <FaBuilding />
          </div>
          <div className="detail-content">
            <h4 className="detail-title">Current Company</h4>
            <p className="detail-value">
              {alumni.currentCompany || "Not provided"}
            </p>
          </div>
        </div>

        <div className="detail-card">
          <div className="detail-icon">
            <FaBriefcase />
          </div>
          <div className="detail-content">
            <h4 className="detail-title">Designation</h4>
            <p className="detail-value">
              {alumni.designation || "Not provided"}
            </p>
          </div>
        </div>

        <div className="detail-card">
          <div className="detail-icon">
            <FaBriefcase />
          </div>
          <div className="detail-content">
            <h4 className="detail-title">Your Alumni ID</h4>
            <p className="detail-value">{alumni._id || "Not provided"}</p>
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="social-links">
        {alumni.LinkedIn && (
          <a
            href={alumni.LinkedIn}
            target="_blank"
            rel="noopener noreferrer"
            className="social-link linkedin-link"
          >
            <FaLinkedin />
            <span className="social-link-text">LinkedIn Profile</span>
          </a>
        )}

        {alumni.Instagram && (
          <a
            href={alumni.Instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="social-link instagram-link"
          >
            <FaInstagram />
            <span className="social-link-text">Instagram</span>
          </a>
        )}
      </div>
    </div>
  );
};

export default AlumniProfile;
