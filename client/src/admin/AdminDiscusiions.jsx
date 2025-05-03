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

  const fetchDiscussions = async () => {
    try {
      const { data } = await axios.get("/api/v1/discussions/getDis", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setDiscussions(data.discussions);
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

  return (
    <div className="admin-discussions-container">
      <h2>Admin Discussions</h2>

      <div className="view-toggle">
        <button
          onClick={() => setViewType("grid")}
          className={`view-btn ${viewType === "grid" ? "active" : ""}`}
        >
          Grid View
        </button>
        <button
          onClick={() => setViewType("table")}
          className={`view-btn ${viewType === "table" ? "active" : ""}`}
        >
          Table View
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading discussions...</div>
      ) : discussions.length === 0 ? (
        <div className="empty-state">No discussions available.</div>
      ) : viewType === "grid" ? (
        <div className="grid-view">
          {discussions.map((dis) => (
            <div key={dis._id} className="discussion-card">
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
              <div className="stats">
                <span>❤️ {dis.likes?.length || 0}</span>
                <span>💬 {dis.comments?.length || 0}</span>
              </div>
              <div className="action-buttons">
                <button
                  onClick={() => handleDelete(dis._id)}
                  className="delete-btn"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleEditClick(dis)}
                  className="edit-btn"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleViewComments(dis)}
                  className="comments-btn"
                >
                  View Comments
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <table className="discussion-table">
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
            {discussions.map((dis) => (
              <tr key={dis._id}>
                <td>{dis.title}</td>
                <td>{dis.description}</td>
                <td>{dis.category}</td>
                <td>{dis.createdBy?.name}</td>
                <td>{new Date(dis.createdAt).toLocaleDateString()}</td>
                <td className="table-actions">
                  <button
                    onClick={() => handleDelete(dis._id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleEditClick(dis)}
                    className="edit-btn"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleViewComments(dis)}
                    className="comments-btn"
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
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Discussion</h3>
            <label>Title:</label>
            <input
              type="text"
              value={editDiscussion.title}
              onChange={(e) =>
                setEditDiscussion({ ...editDiscussion, title: e.target.value })
              }
              className="input-field"
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
              className="textarea-field"
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
              className="select-field"
            >
              <option value="Career">Career</option>
              <option value="Networking">Networking</option>
              <option value="Higher Studies">Higher Studies</option>
              <option value="Internships">Internships</option>
              <option value="General">General</option>
              <option value="Other">Other</option>
            </select>
            <div className="modal-actions">
              <button onClick={handleUpdate} className="btn-primary">
                Save
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comments Modal */}
      {isCommentsModalOpen && currentDiscussion && (
        <div className="modal-overlay">
          <div className="modal-content comments-modal">
            <h3>
              Comments for: {currentDiscussion.title}{" "}
              <span>({currentComments.length})</span>
            </h3>
            <div className="comments-list">
              {currentComments.length > 0 ? (
                currentComments.map((comment) => (
                  <div key={comment._id} className="comment-item">
                    <div className="comment-header">
                      <strong className="author">
                        {comment.createdBy?.name}
                      </strong>
                      <span className="email">
                        ({comment.createdBy?.email})
                      </span>
                      <span className="date">
                        {new Date(comment.createdAt).toLocaleString()}
                      </span>
                      <button
                        onClick={() => confirmDeleteComment(comment._id)}
                        className="delete-comment-btn"
                        disabled={deleteLoading}
                      >
                        {deleteLoading ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                    <div className="comment-body">{comment.content}</div>
                  </div>
                ))
              ) : (
                <div className="no-comments">
                  No comments for this discussion.
                </div>
              )}
            </div>
            <div className="modal-actions">
              <button
                onClick={() => {
                  setIsCommentsModalOpen(false);
                  setCurrentComments([]);
                  setCurrentDiscussion(null);
                }}
                className="btn-secondary"
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
