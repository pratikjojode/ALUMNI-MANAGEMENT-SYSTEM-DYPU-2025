import React, { useState, useEffect } from "react";
import { FaCheck, FaTimes, FaSearch, FaFilter } from "react-icons/fa";
import "../styles/AdminJobPosts.css";

const AdminJobPosts = () => {
  const [jobPosts, setJobPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Fetch job posts pending approval
  useEffect(() => {
    const fetchJobPosts = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/v1/jobsPosting/job-posts"
        );
        const data = await response.json();
        setJobPosts(data);
      } catch (error) {
        console.error("Error fetching job posts:", error);
      }
    };
    fetchJobPosts();
  }, []);

  const handleApproveReject = async (jobPostId, status) => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/v1/jobsPosting/approve",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ jobPostId, status }),
        }
      );

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
        </div>
      </div>

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
                        onClick={() => handleApproveReject(job._id, "approved")}
                      >
                        <FaCheck /> Approve
                      </button>
                      <button
                        className="reject-btn"
                        onClick={() => handleApproveReject(job._id, "rejected")}
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
    </div>
  );
};

export default AdminJobPosts;
