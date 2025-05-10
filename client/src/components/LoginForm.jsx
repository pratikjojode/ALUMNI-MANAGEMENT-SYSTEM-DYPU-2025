import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/login-form.css";
import { IoArrowBack } from "react-icons/io5";
import toast from "react-hot-toast";

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
  });
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false); // New loading state

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!formData.role) {
      setError("Please select a role");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("/api/v1/auth/login", formData);

      if (res.status === 200 && res.data.message === "OTP sent to your email") {
        localStorage.setItem("email", formData.email);
        localStorage.setItem("role", formData.role);

        setOtpSent(true);
        navigate("/verify-otp");
        toast.success("OTP sent succefully");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
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

      <div className="login-container">
        <h2>Login</h2>
        {!otpSent ? (
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
            />

            <div className="role-group">
              <label>
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={formData.role === "admin"}
                  onChange={handleChange}
                />
                Admin
              </label>
              <label>
                <input
                  type="radio"
                  name="role"
                  value="student"
                  checked={formData.role === "student"}
                  onChange={handleChange}
                />
                Student
              </label>
              <label>
                <input
                  type="radio"
                  name="role"
                  value="alumni"
                  checked={formData.role === "alumni"}
                  onChange={handleChange}
                />
                Alumni
              </label>
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Loading..." : "Login"}
            </button>
            <div>
              <span
                onClick={() => navigate("/forgot-password")}
                style={{
                  cursor: "pointer",

                  textDecoration: "underline",
                }}
              >
                Forgot Password?
              </span>
            </div>
          </form>
        ) : null}

        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default LoginForm;
