import React, { useEffect, useState } from "react";
import axios from "axios";
import AlumniMap from "../components/AlumniMap";
import "../styles/AlumniMapPage.css";
import "../styles/AlumniMap.css";
import Navbar from "../components/Navbar";

const AlumniMapPage = () => {
  const [alumniList, setAlumniList] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const response = await axios.get("/api/v1/alumni/all");
        setAlumniList(response.data.alumni || []);
      } catch (err) {
        console.error("Failed to fetch alumni", err);
        setError("Failed to load alumni data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAlumni();
  }, []);

  return (
    <>
      <Navbar />
      <div style={{ padding: "1rem" }}>
        <h2 style={{ textAlign: "center" }}>📍 Alumni Map</h2>

        {loading && (
          <p style={{ textAlign: "center", fontSize: "1.2rem", color: "#777" }}>
            Loading map...
          </p>
        )}

        {error && (
          <p style={{ color: "red", textAlign: "center", fontSize: "1.2rem" }}>
            {error}
          </p>
        )}

        {!loading && !error && alumniList.length > 0 && (
          <AlumniMap alumniList={alumniList} />
        )}

        {!loading && !error && alumniList.length === 0 && (
          <p
            style={{
              textAlign: "center",
              marginTop: "1rem",
              fontSize: "1.1rem",
            }}
          >
            No alumni data available.
          </p>
        )}
      </div>
    </>
  );
};

export default AlumniMapPage;
