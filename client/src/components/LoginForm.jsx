import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/login-form.css"; // Import your CSS file for styling
const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.role) {
      setError("Please select a role");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/auth/login",
        formData
      );

      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);

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
      setError(err.response?.data?.message || "Login failed");
    }
  };

  // Update the JSX structure with className attributes
  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
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

        <button type="submit">Login</button>
      </form>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default LoginForm;
