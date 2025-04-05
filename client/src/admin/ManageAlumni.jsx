// admin/ManageAlumni.jsx
import React, { useState, useEffect } from "react";

const ManageAlumni = () => {
  const [alumni, setAlumni] = useState([]);

  useEffect(() => {
    // Fetch alumni data
    const fetchAlumni = async () => {
      const response = await fetch("/api/alumni"); // Example API call
      const data = await response.json();
      setAlumni(data);
    };
    fetchAlumni();
  }, []);

  return (
    <div>
      <h2>Manage Alumni</h2>
      {alumni.length === 0 ? (
        <p>No alumni found</p>
      ) : (
        <ul>
          {alumni.map((alumnus) => (
            <li key={alumnus._id}>
              <p>{alumnus.name}</p>
              <p>{alumnus.email}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ManageAlumni;
