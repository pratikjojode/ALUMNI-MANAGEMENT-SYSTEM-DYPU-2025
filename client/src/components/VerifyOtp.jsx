import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/VerifyOtp.css";

import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
const VerifyOtp = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const storedEmail = localStorage.getItem("email");
  const role = localStorage.getItem("role");

  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    if (!storedEmail || !role) {
      setError("Missing email or role information.");
      navigate("/login");
      return;
    }

    try {
      const res = await axios.post("/api/v1/auth/verify-otp", {
        email: storedEmail,
        otp,
        role,
      });

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success("OTP verified successfully!");
      switch (user.role) {
        case "admin":
          navigate("/admin");
          break;
        case "student":
          navigate("/student");
          break;
        case "alumni":
          navigate("/alumni");
          break;
        default:
          navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed");
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <Navbar />
      <div className="verify-otp-container">
        <div className="otp-card">
          <div className="verification-section">
            <h3 className="verification-title">Authentication Required</h3>
            <p className="verification-message">
              A one-time password has been sent to your registered email
              address. Please enter the 6-digit code below to verify your
              identity and access your account.
            </p>

            <form onSubmit={handleOtpSubmit}>
              <div className="otp-input-container">
                <input
                  type="text"
                  name="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  maxLength="6"
                  required
                />
              </div>
              <button type="submit" className="verify-button">
                Verify & Continue
              </button>
            </form>

            {error && <p className="error-message">{error}</p>}

            <p className="help-text">
              Didn't receive the code? <a href="#">Resend OTP</a>
            </p>
            <p className="contact-support">
              Having trouble? <a href="#">Contact Support</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerifyOtp;
