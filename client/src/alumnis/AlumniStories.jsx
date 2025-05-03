import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "../styles/AlumniStories.css";

const AlumniStories = () => {
  const [formData, setFormData] = useState({
    name: "",
    shortDescription: "",
    fullDescription: "",
  });
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [alumniId, setAlumniId] = useState("");
  const [successStories, setSuccessStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingStoryId, setDeletingStoryId] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const storiesPerPage = 10;

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const res = await axios.get("/api/v1/alumni/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setAlumniId(res.data.alumni._id);
      } catch (error) {
        console.error("Failed to fetch alumni profile", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchSuccessStories = async () => {
      try {
        const res = await axios.get("/api/v1/success-stories/all");
        setSuccessStories(res.data);
      } catch (error) {
        console.error("Failed to fetch success stories", error);
      }
    };

    fetchAlumni();
    fetchSuccessStories();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      shortDescription: "",
      fullDescription: "",
    });
    setImage(null);
    setIsEdit(false);
    setSelectedStory(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      const data = new FormData();
      data.append("alumni", alumniId);
      data.append("alumniId", alumniId);
      data.append("name", formData.name);
      data.append("shortDescription", formData.shortDescription);
      data.append("fullDescription", formData.fullDescription);
      if (image) data.append("image", image);

      let response;
      if (isEdit && selectedStory) {
        // Update the story if we are in edit mode
        response = await axios.put(
          `/api/v1/success-stories/${selectedStory._id}`,
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        toast.success("Story updated successfully!");
      } else {
        // Create a new story if we are not in edit mode
        response = await axios.post("/api/v1/success-stories/create", data, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        toast.success("Alumni story created successfully!");
      }

      setMessage(
        response.data.message ||
          (isEdit ? "Story updated!" : "Success story created!")
      );

      resetForm();

      // Refresh the stories list
      const res = await axios.get("/api/v1/success-stories");
      setSuccessStories(res.data);
    } catch (error) {
      console.error("Error submitting form:", error);
      setMessage("Failed to create or update success story");
      toast.error("Failed to create or update alumni story");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (storyId) => {
    if (window.confirm("Are you sure you want to delete this story?")) {
      try {
        setDeletingStoryId(storyId);

        await axios.delete(`/api/v1/success-stories/${storyId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setSuccessStories(
          successStories.filter((story) => story._id !== storyId)
        );

        // If the story being edited is deleted, reset the form
        if (isEdit && selectedStory && selectedStory._id === storyId) {
          resetForm();
        }

        toast.success("Story deleted successfully");
      } catch (error) {
        toast.error("Failed to delete story");
        console.error("Error deleting story:", error);
      } finally {
        setDeletingStoryId(null);
      }
    }
  };

  const handleEdit = (story) => {
    // Prevent opening the modal view when clicking edit
    window.event.stopPropagation();

    setSelectedStory(story);
    setFormData({
      name: story.name,
      shortDescription: story.shortDescription,
      fullDescription: story.fullDescription,
    });
    setIsEdit(true);

    // Scroll to the form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    resetForm();
    toast.success("Edit cancelled");
  };

  const exportStories = () => {
    const headers = [
      "Name",
      "Short Description",
      "Full Description",
      "Alumni Name",
      "Alumni Email",
    ];
    const csvContent = [
      headers.join(","),
      ...successStories.map((story) =>
        [
          `"${story.name.replace(/"/g, '""')}"`,
          `"${story.shortDescription.replace(/"/g, '""')}"`,
          `"${story.fullDescription.replace(/"/g, '""')}"`,
          `"${story.alumni.name.replace(/"/g, '""')}"`,
          `"${story.alumni.email.replace(/"/g, '""')}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "alumni_success_stories.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleViewStory = (story) => {
    // Only set selected story for viewing if not in edit mode
    if (!isEdit) {
      setSelectedStory(story);
    }
  };

  const indexOfLastStory = currentPage * storiesPerPage;
  const indexOfFirstStory = indexOfLastStory - storiesPerPage;
  const currentStories = successStories.slice(
    indexOfFirstStory,
    indexOfLastStory
  );
  const totalPages = Math.ceil(successStories.length / storiesPerPage);

  return (
    <div className="success-story-container">
      <h2>{isEdit ? "Edit Success Story" : "Create Success Story"}</h2>
      {loading ? (
        <p className="loading">Loading...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name / Title</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Short Description</label>
            <textarea
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label>Full Description</label>
            <textarea
              name="fullDescription"
              value={formData.fullDescription}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label>
              Upload Image {isEdit && "(Leave empty to keep current image)"}
            </label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>

          <div className="form-buttons">
            <button type="submit" disabled={submitting}>
              {submitting ? "Submitting..." : isEdit ? "Update" : "Submit"}
            </button>

            {isEdit && (
              <button
                type="button"
                className="cancel-button"
                onClick={handleCancelEdit}
                disabled={submitting}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      )}

      {message && <p className="message">{message}</p>}

      <div className="stories-header">
        <h2>Alumni Success Stories</h2>
        <button className="export-button" onClick={exportStories}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Export CSV
        </button>
      </div>

      {successStories.length === 0 ? (
        <p>No stories available yet.</p>
      ) : (
        <div className="stories-table-container">
          <table className="stories-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Short Description</th>
                <th>Alumni Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentStories.map((story) => (
                <tr key={story._id}>
                  <td className="story-image-cell">
                    {story.image ? (
                      <img
                        src={story.image}
                        alt={story.name}
                        className="story-image-thumbnail"
                        onClick={() => handleViewStory(story)}
                      />
                    ) : (
                      <span>No image</span>
                    )}
                  </td>
                  <td
                    onClick={() => handleViewStory(story)}
                    style={{ cursor: "pointer" }}
                  >
                    {story.name}
                  </td>
                  <td>{story.shortDescription.substring(0, 100)}...</td>
                  <td>{story.alumni.name}</td>
                  <td className="actions-cell">
                    <button
                      className="edit-button"
                      onClick={() => handleEdit(story)}
                      disabled={isEdit && selectedStory?._id === story._id}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(story._id)}
                      disabled={deletingStoryId === story._id}
                    >
                      {deletingStoryId === story._id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            &laquo;
          </button>

          {[...Array(totalPages).keys()].map((number) => (
            <button
              key={number + 1}
              className={currentPage === number + 1 ? "active" : ""}
              onClick={() => setCurrentPage(number + 1)}
            >
              {number + 1}
            </button>
          ))}

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            &raquo;
          </button>
        </div>
      )}

      {/* Modal for viewing full story details */}
      {selectedStory && !isEdit && (
        <div className="story-modal" onClick={() => setSelectedStory(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{selectedStory.name}</h3>
              <button
                className="close-modal"
                onClick={() => setSelectedStory(null)}
              >
                ×
              </button>
            </div>

            {selectedStory.image && (
              <img
                src={selectedStory.image}
                alt={selectedStory.name}
                className="modal-image"
              />
            )}

            <p>
              <strong>Short Description:</strong>{" "}
              {selectedStory.shortDescription}
            </p>
            <p>
              <strong>Full Description:</strong> {selectedStory.fullDescription}
            </p>

            <div className="alumni-details">
              <p>
                <strong>Alumni:</strong> {selectedStory.alumni.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedStory.alumni.email}
              </p>
            </div>

            <div className="modal-actions">
              <button
                className="edit-button modal-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(selectedStory);
                  setSelectedStory(null);
                }}
              >
                Edit This Story
              </button>
              <button
                className="delete-button modal-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(selectedStory._id);
                  setSelectedStory(null);
                }}
              >
                Delete This Story
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlumniStories;
