import React, { useState, useEffect } from "react";
import "../styles/ApplyForJobs.css";
const ApplyForJobs = () => {
  const [jobPosts, setJobPosts] = useState([]);
  const [selectedJob, setSelectedJob] = useState("");
  const [resume, setResume] = useState(null);

  useEffect(() => {
    // Fetch job posts
    const fetchJobPosts = async () => {
      try {
        const token = localStorage.getItem("token"); // Assuming you stored the token in localStorage
        const response = await fetch(
          "http://localhost:5000/api/v1/jobsPosting/job-posts",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Add the token to the Authorization header
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("Fetched job posts:", data); // Log the response data
          setJobPosts(data);
        } else {
          alert("Failed to fetch job posts");
        }
      } catch (error) {
        console.error("Error fetching job posts:", error);
      }
    };

    fetchJobPosts();
  }, []);

  const handleResumeChange = (e) => {
    setResume(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedJob || !resume) {
      alert("Please select a job and upload a resume.");
      return;
    }

    // Submit application logic
    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("jobPostId", selectedJob);

    try {
      const token = localStorage.getItem("token"); // Retrieve the token from localStorage

      const response = await fetch(
        "http://localhost:5000/api/v1/job-applications/apply",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, // Add token in header
          },
          body: formData,
        }
      );

      if (response.ok) {
        alert("Job application submitted successfully!");
      } else {
        alert("Error submitting application.");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Error submitting application.");
    }
  };

  return (
    <div className="apply-jobs-container">
      <h2>Apply for Jobs</h2>

      <div className="jobs-list">
        {jobPosts.length === 0 ? (
          <p className="no-jobs">No jobs available at the moment</p>
        ) : (
          jobPosts.map((job) => (
            <div
              className={`job-card ${
                selectedJob === job._id ? "selected" : ""
              }`}
              key={job._id}
              onClick={() => setSelectedJob(job._id)}
            >
              <h3>{job.title}</h3>
              <div className="job-details">
                <p>
                  <strong>Company:</strong> {job.company}
                </p>
                <p>
                  <strong>Location:</strong> {job.location}
                </p>
                <p>
                  <strong>Salary:</strong> {job.salary}
                </p>
                <p>
                  <strong>Description:</strong> {job.description}
                </p>
              </div>
              <button
                type="button"
                className="select-button"
                onClick={() => setSelectedJob(job._id)}
              >
                {selectedJob === job._id ? "Selected" : "Select"}
              </button>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="application-form">
        <div className="form-group">
          <label htmlFor="resume" className="file-label">
            Upload Resume (PDF/DOC)
            <input
              type="file"
              id="resume"
              onChange={handleResumeChange}
              accept=".pdf,.doc,.docx"
              className="file-input"
            />
          </label>
          {resume && <span className="file-name">{resume.name}</span>}
        </div>

        <button type="submit" className="submit-button">
          Submit Application
        </button>

        {!selectedJob && <p className="error">Please select a job first</p>}
      </form>
    </div>
  );
};

export default ApplyForJobs;
