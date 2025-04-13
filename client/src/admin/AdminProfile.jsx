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
      const res = await fetch(
        "/api/v1/admin/updateAdminProfile",

        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(editForm),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setAdmin(data.admin);
        setIsEditing(false);
        alert("Profile updated successfully");
      } else {
        alert(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while updating profile");
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
          alert(data.message || "Failed to delete profile");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while deleting profile");
      }
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

  return (
    <div className="admin-profile-container">
      <div className="admin-profile-header">
        <h1 className="admin-profile-title">Admin Profile</h1>
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

      <div className="profile-card">
        <div className="profile-info-grid">
          <div className="profile-info-item">
            <FaUser className="profile-info-icon" />
            <span className="profile-info-label">Name</span>
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
            <span className="profile-info-label">Email</span>
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
            <span className="profile-info-label">Role</span>
            <span className="profile-info-value">{admin.role}</span>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stats-card">
          <div className="stats-header">
            <FaUsers className="stats-icon" />
            <h3>Managed Students</h3>
          </div>
          <div className="stats-content">
            <span className="stats-count">{admin.students?.length || 0}</span>
            {admin.students?.length > 0 && (
              <span className="stats-change">+2 this week</span>
            )}
          </div>
        </div>

        <div className="stats-card">
          <div className="stats-header">
            <FaGraduationCap className="stats-icon" />
            <h3>Managed Alumni</h3>
          </div>
          <div className="stats-content">
            <span className="stats-count">{admin.alumni?.length || 0}</span>
            {admin.alumni?.length > 0 && (
              <span className="stats-change">+1 this week</span>
            )}
          </div>
        </div>
      </div>

      <div className="details-grid">
        <div className="details-card">
          <h2 className="section-title">
            <FaUsers className="section-title-icon" />
            Student IDs
          </h2>
          {admin.students?.length > 0 ? (
            <div className="id-list">
              {admin.students.map((id, index) => (
                <div key={index} className="id-item">
                  <span className="id-value">{id}</span>
                  <span className="id-date">Added: 2023-06-15</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-message">No students assigned</p>
          )}
        </div>

        <div className="details-card">
          <h2 className="section-title">
            <FaGraduationCap className="section-title-icon" />
            Alumni IDs
          </h2>
          {admin.alumni?.length > 0 ? (
            <div className="id-list">
              {admin.alumni.map((id, index) => (
                <div key={index} className="id-item">
                  <span className="id-value">{id}</span>
                  <span className="id-date">Added: 2023-06-15</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-message">No alumni assigned</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
