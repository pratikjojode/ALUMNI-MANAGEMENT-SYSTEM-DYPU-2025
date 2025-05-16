import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import "../styles/AdminAllStories.css";

const AdminAllStories = () => {
  const [stories, setStories] = useState([]);
  const [filteredStories, setFilteredStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [isGridView, setIsGridView] = useState(false);
  const [editingStory, setEditingStory] = useState(null);
  const [updatedStory, setUpdatedStory] = useState({
    name: "",
    shortDescription: "",
    fullDescription: "",
    image: "",
    isOutstanding: false,
  });

  const [filterType, setFilterType] = useState("all"); // Dropdown for filter type
  const [filterValue, setFilterValue] = useState(""); // Input value for the filter

  const fetchStories = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/v1/success-stories/all");
      setStories(res.data?.stories || res.data);
      setFilteredStories(res.data?.stories || res.data); // Initialize filtered stories
    } catch {
      toast.error("Failed to fetch success stories");
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    if (filterType === "all" || filterValue.trim() === "") {
      // Show all stories if "All" is selected or filterValue is empty
      setFilteredStories(stories);
      return;
    }

    const filtered = stories.filter((story) => {
      const valueToCompare = story[filterType];

      // Handle Boolean fields like "isOutstanding"
      if (filterType === "isOutstanding") {
        return valueToCompare === (filterValue.toLowerCase() === "true");
      }

      // Handle ObjectId fields like "alumni" and "_id"
      if (filterType === "alumni" || filterType === "_id") {
        return valueToCompare?.toString() === filterValue;
      }

      // Handle general string fields (e.g., "name", "shortDescription")
      if (typeof valueToCompare === "string") {
        return valueToCompare.toLowerCase().includes(filterValue.toLowerCase());
      }

      // Default case (if the field is not matched)
      return false;
    });

    setFilteredStories(filtered);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this story?")) return;
    try {
      setDeletingId(id);
      await axios.delete(`/api/v1/success-stories/${id}`);
      toast.success("Story deleted successfully");
      fetchStories();
    } catch {
      toast.error("Failed to delete the story");
    } finally {
      setDeletingId(null);
    }
  };

  const toggleOutstanding = async (id, currentStatus) => {
    try {
      await axios.put(`/api/v1/success-stories/${id}/outstanding`, {
        isOutstanding: !currentStatus,
      });
      toast.success(
        `Story ${!currentStatus ? "marked" : "unmarked"} as outstanding`
      );
      fetchStories();
    } catch {
      toast.error("Failed to update outstanding status");
    }
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put(`/api/v1/success-stories/update/${id}`, updatedStory);
      toast.success("Story updated successfully");
      fetchStories();
      setEditingStory(null); // Close the edit form
    } catch {
      toast.error("Failed to update the story");
    }
  };

  const handleExportCSV = () => {
    const headers = ["Title", "Short Description", "Alumni Name", "Email"];
    const rows = filteredStories.map((story) => [
      `"${story.name}"`,
      `"${story.shortDescription}"`,
      `"${story.alumni?.name}"`,
      `"${story.alumni?.email}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "success_stories.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const handleEdit = (story) => {
    setEditingStory(story);
    setUpdatedStory({
      name: story.name,
      shortDescription: story.shortDescription,
      fullDescription: story.fullDescription,
      image: story.image,
      isOutstanding: story.isOutstanding,
    });
  };

  return (
    <div className="admin-stories-container">
      <h2 className="admin-stories-title">All Success Stories</h2>

      <div className="admin-stories-controls">
        <div className="admin-filter-group">
          <select
            className="admin-filter-dropdown"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All</option>
            <option value="_id">Story ID</option>
            <option value="alumni">Alumni ID</option>
            <option value="name">Title</option>
            <option value="shortDescription">Short Description</option>
            <option value="isOutstanding">Outstanding</option>
          </select>
          <input
            className="admin-filter-input"
            type="text"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            placeholder="Enter filter value"
            disabled={filterType === "all"}
          />
          <button className="admin-filter-button" onClick={handleFilter}>
            Filter
          </button>
        </div>
        <div>
          <button
            className="admin-toggle-view"
            onClick={() => setIsGridView(!isGridView)}
          >
            {isGridView ? "Switch to Table View" : "Switch to Grid View"}
          </button>
          <button className="admin-export-btn" onClick={handleExportCSV}>
            Export to CSV
          </button>
        </div>
      </div>

      {loading ? (
        <div className="admin-stories-loading">Loading...</div>
      ) : isGridView ? (
        <div className="admin-stories-grid">
          {filteredStories.map((story) => (
            <div key={story._id} className="admin-story-card">
              <img
                src={story.image}
                alt="story"
                className="admin-story-image"
              />
              <h3>{story.name}</h3>
              <p>
                {story.shortDescription?.length > 100
                  ? story.shortDescription.slice(0, 100) + "..."
                  : story.shortDescription}
              </p>
              <p className="admin-story-email">
                <strong>{story.alumni?.name}</strong> <br />
                {story.alumni?.email}
              </p>
              <div className="admin-story-actions">
                <button
                  className="admin-delete-button"
                  onClick={() => handleDelete(story._id)}
                  disabled={deletingId === story._id}
                >
                  {deletingId === story._id ? "Deleting..." : "Delete"}
                </button>
                <button
                  className="admin-outstanding-button"
                  onClick={() =>
                    toggleOutstanding(story._id, story.isOutstanding)
                  }
                >
                  {story.isOutstanding
                    ? "Unmark Outstanding"
                    : "Mark Outstanding"}
                </button>
                <button
                  className="admin-edit-button"
                  onClick={() => handleEdit(story)}
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="admin-stories-table-wrapper">
          <table className="admin-stories-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Short Description</th>
                <th>Alumni</th>
                <th>Actions</th>
                <th>Alumni_Id</th>
              </tr>
            </thead>
            <tbody>
              {filteredStories.map((story) => (
                <tr key={story._id}>
                  <td>
                    <img
                      src={story.image}
                      alt="story"
                      className="admin-story-image"
                    />
                  </td>
                  <td>
                    <strong>{story.name}</strong>
                  </td>
                  <td>
                    {story.shortDescription?.length > 60
                      ? story.shortDescription.slice(0, 60) + "..."
                      : story.shortDescription}
                  </td>
                  <td>
                    <div>{story.alumni?.name}</div>
                    <div className="admin-story-email">
                      {story.alumni?.email}
                    </div>
                  </td>
                  <td>
                    <button
                      className="admin-delete-button"
                      onClick={() => handleDelete(story._id)}
                      disabled={deletingId === story._id}
                      style={{ marginRight: "8px" }}
                    >
                      {deletingId === story._id ? "Deleting..." : "Delete"}
                    </button>
                    <button
                      className="admin-outstanding-button"
                      onClick={() =>
                        toggleOutstanding(story._id, story.isOutstanding)
                      }
                    >
                      {story.isOutstanding
                        ? "Unmark Outstanding"
                        : "Mark Outstanding"}
                    </button>
                    <button
                      className="admin-edit-button"
                      onClick={() => handleEdit(story)}
                    >
                      Edit
                    </button>
                  </td>
                  <td>{story.alumni?._id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editingStory && (
        <div className="admin-edit-form">
          <h3>Edit Story</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdate(editingStory._id);
            }}
          >
            <input
              type="text"
              value={updatedStory.name}
              onChange={(e) =>
                setUpdatedStory({ ...updatedStory, name: e.target.value })
              }
              placeholder="Title"
            />
            <textarea
              value={updatedStory.shortDescription}
              onChange={(e) =>
                setUpdatedStory({
                  ...updatedStory,
                  shortDescription: e.target.value,
                })
              }
              placeholder="Short Description"
            />
            <textarea
              value={updatedStory.fullDescription}
              onChange={(e) =>
                setUpdatedStory({
                  ...updatedStory,
                  fullDescription: e.target.value,
                })
              }
              placeholder="Full Description"
            />
            <input
              type="text"
              value={updatedStory.image}
              onChange={(e) =>
                setUpdatedStory({ ...updatedStory, image: e.target.value })
              }
              placeholder="Image URL"
            />
            <label>
              <input
                type="checkbox"
                checked={updatedStory.isOutstanding}
                onChange={(e) =>
                  setUpdatedStory({
                    ...updatedStory,
                    isOutstanding: e.target.checked,
                  })
                }
              />
              Mark as Outstanding
            </label>
            <button type="submit">Update Story</button>
            <button onClick={() => setEditingStory(null)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminAllStories;
