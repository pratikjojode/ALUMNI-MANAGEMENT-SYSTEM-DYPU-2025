import React, { useState } from "react";
import axios from "axios";

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
    PRN: "",
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

    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) {
        form.append(key, formData[key]);
      }
    });

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
    <div>
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
        <br />
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
        <br />
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
        <br />
        <label>
          Profile Photo:
          <input type="file" onChange={handleFileChange} required />
        </label>
        <br />
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
        <br />
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
        <br />
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
        <br />
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
        <br />
        <label>
          PRN:
          <input
            type="text"
            name="PRN"
            value={formData.PRN}
            onChange={handleChange}
            required
          />
        </label>
        <br />
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
        <br />
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
        <br />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default StudentRegister;
