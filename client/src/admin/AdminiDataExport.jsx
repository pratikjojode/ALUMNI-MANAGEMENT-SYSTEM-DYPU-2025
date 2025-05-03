import React, { useState, useEffect } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import "../styles/AdminDataExport.css";

const AdminDataExport = () => {
  const [loading, setLoading] = useState(false);
  const [exportStatus, setExportStatus] = useState(null);
  const [exportedFiles, setExportedFiles] = useState([]);
  const [selectedCollections, setSelectedCollections] = useState([]);
  const [showFileList, setShowFileList] = useState(false);

  const collections = [
    { id: "appointments", label: "Appointments" },
    { id: "chats", label: "Chats" },
    { id: "comments", label: "Comments" },
    { id: "discussions", label: "Discussions" },
    { id: "jobApplications", label: "Job Applications" },
    { id: "jobPosts", label: "Job Posts" },
    { id: "lcRequests", label: "LC Requests" },
    { id: "mentors", label: "Mentors" },
    { id: "mentorshipRequests", label: "Mentorship Requests" },
    { id: "notifications", label: "Notifications" },
    { id: "slots", label: "Slots" },
    { id: "students", label: "Students" },
    { id: "successStories", label: "Success Stories" },
    { id: "admins", label: "Admins" },
    { id: "alumni", label: "Alumni" },
  ];

  useEffect(() => {
    fetchExportedFiles();
  }, []);

  const fetchExportedFiles = async () => {
    try {
      const response = await axios.get("/api/v1/exports/export-files");
      setExportedFiles(response.data.files);
    } catch (error) {
      console.error("Error fetching exported files:", error);
    }
  };

  const toggleCollection = (collectionId) => {
    if (selectedCollections.includes(collectionId)) {
      setSelectedCollections(
        selectedCollections.filter((id) => id !== collectionId)
      );
    } else {
      setSelectedCollections([...selectedCollections, collectionId]);
    }
  };

  const selectAllCollections = () => {
    setSelectedCollections(collections.map((c) => c.id));
  };

  const unselectAllCollections = () => {
    setSelectedCollections([]);
  };

  const exportToExcel = async () => {
    setLoading(true);
    setExportStatus("Exporting data to Excel...");

    try {
      // Using collections parameter if some are selected
      const collectionsParam =
        selectedCollections.length > 0
          ? `?collections=${selectedCollections.join(",")}`
          : "";

      // Use axios with responseType blob for direct file download
      const response = await axios.get(
        `/api/v1/exports/export-excel${collectionsParam}`,
        {
          responseType: "blob",
        }
      );

      // Get the filename from Content-Disposition header or use default
      const contentDisposition = response.headers["content-disposition"];
      let filename = "export.xlsx";
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]*)"?/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }

      // Save the file using file-saver
      saveAs(new Blob([response.data]), filename);

      setExportStatus("Export completed successfully!");
      fetchExportedFiles(); // Refresh the file list
    } catch (error) {
      console.error("Error exporting data:", error);
      setExportStatus(`Export failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const deleteFile = async (fileName) => {
    if (window.confirm(`Are you sure you want to delete ${fileName}?`)) {
      try {
        await axios.delete(`/api/v1/exports/delete/${fileName}`);
        setExportedFiles(
          exportedFiles.filter((file) => file.fileName !== fileName)
        );
      } catch (error) {
        console.error("Error deleting file:", error);
      }
    }
  };

  const downloadFile = (fileName) => {
    window.location.href = `/api/v1/exports/download/${fileName}`;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="admin-data-export-container">
      <div className="export-header">
        <h1>Data Export Management</h1>
        <p>Export your application data to Excel format</p>
      </div>

      <div className="export-controls">
        <div className="collection-selection">
          <h2>Select Collections to Export</h2>
          <div className="selection-actions">
            <button className="select-all" onClick={selectAllCollections}>
              Select All
            </button>
            <button className="unselect-all" onClick={unselectAllCollections}>
              Unselect All
            </button>
          </div>

          <div className="collections-grid">
            {collections.map((collection) => (
              <div className="collection-item" key={collection.id}>
                <label className="collection-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedCollections.includes(collection.id)}
                    onChange={() => toggleCollection(collection.id)}
                  />
                  <span className="checkbox-custom"></span>
                  <span className="collection-name">{collection.label}</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="export-actions">
          <button
            className="export-button"
            onClick={exportToExcel}
            disabled={loading}
          >
            {loading ? (
              <span className="loading-spinner"></span>
            ) : (
              <>
                <span className="icon-export"></span>
                Export to Excel
              </>
            )}
          </button>

          {exportStatus && (
            <div
              className={`export-status ${
                exportStatus.includes("failed")
                  ? "error"
                  : exportStatus.includes("completed")
                  ? "success"
                  : ""
              }`}
            >
              {exportStatus}
            </div>
          )}
        </div>
      </div>

      <div className="export-history">
        <div className="history-header">
          <h2>Export History</h2>
          <button
            className="toggle-list-button"
            onClick={() => setShowFileList(!showFileList)}
          >
            {showFileList ? "Hide Files" : "Show Files"}
          </button>
        </div>

        {showFileList && (
          <div className="file-list">
            {exportedFiles.length === 0 ? (
              <p className="no-files">No exported files found</p>
            ) : (
              <table className="files-table">
                <thead>
                  <tr>
                    <th>File Name</th>
                    <th>Size</th>
                    <th>Date Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {exportedFiles.map((file) => (
                    <tr key={file.fileName}>
                      <td className="file-name">{file.fileName}</td>
                      <td className="file-size">{formatFileSize(file.size)}</td>
                      <td className="file-date">
                        {formatDate(file.createdAt)}
                      </td>
                      <td className="file-actions">
                        <button
                          className="download-button"
                          onClick={() => downloadFile(file.fileName)}
                        >
                          <span className="icon-download"></span>
                          Download
                        </button>
                        <button
                          className="delete-button"
                          onClick={() => deleteFile(file.fileName)}
                        >
                          <span className="icon-delete"></span>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDataExport;
