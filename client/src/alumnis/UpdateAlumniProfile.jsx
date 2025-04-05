import React, { useState, useEffect } from "react";
import axios from "axios";

const UpdateAlumniProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    contactNo: "",
    college: "",
    branch: "",
    passoutYear: "",
    currentCompany: "",
    designation: "",
    location: "",
    LinkedIn: "",
    Instagram: "",
    isVisible: true,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/v1/alumni/profile",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setFormData(res.data.alumni);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        "http://localhost:5000/api/v1/alumni/update-profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Profile updated successfully!");
      console.log(res.data);
    } catch (err) {
      alert("Update failed");
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Update Alumni Profile</h2>
      <form onSubmit={handleSubmit}>
        {[
          "name",
          "contactNo",
          "college",
          "branch",
          "passoutYear",
          "currentCompany",
          "designation",
          "location",
          "LinkedIn",
          "Instagram",
        ].map((field) => (
          <div key={field}>
            <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
            <input
              type="text"
              name={field}
              value={formData[field] || ""}
              onChange={handleChange}
            />
          </div>
        ))}

        {/* ✅ Visibility Toggle */}
        <div>
          <label>
            <input
              type="checkbox"
              name="isVisible"
              checked={formData.isVisible}
              onChange={handleChange}
            />
            Show my profile publicly
          </label>
        </div>

        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default UpdateAlumniProfile;
