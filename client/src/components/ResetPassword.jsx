import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { IoArrowBack } from "react-icons/io5";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    otp: "",
    newPassword: "",
    role: "", // Add role to the state
  });
  const [loading, setLoading] = useState(false);
  const email = localStorage.getItem("resetEmail");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("/api/v1/auth/reset-password", {
        email,
        role: formData.role, // Send role in the request body
        otp: formData.otp,
        newPassword: formData.newPassword,
      });

      if (res.status === 200) {
        toast.success("Password reset successfully!");
        localStorage.removeItem("resetEmail");
        navigate("/unifiedLogin");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reset password");
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
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="otp"
            placeholder="Enter OTP"
            value={formData.otp}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="newPassword"
            placeholder="Enter New Password"
            value={formData.newPassword}
            onChange={handleChange}
            required
          />

          <div className="role-group">
            <label>
              <input
                type="radio"
                name="role"
                value="admin"
                onChange={handleChange}
                required
              />
              Admin
            </label>
            <label>
              <input
                type="radio"
                name="role"
                value="alumni"
                onChange={handleChange}
                required
              />
              Alumni
            </label>
            <label>
              <input
                type="radio"
                name="role"
                value="student"
                onChange={handleChange}
                required
              />
              Student
            </label>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
