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
  FaCalendarAlt,
  FaKey,
  FaIdBadge,
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

  const handleEdit = () => setIsEditing(true);

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
        alert("Profile updated successfully");
      } else {
        alert(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while updating the profile");
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (!admin) {
    return (
      <div className="profile-loading">
        <div className="spinner"></div>
        <p>Loading admin profile...</p>
      </div>
    );
  }

  return (
    <div className="admin-profile">
      <header className="admin-profile__header">
        <h1 className="admin-profile__title">Administrator Profile</h1>
        <div className="admin-profile__actions">
          {!isEditing ? (
            <>
              <button
                className="admin-profile__btn admin-profile__btn--edit"
                onClick={handleEdit}
              >
                <FaEdit /> Edit Profile
              </button>
              <button
                className="admin-profile__btn admin-profile__btn--delete"
                onClick={handleDelete}
              >
                <FaTrash /> Delete Profile
              </button>
            </>
          ) : (
            <>
              <button
                className="admin-profile__btn admin-profile__btn--save"
                onClick={handleSave}
              >
                <FaSave /> Save Changes
              </button>
              <button
                className="admin-profile__btn admin-profile__btn--cancel"
                onClick={handleCancel}
              >
                <FaTimes /> Cancel
              </button>
            </>
          )}
        </div>
      </header>

      <section className="admin-profile__overview">
        <div className="admin-profile__card">
          <div className="admin-profile__card-header">
            <div className="admin-profile__avatar">
              {admin.name ? admin.name.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="admin-profile__info">
              <h2 className="admin-profile__name">{admin.name}</h2>
              <span className="admin-profile__role">{admin.role}</span>
            </div>
          </div>

          <div className="admin-profile__details">
            <div className="admin-profile__detail-item">
              <FaIdBadge className="admin-profile__detail-icon" />
              <span className="admin-profile__detail-label">Admin ID:</span>
              <span className="admin-profile__detail-value">{admin._id}</span>
            </div>

            <div className="admin-profile__detail-item">
              <FaUser className="admin-profile__detail-icon" />
              <span className="admin-profile__detail-label">Full Name:</span>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleChange}
                  className="admin-profile__detail-input"
                />
              ) : (
                <span className="admin-profile__detail-value">
                  {admin.name}
                </span>
              )}
            </div>

            <div className="admin-profile__detail-item">
              <FaEnvelope className="admin-profile__detail-icon" />
              <span className="admin-profile__detail-label">
                Email Address:
              </span>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleChange}
                  className="admin-profile__detail-input"
                />
              ) : (
                <span className="admin-profile__detail-value">
                  {admin.email}
                </span>
              )}
            </div>

            <div className="admin-profile__detail-item">
              <FaUserTag className="admin-profile__detail-icon" />
              <span className="admin-profile__detail-label">Admin Role:</span>
              <span className="admin-profile__detail-value">{admin.role}</span>
            </div>

            <div className="admin-profile__detail-item">
              <FaKey className="admin-profile__detail-icon" />
              <span className="admin-profile__detail-label">Password:</span>
              <span className="admin-profile__detail-value">
                {admin.password || "Hidden for security reasons"}
              </span>
            </div>

            <div className="admin-profile__detail-item">
              <FaCalendarAlt className="admin-profile__detail-icon" />
              <span className="admin-profile__detail-label">Created At:</span>
              <span className="admin-profile__detail-value">
                {formatDate(admin.createdAt)}
              </span>
            </div>

            <div className="admin-profile__detail-item">
              <FaCalendarAlt className="admin-profile__detail-icon" />
              <span className="admin-profile__detail-label">Last Updated:</span>
              <span className="admin-profile__detail-value">
                {formatDate(admin.updatedAt)}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="admin-profile__stats">
        <div className="admin-profile__stats-card">
          <div className="admin-profile__stats-header">
            <FaUsers className="admin-profile__stats-icon" />
            <h3>Students</h3>
          </div>
          <div className="admin-profile__stats-content">
            <span className="admin-profile__stats-count">
              {admin.students?.length || 0}
            </span>
            <span className="admin-profile__stats-label">Total Students</span>
          </div>
        </div>

        <div className="admin-profile__stats-card">
          <div className="admin-profile__stats-header">
            <FaGraduationCap className="admin-profile__stats-icon" />
            <h3>Alumni</h3>
          </div>
          <div className="admin-profile__stats-content">
            <span className="admin-profile__stats-count">
              {admin.alumni?.length || 0}
            </span>
            <span className="admin-profile__stats-label">Total Alumni</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminProfile;
