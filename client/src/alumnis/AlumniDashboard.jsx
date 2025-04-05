import React from "react";

const AlumniDashboard = () => {
  return (
    <div style={{ padding: "2rem" }}>
      <div
        style={{
          backgroundColor: "#f8f9fa",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ color: "#2c3e50", marginBottom: "1rem" }}>
          👋 Welcome to Your Alumni Dashboard!
        </h2>
        <p style={{ fontSize: "16px", color: "#555" }}>
          From here, you can manage your profile, update your current status,
          and stay connected with fellow alumni.
        </p>
      </div>
    </div>
  );
};

export default AlumniDashboard;
