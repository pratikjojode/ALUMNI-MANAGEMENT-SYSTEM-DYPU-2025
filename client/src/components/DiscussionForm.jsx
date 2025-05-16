import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "../styles/DiscussionForm.css";

const DiscussionForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const categories = [
    "Career",
    "Networking",
    "Higher Studies",
    "Internships",
    "General",
    "Other",
  ];

  const handleCreateDiscussion = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    if (!title || !description || !category) {
      toast.error("Please fill in all fields.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("You need to log in to create a discussion.");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        "/api/v1/discussions/createDis",
        {
          title,
          description,
          category,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Discussion created successfully!");
      navigate("/student/discussions");
    } catch (error) {
      toast.error("Error creating discussion. Please try again.");
      console.error("Error creating discussion:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/student/discussions");
  };

  return (
    <div className="custom-discussion-container">
      <div className="custom-discussion-card">
        <div className="custom-form-header">
          <h2 className="custom-form-title">Create New Academic Discussion</h2>
          <p className="custom-form-subtitle">
            Share your questions, insights, and ideas with the academic
            community.
          </p>
          <div className="custom-divider"></div>
        </div>

        <form className="custom-form" onSubmit={handleCreateDiscussion}>
          <div className="custom-form-group">
            <label className="custom-form-label">
              <span className="custom-icon">📚</span> Discussion Title
              <span className="required-star">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a descriptive title"
              className="custom-input"
              maxLength={100}
              required
            />
          </div>

          <div className="custom-form-group">
            <label className="custom-form-label">
              <span className="custom-icon">📝</span> Discussion Description
              <span className="required-star">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your question or discussion topic in detail..."
              rows={6}
              className="custom-textarea"
              maxLength={2000}
              required
            />
            <span className="custom-character-count">
              {description.length}/2000 characters
            </span>
          </div>

          <div className="custom-form-group">
            <label className="custom-form-label">
              <span className="custom-icon">🏷️</span> Discussion Category
              <span className="required-star">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="custom-select"
              required
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((categoryOption) => (
                <option key={categoryOption} value={categoryOption}>
                  {categoryOption}
                </option>
              ))}
            </select>
          </div>

          <div className="custom-form-actions">
            <button
              type="submit"
              disabled={loading}
              className="custom-submit-button"
            >
              {loading ? "Creating..." : "Create Discussion"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="custom-cancel-button"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DiscussionForm;
