import React, { useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import "../styles/AlumniUpload.css";

const AlumniUpload = () => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // To handle upload errors

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadStatus(null); // Reset status when a new file is selected
    setError(null); // Reset error when a new file is selected
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select an Excel file to upload.");
      return;
    }

    setLoading(true);
    setUploadStatus(null);
    setError(null);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const binaryString = e.target.result;
      const wb = XLSX.read(binaryString, { type: "binary" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

      const alumniData = data.slice(1).map((row) => ({
        name: row[0],
        email: row[1],
        contactNo: row[2],
        college: row[3],
        branch: row[4],
        passoutYear: row[5],
        currentCompany: row[6],
        designation: row[7],
        location: row[8],
        LinkedIn: row[9],
        Instagram: row[10],
        academicResult: row[11],
        password: "Test@123", // Default password for all entries
      }));

      try {
        const response = await axios.post("/api/v1/admin/upload-alumni", {
          alumniData,
        });

        setUploadStatus(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error uploading file:", error);
        setLoading(false);
        setError(
          "There was an issue uploading the alumni data. Please try again."
        );
      }
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div className="upload-container">
      <h2>Upload Alumni Data</h2>
      <p className="instructions">
        Select an Excel file (.xlsx or .xls) to upload alumni data. Ensure the
        file follows the required format.
      </p>

      <div className="file-input-container">
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          className="file-input"
        />
      </div>

      <button
        onClick={handleUpload}
        disabled={loading}
        className={`upload-button ${loading ? "disabled" : ""}`}
      >
        {loading ? "Uploading..." : "Upload Alumni Data"}
      </button>

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {uploadStatus && (
        <div className="upload-status">
          <p className="status-message">{uploadStatus.message}</p>
          {uploadStatus.totalInserted > 0 && (
            <p className="success-message">
              {uploadStatus.totalInserted} alumni were successfully registered.
            </p>
          )}
          {uploadStatus.totalSkipped > 0 && (
            <p className="warning-message">
              {uploadStatus.totalSkipped} alumni were skipped due to existing
              email addresses.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default AlumniUpload;
