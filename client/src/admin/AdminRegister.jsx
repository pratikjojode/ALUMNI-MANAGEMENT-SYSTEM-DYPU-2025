import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/admin-register.css";
import { IoArrowBack } from "react-icons/io5";
import { useSearchParams, useNavigate } from "react-router-dom";

const AdminRegister = () => {
  const [searchParams] = useSearchParams();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const VALID_TOKEN = "super-secret-admin-token";
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const token = searchParams.get("token");
    if (token === VALID_TOKEN) {
      setIsAuthorized(true);
    }
  }, [searchParams]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post("/api/v1/admin/registerAdmin", formData);
      setMessage(res.data.message);
      setFormData({ name: "", email: "", password: "" });

      setTimeout(() => {
        navigate("/unifiedLogin");
      }, 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed");
    }

    setLoading(false);
  };

  if (!isAuthorized) {
    return (
      <div className="adminreg-wrapper">
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
        <div className="admin-container">
          <h2>Unauthorized</h2>
          <p>You are not authorized to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="adminreg-wrapper">
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

      <div className="admin-container">
        <h2>Admin Registration</h2>
        <form onSubmit={handleSubmit}>
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
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Create Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        {message && <p className="admin-message">{message}</p>}
      </div>
    </div>
  );
};

export default AdminRegister;
