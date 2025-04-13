import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/all-alumni.css";

const AllAlumni = () => {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState("card");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterYear, setFilterYear] = useState("");

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const response = await axios.get("/api/v1/alumni/all");
        setAlumni(response.data.alumni);
      } catch (err) {
        console.error("Failed to fetch alumni", err);
        setError("Failed to load alumni data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAlumni();
  }, []);

  const filteredAlumni = alumni.filter((alum) => {
    const matchesSearch =
      alum.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alum.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alum.currentCompany.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear =
      filterYear === "" || alum.passoutYear.toString() === filterYear;
    return matchesSearch && matchesYear;
  });

  const handleViewChange = (newView) => {
    setView(newView);
    // Save preference to localStorage
    localStorage.setItem("alumniViewPreference", newView);
  };

  const renderSocialLinks = (alum) => (
    <div className="social-links">
      {alum.LinkedIn && (
        <a
          href={alum.LinkedIn}
          target="_blank"
          rel="noopener noreferrer"
          className="social-link linkedin"
          aria-label={`${alum.name}'s LinkedIn`}
        >
          <i className="fab fa-linkedin"></i> LinkedIn
        </a>
      )}
      {alum.Instagram && (
        <a
          href={alum.Instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="social-link instagram"
          aria-label={`${alum.name}'s Instagram`}
        >
          <i className="fab fa-instagram"></i> Instagram
        </a>
      )}
    </div>
  );

  const renderCardView = () => (
    <div className="alumni-cards-container">
      {filteredAlumni.map((alum) => (
        <div className="alumni-card" key={alum._id}>
          <div className="photo-container">
            <img
              src={alum.profilePhoto || "/default-profile.png"}
              alt={alum.name}
              className="alumni-photo"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/default-profile.png";
              }}
            />
          </div>
          <div className="alumni-info">
            <h3>{alum.name}</h3>
            <div className="alumni-details">
              <p>
                <span className="detail-label">Batch:</span> {alum.passoutYear}
              </p>
              <p>
                <span className="detail-label">Company:</span>{" "}
                {alum.currentCompany || "Not specified"}
              </p>
              <p>
                <span className="detail-label">Role:</span>{" "}
                {alum.designation || "Not specified"}
              </p>
              <p>
                <span className="detail-label">Location:</span>{" "}
                {alum.location || "Not specified"}
              </p>
            </div>
            {renderSocialLinks(alum)}
          </div>
        </div>
      ))}
    </div>
  );

  const renderTableView = () => (
    <div className="table-responsive">
      <table className="alumni-table">
        <thead>
          <tr>
            <th>Photo</th>
            <th>Name</th>
            <th>Batch</th>
            <th>Company</th>
            <th>Role</th>
            <th>Location</th>
            <th>Links</th>
          </tr>
        </thead>
        <tbody>
          {filteredAlumni.map((alum) => (
            <tr key={alum._id}>
              <td>
                <img
                  src={alum.profilePhoto || "/default-profile.png"}
                  alt={alum.name}
                  className="table-photo"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/default-profile.png";
                  }}
                />
              </td>
              <td>{alum.name}</td>
              <td>{alum.passoutYear}</td>
              <td>{alum.currentCompany || "-"}</td>
              <td>{alum.designation || "-"}</td>
              <td>{alum.location || "-"}</td>
              <td className="table-links">{renderSocialLinks(alum)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderGridView = () => (
    <div className="alumni-grid-container">
      {filteredAlumni.map((alum) => (
        <div className="alumni-grid-item" key={alum._id}>
          <div className="grid-photo-container">
            <img
              src={alum.profilePhoto || "/default-profile.png"}
              alt={alum.name}
              className="grid-photo"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/default-profile.png";
              }}
            />
          </div>
          <div className="grid-info">
            <h3>{alum.name}</h3>
            <p>
              <strong>Batch:</strong> {alum.passoutYear}
            </p>
            <p>
              <strong>Company:</strong> {alum.currentCompany || "Not specified"}
            </p>
            {renderSocialLinks(alum)}
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading alumni data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button
          className="retry-button"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="all-alumni-container">
      <div className="form-header">
        <h2>Alumni Network</h2>
        <p className="subtitle">Connect with our accomplished graduates</p>
      </div>

      <div className="controls-section">
        <div className="search-filter-container">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by name, company or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <i className="fas fa-search search-icon"></i>
          </div>
          <div className="year-filter">
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="year-select"
            >
              <option value="">All Years</option>
              {[...new Set(alumni.map((a) => a.passoutYear))]
                .sort((a, b) => b - a)
                .map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div className="view-toggle-buttons">
          <button
            onClick={() => handleViewChange("card")}
            className={view === "card" ? "active" : ""}
            aria-label="Card view"
          >
            <i className="fas fa-id-card"></i> Card
          </button>
          <button
            onClick={() => handleViewChange("table")}
            className={view === "table" ? "active" : ""}
            aria-label="Table view"
          >
            <i className="fas fa-table"></i> Table
          </button>
          <button
            onClick={() => handleViewChange("grid")}
            className={view === "grid" ? "active" : ""}
            aria-label="Grid view"
          >
            <i className="fas fa-th"></i> Grid
          </button>
        </div>
      </div>

      {filteredAlumni.length === 0 ? (
        <div className="no-results">
          <i className="fas fa-user-graduate"></i>
          <p>No alumni match your search criteria</p>
        </div>
      ) : (
        <>
          <div className="results-info">
            <p>
              Showing {filteredAlumni.length} of {alumni.length} alumni
            </p>
          </div>
          {view === "card" && renderCardView()}
          {view === "table" && renderTableView()}
          {view === "grid" && renderGridView()}
        </>
      )}
    </div>
  );
};

export default AllAlumni;
