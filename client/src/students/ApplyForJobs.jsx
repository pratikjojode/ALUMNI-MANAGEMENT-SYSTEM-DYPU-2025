import React, { useState, useEffect } from "react";
import "../styles/ApplyForJobs.css";
import toast from "react-hot-toast";
import {
  FaBuilding,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaFileUpload,
  FaTable,
  FaThLarge,
  FaCheckCircle,
  FaTimes,
} from "react-icons/fa";

const ApplyForJobs = () => {
  const [jobPosts, setJobPosts] = useState([]);
  const [selectedJob, setSelectedJob] = useState("");
  const [resume, setResume] = useState(null);
  const [viewMode, setViewMode] = useState("card");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedJobDetails, setSelectedJobDetails] = useState(null);

  useEffect(() => {
    const fetchJobPosts = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("/api/v1/jobsPosting/job-posts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data.data)) {
            setJobPosts(data.data);
          } else {
            console.error("Unexpected response format:", data);
            setJobPosts([]);
          }
        } else {
          toast.error("Failed to fetch job posts");
        }
      } catch (error) {
        console.error("Error fetching job posts:", error);
        toast.error("Error fetching job posts");
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
      toast.error("Please select a job and upload a resume.");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("jobPostId", selectedJob);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/v1/job-applications/apply", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const job = jobPosts.find((j) => j._id === selectedJob);
        setSelectedJobDetails(job);
        setShowConfirmation(true);
        toast.success("Job application submitted successfully!");
      } else {
        toast.error("Error submitting application.");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Error submitting application.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setResume(null);
    setSelectedJob("");
    setShowConfirmation(false);
    setSelectedJobDetails(null);
  };

  return (
    <div className="apply-jobs-container">
      {/* Confirmation Modal */}
      {showConfirmation && selectedJobDetails && (
        <div className="confirmation-modal">
          <div className="modal-content">
            <button
              className="close-button"
              onClick={() => setShowConfirmation(false)}
            >
              <FaTimes />
            </button>
            <div className="modal-icon">
              <FaCheckCircle />
            </div>
            <h3>Application Submitted!</h3>
            <p>
              You've successfully applied for the{" "}
              <strong>{selectedJobDetails.title}</strong> position at{" "}
              <strong>{selectedJobDetails.company}</strong>.
            </p>
            <div className="modal-details">
              <p>
                <strong>Company:</strong> {selectedJobDetails.company}
              </p>
              <p>
                <strong>Location:</strong> {selectedJobDetails.location}
              </p>
              {selectedJobDetails.salary && (
                <p>
                  <strong>Salary:</strong> {selectedJobDetails.salary}
                </p>
              )}
            </div>
            <div className="modal-actions">
              <button className="modal-button primary" onClick={resetForm}>
                Apply for Another Job
              </button>
              <button
                className="modal-button secondary"
                onClick={() => setShowConfirmation(false)}
              >
                View Applications
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="header-section">
        <h2>Apply for Jobs</h2>
        <div className="view-toggle">
          <button
            className={`view-button ${viewMode === "card" ? "active" : ""}`}
            onClick={() => setViewMode("card")}
          >
            <FaThLarge /> Card View
          </button>
          <button
            className={`view-button ${viewMode === "table" ? "active" : ""}`}
            onClick={() => setViewMode("table")}
          >
            <FaTable /> Table View
          </button>
        </div>
      </div>

      {jobPosts.length === 0 ? (
        <div className="no-jobs-message">
          <p>No jobs available at the moment</p>
        </div>
      ) : viewMode === "card" ? (
        <div className="jobs-grid">
          {jobPosts.map((job) => (
            <div
              className={`job-card ${
                selectedJob === job._id ? "selected" : ""
              }`}
              key={job._id}
              onClick={() => setSelectedJob(job._id)}
            >
              <h3>{job.title}</h3>
              <div className="job-details">
                <p className="company">
                  <FaBuilding /> {job.company}
                </p>
                <p className="location">
                  <FaMapMarkerAlt /> {job.location}
                </p>
                <p className="salary">
                  <FaMoneyBillWave /> {job.salary || "Not specified"}
                </p>
                <p className="description">{job.description}</p>
              </div>
              <div className="job-footer">
                <button
                  type="button"
                  className="select-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedJob(job._id);
                  }}
                >
                  {selectedJob === job._id ? "Selected" : "Select"}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="jobs-table-container">
          <table className="jobs-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Company</th>
                <th>Location</th>
                <th>Salary</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {jobPosts.map((job) => (
                <tr
                  key={job._id}
                  className={selectedJob === job._id ? "selected-row" : ""}
                  onClick={() => setSelectedJob(job._id)}
                >
                  <td>{job.title}</td>
                  <td>{job.company}</td>
                  <td>{job.location}</td>
                  <td>{job.salary || "Not specified"}</td>
                  <td>
                    <button
                      type="button"
                      className="select-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedJob(job._id);
                      }}
                    >
                      {selectedJob === job._id ? "Selected" : "Select"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <form onSubmit={handleSubmit} className="application-form">
        <div className="form-group">
          <label htmlFor="resume" className="file-label">
            <FaFileUpload /> Upload Resume (PDF/DOC)
            <input
              type="file"
              id="resume"
              onChange={handleResumeChange}
              accept=".pdf,.doc,.docx"
              className="file-input"
            />
          </label>
          {resume && (
            <span className="file-name">
              {resume.name} ({Math.round(resume.size / 1024)} KB)
            </span>
          )}
        </div>

        <button
          type="submit"
          className="submit-button"
          disabled={!selectedJob || !resume || isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Application"}
        </button>

        {!selectedJob && (
          <p className="form-error">Please select a job first</p>
        )}
      </form>
    </div>
  );
};

export default ApplyForJobs;
