import React, { useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import "../styles/AlumniUpload.css";
const AlumniUpload = () => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select an Excel file.");
      return;
    }

    setLoading(true);
    setUploadStatus(null);

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
        password: "Test@123",
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
        setUploadStatus({
          message: "Error uploading alumni data",
        });
      }
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div className="upload-container">
      <h2>Upload Alumni Data</h2>
      <input type="file" accept=".xlsx,.xls" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload Alumni Data"}
      </button>

      {uploadStatus && (
        <div className="upload-status">
          <p>{uploadStatus.message}</p>
          {uploadStatus.totalInserted > 0 && (
            <p>
              {uploadStatus.totalInserted} alumni were successfully registered.
            </p>
          )}
          {uploadStatus.totalSkipped > 0 && (
            <p>
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
