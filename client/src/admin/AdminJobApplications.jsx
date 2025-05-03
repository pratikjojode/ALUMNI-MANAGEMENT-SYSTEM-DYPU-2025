import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/AdminJobApplication.css";
import toast from "react-hot-toast";

const AdminJobApplications = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState("table");
  const [statusOptions] = useState(["pending", "accepted", "rejected"]);
  const [selectedStatus, setSelectedStatus] = useState({});
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const fetchAppliedJobs = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "/api/v1/job-applications/getAppliedJobs",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );
      setAppliedJobs(response.data.data || []);

      const statusObj = {};
      response.data.data.forEach((job) => {
        statusObj[job._id] = job.status;
      });
      setSelectedStatus(statusObj);
      toast.success("Job application fecthed succesfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch applied jobs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppliedJobs();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleChangeStatus = async (jobId) => {
    try {
      await axios.patch(
        `/api/v1/job-applications/${jobId}`,
        { status: selectedStatus[jobId] },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );

      setAppliedJobs((prevJobs) =>
        prevJobs.map((job) =>
          job._id === jobId ? { ...job, status: selectedStatus[jobId] } : job
        )
      );

      toast.success("Status updated successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status.");
    }
  };

  const handleDeleteApplication = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this application?"))
      return;

    try {
      await axios.delete(`/api/v1/job-applications/${jobId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      });

      setAppliedJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));

      if (selectedApplication && selectedApplication._id === jobId) {
        setShowDetailsModal(false);
        setSelectedApplication(null);
      }

      toast.success("Application deleted successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete application.");
    }
  };

  const handleStatusChange = (jobId, status) => {
    setSelectedStatus((prev) => ({ ...prev, [jobId]: status }));
  };

  const handleViewDetails = (job) => {
    setSelectedApplication(job);
    setShowDetailsModal(true);
  };

  const renderDetailsModal = () => {
    if (!selectedApplication) return null;

    return (
      <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Application Details</h3>
            <button
              className="close-btn"
              onClick={() => setShowDetailsModal(false)}
            >
              ×
            </button>
          </div>

          <div className="modal-body">
            <div className="detail-section">
              <h4>Application Information</h4>
              <p>
                <strong>Application ID:</strong> {selectedApplication._id}
              </p>
              <p>
                <strong>Status:</strong>
                <select
                  value={selectedStatus[selectedApplication._id]}
                  onChange={(e) =>
                    handleStatusChange(selectedApplication._id, e.target.value)
                  }
                  className={`status-select ${
                    selectedStatus[selectedApplication._id]
                  }`}
                >
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </option>
                  ))}
                </select>
              </p>
              <p>
                <strong>Applied On:</strong>{" "}
                {formatDate(selectedApplication.applicationDate)}
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {new Date(selectedApplication.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Updated At:</strong>{" "}
                {new Date(selectedApplication.updatedAt).toLocaleString()}
              </p>
            </div>

            <div className="detail-section">
              <h4>Job Information</h4>
              <p>
                <strong>Job ID:</strong>{" "}
                {selectedApplication.jobPostId?._id || "N/A"}
              </p>
              <p>
                <strong>Title:</strong>{" "}
                {selectedApplication.jobPostId?.title || "N/A"}
              </p>
              <p>
                <strong>Company:</strong>{" "}
                {selectedApplication.jobPostId?.companyName || "N/A"}
              </p>
              <p>
                <strong>Location:</strong>{" "}
                {selectedApplication.jobPostId?.location || "N/A"}
              </p>
              <p>
                <strong>Posted By (ID):</strong>{" "}
                {selectedApplication.jobPostId?.postedBy || "N/A"}
              </p>
            </div>

            <div className="detail-section">
              <h4>Applicant Information</h4>
              <p>
                <strong>Student ID:</strong>{" "}
                {selectedApplication.studentId?._id || "N/A"}
              </p>
              <p>
                <strong>Name:</strong>{" "}
                {selectedApplication.studentId?.name || "N/A"}
              </p>
              <p>
                <strong>Email:</strong>{" "}
                {selectedApplication.studentId?.email || "N/A"}
              </p>
            </div>

            <div className="detail-section">
              <h4>Resume</h4>
              <a
                href={selectedApplication.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="resume-button"
              >
                View Resume
              </a>
              <p className="resume-url">
                <strong>URL:</strong> {selectedApplication.resume}
              </p>
            </div>

            <div className="detail-section">
              <h4>Other Information</h4>
              <p>
                <strong>Version:</strong> {selectedApplication.__v}
              </p>
            </div>
          </div>

          <div className="modal-footer">
            <button
              onClick={() => handleChangeStatus(selectedApplication._id)}
              className="btn-change-status"
            >
              Update Status
            </button>
            <button
              onClick={() => handleDeleteApplication(selectedApplication._id)}
              className="btn-delete"
            >
              Delete Application
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderTableView = () => (
    <div className="table-container">
      <table className="applied-jobs-table">
        <thead>
          <tr>
            <th>App ID</th>
            <th>Job Title</th>
            <th>Company</th>
            <th>Posted By</th>
            <th>Applicant</th>
            <th>Status</th>
            <th>Applied On</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {appliedJobs.length > 0 ? (
            appliedJobs.map((job) => (
              <tr key={job._id}>
                <td>{job._id.substring(job._id.length - 8)}</td>
                <td>{job.jobPostId?.title || "N/A"}</td>
                <td>{job.jobPostId?.companyName || "N/A"}</td>
                <td>{job.jobPostId?.postedBy?.substring(0, 8) || "N/A"}</td>
                <td>{job.studentId?.name || "N/A"}</td>
                <td>
                  <span className={`status-badge ${selectedStatus[job._id]}`}>
                    {selectedStatus[job._id]}
                  </span>
                </td>
                <td>{formatDate(job.applicationDate)}</td>
                <td>
                  <button
                    onClick={() => handleViewDetails(job)}
                    className="btn-view"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleDeleteApplication(job._id)}
                    className="btn-delete"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">No job applications found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const renderGridView = () => (
    <div className="grid-container">
      {appliedJobs.length > 0 ? (
        appliedJobs.map((job) => (
          <div key={job._id} className="job-card">
            <div className="job-header">
              <h3>{job.jobPostId?.title || "N/A"}</h3>
              <div className="status-selector">
                <select
                  value={selectedStatus[job._id]}
                  onChange={(e) => handleStatusChange(job._id, e.target.value)}
                  className={`status-select ${selectedStatus[job._id]}`}
                >
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="job-company">
              <strong>{job.jobPostId?.companyName || "N/A"}</strong>
              <span> • {job.jobPostId?.location || "N/A"}</span>
            </div>
            <div className="job-applicant">
              <p>
                <strong>Applicant:</strong> {job.studentId?.name || "N/A"}
              </p>
              <p>
                <strong>Posted By:</strong> {job.jobPostId?.postedBy || "N/A"}
              </p>
              <p>
                <strong>App ID:</strong> {job._id}
              </p>
            </div>
            <div className="job-footer">
              <span className="application-date">
                Applied on {formatDate(job.applicationDate)}
              </span>
              <button
                onClick={() => handleViewDetails(job)}
                className="btn-view"
              >
                View Details
              </button>
            </div>
            <div className="job-actions">
              <button
                onClick={() => handleChangeStatus(job._id)}
                className="btn-change-status"
              >
                Update Status
              </button>
              <button
                onClick={() => handleDeleteApplication(job._id)}
                className="btn-delete"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>No job applications found.</p>
      )}
    </div>
  );

  return (
    <div className="applied-jobs-container">
      <div className="page-header">
        <h2>Applied Jobs</h2>
        <div className="view-toggle">
          <button
            className={`toggle-btn ${viewMode === "table" ? "active" : ""}`}
            onClick={() => setViewMode("table")}
          >
            Table View
          </button>
          <button
            className={`toggle-btn ${viewMode === "grid" ? "active" : ""}`}
            onClick={() => setViewMode("grid")}
          >
            Grid View
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loader"></div>
          <p>Loading job applications...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button className="retry-btn" onClick={fetchAppliedJobs}>
            Try Again
          </button>
        </div>
      ) : appliedJobs.length === 0 ? (
        <div className="no-data-container">
          <p>No job applications found.</p>
        </div>
      ) : viewMode === "table" ? (
        renderTableView()
      ) : (
        renderGridView()
      )}

      {showDetailsModal && renderDetailsModal()}
    </div>
  );
};

export default AdminJobApplications;
