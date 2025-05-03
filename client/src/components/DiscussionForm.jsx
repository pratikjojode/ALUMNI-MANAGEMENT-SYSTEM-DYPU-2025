import React, { useState } from "react";
import axios from "axios";
import { Input, Button, message, Select } from "antd";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "../styles/DiscussionForm.css";

const { Option } = Select;

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

  const handleCreateDiscussion = async () => {
    if (!title || !description || !category) {
      message.error("Please fill in all fields.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      message.error("You need to log in to create a discussion.");
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

        <div className="custom-form">
          <div className="custom-form-group">
            <label className="custom-form-label">
              <span className="custom-icon">📚</span> Discussion Title
              <span className="required-star">*</span>
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a descriptive title"
              className="custom-input"
              maxLength={100}
            />
          </div>

          <div className="custom-form-group">
            <label className="custom-form-label">
              <span className="custom-icon">📝</span> Discussion Description
              <span className="required-star">*</span>
            </label>
            <Input.TextArea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your question or discussion topic in detail..."
              rows={6}
              className="custom-textarea"
              maxLength={2000}
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
            <Select
              value={category}
              onChange={(value) => setCategory(value)}
              placeholder="Select a category"
              className="custom-select"
            >
              {categories.map((categoryOption) => (
                <Option key={categoryOption} value={categoryOption}>
                  {categoryOption}
                </Option>
              ))}
            </Select>
          </div>

          <div className="custom-form-actions">
            <Button
              type="primary"
              onClick={handleCreateDiscussion}
              loading={loading}
              className="custom-submit-button"
            >
              Create Discussion
            </Button>
            <Button onClick={handleCancel} className="custom-cancel-button">
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscussionForm;
