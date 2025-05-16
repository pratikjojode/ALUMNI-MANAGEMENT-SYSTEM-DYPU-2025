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
  FaSpinner,
} from "react-icons/fa";

const AdminLCRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState(null);
  const [viewMode, setViewMode] = useState("table");
  const [filters, setFilters] = useState({ status: "All", college: "All" });
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
      setFilteredRequests(res.data || []); // Initialize filtered requests
    } catch (error) {
      console.error("Error fetching LC requests:", error);
      toast.error("Failed to load LC Requests");
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let updatedRequests = [...requests];

    if (filters.status !== "All") {
      updatedRequests = updatedRequests.filter(
        (req) =>
          (filters.status === "Approved" && req.isApproved) ||
          (filters.status === "Pending" && !req.isApproved)
      );
    }

    if (filters.college !== "All") {
      updatedRequests = updatedRequests.filter(
        (req) => req.alumni?.college === filters.college
      );
    }

    setFilteredRequests(updatedRequests);
  };

  useEffect(() => {
    applyFilters();
  }, [filters, requests]);

  const handleFilterChange = (key, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
  };

  const approveRequest = async (id) => {
    setProcessingId(id);
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
      setProcessingId(null);
    }
  };

  const generatePdf = async (id) => {
    setProcessingId(id);
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
      setProcessingId(null);
    }
  };

  const downloadLc = async (id) => {
    setProcessingId(id);
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
      toast.success("Download started");
    } catch (error) {
      console.error("Error downloading LC PDF:", error);
      toast.error("Download failed");
    } finally {
      setProcessingId(null);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const uniqueColleges = [
    "All",
    ...new Set(requests.map((req) => req.alumni?.college).filter(Boolean)),
  ];

  return (
    <div className="alc-container">
      <h2 className="alc-title">LC/No Dues Requests</h2>

      {/* Filters Section */}
      <div className="alc-filters">
        <div className="alc-filter-group">
          <label htmlFor="status">Filter by Status:</label>
          <select
            id="status"
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
          >
            <option value="All">All</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
        <div className="alc-filter-group">
          <label htmlFor="college">Filter by College:</label>
          <select
            id="college"
            value={filters.college}
            onChange={(e) => handleFilterChange("college", e.target.value)}
          >
            {uniqueColleges.map((college) => (
              <option key={college} value={college}>
                {college}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="alc-view-toggle">
        <button
          className={`alc-toggle-btn ${
            viewMode === "table" ? "alc-active" : ""
          }`}
          onClick={() => setViewMode("table")}
        >
          <FaTable /> Table View
        </button>
        <button
          className={`alc-toggle-btn ${
            viewMode === "card" ? "alc-active" : ""
          }`}
          onClick={() => setViewMode("card")}
        >
          <FaThLarge /> Card View
        </button>
      </div>

      {loading ? (
        <p className="alc-loading">Loading LC Requests...</p>
      ) : filteredRequests.length === 0 ? (
        <p className="alc-empty">No LC Requests found</p>
      ) : viewMode === "table" ? (
        <table className="alc-table">
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
            {filteredRequests.map((req) => (
              <tr key={req._id} className="alc-row">
                <td>{req.alumni?.name || "N/A"}</td>
                <td>{req.alumni?.email || "N/A"}</td>
                <td>{req.alumni?.college || "N/A"}</td>
                <td>{req.alumni?.passoutYear || "N/A"}</td>
                <td>{req.reason}</td>
                <td>
                  <span
                    className={`alc-status ${
                      req.isApproved ? "alc-approved" : "alc-pending"
                    }`}
                  >
                    {req.isApproved ? "Approved" : "Pending"}
                  </span>
                </td>
                <td className="alc-actions">
                  {!req.isApproved ? (
                    <button
                      onClick={() => approveRequest(req._id)}
                      className="alc-btn alc-approve-btn"
                      disabled={processingId === req._id}
                    >
                      {processingId === req._id ? (
                        <>
                          <FaSpinner className="alc-spinner" /> Approving...
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
                      className="alc-btn alc-view-btn"
                    >
                      <FaFilePdf /> View PDF
                    </a>
                  ) : (
                    <button
                      onClick={() => generatePdf(req._id)}
                      className="alc-btn alc-generate-btn"
                      disabled={processingId === req._id}
                    >
                      {processingId === req._id ? (
                        <>
                          <FaSpinner className="alc-spinner" /> Generating...
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
                  <button
                    onClick={() => downloadLc(req._id)}
                    className="alc-btn alc-download-btn"
                    disabled={
                      processingId === req._id ||
                      !req.isApproved ||
                      !req.lcPdfUrl
                    }
                  >
                    {processingId === req._id ? (
                      <>
                        <FaSpinner className="alc-spinner" /> Downloading...
                      </>
                    ) : (
                      <>
                        <FaDownload /> Download
                      </>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="alc-cards-grid">
          {filteredRequests.map((req) => (
            <div className="alc-card" key={req._id}>
              <div className="alc-card-header">
                <h3>{req.alumni?.name || "N/A"}</h3>
                <span
                  className={`alc-status ${
                    req.isApproved ? "alc-approved" : "alc-pending"
                  }`}
                >
                  {req.isApproved ? "Approved" : "Pending"}
                </span>
              </div>
              <div className="alc-card-body">
                <div className="alc-card-row">
                  <span className="alc-label">Email:</span>
                  <span className="alc-value">
                    {req.alumni?.email || "N/A"}
                  </span>
                </div>
                <div className="alc-card-row">
                  <span className="alc-label">College:</span>
                  <span className="alc-value">
                    {req.alumni?.college || "N/A"}
                  </span>
                </div>
                <div className="alc-card-row">
                  <span className="alc-label">Passout Year:</span>
                  <span className="alc-value">
                    {req.alumni?.passoutYear || "N/A"}
                  </span>
                </div>
                <div className="alc-card-row">
                  <span className="alc-label">Reason:</span>
                  <span className="alc-value">{req.reason}</span>
                </div>
              </div>
              <div className="alc-card-actions">
                {!req.isApproved ? (
                  <button
                    onClick={() => approveRequest(req._id)}
                    className="alc-btn alc-approve-btn"
                    disabled={processingId === req._id}
                  >
                    {processingId === req._id ? (
                      <>
                        <FaSpinner className="alc-spinner" /> Approving...
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
                    className="alc-btn alc-view-btn"
                  >
                    <FaFilePdf /> View PDF
                  </a>
                ) : (
                  <button
                    onClick={() => generatePdf(req._id)}
                    className="alc-btn alc-generate-btn"
                    disabled={processingId === req._id}
                  >
                    {processingId === req._id ? (
                      <>
                        <FaSpinner className="alc-spinner" /> Generating...
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
                  className="alc-btn alc-download-btn"
                  disabled={
                    processingId === req._id || !req.isApproved || !req.lcPdfUrl
                  }
                >
                  {processingId === req._id ? (
                    <>
                      <FaSpinner className="alc-spinner" /> Downloading...
                    </>
                  ) : (
                    <>
                      <FaDownload /> Download
                    </>
                  )}
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
