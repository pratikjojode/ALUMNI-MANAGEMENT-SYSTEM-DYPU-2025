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
import toast from "react-hot-toast";

const StudentProfile = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await axios.get("/api/v1/students/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setStudent(res.data);
        setFormData(res.data);
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, []);

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `/api/v1/students/updateStudentProfile/${student._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setStudent(res.data.student);
      setIsModalOpen(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile", error);
      toast.error("Update failed. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="profile-loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading profile data...</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="profile-error-container">
        <h3 className="profile-error-heading">Profile Not Found</h3>
        <p className="profile-error-message">
          We couldn't retrieve the student profile. Please try again later.
        </p>
      </div>
    );
  }

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
          <FaEnvelope className="profile-detail-icon" />
          <div>
            <h4 className="detail-title">Email</h4>
            <p className="detail-value">{student.email}</p>
          </div>
        </div>
        <div className="profile-detail-card">
          <FaEnvelope className="profile-detail-icon" />
          <div>
            <h4 className="detail-title">Student ID</h4>
            <p className="detail-value">{student._id}</p>
          </div>
        </div>

        <div className="profile-detail-card">
          <FaPhone className="profile-detail-icon" />
          <div>
            <h4 className="detail-title">Contact</h4>
            <p className="detail-value">{student.contactNo}</p>
          </div>
        </div>

        <div className="profile-detail-card">
          <FaUniversity className="profile-detail-icon" />
          <div>
            <h4 className="detail-title">College</h4>
            <p className="detail-value">{student.college}</p>
          </div>
        </div>

        <div className="profile-detail-card">
          <FaGraduationCap className="profile-detail-icon" />
          <div>
            <h4 className="detail-title">Branch</h4>
            <p className="detail-value">{student.branch}</p>
          </div>
        </div>

        <div className="profile-detail-card">
          <FaCalendarAlt className="profile-detail-icon" />
          <div>
            <h4 className="detail-title">Admission Year</h4>
            <p className="detail-value">{student.admissionYear}</p>
          </div>
        </div>

        <div className="profile-detail-card">
          <FaIdCard className="profile-detail-icon" />
          <div>
            <h4 className="detail-title">PRN</h4>
            <p className="detail-value">{student.prn}</p>
          </div>
        </div>
      </div>

      <div className="profile-timestamps-section">
        <div className="profile-timestamp-card">
          <FaCalendarAlt className="profile-timestamp-icon" />
          <div>
            <h4 className="timestamp-title">Profile Created</h4>
            <p className="timestamp-value">
              {new Date(student.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="profile-timestamp-card">
          <FaCalendarAlt className="profile-timestamp-icon" />
          <div>
            <h4 className="timestamp-title">Last Updated</h4>
            <p className="timestamp-value">
              {new Date(student.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <div className="edit-profile-button-container">
        <button onClick={() => setIsModalOpen(true)} className="edit-btn">
          Edit Profile
        </button>
      </div>

      {/* Modal for editing */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Edit Profile</h2>
            <form onSubmit={handleProfileUpdate} className="modal-form">
              {[
                { label: "Name", name: "name" },
                { label: "Email", name: "email" },
                { label: "Contact No", name: "contactNo" },
                { label: "College", name: "college" },
                { label: "Branch", name: "branch" },
                { label: "Admission Year", name: "admissionYear" },
                { label: "PRN", name: "prn" },
              ].map((field) => (
                <div key={field.name} className="form-group">
                  <label>{field.label}</label>
                  <input
                    type="text"
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              ))}

              <div className="modal-buttons">
                <button type="submit" className="save-btn">
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentProfile;
