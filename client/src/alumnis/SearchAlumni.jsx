import React, { useState } from "react";
import axios from "axios";
import "../styles/SearchAlumni.css";

const SearchAlumni = () => {
  const [filters, setFilters] = useState({
    name: "",
    passoutYear: "",
    designation: "",
    location: "",
  });

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState("grid");
  const [expandedAlumniId, setExpandedAlumniId] = useState(null);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/v1/alumni/search", {
        params: filters,
      });
      setResults(response.data.alumni);
      setExpandedAlumniId(null); // Reset expanded state on new search
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleCardView = (id) => {
    setExpandedAlumniId(expandedAlumniId === id ? null : id);
  };

  return (
    <div className="search-alumni-container">
      <h2 className="search-title">🔍 Find Your Alumni</h2>
      <div className="search-form">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={filters.name}
          onChange={handleChange}
          className="search-input"
        />
        <input
          type="text"
          name="passoutYear"
          placeholder="Passout Year"
          value={filters.passoutYear}
          onChange={handleChange}
          className="search-input"
        />
        <input
          type="text"
          name="designation"
          placeholder="Designation"
          value={filters.designation}
          onChange={handleChange}
          className="search-input"
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={filters.location}
          onChange={handleChange}
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">
          Search
        </button>
      </div>

      <div className="view-toggle">
        <button
          className={view === "table" ? "view-button active" : "view-button"}
          onClick={() => setView("table")}
        >
          Table View
        </button>
        <button
          className={view === "grid" ? "view-button active" : "view-button"}
          onClick={() => setView("grid")}
        >
          Grid View
        </button>
      </div>

      <div className="search-results">
        {loading ? (
          <p className="loading-message">Loading alumni...</p>
        ) : results.length === 0 ? (
          <p className="no-results">No alumni found matching your criteria.</p>
        ) : view === "table" ? (
          <table className="alumni-table">
            <thead>
              <tr>
                <th>Photo</th>
                <th>Name</th>
                <th>Year</th>
                <th>Designation</th>
                <th>Location</th>
                <th>College</th>
                <th>Branch</th>
                <th>Current Company</th>
                <th>Email</th>
                <th>LinkedIn</th>
                <th>Instagram</th>
              </tr>
            </thead>
            <tbody>
              {results.map((alum) => (
                <tr key={alum._id}>
                  <td>
                    <img
                      src={alum.profilePhoto || "/default-avatar.png"}
                      alt={alum.name}
                      className="profile-img"
                    />
                  </td>
                  <td>{alum.name}</td>
                  <td>{alum.passoutYear}</td>
                  <td>{alum.designation || "Not Provided"}</td>
                  <td>{alum.location || "Not Provided"}</td>
                  <td>{alum.college || "Not Provided"}</td>
                  <td>{alum.branch || "Not Provided"}</td>
                  <td>{alum.currentCompany || "Not Provided"}</td>
                  <td>{alum.email || "Not Provided"}</td>
                  <td>
                    {alum.LinkedIn ? (
                      <a
                        href={alum.LinkedIn}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link"
                      >
                        LinkedIn
                      </a>
                    ) : (
                      <p>No LinkedIn</p>
                    )}
                  </td>
                  <td>
                    {alum.Instagram ? (
                      <a
                        href={alum.Instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link"
                      >
                        Instagram
                      </a>
                    ) : (
                      <p>No Instagram</p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="alumni-grid">
            {results.map((alum) => (
              <div key={alum._id} className="alumni-card">
                <img
                  src={alum.profilePhoto || "/default-avatar.png"}
                  alt={alum.name}
                  className="card-photo"
                />
                <div className="card-details">
                  <h3>{alum.name}</h3>
                  <p>Year: {alum.passoutYear}</p>
                  <p>{alum.designation || "Not Provided"}</p>
                  <button
                    className="view-more-button"
                    onClick={() => toggleCardView(alum._id)}
                  >
                    {expandedAlumniId === alum._id ? "View Less" : "View More"}
                  </button>
                  {expandedAlumniId === alum._id && (
                    <div className="expanded-details">
                      <p>Location: {alum.location || "Not Provided"}</p>
                      <p>College: {alum.college || "Not Provided"}</p>
                      <p>Branch: {alum.branch || "Not Provided"}</p>
                      <p>Company: {alum.currentCompany || "Not Provided"}</p>
                      <p>Email: {alum.email || "Not Provided"}</p>
                      <p>
                        LinkedIn:{" "}
                        {alum.LinkedIn ? (
                          <a
                            href={alum.LinkedIn}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-link"
                          >
                            LinkedIn
                          </a>
                        ) : (
                          <span>No LinkedIn</span>
                        )}
                      </p>
                      <p>
                        Instagram:{" "}
                        {alum.Instagram ? (
                          <a
                            href={alum.Instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-link"
                          >
                            Instagram
                          </a>
                        ) : (
                          <span>No Instagram</span>
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchAlumni;
