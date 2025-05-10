import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { IoArrowBack } from "react-icons/io5";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!role) {
      toast.error("Please select a role");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("/api/v1/auth/forgot-password", {
        email,
        role,
      });

      if (res.status === 200) {
        toast.success("OTP sent to your email");
        localStorage.setItem("resetEmail", email);
        navigate("/reset-password");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Your main content wrapper */}
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
          <h2>Forgot Password</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="role-group">
              <label>
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  onChange={(e) => setRole(e.target.value)}
                  required
                />
                Admin
              </label>
              <label>
                <input
                  type="radio"
                  name="role"
                  value="alumni"
                  onChange={(e) => setRole(e.target.value)}
                  required
                />
                Alumni
              </label>
              <label>
                <input
                  type="radio"
                  name="role"
                  value="student"
                  onChange={(e) => setRole(e.target.value)}
                  required
                />
                Student
              </label>
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
