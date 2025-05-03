import React, { useEffect, useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaUserTag,
  FaUsers,
  FaGraduationCap,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaChartLine,
  FaCalendarAlt,
} from "react-icons/fa";
import "../styles/AdminProfile.css";

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const res = await fetch("/api/v1/admin/getAdminProfile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setAdmin(data.admin);
          setEditForm({
            name: data.admin.name,
            email: data.admin.email,
          });
        } else {
          console.error("Failed to fetch admin profile:", data.message);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchAdminProfile();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({
      name: admin.name,
      email: admin.email,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const res = await fetch("/api/v1/admin/updateAdminProfile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (res.ok) {
        setAdmin(data.admin);
        setIsEditing(false);
        showNotification("Profile updated successfully", "success");
      } else {
        showNotification(data.message || "Failed to update profile", "error");
      }
    } catch (error) {
      console.error("Error:", error);
      showNotification("An error occurred while updating profile", "error");
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your profile? This action cannot be undone."
      )
    ) {
      try {
        const res = await fetch("/api/v1/admin/deleteMe", {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (res.ok) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        } else {
          const data = await res.json();
          showNotification(data.message || "Failed to delete profile", "error");
        }
      } catch (error) {
        console.error("Error:", error);
        showNotification("An error occurred while deleting profile", "error");
      }
    }
  };

  const showNotification = (message, type) => {
    // You can implement a better notification system here
    if (type === "success") {
      alert(message);
    } else {
      alert(message);
    }
  };

  if (!admin) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading admin profile...</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString || Date.now());
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="admin-profile-container">
      <div className="admin-profile-header">
        <h1 className="admin-profile-title">Administrator Dashboard</h1>
        <div className="action-buttons">
          {!isEditing ? (
            <>
              <button className="edit-btn" onClick={handleEdit}>
                <FaEdit /> Edit Profile
              </button>
              <button className="delete-btn" onClick={handleDelete}>
                <FaTrash /> Delete Profile
              </button>
            </>
          ) : (
            <>
              <button className="save-btn" onClick={handleSave}>
                <FaSave /> Save Changes
              </button>
              <button className="cancel-btn" onClick={handleCancel}>
                <FaTimes /> Cancel
              </button>
            </>
          )}
        </div>
      </div>

      <div className="dashboard-container">
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              {admin.name ? admin.name.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="profile-title">
              <h2>{admin.name}</h2>
              <span className="profile-role">{admin.role}</span>
            </div>
          </div>

          <div className="profile-info-grid">
            <div className="profile-info-item">
              <FaUser className="profile-info-icon" />
              <span className="profile-info-label">Full Name</span>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleChange}
                  className="edit-input"
                />
              ) : (
                <span className="profile-info-value">{admin.name}</span>
              )}
            </div>

            <div className="profile-info-item">
              <FaEnvelope className="profile-info-icon" />
              <span className="profile-info-label">Email Address</span>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleChange}
                  className="edit-input"
                />
              ) : (
                <span className="profile-info-value">{admin.email}</span>
              )}
            </div>

            <div className="profile-info-item">
              <FaUserTag className="profile-info-icon" />
              <span className="profile-info-label">Admin Role</span>
              <span className="profile-info-value">{admin.role}</span>
            </div>

            <div className="profile-info-item">
              <FaCalendarAlt className="profile-info-icon" />
              <span className="profile-info-label">Last Updated</span>
              <span className="profile-info-value">{formatDate()}</span>
            </div>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stats-card">
            <div className="stats-header">
              <FaUsers className="stats-icon" />
              <h3>Students</h3>
            </div>
            <div className="stats-content">
              <span className="stats-count">{admin.students?.length || 0}</span>
              <div className="stats-details">
                {admin.students?.length > 0 && (
                  <div className="stats-trend positive">
                    <FaChartLine /> <span>+2 this week</span>
                  </div>
                )}
                <span className="stats-label">Active students</span>
              </div>
            </div>
          </div>

          <div className="stats-card">
            <div className="stats-header">
              <FaGraduationCap className="stats-icon" />
              <h3>Alumni</h3>
            </div>
            <div className="stats-content">
              <span className="stats-count">{admin.alumni?.length || 0}</span>
              <div className="stats-details">
                {admin.alumni?.length > 0 && (
                  <div className="stats-trend positive">
                    <FaChartLine /> <span>+1 this week</span>
                  </div>
                )}
                <span className="stats-label">Managed alumni</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="details-grid">
        <div className="details-card">
          <h2 className="section-title">
            <FaUsers className="section-title-icon" />
            Managed Students
          </h2>
          {admin.students?.length > 0 ? (
            <div className="id-list">
              {admin.students.map((id, index) => (
                <div key={index} className="id-item">
                  <div className="id-avatar">
                    {String(id).charAt(0).toUpperCase()}
                  </div>
                  <div className="id-details">
                    <span className="id-value">{id}</span>
                    <span className="id-date">Added: {formatDate()}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p className="empty-message">No students assigned yet</p>
              <button className="add-new-btn">
                <FaUsers /> Add Students
              </button>
            </div>
          )}
        </div>

        <div className="details-card">
          <h2 className="section-title">
            <FaGraduationCap className="section-title-icon" />
            Managed Alumni
          </h2>
          {admin.alumni?.length > 0 ? (
            <div className="id-list">
              {admin.alumni.map((id, index) => (
                <div key={index} className="id-item">
                  <div className="id-avatar">
                    {String(id).charAt(0).toUpperCase()}
                  </div>
                  <div className="id-details">
                    <span className="id-value">{id}</span>
                    <span className="id-date">Added: {formatDate()}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p className="empty-message">No alumni assigned yet</p>
              <button className="add-new-btn">
                <FaGraduationCap /> Add Alumni
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
