import React, { useState, useEffect } from "react";
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
  FaCheck,
  FaUser,
  FaClock,
  FaBookmark,
  FaFilter,
  FaSearch,
} from "react-icons/fa";
import "../styles/ApplyForJobs.css";
const ApplyForJobs = () => {
  const [jobPosts, setJobPosts] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [resume, setResume] = useState(null);
  const [viewMode, setViewMode] = useState("card");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedJobDetails, setSelectedJobDetails] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOptions, setFilterOptions] = useState({
    jobType: "",
    location: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchApprovedJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("/api/v1/jobsPosting/approved", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const jobs = Array.isArray(data.data) ? data.data : [];
          setJobPosts(jobs);
          setFilteredJobs(jobs);
        } else {
          toast.error("Failed to fetch approved job posts");
        }
      } catch (error) {
        console.error("Error fetching approved job posts:", error);
        toast.error("Error fetching approved job posts");
      }
    };

    const fetchAppliedJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "/api/v1/job-applications/getAppliedJobs",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setAppliedJobs(
            Array.isArray(data.data)
              ? data.data.map((job) => job.jobPostId._id)
              : []
          );
        }
      } catch (error) {
        console.error("Error fetching applied jobs:", error);
      }
    };

    fetchApprovedJobs();
    fetchAppliedJobs();
  }, []);

  useEffect(() => {
    // Filter jobs based on search and filter options
    let filtered = [...jobPosts];

    if (searchTerm) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterOptions.jobType) {
      filtered = filtered.filter(
        (job) => job.jobType === filterOptions.jobType
      );
    }

    if (filterOptions.location) {
      filtered = filtered.filter((job) =>
        job.location
          .toLowerCase()
          .includes(filterOptions.location.toLowerCase())
      );
    }

    setFilteredJobs(filtered);
  }, [searchTerm, filterOptions, jobPosts]);

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    setResume(file);

    // Show filename for better UX
    if (file) {
      const fileLabel = document.querySelector(".file-name");
      if (fileLabel) {
        fileLabel.textContent = file.name;
      }
    }
  };

  const handleSelectJob = (job) => {
    if (!appliedJobs.includes(job._id)) {
      setSelectedJob((prev) => (prev?._id === job._id ? null : job));
    }
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
    formData.append("jobPostId", selectedJob._id);

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
        setSelectedJobDetails(selectedJob);
        setShowConfirmation(true);
        setAppliedJobs((prev) => [...prev, selectedJob._id]);
        setSelectedJob(null);
        setResume(null);
        toast.success("Application submitted successfully!");
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
    setSelectedJob(null);
    setShowConfirmation(false);
    setSelectedJobDetails(null);
  };

  // Get unique locations and job types for filters
  const uniqueLocations = [...new Set(jobPosts.map((job) => job.location))];
  const uniqueJobTypes = [
    ...new Set(jobPosts.map((job) => job.jobType).filter(Boolean)),
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
              <strong>{selectedJobDetails.companyName}</strong>.
            </p>
            <div className="modal-details">
              <p>
                <FaBuilding /> <strong>Company:</strong>{" "}
                {selectedJobDetails.companyName}
              </p>
              <p>
                <FaMapMarkerAlt /> <strong>Location:</strong>{" "}
                {selectedJobDetails.location}
              </p>
              <p>
                <FaMoneyBillWave /> <strong>Job Type:</strong>{" "}
                {selectedJobDetails.jobType}
              </p>
              <p>
                <FaUser /> <strong>Posted By:</strong>{" "}
                {selectedJobDetails.postedBy?.name}
              </p>
            </div>
            <div className="modal-actions">
              <button className="modal-button primary" onClick={resetForm}>
                Apply for Another Job
              </button>
              <button
                className="modal-button secondary"
                onClick={() => setShowConfirmation(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="header-section">
        <h2>Browse Available Positions</h2>
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

      {/* Search and Filters */}
      <div className="search-filter-container">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by job title, company, or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button
          className="filter-toggle-button"
          onClick={() => setShowFilters(!showFilters)}
        >
          <FaFilter /> Filters
        </button>
      </div>

      {showFilters && (
        <div className="filters-container">
          <div className="filter-group">
            <label>Job Type</label>
            <select
              value={filterOptions.jobType}
              onChange={(e) =>
                setFilterOptions({ ...filterOptions, jobType: e.target.value })
              }
            >
              <option value="">All Job Types</option>
              {uniqueJobTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Location</label>
            <select
              value={filterOptions.location}
              onChange={(e) =>
                setFilterOptions({ ...filterOptions, location: e.target.value })
              }
            >
              <option value="">All Locations</option>
              {uniqueLocations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>

          <button
            className="clear-filters-button"
            onClick={() => {
              setFilterOptions({ jobType: "", location: "" });
              setSearchTerm("");
            }}
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Jobs Results Count */}
      <div className="results-count">
        <p>
          Showing {filteredJobs.length} of {jobPosts.length} jobs
        </p>
      </div>

      {/* Jobs List */}
      {filteredJobs.length === 0 ? (
        <div className="no-jobs-message">
          <p>No jobs match your search criteria</p>
          <button
            className="clear-search-button"
            onClick={() => {
              setFilterOptions({ jobType: "", location: "" });
              setSearchTerm("");
            }}
          >
            Clear Search
          </button>
        </div>
      ) : viewMode === "card" ? (
        <div className="jobs-grid">
          {filteredJobs.map((job) => (
            <div
              className={`job-card 
                ${appliedJobs.includes(job._id) ? "applied" : ""}
                ${selectedJob?._id === job._id ? "selected" : ""}
              `}
              key={job._id}
              onClick={() => handleSelectJob(job)}
            >
              {selectedJob?._id === job._id && (
                <div className="selected-indicator">
                  <FaCheck />
                </div>
              )}

              {appliedJobs.includes(job._id) && (
                <div className="applied-badge">
                  <FaCheckCircle /> Applied
                </div>
              )}

              <h3>{job.title}</h3>
              <div className="job-details">
                <p className="company">
                  <FaBuilding /> {job.companyName}
                </p>
                <p className="location">
                  <FaMapMarkerAlt /> {job.location}
                </p>
                <p className="jobType">
                  <FaMoneyBillWave /> {job.jobType || "Not specified"}
                </p>
                <p className="posted-by">
                  <FaUser /> Posted by: {job.postedBy?.name}
                </p>
                {job.createdAt && (
                  <p className="posted-date">
                    <FaClock /> Posted: {formatDate(job.createdAt)}
                  </p>
                )}
                <p className="description">{job.description}</p>
              </div>
              <div className="job-footer">
                {appliedJobs.includes(job._id) ? (
                  <span className="status applied">Applied</span>
                ) : (
                  <button className="select-job-button">
                    {selectedJob?._id === job._id ? "Selected" : "Select Job"}
                  </button>
                )}
                <button className="bookmark-button">
                  <FaBookmark />
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
                <th>Job Type</th>
                <th>Posted On</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.map((job) => (
                <tr
                  key={job._id}
                  className={`
                    ${appliedJobs.includes(job._id) ? "applied-row" : ""}
                    ${selectedJob?._id === job._id ? "selected-row" : ""}
                  `}
                  onClick={() => handleSelectJob(job)}
                >
                  <td className="job-title-cell">{job.title}</td>
                  <td>{job.companyName}</td>
                  <td>{job.location}</td>
                  <td>{job.jobType || "Not specified"}</td>
                  <td>{job.createdAt ? formatDate(job.createdAt) : "N/A"}</td>
                  <td>
                    {appliedJobs.includes(job._id) ? (
                      <span className="applied-badge-table">
                        <FaCheckCircle /> Applied
                      </span>
                    ) : selectedJob?._id === job._id ? (
                      <span className="selected-badge-table">Selected</span>
                    ) : (
                      <span className="clickable-badge">Select</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Application Form */}
      {selectedJob && !appliedJobs.includes(selectedJob._id) && (
        <form onSubmit={handleSubmit} className="application-form">
          <div className="form-header">
            <h3>Apply for Position</h3>
          </div>

          <div className="selected-job-info">
            <h4>{selectedJob.title}</h4>
            <div className="job-info-details">
              <p>
                <FaBuilding /> {selectedJob.companyName}
              </p>
              <p>
                <FaMapMarkerAlt /> {selectedJob.location}
              </p>
              <p>
                <FaMoneyBillWave /> {selectedJob.jobType || "Not specified"}
              </p>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="resume" className="file-label">
              <FaFileUpload /> Upload Resume (PDF or DOCX)
            </label>
            <input
              type="file"
              id="resume"
              accept=".pdf,.docx"
              onChange={handleResumeChange}
              required
            />
            <span className="file-name">No file chosen</span>
            <p className="file-instructions">
              Please upload your most recent resume (5MB max)
            </p>
          </div>

          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting || !resume}
          >
            {isSubmitting ? "Submitting..." : `Submit Application`}
          </button>

          <p className="form-disclaimer">
            By submitting this application, you agree to our terms and privacy
            policy.
          </p>
        </form>
      )}
    </div>
  );
};

export default ApplyForJobs;
