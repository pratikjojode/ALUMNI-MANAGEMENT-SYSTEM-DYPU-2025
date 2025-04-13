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

const AdminJobPosts = () => {
  const [jobPosts, setJobPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [view, setView] = useState("table");

  useEffect(() => {
    const fetchJobPosts = async () => {
      try {
        const response = await fetch("/api/v1/jobsPosting/job-posts");
        const data = await response.json();
        console.log("Fetched job posts:", data.data); // Adjusted based on the response structure
        setJobPosts(data.data || []); // Ensure jobPosts is set correctly
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
        setJobPosts((prevPosts) =>
          prevPosts.filter((job) => job._id !== jobPostId)
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

    // Logging the filters and filtered jobs for debugging
    console.log("Matches Search:", matchesSearch);
    console.log("Matches Status:", matchesStatus);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="admin-job-posts-container">
      <div className="admin-job-header">
        <h2>Job Post Approvals</h2>
        <div className="job-controls">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-dropdown">
            <FaFilter className="filter-icon" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div className="view-toggle">
            <button
              className={view === "table" ? "active" : ""}
              onClick={() => setView("table")}
            >
              <FaTable /> Table
            </button>
            <button
              className={view === "card" ? "active" : ""}
              onClick={() => setView("card")}
            >
              <FaTh /> Cards
            </button>
          </div>
        </div>
      </div>

      {view === "table" ? (
        <div className="job-posts-table-container">
          <table className="job-posts-table">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Company</th>
                <th>Location</th>
                <th>Posted On</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <tr key={job._id}>
                    <td>
                      <div className="job-title">
                        <h4>{job.title}</h4>
                        <p className="job-description">
                          {job.description.substring(0, 60)}...
                        </p>
                      </div>
                    </td>
                    <td>{job.companyName}</td>
                    <td>{job.location}</td>
                    <td>{new Date(job.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge ${job.status}`}>
                        {job.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="approve-btn"
                          onClick={() =>
                            handleApproveReject(job._id, "approved")
                          }
                        >
                          <FaCheck /> Approve
                        </button>
                        <button
                          className="reject-btn"
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
                <tr>
                  <td colSpan="6" className="no-jobs">
                    No job posts found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="job-posts-grid">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div key={job._id} className="job-card">
                <div className="job-card-header">
                  <h3>{job.title}</h3>
                  <p className="job-card-company">{job.companyName}</p>
                </div>
                <div className="job-card-body">
                  <div className="job-card-detail">
                    <span className="job-card-detail-icon">📍</span>
                    <span>{job.location}</span>
                  </div>
                  <div className="job-card-detail">
                    <span className="job-card-detail-icon">📅</span>
                    <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="job-card-description">
                    {job.description.substring(0, 150)}...
                  </div>
                </div>
                <div className="job-card-footer">
                  <span
                    className={`job-card-status status-badge ${job.status}`}
                  >
                    {job.status}
                  </span>
                  <div className="job-card-actions">
                    <button
                      className="approve-btn"
                      onClick={() => handleApproveReject(job._id, "approved")}
                    >
                      <FaCheck />
                    </button>
                    <button
                      className="reject-btn"
                      onClick={() => handleApproveReject(job._id, "rejected")}
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-jobs">
              No job posts found matching your criteria
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminJobPosts;
