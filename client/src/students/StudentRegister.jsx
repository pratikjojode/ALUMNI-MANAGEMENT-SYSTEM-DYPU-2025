import React, { useState } from "react";
import axios from "axios";
import "../styles/student-register.css";
import { IoArrowBack } from "react-icons/io5";

const StudentRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactNo: "",
    profilePhoto: null,
    college: "",
    branch: "",
    admissionYear: "",
    passoutYear: "",
    prn: "",
    projectIdea: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      profilePhoto: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedPrn = formData.prn.trim();
    if (!trimmedPrn) {
      return window.alert("PRN is required!");
    }

    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) {
        form.append(key, formData[key]);
      }
    });
    form.set("prn", trimmedPrn);

    try {
      await axios.post(
        "http://localhost:5000/api/v1/students/registerStudent",
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      window.alert("Student Registered Successfully");
    } catch (error) {
      window.alert(
        `Registration Failed: ${error.response?.data?.message || error.message}`
      );
    }
  };

  return (
    <div className="student-register-wrapper">
      {/* Go Back Button */}
      <button
        onClick={() => window.history.back()}
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          padding: "8px 16px",
          backgroundColor: "#9F1C33",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        <IoArrowBack size={20} />
        Back
      </button>

      <div className="student-register-container">
        <h2>Student Registration</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Contact No:
            <input
              type="number"
              name="contactNo"
              value={formData.contactNo}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Profile Photo:
            <input type="file" onChange={handleFileChange} required />
          </label>
          <label>
            College:
            <input
              type="text"
              name="college"
              value={formData.college}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Branch:
            <input
              type="text"
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Admission Year:
            <input
              type="number"
              name="admissionYear"
              value={formData.admissionYear}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Passout Year:
            <input
              type="number"
              name="passoutYear"
              value={formData.passoutYear}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            PRN:
            <input
              type="text"
              name="prn"
              value={formData.prn}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Project Idea:
            <input
              type="text"
              name="projectIdea"
              value={formData.projectIdea}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </label>
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};

export default StudentRegister;
