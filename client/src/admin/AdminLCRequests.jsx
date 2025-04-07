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
} from "react-icons/fa";

const AdminLCRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("table");
  const token = localStorage.getItem("token");

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/v1/lc/getAllLc", {
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
    try {
      await axios.put(
        `http://localhost:5000/api/v1/lc/approve/${id}`,
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
    }
  };

  const generatePdf = async (id) => {
    try {
      await axios.post(
        `http://localhost:5000/api/v1/lc/generate-pdf/${id}`,
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
    }
  };

  const downloadLc = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/v1/lc/download/${id}`,
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
      a.download = `Leaving_Certificate_${id}.pdf`;
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading LC PDF:", error);
      toast.error("Download failed");
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
                      className="btn approve"
                      onClick={() => approveRequest(req._id)}
                    >
                      <FaCheck /> Approve
                    </button>
                  ) : req.lcPdfUrl ? (
                    <>
                      <a
                        href={req.lcPdfUrl}
                        className="btn view"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaFilePdf /> View PDF
                      </a>
                      <button
                        className="btn download"
                        onClick={() => downloadLc(req._id)}
                      >
                        <FaDownload /> Download
                      </button>
                    </>
                  ) : (
                    <button
                      className="btn download"
                      onClick={() => generatePdf(req._id)}
                    >
                      <FaFilePdf /> Generate PDF
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
                    className="btn approve"
                    onClick={() => approveRequest(req._id)}
                  >
                    <FaCheck /> Approve
                  </button>
                ) : req.lcPdfUrl ? (
                  <>
                    <a
                      href={req.lcPdfUrl}
                      className="btn view"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaFilePdf /> View PDF
                    </a>
                    <button
                      className="btn download"
                      onClick={() => downloadLc(req._id)}
                    >
                      <FaDownload /> Download
                    </button>
                  </>
                ) : (
                  <button
                    className="btn download"
                    onClick={() => generatePdf(req._id)}
                  >
                    <FaFilePdf /> Generate PDF
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminLCRequests;
