import React, { useState } from "react";
import axios from "axios";
import "../styles/student-register.css";
import { IoArrowBack } from "react-icons/io5";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const StudentRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactNo: "",
    profilePhoto: null,
    college: "",
    branch: "",
    admissionYear: "",
    prn: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
    setLoading(true);

    const trimmedPrn = formData.prn.trim();
    if (!trimmedPrn) {
      setLoading(false);
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
      toast.success("Student Registered Successfully");
      navigate("/unifiedLogin");
      setFormData({
        name: "",
        email: "",
        contactNo: "",
        profilePhoto: null,
        college: "",
        branch: "",
        admissionYear: "",
        prn: "",
        password: "",
      });
    } catch (error) {
      toast.error(
        `Registration Failed: ${error.response?.data?.message || error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="student-register-wrapper">
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
            <select
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select Branch
              </option>
              <option value="CS">CS</option>
              <option value="IT">IT</option>
              <option value="AIDS">AIDS</option>
            </select>
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
            Password:
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </label>
          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentRegister;
