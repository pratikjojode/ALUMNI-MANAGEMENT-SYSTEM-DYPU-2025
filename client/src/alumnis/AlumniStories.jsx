import React, { useState, useEffect } from "react";
import axios from "axios";
import * as jwtDecode from "jwt-decode";
import toast from "react-hot-toast";
import "../styles/AlumniStories.css";

const AlumniStories = () => {
  const [formData, setFormData] = useState({
    name: "",
    shortDescription: "",
    fullDescription: "",
  });
  const [alumniId, setAlumniId] = useState("");
  const [image, setImage] = useState(null);
  const [stories, setStories] = useState([]);
  const [editingStory, setEditingStory] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode.jwtDecode(token);
        if (decoded.id) {
          setAlumniId(decoded.id);
          fetchStories(decoded.id);
        }
      } catch (error) {
        console.error("Token decode failed", error);
      }
    }
  }, []);

  const fetchStories = async (id) => {
    try {
      const res = await axios.get(`/api/v1/success-stories/alumni/${id}`);
      setStories(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch success stories.");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!alumniId) {
      toast.error("Alumni ID not found. Please login again.");
      return;
    }

    setIsLoading(true);

    const form = new FormData();
    form.append("alumni", alumniId);
    form.append("name", formData.name);
    form.append("shortDescription", formData.shortDescription);
    form.append("fullDescription", formData.fullDescription);
    if (image) {
      form.append("image", image);
    }

    try {
      if (editingStory) {
        const res = await axios.put(
          `/api/v1/success-stories/update/${editingStory.alumni._id}`,
          form,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        toast.success(res.data.message || "Story updated successfully!");
        fetchStories(alumniId);
        setEditingStory(null);
        setShowModal(false);
      } else {
        const res = await axios.post("/api/v1/success-stories/create", form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success(res.data.message || "Story created successfully!");
        fetchStories(alumniId);
      }
      setFormData({
        name: "",
        shortDescription: "",
        fullDescription: "",
      });
      setImage(null);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (story) => {
    setEditingStory(story);
    setFormData({
      name: story.name,
      shortDescription: story.shortDescription,
      fullDescription: story.fullDescription,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this story?"
    );
    if (confirmDelete) {
      setIsDeleting(true);

      try {
        await axios.delete(`/api/v1/success-stories/${id}`);
        fetchStories(alumniId);
        toast.success("Success story deleted successfully.");
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete success story.");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingStory(null);
    setFormData({
      name: "",
      shortDescription: "",
      fullDescription: "",
    });
    setImage(null);
  };

  return (
    <div className="alumni-stories-container">
      <div className="alumni-stories-card">
        <h2 className="alumni-stories-title">
          <span className="alumni-stories-icon">🎓</span> Share Your Success
          Story
        </h2>

        {!showModal && (
          <form onSubmit={handleSubmit} className="alumni-stories-form">
            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder="Story Title"
                value={formData.name}
                onChange={handleChange}
                required
                className="alumni-stories-input"
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="shortDescription"
                placeholder="Short Description"
                value={formData.shortDescription}
                onChange={handleChange}
                required
                className="alumni-stories-input"
              />
            </div>
            <div className="form-group">
              <textarea
                name="fullDescription"
                placeholder="Full Description"
                value={formData.fullDescription}
                onChange={handleChange}
                required
                className="alumni-stories-textarea"
              />
            </div>
            <div className="form-group file-input-container">
              <label className="file-input-label">
                <span className="file-input-text">Choose Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file-input"
                />
              </label>
              <span className="file-name">
                {image ? image.name : "No file selected"}
              </span>
            </div>
            <button type="submit" className="alumni-stories-button">
              {isLoading ? (
                <span className="loading-text">Please wait...</span>
              ) : (
                <span className="button-icon">🚀</span>
              )}
              {isLoading ? "Submitting..." : "Submit Story"}
            </button>
          </form>
        )}

        <div className="alumni-stories-section">
          <h3 className="alumni-stories-subtitle">Your Success Stories</h3>
          {stories.length > 0 ? (
            <div className="alumni-stories-table-container">
              <table className="alumni-stories-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Short Description</th>
                    <th>Full Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {stories.map((story) => (
                    <tr key={story._id}>
                      <td className="story-image-cell">
                        {story.image ? (
                          <img
                            src={story.image}
                            alt={story.name}
                            className="story-thumbnail"
                          />
                        ) : (
                          <div className="no-image-placeholder">No Image</div>
                        )}
                      </td>
                      <td>{story.name}</td>
                      <td>{story.shortDescription}</td>
                      <td>{story.fullDescription}</td>
                      <td className="action-buttons">
                        <button
                          onClick={() => handleEdit(story)}
                          className="edit-button"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(story._id)}
                          className="delete-button"
                        >
                          {isDeleting ? (
                            <span className="loading-text">Deleting...</span>
                          ) : (
                            "Delete"
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="no-stories-message">No success stories found.</p>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Edit Success Story</h3>
              <button className="modal-close" onClick={closeModal}>
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit} className="alumni-stories-form">
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  placeholder="Story Title"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="alumni-stories-input"
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="shortDescription"
                  placeholder="Short Description"
                  value={formData.shortDescription}
                  onChange={handleChange}
                  required
                  className="alumni-stories-input"
                />
              </div>
              <div className="form-group">
                <textarea
                  name="fullDescription"
                  placeholder="Full Description"
                  value={formData.fullDescription}
                  onChange={handleChange}
                  required
                  className="alumni-stories-textarea"
                />
              </div>
              <div className="form-group file-input-container">
                <label className="file-input-label">
                  <span className="file-input-text">Update Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="file-input"
                  />
                </label>
                <span className="file-name">
                  {image ? image.name : "No new file selected"}
                </span>
              </div>
              <div className="modal-footer">
                <button type="submit" className="alumni-stories-button">
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlumniStories;
