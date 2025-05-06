import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "../styles/LCRequestForm.css"; // Import the separate CSS file

const LCRequestForm = () => {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [existingRequest, setExistingRequest] = useState(null);

  useEffect(() => {
    const fetchExistingRequest = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/v1/lc/getLc", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setExistingRequest(response.data.lc);
      } catch (err) {
        if (err.response?.status !== 404) {
          console.error("Error fetching LC request:", err);
          toast.error("Failed to fetch existing LC request.");
        }
      }
    };

    fetchExistingRequest();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!reason.trim()) {
      return toast.error("Reason is required");
    }

    if (existingRequest?.isApproved) {
      return toast.error("Your LC request has already been approved.");
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "/api/v1/lc/apply",
        { reason },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(
        response.data.message || "LC Request Submitted Successfully!"
      );
      setReason("");
      // Refresh the existing request data
      const refreshResponse = await axios.get("/api/v1/lc/getLc", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setExistingRequest(refreshResponse.data.lc);
    } catch (err) {
      console.error("LC request error:", err);
      toast.error(err.response?.data?.message || "Submission Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `/api/v1/lc/download/${existingRequest._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Leaving_Certificate_${existingRequest._id}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading LC PDF:", error);
      toast.error("Download failed. Please try again.");
    }
  };

  return (
    <div className="lc-request-form-container">
      <h2 className="lc-title">Leaving Certificate Request</h2>

      {existingRequest ? (
        <div className="existing-request">
          <h3>Your LC/No Dues Request Details:</h3>
          <div className="request-details">
            {existingRequest.alumni?.profilePhoto && (
              <img
                src={existingRequest.alumni.profilePhoto}
                alt={`${existingRequest.alumni.name}'s profile`}
                className="profile-photo"
              />
            )}
            <div className="request-info">
              <p>
                <strong>Name:</strong> {existingRequest.alumni?.name || "N/A"}
              </p>
              <p>
                <strong>Email:</strong> {existingRequest.alumni?.email || "N/A"}
              </p>
              <p>
                <strong>Contact No:</strong>{" "}
                {existingRequest.alumni?.contactNo || "N/A"}
              </p>
              <p>
                <strong>Reason:</strong> {existingRequest.reason}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`status ${
                    existingRequest.isApproved ? "approved" : "pending"
                  }`}
                >
                  {existingRequest.isApproved ? "Approved" : "Pending"}
                </span>
              </p>
            </div>
          </div>

          {existingRequest.isApproved && existingRequest.lcPdfUrl && (
            <div className="download-section">
              <button onClick={handleDownloadPdf} className="download-btn">
                Download LC/No Dues PDF
              </button>
            </div>
          )}
        </div>
      ) : (
        <p className="no-request">No existing LC request found.</p>
      )}

      {!existingRequest && (
        <form onSubmit={handleSubmit} className="lc-form">
          <label htmlFor="reason">Reason for Request:</label>
          <textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter your reason here..."
            rows={4}
            required
          />
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? "Submitting..." : "Submit Request"}
          </button>
        </form>
      )}
    </div>
  );
};

export default LCRequestForm;
