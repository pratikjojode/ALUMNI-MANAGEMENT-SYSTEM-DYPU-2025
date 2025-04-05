import { useState } from "react";
import axios from "axios";

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/admin/registerAdmin",
        formData
      );

      setMessage(res.data.message);
      setFormData({ name: "", email: "", password: "" });
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed");
    }

    setLoading(false);
  };

  return (
    <div>
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
        <br />
        <br />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <br />
        <br />
        <input
          type="password"
          name="password"
          placeholder="Create Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <br />
        <br />
        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      {message && (
        <p style={{ marginTop: "1rem", color: "green" }}>{message}</p>
      )}
    </div>
  );
};

export default AdminRegister;
