import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaUser,
  FaPhone,
  FaUniversity,
  FaGraduationCap,
  FaBuilding,
  FaBriefcase,
  FaMapMarkerAlt,
  FaLinkedin,
  FaInstagram,
  FaEye,
  FaEyeSlash,
  FaSave,
} from "react-icons/fa";
import "../styles/UpdateAlumniProfile.css"; // Assuming you have a CSS file for styling
const UpdateAlumniProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    contactNo: "",
    college: "",
    branch: "",
    passoutYear: "",
    currentCompany: "",
    designation: "",
    location: "",
    LinkedIn: "",
    Instagram: "",
    isVisible: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/v1/alumni/profile",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setFormData(res.data.alumni);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.put(
        "http://localhost:5000/api/v1/alumni/update-profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Profile updated successfully!");
    } catch (err) {
      alert("Update failed. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="premium-update-container">
      <div className="form-header">
        <h1>
          <FaUser className="header-icon" /> Update Profile
        </h1>
        <p className="form-subtitle">
          Keep your information current and accurate
        </p>
      </div>

      <form onSubmit={handleSubmit} className="premium-profile-form">
        <div className="form-grid">
          {/* Personal Information Section */}
          <div className="form-section">
            <h2 className="section-title">
              <FaUser /> Personal Information
            </h2>
            <div className="input-group">
              <label>Full Name</label>
              <div className="input-field">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label>Contact Number</label>
              <div className="input-field">
                <FaPhone className="input-icon" />
                <input
                  type="tel"
                  name="contactNo"
                  value={formData.contactNo}
                  onChange={handleChange}
                  placeholder="+1 (123) 456-7890"
                />
              </div>
            </div>

            <div className="input-group">
              <label>Location</label>
              <div className="input-field">
                <FaMapMarkerAlt className="input-icon" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="City, Country"
                />
              </div>
            </div>
          </div>

          {/* Education Section */}
          <div className="form-section">
            <h2 className="section-title">
              <FaUniversity /> Education
            </h2>
            <div className="input-group">
              <label>College/University</label>
              <div className="input-field">
                <input
                  type="text"
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  placeholder="Your alma mater"
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label>Branch/Department</label>
              <div className="input-field">
                <input
                  type="text"
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  placeholder="Your field of study"
                />
              </div>
            </div>

            <div className="input-group">
              <label>Passout Year</label>
              <div className="input-field">
                <FaGraduationCap className="input-icon" />
                <input
                  type="number"
                  name="passoutYear"
                  value={formData.passoutYear}
                  onChange={handleChange}
                  placeholder="Graduation year"
                  min="1900"
                  max="2099"
                />
              </div>
            </div>
          </div>

          {/* Professional Section */}
          <div className="form-section">
            <h2 className="section-title">
              <FaBriefcase /> Professional
            </h2>
            <div className="input-group">
              <label>Current Company</label>
              <div className="input-field">
                <FaBuilding className="input-icon" />
                <input
                  type="text"
                  name="currentCompany"
                  value={formData.currentCompany}
                  onChange={handleChange}
                  placeholder="Where you work"
                />
              </div>
            </div>

            <div className="input-group">
              <label>Designation</label>
              <div className="input-field">
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  placeholder="Your job title"
                />
              </div>
            </div>
          </div>

          {/* Social Links Section */}
          <div className="form-section">
            <h2 className="section-title">
              <FaLinkedin /> Social Links
            </h2>
            <div className="input-group">
              <label>LinkedIn Profile</label>
              <div className="input-field">
                <FaLinkedin className="input-icon" />
                <input
                  type="url"
                  name="LinkedIn"
                  value={formData.LinkedIn}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>
            </div>

            <div className="input-group">
              <label>Instagram</label>
              <div className="input-field">
                <FaInstagram className="input-icon" />
                <input
                  type="url"
                  name="Instagram"
                  value={formData.Instagram}
                  onChange={handleChange}
                  placeholder="https://instagram.com/yourprofile"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Section */}
        <div className="privacy-section">
          <label className="privacy-toggle">
            <input
              type="checkbox"
              name="isVisible"
              checked={formData.isVisible}
              onChange={handleChange}
              className="toggle-input"
            />
            <span className="toggle-slider"></span>
            <span className="toggle-label">
              {formData.isVisible ? (
                <>
                  <FaEye /> Profile is public
                </>
              ) : (
                <>
                  <FaEyeSlash /> Profile is private
                </>
              )}
            </span>
          </label>
          <p className="privacy-note">
            {formData.isVisible
              ? "Your profile will be visible to other alumni"
              : "Your profile will be hidden from other alumni"}
          </p>
        </div>

        <button type="submit" className="submit-button" disabled={isSubmitting}>
          <FaSave className="button-icon" />
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default UpdateAlumniProfile;
