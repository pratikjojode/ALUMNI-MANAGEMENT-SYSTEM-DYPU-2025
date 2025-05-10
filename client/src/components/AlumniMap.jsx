import React, { useState, useEffect } from "react";
import _ from "lodash";
import "../styles/AlumniMap.css";

const AlumniMap = ({ alumniList }) => {
  const [locations, setLocations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredLocations, setFilteredLocations] = useState([]);

  const locationPositions = {
    mumbai: { x: 44.5, y: 62 },
    delhi: { x: 58.5, y: 43 },
    bangalore: { x: 55.5, y: 77 },
    hyderabad: { x: 57.5, y: 68 },
    kolkata: { x: 75.5, y: 55 },
    chennai: { x: 60.5, y: 80 },
    pune: { x: 52.5, y: 63 },
    ahmedabad: { x: 45.5, y: 55 },
    jaipur: { x: 53.5, y: 48 },
    lucknow: { x: 63.5, y: 48 },
    kochi: { x: 54.5, y: 85 },
    indore: { x: 51.5, y: 58 },
    goa: { x: 48.5, y: 70 },
  };

  useEffect(() => {
    if (alumniList?.length) {
      processLocations(alumniList);
    } else {
      setLocations([]);
      setFilteredLocations([]);
    }
  }, [alumniList]);

  const processLocations = (alumniData) => {
    const validAlumni = alumniData.filter((alum) => alum.location?.trim());

    const grouped = _.groupBy(validAlumni, "location");
    const processed = Object.keys(grouped).map((loc) => {
      const normalized = loc.toLowerCase().trim();
      return {
        name: loc,
        position: locationPositions[normalized] || { x: 50, y: 50 },
        alumni: grouped[loc],
        count: grouped[loc].length,
      };
    });

    setLocations(processed);
    setFilteredLocations(processed);
  };

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredLocations(locations);
      return;
    }

    const filtered = locations.filter(
      (loc) =>
        loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loc.alumni.some(
          (alum) =>
            alum.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            alum.currentCompany
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            alum.branch?.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    setFilteredLocations(filtered);
  }, [searchTerm, locations]);

  return (
    <div className="alumni-map-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by location, name, company or branch..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="location-summary">
        <span>Total locations: {locations.length}</span>
        <span>
          Alumni with locations:{" "}
          {alumniList?.filter((a) => a.location?.trim()).length || 0}
        </span>
      </div>

      <div className="map-container">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Geographical distribution of alumni across India"
        >
          <path
            d="M85.2 25.5l-2.4-1.3-2.5.9-1.5-1.5-3.3.3-1.3-1.9-4.4 1.4-3.2-3.1-3.3.8-3.3-1.9-2.9.6-3.2-3.4-5.7 2.2-5.5-2.5-5.1.6-3.7-2.1-4.1.9-4.3-2.8-3.1.6-3.9-3.5-3.2 1.4-1.6-1.1-1.6 1.6-2.4-.6-1.2 1.9-2.5-.4-1.6 1.3-3.1-2.1-1.9 1.1-1.7-1.3-2.3.6-1.1 2.6-3.4 1.1.3 2.4-2.6 1.6.5 2.1-1.9 1.7.8 2.3-1.7 1.1.6 3.1 2.8 1.7.3 3.2 2.5 1.4 1.7 3.3-.3 2.9 2.1 2.7-.3 3.1 1.5 2.6-.6 1.9 1.5 3.4-.3 1.8 1.8 2.9-.9 1.7 1.5 3.3-1.2 2.3 1.8 3.4-1.5 2.1 1.2 2.9-1.5 1.4 1.5 3.1-1.8 2.4 2.4 3.4-2.4 1.8 1.8 2.7-1.8 1.4 1.2 2.4-1.5 1.4 1.5 2.7-2.1 1.8 1.8 2.4-1.8 1.1 1.5 2.1-1.8 1.5 1.5 2.4-2.4 1.2 1.5 2.1-2.1 1.5 1.8 1.8-1.8.9 1.5 1.8-2.1 1.2 1.8 1.5-1.5.9 1.2 1.2-1.5 1.5 1.8 1.2-1.8 1.2 1.5.9-1.2 1.5 1.8.6-1.5 1.8 1.8.3-1.8 2.1 2.4-.6 1.5 1.8 1.5-.9 1.2 1.5 1.5-.6.9 1.2 1.5-.9.6 1.2 1.5-.6.3 1.5 1.2-.6.3 1.8.9-.3.3 1.2.9-.3.3.9.6-.3.3.6.3-.3.3.3.3-.3z"
            fill="#f0f9ff"
            stroke="#94a3b8"
            strokeWidth="0.3"
          />
          {filteredLocations.map((location, index) => (
            <g key={index} className="location-item">
              <circle
                cx={location.position.x}
                cy={location.position.y}
                r={Math.max(3, Math.log(location.count + 1) * 2)}
                fill="#dc2626"
                stroke="#fff"
                strokeWidth="0.8"
                className="location-circle"
              />
              <text
                x={location.position.x}
                y={location.position.y}
                textAnchor="middle"
                dominantBaseline="central"
                fill="#fff"
                fontSize="3"
                fontWeight="600"
              >
                {location.count}
              </text>
              <text
                x={location.position.x}
                y={location.position.y + 6}
                textAnchor="middle"
                fill="#1e293b"
                fontSize="2.8"
                className="location-name-on-map"
              >
                {location.name}
              </text>
            </g>
          ))}
          {filteredLocations.length === 0 && locations.length > 0 && (
            <text
              x="50"
              y="50"
              textAnchor="middle"
              dominantBaseline="central"
              fill="#64748b"
              fontSize="4"
              className="no-matches-text"
            >
              No matches found for "{searchTerm}"
            </text>
          )}
        </svg>
      </div>

      {filteredLocations.length > 0 && (
        <div className="location-list">
          <h3 className="location-header">
            Alumni Locations ({filteredLocations.length})
          </h3>
          <div className="location-grid">
            {filteredLocations.map((location, index) => (
              <div key={index} className="location-card">
                <div className="location-card-header">
                  <h4 className="location-name">{location.name}</h4>
                  <span className="location-count">
                    {location.count} alumni
                  </span>
                </div>
                <ul className="alumni-list">
                  {location.alumni.slice(0, 3).map((alum, i) => (
                    <li key={i} className="alumni-item">
                      <span className="alumni-name">{alum.name}</span>
                      {alum.currentCompany && (
                        <span className="alumni-company">
                          {" "}
                          • {alum.currentCompany}
                        </span>
                      )}
                    </li>
                  ))}
                  {location.alumni.length > 3 && (
                    <li className="more-alumni">
                      and {location.alumni.length - 3} more...
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AlumniMap;
