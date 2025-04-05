// src/pages/AlumniProfile.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const AlumniProfile = () => {
  const [alumni, setAlumni] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/v1/alumni/profile",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setAlumni(res.data.alumni);
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlumni();
  }, []);

  if (loading) return <p>Loading profile...</p>;
  if (!alumni) return <p>Profile not found</p>;

  return (
    <div>
      <h2>Alumni Profile</h2>
      <img
        src={alumni.profilePhoto}
        alt={alumni.name}
        width="150"
        height="150"
        style={{ borderRadius: "50%", objectFit: "cover" }}
      />
      <h3>{alumni.name}</h3>
      <p>
        <strong>Email:</strong> {alumni.email}
      </p>
      <p>
        <strong>Contact:</strong> {alumni.contactNo}
      </p>
      <p>
        <strong>College:</strong> {alumni.college}
      </p>
      <p>
        <strong>Branch:</strong> {alumni.branch}
      </p>
      <p>
        <strong>Passout Year:</strong> {alumni.passoutYear}
      </p>
      <p>
        <strong>Company:</strong> {alumni.currentCompany}
      </p>
      <p>
        <strong>Designation:</strong> {alumni.designation}
      </p>
      <p>
        <strong>Location:</strong> {alumni.location}
      </p>
      <p>
        <strong>LinkedIn:</strong>{" "}
        <a href={alumni.LinkedIn} target="_blank" rel="noreferrer">
          {alumni.LinkedIn}
        </a>
      </p>
      <p>
        <strong>Instagram:</strong>{" "}
        <a href={alumni.Instagram} target="_blank" rel="noreferrer">
          {alumni.Instagram}
        </a>
      </p>
    </div>
  );
};

export default AlumniProfile;
