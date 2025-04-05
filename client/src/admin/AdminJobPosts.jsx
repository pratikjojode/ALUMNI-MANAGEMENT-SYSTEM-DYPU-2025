import React, { useState, useEffect } from "react";
import "../styles/AdminJobPosts.css"; // Import the CSS file

const AdminJobPosts = () => {
  const [jobPosts, setJobPosts] = useState([]);

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
        alert(`Job post has been ${status}`);
        setJobPosts((prevPosts) =>
          prevPosts.filter((job) => job._id !== jobPostId)
        );
      } else {
        alert("Error approving/rejecting job post");
      }
    } catch (error) {
      console.error("Error in approve/reject action:", error);
      alert("Error approving/rejecting job post");
    }
  };

  return (
    <div className="admin-job-posts-container">
      <h2>Admin Dashboard - Job Post Approvals</h2>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Location</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {jobPosts.map((job) => (
            <tr key={job._id}>
              <td>{job.title}</td>
              <td>{job.description}</td>
              <td>{job.location}</td>
              <td>
                <button
                  className="approve"
                  onClick={() => handleApproveReject(job._id, "approved")}
                >
                  Approve
                </button>
                <button
                  className="reject"
                  onClick={() => handleApproveReject(job._id, "rejected")}
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminJobPosts;
