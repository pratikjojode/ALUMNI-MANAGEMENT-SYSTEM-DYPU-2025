import React, { useState, useEffect } from "react";

const ViewJobPosts = () => {
  const [jobPosts, setJobPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobPosts = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/v1/jobsPosting/job-posts"
        );
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
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Admin Dashboard - Job Postings</h2>
      {jobPosts.length === 0 ? (
        <p>No job posts available</p>
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
