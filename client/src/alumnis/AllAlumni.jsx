import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/all-alumni.css";
const AllAlumni = () => {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("card");

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/v1/alumni/all"
        );
        setAlumni(response.data.alumni);
      } catch (err) {
        console.error("Failed to fetch alumni", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlumni();
  }, []);

  if (loading) return <p>Loading alumni...</p>;

  const renderCardView = () => (
    <div className="alumni-cards-container">
      {alumni.map((alum) => (
        <div className="alumni-card" key={alum._id}>
          <img
            src={alum.profilePhoto}
            alt={alum.name}
            className="alumni-photo"
          />
          <div className="alumni-info">
            <h3>{alum.name}</h3>
            <p>
              <strong>Batch:</strong> {alum.passoutYear}
            </p>
            <p>
              <strong>Company:</strong> {alum.currentCompany}
            </p>
            <p>
              <strong>Designation:</strong> {alum.designation}
            </p>
            <p>
              <strong>Location:</strong> {alum.location}
            </p>
            <a href={alum.LinkedIn} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            {alum.Instagram && (
              <a href={alum.Instagram} target="_blank" rel="noreferrer">
                Instagram
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderTableView = () => (
    <table className="alumni-table">
      <thead>
        <tr>
          <th>Photo</th>
          <th>Name</th>
          <th>Year</th>
          <th>Company</th>
          <th>Designation</th>
          <th>Location</th>
          <th>LinkedIn</th>
          <th>Instagram</th>
        </tr>
      </thead>
      <tbody>
        {alumni.map((alum) => (
          <tr key={alum._id}>
            <td>
              <img
                src={alum.profilePhoto}
                alt={alum.name}
                width={50}
                height={50}
              />
            </td>
            <td>{alum.name}</td>
            <td>{alum.passoutYear}</td>
            <td>{alum.currentCompany}</td>
            <td>{alum.designation}</td>
            <td>{alum.location}</td>
            <td>
              <a href={alum.LinkedIn} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </td>
            <td>
              {alum.Instagram && (
                <a href={alum.Instagram} target="_blank" rel="noreferrer">
                  Instagram
                </a>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderGridView = () => (
    <div className="alumni-grid-container">
      {alumni.map((alum) => (
        <div className="alumni-grid-item" key={alum._id}>
          <img
            src={alum.profilePhoto}
            alt={alum.name}
            className="alumni-photo"
          />
          <div className="alumni-info">
            <h3>{alum.name}</h3>
            <p>
              <strong>Batch:</strong> {alum.passoutYear}
            </p>
            <p>
              <strong>Company:</strong> {alum.currentCompany}
            </p>
            <p>
              <strong>Designation:</strong> {alum.designation}
            </p>
            <p>
              <strong>Location:</strong> {alum.location}
            </p>
            <a href={alum.LinkedIn} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            {alum.Instagram && (
              <a href={alum.Instagram} target="_blank" rel="noreferrer">
                Instagram
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="all-alumni-container">
      <h2>All Alumni</h2>
      <div className="view-toggle-buttons">
        <button onClick={() => setView("card")}>Card View</button>
        <button onClick={() => setView("table")}>Table View</button>
        <button onClick={() => setView("grid")}>Grid View</button>
      </div>

      {view === "card" && renderCardView()}
      {view === "table" && renderTableView()}
      {view === "grid" && renderGridView()}
    </div>
  );
};

export default AllAlumni;
