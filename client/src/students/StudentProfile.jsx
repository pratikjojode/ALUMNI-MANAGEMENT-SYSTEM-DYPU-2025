import React, { useEffect, useState } from "react";
import axios from "axios";
import {
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

  const handleEditProfile = () => {
    alert("Edit profile is been developed or under mantainance");
  };
  if (loading)
    return (
      <div className="profile-loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading profile data...</p>
      </div>
    );

  if (!student)
    return (
      <div className="profile-error-container">
        <h3 className="profile-error-heading">Profile Not Found</h3>
        <p className="profile-error-message">
          We couldn't retrieve the student profile. Please try again later.
        </p>
      </div>
    );

  return (
    <div className="student-profile-container">
      <div className="student-profile-header">
        <div className="profile-avatar-wrapper">
          <img
            src={student.profilePhoto || "https://via.placeholder.com/150"}
            alt={student.name}
            className="profile-avatar"
          />
        </div>

        <div className="profile-header-details">
          <h1 className="profile-name">{student.name}</h1>
          <p className="profile-branch">{student.branch} Student</p>
          <p className="profile-role">Role: {student.role}</p>
          <div className="profile-location">
            <FaMapMarkerAlt className="profile-icon" />
            <span className="profile-college">{student.college}</span>
          </div>
        </div>
      </div>

      <div className="profile-details-section">
        <div className="profile-detail-card">
          <div className="profile-detail-icon">
            <FaEnvelope />
          </div>
          <div>
            <h4 className="detail-title">Email</h4>
            <p className="detail-value">{student.email}</p>
          </div>
        </div>

        <div className="profile-detail-card">
          <div className="profile-detail-icon">
            <FaPhone />
          </div>
          <div>
            <h4 className="detail-title">Contact</h4>
            <p className="detail-value">
              {student.contactNo || "Not provided"}
            </p>
          </div>
        </div>

        <div className="profile-detail-card">
          <div className="profile-detail-icon">
            <FaUniversity />
          </div>
          <div>
            <h4 className="detail-title">College</h4>
            <p className="detail-value">{student.college}</p>
          </div>
        </div>

        <div className="profile-detail-card">
          <div className="profile-detail-icon">
            <FaGraduationCap />
          </div>
          <div>
            <h4 className="detail-title">Branch</h4>
            <p className="detail-value">{student.branch}</p>
          </div>
        </div>

        <div className="profile-detail-card">
          <div className="profile-detail-icon">
            <FaCalendarAlt />
          </div>
          <div>
            <h4 className="detail-title">Admission Year</h4>
            <p className="detail-value">{student.admissionYear}</p>
          </div>
        </div>

        <div className="profile-detail-card">
          <div className="profile-detail-icon">
            <FaIdCard />
          </div>
          <div>
            <h4 className="detail-title">PRN</h4>
            <p className="detail-value">{student.prn}</p>
          </div>
        </div>
      </div>

      <div className="profile-timestamps-section">
        <div className="profile-timestamp-card">
          <div className="profile-timestamp-icon">
            <FaCalendarAlt />
          </div>
          <div>
            <h4 className="timestamp-title">Profile Created</h4>
            <p className="timestamp-value">
              {new Date(student.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="profile-timestamp-card">
          <div className="profile-timestamp-icon">
            <FaCalendarAlt />
          </div>
          <div>
            <h4 className="timestamp-title">Last Updated</h4>
            <p className="timestamp-value">
              {new Date(student.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
      <div>
        <button onClick={handleEditProfile}>Edit Profile</button>
      </div>
    </div>
  );
};

export default StudentProfile;
