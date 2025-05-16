import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import defaultProfilePhoto from "../assets/profile.png"; // Importing default photo
import "../styles/all-alumni.css";

// Memoized AlumniCard component for Card and Grid views
const AlumniCard = React.memo(({ alum, renderSocialLinks }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  return (
    <div className="alumni-card">
      <div className="photo-container">
        <img
          src={imageError ? defaultProfilePhoto : alum.profilePhoto}
          alt={alum.name}
          className="alumni-photo"
          onError={handleImageError}
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
  );
});

// Memoized AlumniRow component for Table view
const AlumniRow = React.memo(({ alum, renderSocialLinks }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  return (
    <tr>
      <td>
        <img
          src={imageError ? defaultProfilePhoto : alum.profilePhoto}
          alt={alum.name}
          className="table-photo"
          onError={handleImageError}
        />
      </td>
      <td>{alum.name}</td>
      <td>{alum.passoutYear}</td>
      <td>{alum.currentCompany || "-"}</td>
      <td>{alum.designation || "-"}</td>
      <td>{alum.location || "-"}</td>
      <td className="table-links">{renderSocialLinks(alum)}</td>
    </tr>
  );
});

// Main AllAlumni Component
const AllAlumni = () => {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState("card");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterCompany, setFilterCompany] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterLocation, setFilterLocation] = useState("");

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

  const filteredAlumni = useMemo(() => {
    return alumni.filter((alum) => {
      const matchesSearch =
        alum.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alum.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alum.currentCompany.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesYear =
        filterYear === "" || alum.passoutYear.toString() === filterYear;
      const matchesCompany =
        filterCompany === "" ||
        alum.currentCompany
          ?.toLowerCase()
          .includes(filterCompany.toLowerCase());
      const matchesLocation =
        filterLocation === "" ||
        alum.location?.toLowerCase().includes(filterLocation.toLowerCase());
      const matchesRole =
        filterRole === "" ||
        alum.designation?.toLowerCase().includes(filterRole.toLowerCase());
      return (
        matchesSearch &&
        matchesYear &&
        matchesCompany &&
        matchesLocation &&
        matchesRole
      );
    });
  }, [
    alumni,
    searchTerm,
    filterYear,
    filterCompany,
    filterLocation,
    filterRole,
  ]);

  const renderSocialLinks = useCallback(
    (alum) => (
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
    ),
    []
  );

  const handleViewChange = useCallback((newView) => {
    setView(newView);
    localStorage.setItem("alumniViewPreference", newView);
  }, []);

  const renderCardView = () => (
    <div className="alumni-cards-container">
      {filteredAlumni.map((alum) => (
        <AlumniCard
          key={alum._id}
          alum={alum}
          renderSocialLinks={renderSocialLinks}
        />
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
            <AlumniRow
              key={alum._id}
              alum={alum}
              renderSocialLinks={renderSocialLinks}
            />
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderGridView = () => (
    <div className="alumni-grid-container">
      {filteredAlumni.map((alum) => (
        <AlumniCard
          key={alum._id}
          alum={alum}
          renderSocialLinks={renderSocialLinks}
        />
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
          <div className="dropdown-filter">
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="filter-select"
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
            <select
              value={filterCompany}
              onChange={(e) => setFilterCompany(e.target.value)}
              className="filter-select"
            >
              <option value="">All Companies</option>
              {[...new Set(alumni.map((a) => a.currentCompany))]
                .filter((company) => company)
                .sort()
                .map((company) => (
                  <option key={company} value={company}>
                    {company}
                  </option>
                ))}
            </select>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="filter-select"
            >
              <option value="">All Roles</option>
              {[...new Set(alumni.map((a) => a.designation))]
                .filter((role) => role)
                .sort()
                .map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
            </select>
            <select
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="filter-select"
            >
              <option value="">All Locations</option>
              {[...new Set(alumni.map((a) => a.location))]
                .filter((location) => location)
                .sort()
                .map((location) => (
                  <option key={location} value={location}>
                    {location}
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
