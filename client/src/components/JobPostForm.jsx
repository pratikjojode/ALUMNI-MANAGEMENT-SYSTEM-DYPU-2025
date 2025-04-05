import React, { useState } from "react";
import axios from "axios";
import "../styles/JobPostForm.css";

const JobPostForm = () => {
  const [jobDetails, setJobDetails] = useState({
    title: "",
    description: "",
    location: "",
    jobType: "",
    applicationDeadline: "",
    companyName: "",
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobDetails({ ...jobDetails, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/jobsPosting/job-post",
        jobDetails,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setMessage(response.data.message);
      setError("");
      setJobDetails({
        title: "",
        description: "",
        location: "",
        jobType: "",
        applicationDeadline: "",
        companyName: "",
      });
    } catch (error) {
      setError(error.response?.data?.message || "Error posting the job");
      setMessage("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="job-post-container">
      <div className="job-post-card">
        <div className="form-header">
          <h2 className="form-title">Post a Job Opportunity</h2>
          <p className="form-subtitle">
            Connect with talented alumni candidates
          </p>
        </div>

        {message && (
          <div className="alert alert-success">
            <i className="fas fa-check-circle"></i> {message}
          </div>
        )}
        {error && (
          <div className="alert alert-error">
            <i className="fas fa-exclamation-circle"></i> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="job-post-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Job Title *
                <input
                  type="text"
                  name="title"
                  value={jobDetails.title}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g. Senior Software Engineer"
                  required
                />
              </label>
            </div>

            <div className="form-group">
              <label className="form-label">
                Company Name *
                <input
                  type="text"
                  name="companyName"
                  value={jobDetails.companyName}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Your company name"
                  required
                />
              </label>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Job Description *
              <textarea
                name="description"
                value={jobDetails.description}
                onChange={handleChange}
                className="form-textarea"
                placeholder="Describe the position, responsibilities, and requirements"
                rows="5"
                required
              />
            </label>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Location *
                <input
                  type="text"
                  name="location"
                  value={jobDetails.location}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g. Remote, New York, etc."
                  required
                />
              </label>
            </div>

            <div className="form-group">
              <label className="form-label">
                Job Type *
                <select
                  name="jobType"
                  value={jobDetails.jobType}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Select job type</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                  <option value="Remote">Remote</option>
                </select>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Application Deadline *
              <input
                type="date"
                name="applicationDeadline"
                value={jobDetails.applicationDeadline}
                onChange={handleChange}
                className="form-input"
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </label>
          </div>

          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Posting...
              </>
            ) : (
              <>
                <i className="fas fa-paper-plane"></i> Post Job
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default JobPostForm;
