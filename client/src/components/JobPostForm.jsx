import React, { useState } from "react";
import axios from "axios";

const JobPostForm = () => {
  const [jobDetails, setJobDetails] = useState({
    title: "",
    description: "",
    location: "",
    jobType: "",
    applicationDeadline: "",
    companyName: "", // Add companyName field here
  });

  const [error, setError] = useState(""); // For error handling
  const [message, setMessage] = useState(""); // For success messages

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobDetails({ ...jobDetails, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      setMessage(response.data.message); // Success message
      setError(""); // Clear previous errors
    } catch (error) {
      setError(error.response?.data?.message || "Error posting the job");
      setMessage(""); // Clear previous success messages
    }
  };

  return (
    <div>
      <h2>Post a Job</h2>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Job Title:
          <input
            type="text"
            name="title"
            value={jobDetails.title}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Description:
          <textarea
            name="description"
            value={jobDetails.description}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Location:
          <input
            type="text"
            name="location"
            value={jobDetails.location}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Job Type:
          <input
            type="text"
            name="jobType"
            value={jobDetails.jobType}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Company Name:
          <input
            type="text"
            name="companyName"
            value={jobDetails.companyName}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Application Deadline:
          <input
            type="date"
            name="applicationDeadline"
            value={jobDetails.applicationDeadline}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <button type="submit">Post Job</button>
      </form>
    </div>
  );
};

export default JobPostForm;
