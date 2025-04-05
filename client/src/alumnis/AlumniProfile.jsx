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
import "../styles/AlumniProfile.css"; // Assuming you have a CSS file for styling
const AlumniProfile = () => {
  const [alumni, setAlumni] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/v1/alumni/profile",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
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
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading profile data...</p>
      </div>
    );

  if (!alumni)
    return (
      <div className="profile-error">
        <h3>Profile Not Found</h3>
        <p>We couldn't retrieve the alumni profile. Please try again later.</p>
      </div>
    );

  return (
    <div className="premium-profile-container">
      <div className="profile-header">
        <div className="profile-avatar-container">
          <img
            src={alumni.profilePhoto || "https://via.placeholder.com/150"}
            alt={alumni.name}
            className="profile-avatar"
          />
          {alumni.isPremium && <span className="premium-badge">PRO</span>}
        </div>

        <div className="profile-heading">
          <h1>{alumni.name}</h1>
          <p className="profile-title">
            {alumni.designation} at {alumni.currentCompany}
          </p>
          <div className="profile-location">
            <FaMapMarkerAlt className="icon" />
            <span>{alumni.location}</span>
          </div>
        </div>
      </div>

      <div className="profile-details-grid">
        <div className="detail-card">
          <div className="detail-icon">
            <FaEnvelope />
          </div>
          <div>
            <h4>Email</h4>
            <p>{alumni.email}</p>
          </div>
        </div>

        <div className="detail-card">
          <div className="detail-icon">
            <FaPhone />
          </div>
          <div>
            <h4>Contact</h4>
            <p>{alumni.contactNo || "Not provided"}</p>
          </div>
        </div>

        <div className="detail-card">
          <div className="detail-icon">
            <FaUniversity />
          </div>
          <div>
            <h4>College</h4>
            <p>{alumni.college}</p>
          </div>
        </div>

        <div className="detail-card">
          <div className="detail-icon">
            <FaGraduationCap />
          </div>
          <div>
            <h4>Branch & Year</h4>
            <p>
              {alumni.branch} ({alumni.passoutYear})
            </p>
          </div>
        </div>

        <div className="detail-card">
          <div className="detail-icon">
            <FaBuilding />
          </div>
          <div>
            <h4>Current Company</h4>
            <p>{alumni.currentCompany || "Not provided"}</p>
          </div>
        </div>

        <div className="detail-card">
          <div className="detail-icon">
            <FaBriefcase />
          </div>
          <div>
            <h4>Designation</h4>
            <p>{alumni.designation || "Not provided"}</p>
          </div>
        </div>
      </div>

      <div className="social-links">
        {alumni.LinkedIn && (
          <a
            href={alumni.LinkedIn}
            target="_blank"
            rel="noopener noreferrer"
            className="social-link linkedin"
          >
            <FaLinkedin />
            <span>LinkedIn Profile</span>
          </a>
        )}

        {alumni.Instagram && (
          <a
            href={alumni.Instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="social-link instagram"
          >
            <FaInstagram />
            <span>Instagram</span>
          </a>
        )}
      </div>
    </div>
  );
};

export default AlumniProfile;
