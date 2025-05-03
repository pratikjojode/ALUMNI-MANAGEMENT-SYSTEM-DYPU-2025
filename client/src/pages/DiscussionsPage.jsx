import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "../styles/DiscussionsPage.css"; // New CSS file

const DiscussionsPage = () => {
  const [discussions, setDiscussions] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [loadingDiscussions, setLoadingDiscussions] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [selectedDiscussionIdForComments, setSelectedDiscussionIdForComments] =
    useState(null);
  const [discussionComments, setDiscussionComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState("");
  const [replyingToCommentId, setReplyingToCommentId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const navigate = useNavigate();

  const discussionCategories = [
    "All",
    "Networking",
    "Career",
    "Internships",
    "General",
  ];

  const fetchDiscussionList = async (category) => {
    try {
      setLoadingDiscussions(true);
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication required.");
        navigate("/login");
        return;
      }
      const url =
        category && category !== "All"
          ? `/api/v1/discussions/category/${category}`
          : `/api/v1/discussions/getDis`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDiscussions(response.data.discussions);
      toast.success("Discussions loaded.");
    } catch (error) {
      console.error("Failed to fetch discussions:", error);
      toast.error("Failed to load discussions.");
    } finally {
      setLoadingDiscussions(false);
    }
  };

  const openCommentModal = async (discussionId) => {
    setSelectedDiscussionIdForComments(discussionId);
    setIsCommentModalOpen(true);
    try {
      setLoadingDiscussions(true); // Reusing loading state for simplicity
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication required.");
        return;
      }
      const response = await axios.get(
        `/api/v1/comments/discussion/${discussionId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDiscussionComments(response.data.comments);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
      toast.error("Failed to load comments.");
    } finally {
      setLoadingDiscussions(false);
    }
  };

  const closeCommentModal = () => {
    setIsCommentModalOpen(false);
    setSelectedDiscussionIdForComments(null);
    setDiscussionComments([]);
    setNewCommentText("");
    setReplyingToCommentId(null);
    setReplyText("");
  };

  const handlePostNewComment = async () => {
    if (!selectedDiscussionIdForComments || !newCommentText.trim()) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication required.");
        return;
      }
      await axios.post(
        "/api/v1/comments/create",
        {
          content: newCommentText,
          discussionId: selectedDiscussionIdForComments,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewCommentText("");
      fetchCommentsForModal(selectedDiscussionIdForComments); // Refresh comments
      toast.success("Comment posted.");
    } catch (error) {
      console.error("Failed to post comment:", error);
      toast.error("Failed to post comment.");
    }
  };

  const handlePostReply = async () => {
    if (!replyingToCommentId || !replyText.trim()) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication required.");
        return;
      }
      await axios.post(
        "/api/v1/comments/reply",
        {
          content: replyText,
          commentId: replyingToCommentId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReplyText("");
      setReplyingToCommentId(null);
      fetchCommentsForModal(selectedDiscussionIdForComments); // Refresh comments
      toast.success("Reply posted.");
    } catch (error) {
      console.error("Failed to post reply:", error);
      toast.error("Failed to post reply.");
    }
  };

  const fetchCommentsForModal = async (discussionId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const response = await axios.get(
        `/api/v1/comments/discussion/${discussionId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDiscussionComments(response.data.comments);
    } catch (error) {
      console.error("Failed to refresh comments:", error);
      toast.error("Failed to refresh comments.");
    }
  };

  const handleLikeDiscussion = async (discussionId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication required.");
        return;
      }
      const response = await axios.patch(
        `/api/v1/discussions/like/${discussionId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDiscussions((prev) =>
        prev.map((d) =>
          d._id === discussionId ? { ...d, likes: response.data.likes } : d
        )
      );
    } catch (error) {
      console.error("Failed to like/unlike:", error);
      toast.error("Failed to like/unlike.");
    }
  };

  useEffect(() => {
    fetchDiscussionList(categoryFilter);
  }, [categoryFilter]);

  const getCategoryColor = (category) => {
    const colors = {
      Networking: "#29abe2",
      Career: "#8bc34a",
      Internships: "#ff9800",
      General: "#9c27b0",
    };
    return colors[category] || "#607d8b";
  };

  const renderDiscussionItem = (discussion) => (
    <div key={discussion._id} className="discussion-item">
      <div className="discussion-header">
        <h3 className="discussion-title">{discussion.title}</h3>
        <span
          className="discussion-category"
          style={{ backgroundColor: getCategoryColor(discussion.category) }}
        >
          {discussion.category}
        </span>
      </div>
      <p className="discussion-body">{discussion.description}</p>
      <div className="discussion-meta">
        <span className="discussion-author">
          By: {discussion.createdBy?.name || "Anonymous"}
        </span>
        <button
          className="like-button"
          onClick={() => handleLikeDiscussion(discussion._id)}
        >
          {discussion.likes?.includes(localStorage.getItem("userId"))
            ? "❤️ Unlike"
            : "🤍 Like"}{" "}
          ({discussion.likes?.length || 0})
        </button>
        <button
          className="comment-button"
          onClick={() => openCommentModal(discussion._id)}
        >
          💬 Comments ({discussion.comments?.length || 0})
        </button>
      </div>
    </div>
  );

  const renderDiscussionList = () => (
    <div className="discussion-list-container">
      {loadingDiscussions ? (
        <p className="loading-message">Loading discussions...</p>
      ) : discussions.length > 0 ? (
        discussions.map(renderDiscussionItem)
      ) : (
        <p className="empty-message">No discussions found in this category.</p>
      )}
    </div>
  );

  const renderCommentModal = () => (
    <div
      className={`comment-modal-overlay ${isCommentModalOpen ? "open" : ""}`}
    >
      <div className="comment-modal-content">
        <div className="modal-header">
          <h4 className="modal-title">Discussion Comments</h4>
          <button className="modal-close-button" onClick={closeCommentModal}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          {loadingDiscussions && (
            <p className="loading-message">Loading comments...</p>
          )}
          {!loadingDiscussions && discussionComments.length === 0 && (
            <p className="empty-message">
              No comments yet. Be the first to comment!
            </p>
          )}
          {!loadingDiscussions && discussionComments.length > 0 && (
            <ul className="comment-list">
              {discussionComments.map((comment) => (
                <li key={comment._id} className="comment-item">
                  <div className="comment-header">
                    <span className="comment-author">
                      {comment.createdBy?.name || "Anonymous"}
                    </span>
                  </div>
                  <p className="comment-text">{comment.content}</p>
                  <div className="comment-actions">
                    <button
                      className="reply-trigger"
                      onClick={() => setReplyingToCommentId(comment._id)}
                    >
                      Reply
                    </button>
                  </div>
                  {replyingToCommentId === comment._id && (
                    <div className="reply-form">
                      <textarea
                        className="reply-input"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write your reply..."
                      />
                      <button
                        className="post-reply-button"
                        onClick={handlePostReply}
                      >
                        Post Reply
                      </button>
                      <button
                        className="cancel-reply-button"
                        onClick={() => setReplyingToCommentId(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                  {comment.replies && comment.replies.length > 0 && (
                    <ul className="reply-list">
                      {comment.replies.map((reply) => (
                        <li key={reply._id} className="reply-item">
                          <span className="reply-author">
                            {reply.createdBy?.name || "Anonymous"}
                          </span>
                          <p className="reply-text">{reply.content}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="modal-footer">
          <textarea
            className="new-comment-input"
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            placeholder="Add your comment..."
          />
          <button
            className="post-comment-button"
            onClick={handlePostNewComment}
          >
            Post Comment
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="discussions-page-container">
      <div className="discussions-control-panel">
        <button
          className="create-discussion-button"
          onClick={() => navigate("/student/discussionFormAll")}
        >
          ➕ New Discussion
        </button>
        <select
          className="category-filter-dropdown"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          {discussionCategories.map((cat) => (
            <option key={cat} value={cat} className="filter-option">
              {cat}
            </option>
          ))}
        </select>
      </div>

      <h2 className="discussions-page-title">Community Discussions</h2>
      {renderDiscussionList()}
      {renderCommentModal()}
    </div>
  );
};

export default DiscussionsPage;
