import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaUniversity,
  FaGraduationCap,
  FaCalendarAlt,
  FaBriefcase,
  FaUserTie,
  FaMapMarkerAlt,
  FaLinkedin,
  FaInstagram,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaSearch,
  FaTable,
  FaTh,
} from "react-icons/fa";
import "../styles/ManageAlumni.css";
import { FiCheck } from "react-icons/fi";

const ManageAlumni = () => {
  const [alumni, setAlumni] = useState([]);
  const [editAlumni, setEditAlumni] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [updatedDetails, setUpdatedDetails] = useState({
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
  });
  const [view, setView] = useState("card"); // Toggle between "card" and "table" view

  // Fetch alumni data
  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/v1/alumni/all");
        const data = await response.json();
        setAlumni(data.alumni);
      } catch (error) {
        console.error("Error fetching alumni:", error);
      }
    };
    fetchAlumni();
  }, []);

  const filteredAlumni = alumni.filter((alumnus) => {
    const matchesSearch =
      alumnus.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alumnus.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear =
      filterYear === "" || alumnus.passoutYear.toString() === filterYear;
    return matchesSearch && matchesYear;
  });

  // Delete alumni
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this alumni?")) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/v1/alumni/deleteAlumni/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.ok) {
          setAlumni((prevAlumni) =>
            prevAlumni.filter((alumnus) => alumnus._id !== id)
          );
        } else {
          alert("Failed to delete alumni");
        }
      } catch (error) {
        console.error("Error deleting alumni:", error);
      }
    }
  };

  const handleApprove = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/admin/approve-alumni/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        setAlumni((prevAlumni) =>
          prevAlumni.map((alumnus) =>
            alumnus._id === id ? { ...alumnus, isApproved: true } : alumnus
          )
        );
        alert("Alumni approved successfully");
      } else {
        alert(data.message || "Approval failed");
      }
    } catch (error) {
      console.error("Error approving alumni:", error);
      alert("Something went wrong during approval");
    }
  };

  // Handle edit button click
  const handleEdit = (alumnus) => {
    setEditAlumni(alumnus);
    setUpdatedDetails({
      name: alumnus.name,
      email: alumnus.email,
      contactNo: alumnus.contactNo,
      college: alumnus.college,
      branch: alumnus.branch,
      passoutYear: alumnus.passoutYear,
      currentCompany: alumnus.currentCompany,
      designation: alumnus.designation,
      location: alumnus.location,
      LinkedIn: alumnus.LinkedIn,
      Instagram: alumnus.Instagram,
    });
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  // Handle update submission
  const handleUpdate = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/alumni/updateProfile/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(updatedDetails),
        }
      );
      if (response.ok) {
        setAlumni((prevAlumni) =>
          prevAlumni.map((alumnus) =>
            alumnus._id === id ? { ...alumnus, ...updatedDetails } : alumnus
          )
        );
        setEditAlumni(null);
      } else {
        alert("Failed to update alumni");
      }
    } catch (error) {
      console.error("Error updating alumni:", error);
    }
  };

  return (
    <div className="manage-alumni-container">
      <div className="alumni-header">
        <h2>Manage Alumni</h2>
        <div className="alumni-controls">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search alumni..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-dropdown">
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
            >
              <option value="">All Years</option>
              {[...new Set(alumni.map((a) => a.passoutYear))]
                .sort((a, b) => b - a)
                .map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
            </select>
          </div>
          <div className="view-toggle">
            <button onClick={() => setView("card")}>
              <FaTh /> Card View
            </button>
            <button onClick={() => setView("table")}>
              <FaTable /> Table View
            </button>
          </div>
        </div>
      </div>

      {filteredAlumni.length === 0 ? (
        <div className="no-alumni">
          <p>No alumni found matching your criteria</p>
        </div>
      ) : (
        <>
          {view === "card" ? (
            <div className="alumni-grid">
              {filteredAlumni.map((alumnus) => (
                <div key={alumnus._id} className="alumni-card">
                  <div className="card-header">
                    <div className="alumni-avatar">
                      {alumnus.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="alumni-info">
                      <h3>{alumnus.name}</h3>
                      <p className="alumni-email">
                        <FaEnvelope /> {alumnus.email}
                      </p>
                    </div>
                  </div>

                  <div className="card-details">
                    <div className="detail-item">
                      <FaPhone className="detail-icon" />
                      <span>{alumnus.contactNo || "Not provided"}</span>
                    </div>
                    <div className="detail-item">
                      <FaUniversity className="detail-icon" />
                      <span>
                        {alumnus.college} - {alumnus.branch}
                      </span>
                    </div>
                    <div className="detail-item">
                      <FaCalendarAlt className="detail-icon" />
                      <span>Class of {alumnus.passoutYear}</span>
                    </div>
                  </div>

                  <div className="card-footer">
                    <button onClick={() => handleEdit(alumnus)}>
                      <FaEdit /> Edit
                    </button>
                    <button onClick={() => handleDelete(alumnus._id)}>
                      <FaTrash /> Delete
                    </button>
                    {alumnus.isApproved && (
                      <p>
                        <FiCheck size={24} />
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <table className="alumni-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Contact</th>
                  <th>College</th>
                  <th>Branch</th>
                  <th>Year</th>
                  <th>Company</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAlumni.map((alumnus) => (
                  <tr key={alumnus._id}>
                    <td>{alumnus.name}</td>
                    <td>{alumnus.email}</td>
                    <td>{alumnus.contactNo || "Not provided"}</td>
                    <td>{alumnus.college}</td>
                    <td>{alumnus.branch}</td>
                    <td>{alumnus.passoutYear}</td>
                    <td>{alumnus.currentCompany || "Not specified"}</td>
                    <td>
                      <button onClick={() => handleEdit(alumnus)}>Edit</button>
                      <button onClick={() => handleDelete(alumnus._id)}>
                        Delete
                      </button>
                      {alumnus.isApproved ? (
                        <span className="approved-text">Approved</span>
                      ) : (
                        <button onClick={() => handleApprove(alumnus._id)}>
                          Approve
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}

      {/* Edit Modal */}
      {editAlumni && (
        <div className="edit-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Edit Alumni Details</h3>
              <button className="close-btn" onClick={() => setEditAlumni(null)}>
                <FaTimes />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdate(editAlumni._id);
              }}
            >
              <div className="form-grid">
                <div className="form-group">
                  <label>
                    <FaUser /> Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={updatedDetails.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    <FaEnvelope /> Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={updatedDetails.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    <FaPhone /> Contact
                  </label>
                  <input
                    type="text"
                    name="contactNo"
                    value={updatedDetails.contactNo}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>
                    <FaUniversity /> College
                  </label>
                  <input
                    type="text"
                    name="college"
                    value={updatedDetails.college}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>
                    <FaGraduationCap /> Branch
                  </label>
                  <input
                    type="text"
                    name="branch"
                    value={updatedDetails.branch}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>
                    <FaCalendarAlt /> Passout Year
                  </label>
                  <input
                    type="text"
                    name="passoutYear"
                    value={updatedDetails.passoutYear}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>
                    <FaBriefcase /> Company
                  </label>
                  <input
                    type="text"
                    name="currentCompany"
                    value={updatedDetails.currentCompany}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>
                    <FaUserTie /> Designation
                  </label>
                  <input
                    type="text"
                    name="designation"
                    value={updatedDetails.designation}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>
                    <FaMapMarkerAlt /> Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={updatedDetails.location}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>
                    <FaLinkedin /> LinkedIn
                  </label>
                  <input
                    type="text"
                    name="LinkedIn"
                    value={updatedDetails.LinkedIn}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>
                    <FaInstagram /> Instagram
                  </label>
                  <input
                    type="text"
                    name="Instagram"
                    value={updatedDetails.Instagram}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="save-btn">
                  <FaSave /> Save Changes
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setEditAlumni(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAlumni;
