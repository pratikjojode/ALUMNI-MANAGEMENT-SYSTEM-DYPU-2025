import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaLinkedin,
  FaInstagram,
  FaEnvelope,
  FaPhone,
  FaUniversity,
  FaGraduationCap,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaIdCard,
} from "react-icons/fa";
import "../styles/StudentProfile.css";

const StudentProfile = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await axios.get("/api/v1/students/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setStudent(res.data);
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, []);

  if (loading)
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading profile data...</p>
      </div>
    );

  if (!student)
    return (
      <div className="profile-error">
        <h3>Profile Not Found</h3>
        <p>We couldn't retrieve the student profile. Please try again later.</p>
      </div>
    );

  return (
    <div className="premium-profile-container">
      {/* Profile Header with Avatar */}
      <div className="profile-header">
        <div className="profile-avatar-container">
          <img
            src={student.profilePhoto || "https://via.placeholder.com/150"}
            alt={student.name}
            className="profile-avatar"
          />
        </div>

        <div className="profile-heading">
          <h1>{student.name}</h1>
          <p className="profile-title">{student.branch} Student</p>
          <p className="profile-role">Role: {student.role}</p> {/* Role */}
          <div className="profile-location">
            <FaMapMarkerAlt className="icon" />
            <span>{student.college}</span>
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="profile-details-grid">
        <div className="detail-card">
          <div className="detail-icon">
            <FaEnvelope />
          </div>
          <div>
            <h4>Email</h4>
            <p>{student.email}</p>
          </div>
        </div>

        <div className="detail-card">
          <div className="detail-icon">
            <FaPhone />
          </div>
          <div>
            <h4>Contact</h4>
            <p>{student.contactNo || "Not provided"}</p>
          </div>
        </div>

        <div className="detail-card">
          <div className="detail-icon">
            <FaUniversity />
          </div>
          <div>
            <h4>College</h4>
            <p>{student.college}</p>
          </div>
        </div>

        <div className="detail-card">
          <div className="detail-icon">
            <FaGraduationCap />
          </div>
          <div>
            <h4>Branch</h4>
            <p>{student.branch}</p>
          </div>
        </div>

        <div className="detail-card">
          <div className="detail-icon">
            <FaCalendarAlt />
          </div>
          <div>
            <h4>Admission Year</h4>
            <p>{student.admissionYear}</p>
          </div>
        </div>

        <div className="detail-card">
          <div className="detail-icon">
            <FaIdCard />
          </div>
          <div>
            <h4>PRN</h4>
            <p>{student.prn}</p>
          </div>
        </div>
      </div>

      {/* Created At and Updated At */}
      <div className="profile-details-grid">
        <div className="detail-card">
          <div className="detail-icon">
            <FaCalendarAlt />
          </div>
          <div>
            <h4>Profile Created</h4>
            <p>{new Date(student.createdAt).toLocaleDateString()}</p>{" "}
            {/* Created Date */}
          </div>
        </div>

        <div className="detail-card">
          <div className="detail-icon">
            <FaCalendarAlt />
          </div>
          <div>
            <h4>Last Updated</h4>
            <p>{new Date(student.updatedAt).toLocaleDateString()}</p>{" "}
            {/* Updated Date */}
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="social-links">
        {student.LinkedIn && (
          <a
            href={student.LinkedIn}
            target="_blank"
            rel="noopener noreferrer"
            className="social-link linkedin"
          >
            <FaLinkedin />
            <span>LinkedIn Profile</span>
          </a>
        )}

        {student.Instagram && (
          <a
            href={student.Instagram}
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

export default StudentProfile;
