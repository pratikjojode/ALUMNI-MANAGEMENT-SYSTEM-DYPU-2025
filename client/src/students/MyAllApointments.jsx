import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/MyAllApointments.css";
import { toast } from "react-hot-toast";

const MyAllApointments = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const studentId = user?.id;

  useEffect(() => {
    const fetchApplications = async () => {
      if (!studentId || !token) {
        setError("Unauthorized: Missing credentials.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          `/api/v1/job-applications/getApplicationsByStudent/${studentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (res.data.data.length === 0) {
          setError("No applications found.");
        } else {
          setApplications(res.data.data);
        }
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Something went wrong");
        setLoading(false);
      }
    };

    fetchApplications();
  }, [studentId, token]);

  const handleDeleteApplication = async (applicationId) => {
    if (!studentId || !token) {
      setError("Unauthorized: Missing credentials.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to cancel this application?"
    );

    if (confirmDelete) {
      try {
        const res = await axios.delete(
          `/api/v1/job-applications/${applicationId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.status === 200) {
          setApplications(
            applications.filter((app) => app._id !== applicationId)
          );
          toast.success("Application canceled successfully.");
        }
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to cancel application."
        );
        toast.error("Error occurred while canceling the application.");
      }
    }
  };

  if (loading) return <p className="my-applications-loading">Loading...</p>;
  if (error) return <p className="my-applications-error">{error}</p>;

  return (
    <div className="my-applications-wrapper">
      <h2 className="my-applications-heading">My Job Applications</h2>
      {applications.length === 0 ? (
        <p className="my-applications-no-data">No applications available.</p>
      ) : (
        <div className="my-applications-container">
          {applications.map((app) => (
            <div className="my-application-card" key={app._id}>
              <h3 className="my-application-title">{app.jobPostId.title}</h3>
              <p className="my-application-info">
                <strong>Company:</strong> {app.jobPostId.companyName}
              </p>
              <p className="my-application-info">
                <strong>Location:</strong> {app.jobPostId.location}
              </p>
              <p className="my-application-info">
                <strong>Status:</strong> {app.status}
              </p>
              {app.status === "Accepted" && (
                <p className="my-application-accepted-message">
                  Congratulations! Your application has been accepted. You will
                  receive further communication via email.
                </p>
              )}
              <p className="my-application-info">
                <strong>Resume:</strong>{" "}
                <a
                  href={app.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="my-application-resume-link"
                >
                  View
                </a>
              </p>
              <p className="my-application-info">
                <strong>Applied On:</strong>{" "}
                {new Date(app.applicationDate).toLocaleDateString()}
              </p>
              <button
                className="my-application-cancel-btn"
                onClick={() => handleDeleteApplication(app._id)}
              >
                Cancel Application
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAllApointments;
