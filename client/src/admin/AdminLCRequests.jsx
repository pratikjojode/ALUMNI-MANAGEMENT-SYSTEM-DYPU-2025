import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "../styles/AdminLCRequests.css";
import {
  FaFilePdf,
  FaCheck,
  FaTable,
  FaThLarge,
  FaDownload,
  FaSpinner, // Import the spinner icon
} from "react-icons/fa";

const AdminLCRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState(null); // State to track the ID being processed (approve, generate, or download)
  const [viewMode, setViewMode] = useState("table");
  const token = localStorage.getItem("token");

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/v1/lc/getAllLc", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRequests(res.data || []);
    } catch (error) {
      console.error("Error fetching LC requests:", error);
      toast.error("Failed to load LC Requests");
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const approveRequest = async (id) => {
    setProcessingId(id); // Set the ID as processing
    try {
      await axios.put(
        `/api/v1/lc/approve/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("LC Request Approved");
      fetchRequests();
    } catch (error) {
      console.error("Error approving LC request:", error);
      toast.error("Approval failed");
    } finally {
      setProcessingId(null); // Reset processing ID
    }
  };

  const generatePdf = async (id) => {
    setProcessingId(id); // Set the ID as processing
    try {
      await axios.post(
        `/api/v1/lc/generate-pdf/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("PDF Generated Successfully");
      fetchRequests();
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF");
    } finally {
      setProcessingId(null); // Reset processing ID
    }
  };

  const downloadLc = async (id) => {
    setProcessingId(id); // Set the ID as processing
    try {
      const response = await axios.get(`/api/v1/lc/download/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `Leaving_Certificate_${id}.pdf`;
      a.click();

      window.URL.revokeObjectURL(url);
      toast.success("Download started"); // Provide feedback that download initiated
    } catch (error) {
      console.error("Error downloading LC PDF:", error);
      toast.error("Download failed");
    } finally {
      setProcessingId(null); // Reset processing ID
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="admin-lc-requests">
      <h2>LC/No dues Requests</h2>

      <div className="view-toggle">
        <button
          className={viewMode === "table" ? "active" : ""}
          onClick={() => setViewMode("table")}
        >
          <FaTable /> Table View
        </button>
        <button
          className={viewMode === "card" ? "active" : ""}
          onClick={() => setViewMode("card")}
        >
          <FaThLarge /> Card View
        </button>
      </div>

      {loading ? (
        <p className="loading-message">Loading LC Requests...</p>
      ) : requests.length === 0 ? (
        <p className="empty-message">No LC Requests found</p>
      ) : viewMode === "table" ? (
        <table className="lc-table">
          <thead>
            <tr>
              <th>Alumni Name</th>
              <th>Email</th>
              <th>College</th>
              <th>Passout Year</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Actions</th>
              <th>Download</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req._id}>
                <td>{req.alumni?.name || "N/A"}</td>
                <td>{req.alumni?.email || "N/A"}</td>
                <td>{req.alumni?.college || "N/A"}</td>
                <td>{req.alumni?.passoutYear || "N/A"}</td>
                <td>{req.reason}</td>
                <td>
                  <span
                    className={`status-tag ${
                      req.isApproved ? "approved" : "pending"
                    }`}
                  >
                    {req.isApproved ? "Approved" : "Pending"}
                  </span>
                </td>
                <td>
                  {!req.isApproved ? (
                    <button
                      onClick={() => approveRequest(req._id)}
                      disabled={processingId === req._id}
                    >
                      {processingId === req._id ? (
                        <>
                          <FaSpinner className="spinner" /> Approving...
                        </>
                      ) : (
                        <>
                          <FaCheck /> Approve
                        </>
                      )}
                    </button>
                  ) : req.lcPdfUrl ? (
                    <a
                      href={req.lcPdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaFilePdf /> View PDF
                    </a>
                  ) : (
                    <button
                      onClick={() => generatePdf(req._id)}
                      disabled={processingId === req._id}
                    >
                      {processingId === req._id ? (
                        <>
                          <FaSpinner className="spinner" /> Generating...
                        </>
                      ) : (
                        <>
                          <FaFilePdf /> Generate PDF
                        </>
                      )}
                    </button>
                  )}
                </td>
                <td>
                  {req.isApproved && req.lcPdfUrl ? (
                    <button
                      onClick={() => downloadLc(req._id)}
                      disabled={processingId === req._id}
                    >
                      {processingId === req._id ? (
                        <>
                          <FaSpinner className="spinner" /> Downloading...
                        </>
                      ) : (
                        <FaDownload />
                      )}
                      Download
                    </button>
                  ) : (
                    <button disabled>
                      <FaDownload /> Download
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="lc-cards">
          {requests.map((req) => (
            <div className="lc-card" key={req._id}>
              <div className="card-row">
                <span className="card-label">Name:</span>
                <span className="card-value">{req.alumni?.name || "N/A"}</span>
              </div>
              <div className="card-row">
                <span className="card-label">Email:</span>
                <span className="card-value">{req.alumni?.email || "N/A"}</span>
              </div>
              <div className="card-row">
                <span className="card-label">College:</span>
                <span className="card-value">
                  {req.alumni?.college || "N/A"}
                </span>
              </div>
              <div className="card-row">
                <span className="card-label">Passout Year:</span>
                <span className="card-value">
                  {req.alumni?.passoutYear || "N/A"}
                </span>
              </div>
              <div className="card-row">
                <span className="card-label">Reason:</span>
                <span className="card-value">{req.reason}</span>
              </div>
              <div className="card-row">
                <span className="card-label">Status:</span>
                <span
                  className={`status-tag ${
                    req.isApproved ? "approved" : "pending"
                  }`}
                >
                  {req.isApproved ? "Approved" : "Pending"}
                </span>
              </div>
              <div className="card-actions">
                {!req.isApproved ? (
                  <button
                    onClick={() => approveRequest(req._id)}
                    disabled={processingId === req._id}
                  >
                    {processingId === req._id ? (
                      <>
                        <FaSpinner className="spinner" /> Approving...
                      </>
                    ) : (
                      <>
                        <FaCheck /> Approve
                      </>
                    )}
                  </button>
                ) : req.lcPdfUrl ? (
                  <a
                    href={req.lcPdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaFilePdf /> View PDF
                  </a>
                ) : (
                  <button
                    onClick={() => generatePdf(req._id)}
                    disabled={processingId === req._id}
                  >
                    {processingId === req._id ? (
                      <>
                        <FaSpinner className="spinner" /> Generating...
                      </>
                    ) : (
                      <>
                        <FaFilePdf /> Generate PDF
                      </>
                    )}
                  </button>
                )}
                <button
                  onClick={() => downloadLc(req._id)}
                  disabled={
                    processingId === req._id || !req.isApproved || !req.lcPdfUrl
                  }
                >
                  {processingId === req._id ? (
                    <>
                      <FaSpinner className="spinner" /> Downloading...
                    </>
                  ) : (
                    <FaDownload />
                  )}
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminLCRequests;
