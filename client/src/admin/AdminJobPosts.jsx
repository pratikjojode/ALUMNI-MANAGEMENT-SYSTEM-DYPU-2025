import React, { useState, useEffect } from "react";
import {
  FaCheck,
  FaTimes,
  FaSearch,
  FaFilter,
  FaTable,
  FaTh,
} from "react-icons/fa";
import "../styles/AdminJobPosts.css";

const JobPostsAdmin = () => {
  const [jobPosts, setJobPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [view, setView] = useState("table");

  useEffect(() => {
    const fetchJobPosts = async () => {
      try {
        const response = await fetch("/api/v1/jobsPosting/job-posts");
        const data = await response.json();
        console.log("Fetched job posts:", data.data);
        setJobPosts(data.data || []);
      } catch (error) {
        console.error("Error fetching job posts:", error);
      }
    };

    fetchJobPosts();
  }, []);

  const handleApproveReject = async (jobPostId, status) => {
    try {
      const response = await fetch("/api/v1/jobsPosting/approve", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ jobPostId, status }),
      });

      if (response.ok) {
        // Update the status of the job post in the state
        setJobPosts((prevPosts) =>
          prevPosts.map((job) =>
            job._id === jobPostId ? { ...job, status } : job
          )
        );
      } else {
        console.error("Error in approve/reject action");
      }
    } catch (error) {
      console.error("Error approving/rejecting job post:", error);
    }
  };

  const filteredJobs = jobPosts.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || job.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="admin-job-posts-container">
      <div className="admin-job-posts-header">
        <h2 className="admin-job-posts-title">Job Post Approvals</h2>
        <div className="admin-job-posts-controls">
          <div className="admin-job-search">
            <FaSearch className="admin-job-search-icon" />
            <input
              type="text"
              className="admin-job-search-input"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="admin-job-filter">
            <FaFilter className="admin-job-filter-icon" />
            <select
              className="admin-job-filter-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div className="admin-job-view-toggle">
            <button
              className={`view-toggle-btn ${
                view === "table" ? "view-toggle-active" : ""
              }`}
              onClick={() => setView("table")}
            >
              <FaTable /> Table
            </button>
            <button
              className={`view-toggle-btn ${
                view === "card" ? "view-toggle-active" : ""
              }`}
              onClick={() => setView("card")}
            >
              <FaTh /> Cards
            </button>
          </div>
        </div>
      </div>

      {view === "table" ? (
        <div className="admin-job-table-container">
          <table className="admin-job-table">
            <thead>
              <tr className="admin-job-table-header">
                <th className="admin-job-table-header-cell">Job Title</th>
                <th className="admin-job-table-header-cell">Company</th>
                <th className="admin-job-table-header-cell">Location</th>
                <th className="admin-job-table-header-cell">Posted On</th>
                <th className="admin-job-table-header-cell">Status</th>
                <th className="admin-job-table-header-cell">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <tr key={job._id} className="admin-job-table-row">
                    <td className="admin-job-table-cell">
                      <div className="admin-job-title-container">
                        <h4 className="admin-job-title">{job.title}</h4>
                        <p className="admin-job-description">
                          {job.description.substring(0, 60)}...
                        </p>
                      </div>
                    </td>
                    <td className="admin-job-table-cell">{job.companyName}</td>
                    <td className="admin-job-table-cell">{job.location}</td>
                    <td className="admin-job-table-cell">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </td>
                    <td className="admin-job-table-cell">
                      <span
                        className={`admin-job-status-badge admin-job-status-${job.status}`}
                      >
                        {job.status}
                      </span>
                    </td>
                    <td className="admin-job-table-cell">
                      <div className="admin-job-actions">
                        <button
                          className="admin-job-approve-btn"
                          onClick={() =>
                            handleApproveReject(job._id, "approved")
                          }
                        >
                          <FaCheck /> Approve
                        </button>
                        <button
                          className="admin-job-reject-btn"
                          onClick={() =>
                            handleApproveReject(job._id, "rejected")
                          }
                        >
                          <FaTimes /> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="admin-job-empty-row">
                  <td colSpan="6" className="admin-job-empty-cell">
                    No job posts found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="admin-job-card-grid">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div key={job._id} className="admin-job-card">
                <div className="admin-job-card-header">
                  <h3 className="admin-job-card-title">{job.title}</h3>
                  <p className="admin-job-card-company">{job.companyName}</p>
                </div>
                <div className="admin-job-card-body">
                  <div className="admin-job-card-detail">
                    <span className="admin-job-card-detail-icon">📍</span>
                    <span className="admin-job-card-detail-text">
                      {job.location}
                    </span>
                  </div>
                  <div className="admin-job-card-detail">
                    <span className="admin-job-card-detail-icon">📅</span>
                    <span className="admin-job-card-detail-text">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="admin-job-card-description">
                    {job.description.substring(0, 150)}...
                  </div>
                </div>
                <div className="admin-job-card-footer">
                  <span
                    className={`admin-job-card-status admin-job-status-${job.status}`}
                  >
                    {job.status}
                  </span>
                  <div className="admin-job-card-actions">
                    <button
                      className="admin-job-approve-btn"
                      onClick={() => handleApproveReject(job._id, "approved")}
                    >
                      <FaCheck />
                    </button>
                    <button
                      className="admin-job-reject-btn"
                      onClick={() => handleApproveReject(job._id, "rejected")}
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="admin-job-empty-state">
              No job posts found matching your criteria
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobPostsAdmin;
