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
  FaLock,
} from "react-icons/fa";
import "../styles/ManageAlumni.css";
import { FiCheck } from "react-icons/fi";
import toast from "react-hot-toast";
import dummyProfile from "../assets/profile.png";

const ManageAlumni = () => {
  const [alumni, setAlumni] = useState([]);
  const [filters, setFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [editAlumni, setEditAlumni] = useState(null);
  const [updatedDetails, setUpdatedDetails] = useState({
    name: "",
    email: "",
    contactNo: "",
    profilePhoto: "",
    college: "",
    branch: "",
    passoutYear: "",
    currentCompany: "",
    designation: "",
    location: "",
    LinkedIn: "",
    Instagram: "",
    academicResult: "",
    role: "",
    password: "",
    isApproved: false,
    isVisible: true,
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
        toast.error("Failed to fetch alumni data.");
      }
    };
    fetchAlumni();
  }, []);

  const getUniqueValues = (field) => {
    return [...new Set(alumni.map((alumnus) => alumnus[field]))].filter(
      Boolean
    );
  };

  const filteredAlumni = alumni.filter((alumnus) => {
    const matchesSearchTerm = alumnus.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilters = Object.entries(filters).every(([field, value]) => {
      if (!value) return true; // No filter applied to this field
      if (typeof alumnus[field] === "boolean") {
        return (
          (value === "Yes" && alumnus[field]) ||
          (value === "No" && !alumnus[field])
        );
      }
      return alumnus[field]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase());
    });
    return matchesSearchTerm && matchesFilters;
  });

  const handleFilterChange = (field, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value,
    }));
  };

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
          toast.success("Alumni deleted successfully");
        } else {
          toast.error("Failed to delete alumni");
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

      if (response.ok) {
        setAlumni((prevAlumni) =>
          prevAlumni.map((alumnus) =>
            alumnus._id === id ? { ...alumnus, isApproved: true } : alumnus
          )
        );
        toast.success("Alumni approved successfully");
      } else {
        toast.error("Failed to approve alumni");
      }
    } catch (error) {
      console.error("Error approving alumni:", error);
    }
  };

  const handleEdit = (alumnus) => {
    setEditAlumni(alumnus);
    setUpdatedDetails({
      name: alumnus.name,
      email: alumnus.email,
      contactNo: alumnus.contactNo,
      profilePhoto: alumnus.profilePhoto,
      college: alumnus.college,
      branch: alumnus.branch,
      passoutYear: alumnus.passoutYear,
      currentCompany: alumnus.currentCompany,
      designation: alumnus.designation,
      location: alumnus.location,
      LinkedIn: alumnus.LinkedIn,
      Instagram: alumnus.Instagram,
      academicResult: alumnus.academicResult,
      role: alumnus.role,
      password: alumnus.password,
      isApproved: alumnus.isApproved,
      isVisible: alumnus.isVisible,
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
    <div className="manage-alumni">
      <div className="manage-alumni__header">
        <h2 className="manage-alumni__title">Manage Alumni</h2>
        <div className="manage-alumni__controls">
          <div className="manage-alumni__search">
            <label htmlFor="searchTerm">Search by Name:</label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Type name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="manage-alumni__search-input"
            />
          </div>
          {[
            { field: "name", label: "Name" },
            { field: "email", label: "Email" },
            { field: "contactNo", label: "Contact Number" },
            { field: "college", label: "College" },
            { field: "branch", label: "Branch" },
            { field: "passoutYear", label: "Passout Year" },
            { field: "currentCompany", label: "Company" },
            { field: "designation", label: "Designation" },
            { field: "location", label: "Location" },
            { field: "LinkedIn", label: "LinkedIn" },
            { field: "Instagram", label: "Instagram" },
            { field: "academicResult", label: "Academic Result" },
            { field: "role", label: "Role" },
            { field: "isApproved", label: "Approved", isBoolean: true },
            { field: "isVisible", label: "Visible", isBoolean: true },
          ].map(({ field, label, isBoolean }) => (
            <div key={field} className="manage-alumni__filter">
              <label>{label}</label>
              <select
                value={filters[field] || ""}
                onChange={(e) => handleFilterChange(field, e.target.value)}
              >
                <option value="">All</option>
                {isBoolean ? (
                  <>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </>
                ) : (
                  getUniqueValues(field).map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))
                )}
              </select>
            </div>
          ))}
          <div className="manage-alumni__view-toggle">
            <button
              className={`manage-alumni__view-btn ${
                view === "card" ? "manage-alumni__view-btn--active" : ""
              }`}
              onClick={() => setView("card")}
            >
              <FaTh /> Card View
            </button>
            <button
              className={`manage-alumni__view-btn ${
                view === "table" ? "manage-alumni__view-btn--active" : ""
              }`}
              onClick={() => setView("table")}
            >
              <FaTable /> Table View
            </button>
          </div>
        </div>
      </div>

      {filteredAlumni.length === 0 ? (
        <div className="manage-alumni__empty-state">
          <p>No alumni found matching your criteria.</p>
        </div>
      ) : view === "card" ? (
        <div className="manage-alumni__cards">
          {filteredAlumni.map((alumnus) => (
            <div key={alumnus._id} className="manage-alumni__card">
              <div className="manage-alumni__card-header">
                <h3>{alumnus.name}</h3>
                <p>
                  <FaEnvelope /> {alumnus.email}
                </p>
              </div>
              <div className="manage-alumni__card-body">
                <img
                  src={alumnus.profilePhoto || dummyProfile}
                  alt={alumnus.name}
                  className="manage-alumni__photo"
                />
                <p>
                  <FaPhone /> {alumnus.contactNo || "Not Available"}
                </p>
                <p>
                  <FaUniversity /> {alumnus.college}
                </p>
              </div>
              <div className="manage-alumni__card-footer">
                <button onClick={() => handleEdit(alumnus)}>
                  <FaEdit /> Edit
                </button>
                <button onClick={() => handleDelete(alumnus._id)}>
                  <FaTrash /> Delete
                </button>
                {!alumnus.isApproved && (
                  <button onClick={() => handleApprove(alumnus._id)}>
                    <FiCheck /> Approve
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <table className="manage-alumni__table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Contact</th>
              <th>College</th>
              <th>Branch</th>
              <th>Passout Year</th>
              <th>Company</th>
              <th>Designation</th>
              <th>Location</th>
              <th>Approved</th>
              <th>Visible</th>
            </tr>
          </thead>
          <tbody>
            {filteredAlumni.map((alumnus) => (
              <tr key={alumnus._id}>
                <td>{alumnus.name}</td>
                <td>{alumnus.email}</td>
                <td>{alumnus.contactNo}</td>
                <td>{alumnus.college}</td>
                <td>{alumnus.branch}</td>
                <td>{alumnus.passoutYear}</td>
                <td>{alumnus.currentCompany}</td>
                <td>{alumnus.designation}</td>
                <td>{alumnus.location}</td>
                <td>{alumnus.isApproved ? "Yes" : "No"}</td>
                <td>{alumnus.isVisible ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {editAlumni && (
        <div className="manage-alumni__modal">
          <div className="manage-alumni__modal-content">
            <h3>Edit Alumni Details</h3>
            <button
              className="manage-alumni__modal-close"
              onClick={() => setEditAlumni(null)}
            >
              <FaTimes />
            </button>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdate(editAlumni._id);
              }}
            >
              <label>
                <FaUser /> Name:
                <input
                  type="text"
                  name="name"
                  value={updatedDetails.name}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                <FaEnvelope /> Email:
                <input
                  type="email"
                  name="email"
                  value={updatedDetails.email}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                <FaPhone /> Contact:
                <input
                  type="text"
                  name="contactNo"
                  value={updatedDetails.contactNo}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                <FaUniversity /> College:
                <input
                  type="text"
                  name="college"
                  value={updatedDetails.college}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                <FaGraduationCap /> Branch:
                <input
                  type="text"
                  name="branch"
                  value={updatedDetails.branch}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                <FaCalendarAlt /> Passout Year:
                <input
                  type="text"
                  name="passoutYear"
                  value={updatedDetails.passoutYear}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                <FaBriefcase /> Company:
                <input
                  type="text"
                  name="currentCompany"
                  value={updatedDetails.currentCompany}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                <FaUserTie /> Designation:
                <input
                  type="text"
                  name="designation"
                  value={updatedDetails.designation}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                <FaMapMarkerAlt /> Location:
                <input
                  type="text"
                  name="location"
                  value={updatedDetails.location}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                <FaLinkedin /> LinkedIn:
                <input
                  type="text"
                  name="LinkedIn"
                  value={updatedDetails.LinkedIn}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                <FaInstagram /> Instagram:
                <input
                  type="text"
                  name="Instagram"
                  value={updatedDetails.Instagram}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                <FaUser /> Profile Photo URL:
                <input
                  type="text"
                  name="profilePhoto"
                  value={updatedDetails.profilePhoto}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                <FaLock /> Password:
                <input
                  type="password"
                  name="password"
                  value={updatedDetails.password}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                <input
                  type="checkbox"
                  name="isVisible"
                  checked={updatedDetails.isVisible}
                  onChange={(e) =>
                    setUpdatedDetails((prev) => ({
                      ...prev,
                      isVisible: e.target.checked,
                    }))
                  }
                />
                Is Visible
              </label>
              <button type="submit">
                <FaSave /> Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAlumni;
