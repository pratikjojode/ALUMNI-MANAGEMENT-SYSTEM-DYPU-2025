import { useState } from "react";
import axios from "axios";
import "../styles/alumni-register-form.css";
import { IoArrowBack } from "react-icons/io5";

const AlumniRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactNo: "",
    college: "",
    branch: "",
    passoutYear: "",
    currentCompany: "",
    designation: "",
    location: "",
    LinkedIn: "",
    Instagram: "",
    password: "",
    isVisible: true,
  });

  const [profilePhoto, setProfilePhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePhoto(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });
      if (profilePhoto) data.append("profilePhoto", profilePhoto);

      const res = await axios.post(
        "http://localhost:5000/api/v1/alumni/registerAlumni",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage(res.data.message);
      setFormData({
        name: "",
        email: "",
        contactNo: "",
        college: "",
        branch: "",
        passoutYear: "",
        currentCompany: "",
        designation: "",
        location: "",
        LinkedIn: "",
        Instagram: "",
        password: "",
        isVisible: true,
      });
      setProfilePhoto(null);
      setPreview(null);
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed");
    }

    setLoading(false);
  };

  return (
    <div className="alumnireg-wrapper">
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

      <div className="alumni-container">
        <h2>Alumni Registration</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="contactNo"
            placeholder="Contact Number"
            value={formData.contactNo}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="college"
            placeholder="College Name"
            value={formData.college}
            onChange={handleChange}
          />
          <input
            type="text"
            name="branch"
            placeholder="Branch"
            value={formData.branch}
            onChange={handleChange}
          />
          <input
            type="number"
            name="passoutYear"
            placeholder="Passout Year"
            value={formData.passoutYear}
            onChange={handleChange}
          />
          <input
            type="text"
            name="currentCompany"
            placeholder="Current Company"
            value={formData.currentCompany}
            onChange={handleChange}
          />
          <input
            type="text"
            name="designation"
            placeholder="Designation"
            value={formData.designation}
            onChange={handleChange}
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
          />
          <input
            type="url"
            name="LinkedIn"
            placeholder="LinkedIn Profile"
            value={formData.LinkedIn}
            onChange={handleChange}
          />
          <input
            type="text"
            name="Instagram"
            placeholder="Instagram Profile"
            value={formData.Instagram}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <label>
            <input
              type="checkbox"
              name="isVisible"
              checked={formData.isVisible}
              onChange={(e) =>
                setFormData({ ...formData, isVisible: e.target.checked })
              }
            />
            Make profile visible publicly
          </label>

          <input
            type="file"
            name="profilePhoto"
            accept="image/*"
            onChange={handleFileChange}
          />
          {preview && <img src={preview} alt="Preview" width="100" />}

          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default AlumniRegister;
