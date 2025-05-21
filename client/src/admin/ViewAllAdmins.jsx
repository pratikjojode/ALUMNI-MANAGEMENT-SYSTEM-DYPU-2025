import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/ViewAllAdmins.css";

const ViewAllAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("card");

  const fetchAdmins = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token not found. Please log in.");
        setLoading(false);
        return;
      }

      const res = await axios.get("/api/v1/admin/allAdmin", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAdmins(res.data.admins);
    } catch (err) {
      console.error("Failed to fetch admins:", err);
      setError(err.response?.data?.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const renderCardView = () => (
    <ul className="admin-list">
      {admins.map((admin) => (
        <li key={admin._id} className="admin-list-item">
          <div className="admin-item-header">
            <span className="admin-list-name">{admin.name}</span>
            <span className="admin-list-email">{admin.email}</span>
          </div>
          <div className="admin-item-details">
            <p className="admin-list-role">
              Role: <strong>{admin.role}</strong>
            </p>
            <p className="admin-list-students">
              Students managed: {admin.students ? admin.students.length : 0}
            </p>
            <p className="admin-list-alumni">
              Alumni managed: {admin.alumni ? admin.alumni.length : 0}
            </p>
            <p className="admin-list-created">
              Created: {new Date(admin.createdAt).toLocaleDateString()}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );

  const renderTableView = () => (
    <div className="admin-list-table-container">
      <table className="admin-list-table">
        <thead>
          <tr>
            <th>Admin</th>
            <th>Role</th>
            <th>Students</th>
            <th>Alumni</th>
            <th>Created Date</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => (
            <tr key={admin._id}>
              <td>
                <span className="admin-table-name">{admin.name}</span>
                <span className="admin-table-email">{admin.email}</span>
              </td>
              <td>
                <span className="admin-table-role">{admin.role}</span>
              </td>
              <td className="admin-table-count">
                {admin.students ? admin.students.length : 0}
              </td>
              <td className="admin-table-count">
                {admin.alumni ? admin.alumni.length : 0}
              </td>
              <td className="admin-table-date">
                {new Date(admin.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (loading) {
    return (
      <div className="admin-list-container">
        <div className="admin-header">
          <h2 className="admin-list-title">All System Admins</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return <p className="admin-list-status admin-list-error">Error: {error}</p>;
  }

  return (
    <div className="admin-list-container">
      <div className="admin-header">
        <h2 className="admin-list-title">
          All System Admins
          <span className="admin-counter">{admins.length}</span>
        </h2>
        <div className="admin-view-toggle">
          <button
            className={`admin-view-btn ${viewMode === "card" ? "active" : ""}`}
            onClick={() => setViewMode("card")}
          >
            Card View
          </button>
          <button
            className={`admin-view-btn ${viewMode === "table" ? "active" : ""}`}
            onClick={() => setViewMode("table")}
          >
            Table View
          </button>
        </div>
      </div>

      {admins.length === 0 ? (
        <p className="admin-list-status admin-list-empty">No admins found.</p>
      ) : viewMode === "card" ? (
        renderCardView()
      ) : (
        renderTableView()
      )}
    </div>
  );
};

export default ViewAllAdmins;
