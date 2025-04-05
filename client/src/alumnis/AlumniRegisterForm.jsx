import { useState } from "react";
import axios from "axios";

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
    isVisible: true, // Profile visibility toggle
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
        Instagram: "",
        LinkedIn: "",
        password: "",
        isVisible: true, // Reset visibility after submit
      });
      setProfilePhoto(null);
      setPreview(null);
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed");
    }

    setLoading(false);
  };

  return (
    <div>
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
        <br />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type="text"
          name="contactNo"
          placeholder="Contact Number"
          value={formData.contactNo}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type="text"
          name="college"
          placeholder="College Name"
          value={formData.college}
          onChange={handleChange}
        />
        <br />
        <input
          type="text"
          name="branch"
          placeholder="Branch"
          value={formData.branch}
          onChange={handleChange}
        />
        <br />
        <input
          type="number"
          name="passoutYear"
          placeholder="Passout Year"
          value={formData.passoutYear}
          onChange={handleChange}
        />
        <br />
        <input
          type="text"
          name="currentCompany"
          placeholder="Current Company"
          value={formData.currentCompany}
          onChange={handleChange}
        />
        <br />
        <input
          type="text"
          name="designation"
          placeholder="Designation"
          value={formData.designation}
          onChange={handleChange}
        />
        <br />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
        />
        <br />
        <input
          type="url"
          name="LinkedIn"
          placeholder="LinkedIn Profile"
          value={formData.LinkedIn}
          onChange={handleChange}
        />
        <br />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type="text"
          name="Instagram"
          placeholder="Instagram Profile"
          value={formData.Instagram}
          onChange={handleChange}
        />
        <br />

        {/* Profile Visibility */}
        <div style={{ marginBottom: "0.75rem" }}>
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
        </div>

        <br />

        <input
          type="file"
          name="profilePhoto"
          accept="image/*"
          onChange={handleFileChange}
        />
        <br />
        {preview && <img src={preview} alt="Preview" width="100" />}
        <br />
        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default AlumniRegister;
