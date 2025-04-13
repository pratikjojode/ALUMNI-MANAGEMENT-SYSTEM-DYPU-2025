import React, { useState, useEffect } from "react";
import "../styles/ViewJobPosts.css";

const ViewJobPosts = () => {
  const [jobPosts, setJobPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobPosts = async () => {
      try {
        const response = await fetch("/api/v1/jobsPosting/job-posts");
        if (response.ok) {
          const data = await response.json();
          setJobPosts(data);
        } else {
          alert("Failed to fetch job posts");
        }
      } catch (error) {
        console.error("Error fetching job posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobPosts();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="view-job-posts-container">
      <h2>Admin Dashboard - Job Postings</h2>
      {jobPosts.length === 0 ? (
        <p className="no-job-posts">No job posts available</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Location</th>
              <th>Posted By</th>
            </tr>
          </thead>
          <tbody>
            {jobPosts.map((job) => (
              <tr key={job._id}>
                <td>{job.title}</td>
                <td>{job.description}</td>
                <td>{job.location}</td>
                <td>{job.postedBy.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewJobPosts;
