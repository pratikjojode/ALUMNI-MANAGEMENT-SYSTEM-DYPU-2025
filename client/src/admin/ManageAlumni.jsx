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
import toast from "react-hot-toast";

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
    profilePhoto: "",
    academicResult: "",
  });
  const [view, setView] = useState("card");

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const response = await fetch("/api/v1/alumni/all");
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

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this alumni?")) {
      try {
        const response = await fetch(`/api/v1/alumni/deleteAlumni/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
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
      const response = await fetch(`/api/v1/admin/approve-alumni/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setAlumni((prevAlumni) =>
          prevAlumni.map((alumnus) =>
            alumnus._id === id ? { ...alumnus, isApproved: true } : alumnus
          )
        );
        toast.success("Alumni approved successfully");
      } else {
        toast.error(data.message || "Approval failed");
      }
    } catch (error) {
      console.error("Error approving alumni:", error);
      alert("Something went wrong during approval");
    }
  };

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
      profilePhoto: alumnus.profilePhoto,
      academicResult: alumnus.academicResult,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleUpdate = async (id) => {
    try {
      const response = await fetch(`/api/v1/alumni/updateProfile/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updatedDetails),
      });
      if (response.ok) {
        setAlumni((prevAlumni) =>
          prevAlumni.map((alumnus) =>
            alumnus._id === id ? { ...alumnus, ...updatedDetails } : alumnus
          )
        );
        setEditAlumni(null);
        toast.success("Alumni updated successfully");
      } else {
        toast.error("Failed to update alumni");
      }
    } catch (error) {
      console.error("Error updating alumni:", error);
    }
  };

  return (
    <div className="alumni-management">
      <div className="alumni-management__header">
        <h2 className="alumni-management__title">Manage Alumni</h2>
        <div className="alumni-management__controls">
          <div className="alumni-management__search">
            <FaSearch className="alumni-management__search-icon" />
            <input
              type="text"
              className="alumni-management__search-input"
              placeholder="Search alumni..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="alumni-management__filter">
            <select
              className="alumni-management__filter-select"
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

          <div className="alumni-management__view-toggle">
            <button
              className={`alumni-management__view-button ${
                view === "card" ? "active" : ""
              }`}
              onClick={() => setView("card")}
            >
              <FaTh /> Card View
            </button>
            <button
              className={`alumni-management__view-button ${
                view === "table" ? "active" : ""
              }`}
              onClick={() => setView("table")}
            >
              <FaTable /> Table View
            </button>
          </div>
        </div>
      </div>

      {filteredAlumni.length === 0 ? (
        <div className="alumni-management__empty-state">
          <p className="alumni-management__empty-text">
            No alumni found matching your criteria
          </p>
        </div>
      ) : (
        <>
          {view === "card" ? (
            <div className="alumni-cards">
              {filteredAlumni.map((alumnus) => (
                <div key={alumnus._id} className="alumni-card">
                  <div className="alumni-card__header">
                    <div className="alumni-card__info">
                      <h3 className="alumni-card__name">{alumnus.name}</h3>
                      <p className="alumni-card__email">
                        <FaEnvelope className="alumni-card__email-icon" />
                        {alumnus.email}
                      </p>
                    </div>
                  </div>
                  <div className="alumni-card__detail-item">
                    {alumnus.profilePhoto ? (
                      <img
                        src={alumnus.profilePhoto}
                        alt={alumnus.name}
                        className="alumni-card__profile-photo"
                      />
                    ) : (
                      <FaUserCircle className="profile-icon" />
                    )}
                  </div>

                  <div className="alumni-card__details">
                    <div className="alumni-card__detail-item">
                      <FaPhone className="alumni-card__detail-icon" />
                      <span className="alumni-card__detail-text">
                        {alumnus.contactNo || "Not provided"}
                      </span>
                    </div>
                    <div className="alumni-card__detail-item">
                      <FaUniversity className="alumni-card__detail-icon" />
                      <span className="alumni-card__detail-text">
                        {alumnus.college} - {alumnus.branch}
                      </span>
                    </div>
                    <div className="alumni-card__detail-item">
                      <FaCalendarAlt className="alumni-card__detail-icon" />
                      <span className="alumni-card__detail-text">
                        Passout Year {alumnus.passoutYear}
                      </span>
                    </div>
                  </div>

                  <div className="alumni-card__footer">
                    <button
                      className="alumni-card__action alumni-card__action--edit"
                      onClick={() => handleEdit(alumnus)}
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      className="alumni-card__action alumni-card__action--delete"
                      onClick={() => handleDelete(alumnus._id)}
                    >
                      <FaTrash /> Delete
                    </button>
                    {alumnus.isApproved && (
                      <div className="alumni-card__approved">
                        <FiCheck className="alumni-card__approved-icon" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <table className="alumni-table">
              <thead className="alumni-table__header">
                <tr className="alumni-table__header-row">
                  <th className="alumni-table__header-cell">Name</th>
                  <th className="alumni-table__header-cell">Email</th>
                  <th className="alumni-table__header-cell">Contact</th>
                  <th className="alumni-table__header-cell">College</th>
                  <th className="alumni-table__header-cell">Branch</th>
                  <th className="alumni-table__header-cell">Passout Year</th>
                  <th className="alumni-table__header-cell">Company</th>
                  <th className="alumni-table__header-cell">Location</th>
                  <th className="alumni-table__header-cell">Designation</th>
                  <th className="alumni-table__header-cell">Actions</th>
                  <th className="alumni-table__header-cell">LinkedIn</th>
                  <th className="alumni-table__header-cell">Instagram</th>
                  <th className="alumni-table__header-cell">createdAt</th>
                  <th className="alumni-table__header-cell">Academic Result</th>
                </tr>
              </thead>
              <tbody className="alumni-table__body">
                {filteredAlumni.map((alumnus) => (
                  <tr key={alumnus._id} className="alumni-table__row">
                    <td className="alumni-table__cell">{alumnus.name}</td>
                    <td className="alumni-table__cell">{alumnus.email}</td>
                    <td className="alumni-table__cell">
                      {alumnus.contactNo || "Not provided"}
                    </td>
                    <td className="alumni-table__cell">{alumnus.college}</td>
                    <td className="alumni-table__cell">{alumnus.branch}</td>
                    <td className="alumni-table__cell">
                      {alumnus.passoutYear}
                    </td>
                    <td className="alumni-table__cell">
                      {alumnus.currentCompany || "Not specified"}
                    </td>
                    <td className="alumni-table__cell">
                      {alumnus.location || "Not specified"}
                    </td>
                    <td className="alumni-table__cell">
                      {alumnus.designation || "Not specified"}
                    </td>
                    <td className="alumni-table__cell alumni-table__actions">
                      <button
                        className="alumni-table__action alumni-table__action--edit"
                        onClick={() => handleEdit(alumnus)}
                      >
                        Edit
                      </button>
                      <button
                        className="alumni-table__action alumni-table__action--delete"
                        onClick={() => handleDelete(alumnus._id)}
                      >
                        Delete
                      </button>
                      {alumnus.isApproved ? (
                        <span className="alumni-table__approved">Approved</span>
                      ) : (
                        <button
                          className="alumni-table__action alumni-table__action--approve"
                          onClick={() => handleApprove(alumnus._id)}
                        >
                          Approve
                        </button>
                      )}
                    </td>

                    <td>
                      {alumnus.LinkedIn ? (
                        <a
                          href={alumnus.LinkedIn}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-link"
                        >
                          LinkedIn
                        </a>
                      ) : (
                        <span className="no-link">N/A</span>
                      )}
                    </td>
                    <td>
                      {alumnus.Instagram ? (
                        <a
                          href={alumnus.Instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-link"
                        >
                          Instagram
                        </a>
                      ) : (
                        <span className="no-link">N/A</span>
                      )}
                    </td>
                    <td>{new Date(alumnus.createdAt).toLocaleDateString()}</td>
                    <td>
                      {alumnus.academicResult ? (
                        <a
                          href={alumnus.academicResult}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="view-btn"
                        >
                          View
                        </a>
                      ) : (
                        <span className="no-result">Not provided</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}

      {editAlumni && (
        <div className="alumni-modal">
          <div className="alumni-modal__content">
            <div className="alumni-modal__header">
              <h3 className="alumni-modal__title">Edit Alumni Details</h3>
              <button
                className="alumni-modal__close"
                onClick={() => setEditAlumni(null)}
              >
                <FaTimes />
              </button>
            </div>

            <form
              className="alumni-modal__form"
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdate(editAlumni._id);
              }}
            >
              <div className="alumni-modal__form-grid">
                <div className="alumni-modal__form-group">
                  <label className="alumni-modal__label">
                    <FaUser className="alumni-modal__label-icon" /> Name
                  </label>
                  <input
                    type="text"
                    className="alumni-modal__input"
                    name="name"
                    value={updatedDetails.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="alumni-modal__form-group">
                  <label className="alumni-modal__label">
                    <FaEnvelope className="alumni-modal__label-icon" /> Email
                  </label>
                  <input
                    type="email"
                    className="alumni-modal__input"
                    name="email"
                    value={updatedDetails.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="alumni-modal__form-group">
                  <label className="alumni-modal__label">
                    <FaPhone className="alumni-modal__label-icon" /> Contact
                  </label>
                  <input
                    type="text"
                    className="alumni-modal__input"
                    name="contactNo"
                    value={updatedDetails.contactNo}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="alumni-modal__form-group">
                  <label className="alumni-modal__label">
                    <FaUniversity className="alumni-modal__label-icon" />{" "}
                    College
                  </label>
                  <input
                    type="text"
                    className="alumni-modal__input"
                    name="college"
                    value={updatedDetails.college}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="alumni-modal__form-group">
                  <label className="alumni-modal__label">
                    <FaGraduationCap className="alumni-modal__label-icon" />{" "}
                    Branch
                  </label>
                  <input
                    type="text"
                    className="alumni-modal__input"
                    name="branch"
                    value={updatedDetails.branch}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="alumni-modal__form-group">
                  <label className="alumni-modal__label">
                    <FaCalendarAlt className="alumni-modal__label-icon" />{" "}
                    Passout Year
                  </label>
                  <input
                    type="text"
                    className="alumni-modal__input"
                    name="passoutYear"
                    value={updatedDetails.passoutYear}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="alumni-modal__form-group">
                  <label className="alumni-modal__label">
                    <FaBriefcase className="alumni-modal__label-icon" /> Company
                  </label>
                  <input
                    type="text"
                    className="alumni-modal__input"
                    name="currentCompany"
                    value={updatedDetails.currentCompany}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="alumni-modal__form-group">
                  <label className="alumni-modal__label">
                    <FaUserTie className="alumni-modal__label-icon" />{" "}
                    Designation
                  </label>
                  <input
                    type="text"
                    className="alumni-modal__input"
                    name="designation"
                    value={updatedDetails.designation}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="alumni-modal__form-group">
                  <label className="alumni-modal__label">
                    <FaMapMarkerAlt className="alumni-modal__label-icon" />{" "}
                    Location
                  </label>
                  <input
                    type="text"
                    className="alumni-modal__input"
                    name="location"
                    value={updatedDetails.location}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="alumni-modal__form-group">
                  <label className="alumni-modal__label">
                    <FaLinkedin className="alumni-modal__label-icon" /> LinkedIn
                  </label>
                  <input
                    type="text"
                    className="alumni-modal__input"
                    name="LinkedIn"
                    value={updatedDetails.LinkedIn}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="alumni-modal__form-group">
                  <label className="alumni-modal__label">
                    <FaInstagram className="alumni-modal__label-icon" />{" "}
                    Instagram
                  </label>
                  <input
                    type="text"
                    className="alumni-modal__input"
                    name="Instagram"
                    value={updatedDetails.Instagram}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="alumni-modal__form-actions">
                <button
                  type="submit"
                  className="alumni-modal__button alumni-modal__button--save"
                >
                  <FaSave /> Save Changes
                </button>
                <button
                  type="button"
                  className="alumni-modal__button alumni-modal__button--cancel"
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
