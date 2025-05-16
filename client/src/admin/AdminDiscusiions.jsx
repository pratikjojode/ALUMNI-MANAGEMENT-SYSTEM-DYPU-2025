import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "../styles/AdminDiscussions.css";

const AdminDiscussions = () => {
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editDiscussion, setEditDiscussion] = useState(null);
  const [viewType, setViewType] = useState("grid");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
  const [currentComments, setCurrentComments] = useState([]);
  const [currentDiscussion, setCurrentDiscussion] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [filterCategory, setFilterCategory] = useState("");
  const [filterAuthor, setFilterAuthor] = useState("");
  const [filterSearch, setFilterSearch] = useState("");

  // For dynamic filter options
  const [uniqueCategories, setUniqueCategories] = useState([]);
  const [uniqueAuthors, setUniqueAuthors] = useState([]);

  const fetchDiscussions = async () => {
    try {
      const { data } = await axios.get("/api/v1/discussions/getDis", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setDiscussions(data.discussions);

      const categories = Array.from(
        new Set(data.discussions.map((d) => d.category).filter(Boolean))
      );
      setUniqueCategories(categories);

      const authors = Array.from(
        new Set(data.discussions.map((d) => d.createdBy?.name).filter(Boolean))
      );
      setUniqueAuthors(authors);
    } catch (error) {
      console.error("Error fetching discussions:", error);
      toast.error("Failed to load discussions");
    } finally {
      setLoading(false);
    }
  };

  const fetchCommentsForDiscussion = async (discussionId) => {
    try {
      const { data } = await axios.get(
        `/api/v1/comments/discussion/${discussionId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setCurrentComments(data.comments);
      setIsCommentsModalOpen(true);
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Failed to load comments");
    }
  };

  useEffect(() => {
    fetchDiscussions();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/v1/discussions/delete-discussion/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setDiscussions((prev) => prev.filter((d) => d._id !== id));
      toast.success("Discussion deleted successfully");
    } catch (error) {
      console.error("Error deleting discussion:", error);
      toast.error("Failed to delete discussion");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      setDeleteLoading(true);
      await axios.delete(`/api/v1/comments/deleteComment/${commentId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setCurrentComments((prev) => prev.filter((c) => c._id !== commentId));

      if (currentDiscussion) {
        setDiscussions((prev) =>
          prev.map((d) => {
            if (d._id === currentDiscussion._id) {
              return {
                ...d,
                comments: d.comments.filter((c) => c !== commentId),
              };
            }
            return d;
          })
        );
      }

      toast.success("Comment deleted successfully");
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const { data } = await axios.put(
        `/api/v1/discussions/update-discussion/${editDiscussion._id}`,
        editDiscussion,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setDiscussions((prev) =>
        prev.map((d) =>
          d._id === data.updatedDiscussion._id ? data.updatedDiscussion : d
        )
      );
      toast.success("Discussion updated successfully");
      setIsModalOpen(false);
      setEditDiscussion(null);
    } catch (error) {
      console.error("Error updating discussion:", error);
      toast.error("Failed to update discussion");
    }
  };

  const handleEditClick = (discussion) => {
    setEditDiscussion(discussion);
    setIsModalOpen(true);
  };

  const handleViewComments = (discussion) => {
    setCurrentDiscussion(discussion);
    fetchCommentsForDiscussion(discussion._id);
  };

  const confirmDeleteComment = (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      handleDeleteComment(commentId);
    }
  };

  const filteredDiscussions = discussions.filter((d) => {
    const matchCategory = filterCategory ? d.category === filterCategory : true;
    const matchAuthor = filterAuthor
      ? d.createdBy?.name === filterAuthor
      : true;
    const matchSearch = filterSearch
      ? d.title?.toLowerCase().includes(filterSearch.toLowerCase()) ||
        d.description?.toLowerCase().includes(filterSearch.toLowerCase())
      : true;
    return matchCategory && matchAuthor && matchSearch;
  });

  return (
    <div className="admin-discussions-container">
      <h2>Admin Discussions</h2>

      <div className="admin-discussions-filters">
        <div className="admin-filter-group">
          <label>Category</label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="admin-filter-select"
          >
            <option value="">All</option>
            {uniqueCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div className="admin-filter-group">
          <label>Author</label>
          <select
            value={filterAuthor}
            onChange={(e) => setFilterAuthor(e.target.value)}
            className="admin-filter-select"
          >
            <option value="">All</option>
            {uniqueAuthors.map((au) => (
              <option key={au} value={au}>
                {au}
              </option>
            ))}
          </select>
        </div>
        <div className="admin-filter-group">
          <label>Search</label>
          <input
            type="text"
            placeholder="Title or Description..."
            value={filterSearch}
            onChange={(e) => setFilterSearch(e.target.value)}
            className="admin-filter-input"
          />
        </div>
        {(filterCategory || filterAuthor || filterSearch) && (
          <button
            className="admin-filter-clear"
            onClick={() => {
              setFilterCategory("");
              setFilterAuthor("");
              setFilterSearch("");
            }}
          >
            Clear Filters
          </button>
        )}
      </div>

      <div className="admin-view-toggle">
        <button
          onClick={() => setViewType("grid")}
          className={`admin-toggle-btn ${
            viewType === "grid" ? "admin-toggle-active" : ""
          }`}
        >
          Grid View
        </button>
        <button
          onClick={() => setViewType("table")}
          className={`admin-toggle-btn ${
            viewType === "table" ? "admin-toggle-active" : ""
          }`}
        >
          Table View
        </button>
      </div>

      {loading ? (
        <div className="admin-loading-state">Loading discussions...</div>
      ) : filteredDiscussions.length === 0 ? (
        <div className="admin-empty-view">No discussions available.</div>
      ) : viewType === "grid" ? (
        <div className="admin-grid-view">
          {filteredDiscussions.map((dis) => (
            <div key={dis._id} className="admin-discussion-card">
              <h3>{dis.title}</h3>
              <p>
                <strong>Description:</strong> {dis.description}
              </p>
              <p>
                <strong>Category:</strong> {dis.category}
              </p>
              <p>
                <strong>Author:</strong> {dis.createdBy?.name}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(dis.createdAt).toLocaleDateString()}
              </p>
              <div className="admin-discussion-stats">
                <span>❤️ {dis.likes?.length || 0}</span>
                <span>💬 {dis.comments?.length || 0}</span>
              </div>
              <div className="admin-discussion-actions">
                <button
                  onClick={() => handleDelete(dis._id)}
                  className="admin-discussion-delete"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleEditClick(dis)}
                  className="admin-discussion-edit"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleViewComments(dis)}
                  className="admin-discussion-comments"
                >
                  View Comments
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <table className="admin-discussion-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Category</th>
              <th>Author</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDiscussions.map((dis) => (
              <tr key={dis._id}>
                <td>{dis.title}</td>
                <td>{dis.description}</td>
                <td>{dis.category}</td>
                <td>{dis.createdBy?.name}</td>
                <td>{new Date(dis.createdAt).toLocaleDateString()}</td>
                <td className="admin-table-actions">
                  <button
                    onClick={() => handleDelete(dis._id)}
                    className="admin-table-delete"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleEditClick(dis)}
                    className="admin-table-edit"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleViewComments(dis)}
                    className="admin-table-comments"
                  >
                    Comments ({dis.comments?.length || 0})
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {isModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content">
            <h3>Edit Discussion</h3>
            <label>Title:</label>
            <input
              type="text"
              value={editDiscussion.title}
              onChange={(e) =>
                setEditDiscussion({ ...editDiscussion, title: e.target.value })
              }
              className="admin-modal-input"
            />
            <label>Description:</label>
            <textarea
              value={editDiscussion.description}
              onChange={(e) =>
                setEditDiscussion({
                  ...editDiscussion,
                  description: e.target.value,
                })
              }
              className="admin-modal-textarea"
            />
            <label>Category:</label>
            <select
              value={editDiscussion.category}
              onChange={(e) =>
                setEditDiscussion({
                  ...editDiscussion,
                  category: e.target.value,
                })
              }
              className="admin-modal-select"
            >
              <option value="Career">Career</option>
              <option value="Networking">Networking</option>
              <option value="Higher Studies">Higher Studies</option>
              <option value="Internships">Internships</option>
              <option value="General">General</option>
              <option value="Other">Other</option>
            </select>
            <div className="admin-modal-actions">
              <button onClick={handleUpdate} className="admin-modal-save">
                Save
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="admin-modal-cancel"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isCommentsModalOpen && currentDiscussion && (
        <div className="admin-comments-overlay">
          <div className="admin-comments-modal">
            <h3>
              Comments for: {currentDiscussion.title}{" "}
              <span>({currentComments.length})</span>
            </h3>
            <div className="admin-comments-list">
              {currentComments.length > 0 ? (
                currentComments.map((comment) => (
                  <div key={comment._id} className="admin-comment-item">
                    <div className="admin-comment-header">
                      <strong className="admin-comment-author">
                        {comment.createdBy?.name}
                      </strong>
                      <span className="admin-comment-email">
                        ({comment.createdBy?.email})
                      </span>
                      <span className="admin-comment-date">
                        {new Date(comment.createdAt).toLocaleString()}
                      </span>
                      <button
                        onClick={() => confirmDeleteComment(comment._id)}
                        className="admin-comment-delete"
                        disabled={deleteLoading}
                      >
                        {deleteLoading ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                    <div className="admin-comment-body">{comment.content}</div>
                  </div>
                ))
              ) : (
                <div className="admin-no-comments">
                  No comments for this discussion.
                </div>
              )}
            </div>
            <div className="admin-modal-actions">
              <button
                onClick={() => {
                  setIsCommentsModalOpen(false);
                  setCurrentComments([]);
                  setCurrentDiscussion(null);
                }}
                className="admin-modal-close"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDiscussions;
