import { useState } from "react";
import axios from "axios";
import "../styles/alumni-register-form.css";
import { IoArrowBack } from "react-icons/io5";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

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
  const [resultUpload, setResultUpload] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
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

  const handleResultUploadChange = (e) => {
    const file = e.target.files[0];
    setResultUpload(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!resultUpload) {
      toast.error("Academic result is required.");
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });
      if (profilePhoto) data.append("profilePhoto", profilePhoto);
      if (resultUpload) data.append("academicResult", resultUpload);

      const res = await axios.post(
        "http://localhost:5000/api/v1/alumni/registerAlumni",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(res.data.message || "Registered successfully");
      navigate("/unifiedLogin");

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
      setResultUpload(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }

    setLoading(false);
  };

  return (
    <div className="alumnireg-wrapper">
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
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>Contact Number</label>
          <input
            type="text"
            name="contactNo"
            value={formData.contactNo}
            onChange={handleChange}
            required
          />

          <label>College Name</label>
          <input
            type="text"
            name="college"
            value={formData.college}
            onChange={handleChange}
          />

          <label>Branch</label>
          <input
            type="text"
            name="branch"
            value={formData.branch}
            onChange={handleChange}
          />

          <label>Passout Year</label>
          <input
            type="number"
            name="passoutYear"
            value={formData.passoutYear}
            onChange={handleChange}
          />

          <label>Current Company</label>
          <input
            type="text"
            name="currentCompany"
            value={formData.currentCompany}
            onChange={handleChange}
          />

          <label>Designation</label>
          <input
            type="text"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
          />

          <label>Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
          />

          <label>LinkedIn Profile</label>
          <input
            type="url"
            name="LinkedIn"
            value={formData.LinkedIn}
            onChange={handleChange}
          />

          <label>Instagram Profile</label>
          <input
            type="text"
            name="Instagram"
            value={formData.Instagram}
            onChange={handleChange}
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
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

          <label htmlFor="profilePhoto">Upload Profile Photo</label>
          <input
            type="file"
            id="profilePhoto"
            name="profilePhoto"
            accept="image/*"
            onChange={handleFileChange}
          />
          {preview && <img src={preview} alt="Preview" width="100" />}

          <label htmlFor="academicResult">
            Upload Academic Result (PDF/Image)
          </label>
          <input
            type="file"
            id="academicResult"
            name="academicResult"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            onChange={handleResultUploadChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AlumniRegister;
