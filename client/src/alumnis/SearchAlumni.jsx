// src/pages/SearchAlumni.jsx
import React, { useState } from "react";
import axios from "axios";
import "../styles/SearchAlumni.css"; // Assuming you have a CSS file for styling
const SearchAlumni = () => {
  const [filters, setFilters] = useState({
    name: "",
    passoutYear: "",
    designation: "",
    location: "",
  });

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:5000/api/v1/alumni/search",
        {
          params: filters,
        }
      );
      setResults(response.data.alumni);
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-alumni-container">
      <h2>🔍 Search Alumni</h2>
      <div className="form-group">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={filters.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="passoutYear"
          placeholder="Passout Year"
          value={filters.passoutYear}
          onChange={handleChange}
        />
        <input
          type="text"
          name="designation"
          placeholder="Designation"
          value={filters.designation}
          onChange={handleChange}
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={filters.location}
          onChange={handleChange}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className="results">
        {loading ? (
          <p>Loading alumni...</p>
        ) : results.length === 0 ? (
          <p>No alumni found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Photo</th>
                <th>Name</th>
                <th>Year</th>
                <th>Designation</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              {results.map((alum) => (
                <tr key={alum._id}>
                  <td>
                    <img
                      src={alum.profilePhoto}
                      alt={alum.name}
                      width={50}
                      height={50}
                      style={{ borderRadius: "50%" }}
                    />
                  </td>
                  <td>{alum.name}</td>
                  <td>{alum.passoutYear}</td>
                  <td>{alum.designation}</td>
                  <td>{alum.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default SearchAlumni;
