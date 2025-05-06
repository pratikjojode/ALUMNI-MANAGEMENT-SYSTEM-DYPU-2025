import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "../styles/DiscussionsPage.css";

const DiscussionsPage = () => {
  const [discussions, setDiscussions] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [loadingDiscussions, setLoadingDiscussions] = useState(false);

  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [selectedDiscussionIdForComments, setSelectedDiscussionIdForComments] =
    useState(null);
  const [discussionComments, setDiscussionComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);

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
    setLoadingDiscussions(true);
    try {
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
    } catch (error) {
      console.error("Failed to fetch discussions:", error);
      toast.error(
        error.response?.data?.message || "Failed to load discussions."
      );
      setDiscussions([]);
    } finally {
      setLoadingDiscussions(false);
    }
  };

  const fetchCommentsForModal = async (discussionId) => {
    if (!discussionId) return;
    setLoadingComments(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setDiscussionComments([]);
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
      console.error("Failed to refresh comments:", error);
      toast.error(
        error.response?.data?.message || "Failed to refresh comments."
      );
      setDiscussionComments([]);
    } finally {
      setLoadingComments(false);
    }
  };

  const openCommentModal = async (discussionId) => {
    setSelectedDiscussionIdForComments(discussionId);
    setIsCommentModalOpen(true);
    await fetchCommentsForModal(discussionId);
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
    if (!selectedDiscussionIdForComments || !newCommentText.trim()) {
      toast.error("Comment text cannot be empty.");
      return;
    }
    setLoadingComments(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication required.");
        setLoadingComments(false);
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
      await fetchCommentsForModal(selectedDiscussionIdForComments);
      toast.success("Comment posted.");
    } catch (error) {
      console.error("Failed to post comment:", error);
      toast.error(error.response?.data?.message || "Failed to post comment.");
      setLoadingComments(false);
    }
  };

  const handlePostReply = async () => {
    if (!replyingToCommentId || !replyText.trim()) {
      toast.error("Reply text cannot be empty.");
      return;
    }
    setLoadingComments(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication required.");
        setLoadingComments(false);
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
      await fetchCommentsForModal(selectedDiscussionIdForComments);
      toast.success("Reply posted.");
    } catch (error) {
      console.error("Failed to post reply:", error);
      toast.error(error.response?.data?.message || "Failed to post reply.");
      setLoadingComments(false);
    }
  };

  const handleLikeDiscussion = async (discussionId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `/api/v1/discussions/like/${discussionId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDiscussions((prevDiscussions) =>
        prevDiscussions.map((d) =>
          d._id === discussionId ? { ...d, likes: response.data.likes } : d
        )
      );
    } catch (error) {
      console.error("Failed to like/unlike:", error);
      toast.error(
        error.response?.data?.message || "Failed to update like status."
      );
    }
  };

  useEffect(() => {
    fetchDiscussionList(categoryFilter);
  }, [categoryFilter, navigate]);

  const getCategoryColor = (category) => {
    const colors = {
      Networking: "#29abe2",
      Career: "#8bc34a",
      Internships: "#ff9800",
      General: "#9c27b0",
    };
    return colors[category] || "#607d8b";
  };

  const renderDiscussionItem = (discussion) => {
    const userId = localStorage.getItem("userId");
    const isLiked = discussion.likes?.includes(userId);

    return (
      <article
        key={discussion._id}
        className="discussion-item"
        data-category={discussion.category}
      >
        <header className="discussion-header">
          <h3 className="discussion-title">{discussion.title}</h3>
          <span
            className="discussion-category"
            style={{ backgroundColor: getCategoryColor(discussion.category) }}
          >
            {discussion.category}
          </span>
        </header>
        <p className="discussion-body">{discussion.description}</p>
        <footer className="discussion-meta">
          <span className="discussion-author">
            By: {discussion.createdBy?.name || "Anonymous"}
            {discussion.createdByModel && (
              <span className="created-by-model-tag">
                ({discussion.createdByModel})
              </span>
            )}
          </span>
          {discussion.createdAt && (
            <span className="discussion-timestamp">
              {new Date(discussion.createdAt).toLocaleString()}
            </span>
          )}
          <button
            className={`like-button ${isLiked ? "liked" : ""}`}
            onClick={() => handleLikeDiscussion(discussion._id)}
            aria-pressed={isLiked}
            title={isLiked ? "Unlike this discussion" : "Like this discussion"}
          >
            {isLiked ? "❤️ Unlike" : "🤍 Like"} ({discussion.likes?.length || 0}
            )
          </button>
          <button
            className="comment-button"
            onClick={() => openCommentModal(discussion._id)}
            aria-label={`View ${
              discussion.comments?.length || 0
            } comments for ${discussion.title}`}
            title="View and add comments"
          >
            💬 Comments ({discussion.comments?.length || 0}){" "}
          </button>
        </footer>
      </article>
    );
  };

  const renderDiscussionList = () => (
    <section className="discussion-list-container">
      {loadingDiscussions && discussions.length === 0 && (
        <p className="loading-message">Loading discussions...</p>
      )}
      {!loadingDiscussions && discussions.length > 0 && (
        <div className="discussion-items">
          {discussions.map(renderDiscussionItem)}
        </div>
      )}
      {!loadingDiscussions && discussions.length === 0 && (
        <p className="empty-message">
          No discussions found in this category. Be the first to create one!
        </p>
      )}
      {loadingDiscussions && discussions.length > 0 && (
        <p className="loading-message-partial">Loading more discussions...</p>
      )}
    </section>
  );

  const renderCommentModal = () => {
    if (!isCommentModalOpen) return null;

    const discussionTitle =
      discussions.find((d) => d._id === selectedDiscussionIdForComments)
        ?.title || "Comments";

    return (
      <div
        className={`comment-modal-overlay ${isCommentModalOpen ? "open" : ""}`}
        onClick={closeCommentModal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div
          className="comment-modal-content"
          onClick={(e) => e.stopPropagation()}
        >
          <header className="modal-header">
            <h4 id="modal-title" className="modal-title">
              Comments on "{discussionTitle}"
            </h4>
            <button
              className="modal-close-button"
              onClick={closeCommentModal}
              aria-label="Close comments modal"
              title="Close"
            >
              &times;
            </button>
          </header>

          {/* Disclaimer/Warning Section */}
          <div className="modal-disclaimer">
            <p>
              Please remember this is a college community discussion forum.
              Engage respectfully and constructively. Any form of misbehavior,
              harassment, or inappropriate content is strictly prohibited.
            </p>
          </div>

          <section className="modal-body">
            {loadingComments && discussionComments.length === 0 && (
              <p className="loading-message">Loading comments...</p>
            )}

            {!loadingComments && discussionComments.length === 0 && (
              <p className="empty-message">
                No comments yet. Be the first to comment!
              </p>
            )}

            {!loadingComments && discussionComments.length > 0 && (
              <ul className="comment-list">
                {discussionComments.map((comment) => (
                  <li key={comment._id} className="comment-item">
                    <div className="comment-content-wrapper">
                      <div className="comment-header">
                        <span className="comment-author">
                          {comment.createdBy?.name || "Anonymous"}
                          {comment.createdByModel && (
                            <span className="created-by-model-tag">
                              ({comment.createdByModel})
                            </span>
                          )}
                        </span>
                        {comment.createdAt && (
                          <span className="comment-timestamp">
                            {new Date(comment.createdAt).toLocaleString()}
                          </span>
                        )}
                      </div>
                      <p className="comment-text">{comment.content}</p>
                      <div className="comment-actions">
                        <button
                          className="reply-trigger"
                          onClick={() => {
                            setReplyingToCommentId(
                              replyingToCommentId === comment._id
                                ? null
                                : comment._id
                            );
                            setReplyText("");
                          }}
                          aria-expanded={replyingToCommentId === comment._id}
                          aria-controls={`reply-form-${comment._id}`}
                        >
                          {replyingToCommentId === comment._id
                            ? "Cancel Reply"
                            : "Reply"}
                        </button>
                      </div>
                      {replyingToCommentId === comment._id && (
                        <div
                          id={`reply-form-${comment._id}`}
                          className="reply-form"
                        >
                          <textarea
                            className="reply-input"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder={`Replying to ${
                              comment.createdBy?.name || "Anonymous"
                            }...`}
                            rows="3"
                            aria-label={`Write a reply to ${
                              comment.createdBy?.name || "Anonymous"
                            }`}
                          />
                          <div className="reply-form-actions">
                            <button
                              className="post-reply-button"
                              onClick={handlePostReply}
                              disabled={!replyText.trim() || loadingComments}
                            >
                              {loadingComments &&
                              replyingToCommentId === comment._id
                                ? "Posting..."
                                : "Post Reply"}
                            </button>
                          </div>
                        </div>
                      )}
                      {comment.replies && comment.replies.length > 0 && (
                        <ul className="reply-list">
                          {comment.replies.map((reply) => (
                            <li key={reply._id} className="reply-item">
                              <div className="reply-content-wrapper">
                                <span className="reply-author">
                                  {reply.createdBy?.name || "Anonymous"}
                                  {reply.createdByModel && (
                                    <span className="created-by-model-tag">
                                      ({reply.createdByModel})
                                    </span>
                                  )}
                                </span>
                                {reply.createdAt && (
                                  <span className="reply-timestamp">
                                    {new Date(reply.createdAt).toLocaleString()}
                                  </span>
                                )}
                                <p className="reply-text">{reply.content}</p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <footer className="modal-footer">
            <textarea
              className="new-comment-input"
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              placeholder="Add your comment..."
              rows="3"
              aria-label="Write a new comment"
            />
            <button
              className="post-comment-button"
              onClick={handlePostNewComment}
              disabled={!newCommentText.trim() || loadingComments}
            >
              {loadingComments && !replyingToCommentId
                ? "Posting..."
                : "Post Comment"}
            </button>
          </footer>
        </div>
      </div>
    );
  };

  return (
    <div className="discussions-page-container">
      <header className="discussions-header">
        <h2 className="discussions-page-title">Community Discussions</h2>
        <div className="discussions-control-panel">
          <button
            className="create-discussion-button"
            onClick={() => navigate("/alumni/discussionFormAll")}
          >
            ➕ New Discussion
          </button>
          <div className="category-filter-control">
            <label htmlFor="category-filter" className="visually-hidden">
              Filter by category
            </label>
            <select
              id="category-filter"
              className="category-filter-dropdown"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              aria-label="Filter discussions by category"
            >
              {discussionCategories.map((cat) => (
                <option key={cat} value={cat} className="filter-option">
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>
      {renderDiscussionList()}
      {renderCommentModal()}
    </div>
  );
};

export default DiscussionsPage;
