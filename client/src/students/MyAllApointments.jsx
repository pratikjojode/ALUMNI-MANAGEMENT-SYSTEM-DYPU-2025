import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/MyAllApointments.css"; // Assuming you have some CSS for styling
import { toast } from "react-hot-toast"; // Import toast from react-hot-toast

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>My Job Applications</h2>
      {applications.length === 0 ? (
        <p>No applications available.</p>
      ) : (
        <div className="applications-container">
          {applications.map((app) => (
            <div className="application-card" key={app._id}>
              <h3>{app.jobPostId.title}</h3>
              <p>
                <strong>Company:</strong> {app.jobPostId.companyName}
              </p>
              <p>
                <strong>Location:</strong> {app.jobPostId.location}
              </p>
              <p>
                <strong>Status:</strong> {app.status}
              </p>
              <p>
                <strong>Resume:</strong>
                <a href={app.resume} target="_blank" rel="noopener noreferrer">
                  View
                </a>
              </p>
              <p>
                <strong>Applied On:</strong>
                {new Date(app.applicationDate).toLocaleDateString()}
              </p>
              <button
                className="delete-button"
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
