import React, { useState, useEffect } from "react";
import {
  FaEdit,
  FaTrash,
  FaEnvelope,
  FaPhone,
  FaUniversity,
  FaCalendarAlt,
  FaIdCard,
  FaUserTag,
  FaUserCircle,
} from "react-icons/fa";
import "../styles/manageStudents.css";

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [view, setView] = useState("card");
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    contactNo: "",
    college: "",
    branch: "",
    admissionYear: "",
    prn: "",
    role: "",
  });

  const [dropdownOptions, setDropdownOptions] = useState({
    colleges: [],
    branches: [],
    admissionYears: [],
    roles: [],
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactNo: "",
    college: "",
    branch: "",
    admissionYear: "",
    prn: "",
    profilePhoto: "",
    role: "student",
  });

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch("/api/v1/admin/allStudents", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setStudents(data.students);
          populateDropdownOptions(data.students); // Populate dropdown options dynamically
        } else {
          console.error("Failed to fetch students:", data.message);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };
    fetchStudents();
  }, []);

  // Extract unique values for dropdowns
  const populateDropdownOptions = (students) => {
    const colleges = Array.from(
      new Set(students.map((student) => student.college))
    );
    const branches = Array.from(
      new Set(students.map((student) => student.branch))
    );
    const admissionYears = Array.from(
      new Set(students.map((student) => student.admissionYear))
    );
    const roles = Array.from(new Set(students.map((student) => student.role)));

    setDropdownOptions({
      colleges,
      branches,
      admissionYears,
      roles,
    });
  };

  const handleDelete = async (studentId) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        const res = await fetch(`/api/v1/admin/delete-student/${studentId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          alert("Student deleted successfully");
          setStudents((prev) =>
            prev.filter((student) => student._id !== studentId)
          );
        } else {
          alert(data.message || "Failed to delete student");
        }
      } catch (error) {
        console.error("Error deleting student:", error);
      }
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name || "",
      email: student.email || "",
      contactNo: student.contactNo || "",
      college: student.college || "",
      branch: student.branch || "",
      admissionYear: student.admissionYear || "",
      prn: student.prn || "",
      profilePhoto: student.profilePhoto || "",
      role: student.role || "student",
    });
  };

  const handleFormChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `/api/v1/admin/update-student/${editingStudent._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (res.ok) {
        alert("Student updated successfully");
        setStudents((prev) =>
          prev.map((s) => (s._id === editingStudent._id ? data.student : s))
        );
        setEditingStudent(null);
      } else {
        alert(data.message || "Update failed");
      }
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const closeModal = () => {
    setEditingStudent(null);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const filteredStudents = students.filter((student) => {
    // Search term matches any field
    const matchesSearch = Object.values(student)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    // Filters match specific fields
    const matchesFilters = Object.keys(filters).every((key) =>
      filters[key]
        ? student[key]
            ?.toString()
            .toLowerCase()
            .includes(filters[key].toLowerCase())
        : true
    );

    return matchesSearch && matchesFilters;
  });

  return (
    <div className="ms-page-container">
      <h2 className="ms-page-header">Manage Students</h2>

      {/* Filters Section */}
      <div className="ms-filters-container">
        <input
          type="text"
          placeholder="Search anything"
          value={searchTerm}
          onChange={handleSearchChange}
          className="ms-search-input"
        />
        <select
          name="college"
          value={filters.college}
          onChange={handleFilterChange}
          className="ms-filter-select"
        >
          <option value="">All Colleges</option>
          {dropdownOptions.colleges.map((college) => (
            <option key={college} value={college}>
              {college}
            </option>
          ))}
        </select>
        <select
          name="branch"
          value={filters.branch}
          onChange={handleFilterChange}
          className="ms-filter-select"
        >
          <option value="">All Branches</option>
          {dropdownOptions.branches.map((branch) => (
            <option key={branch} value={branch}>
              {branch}
            </option>
          ))}
        </select>
        <select
          name="admissionYear"
          value={filters.admissionYear}
          onChange={handleFilterChange}
          className="ms-filter-select"
        >
          <option value="">All Admission Years</option>
          {dropdownOptions.admissionYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <select
          name="role"
          value={filters.role}
          onChange={handleFilterChange}
          className="ms-filter-select"
        >
          <option value="">All Roles</option>
          {dropdownOptions.roles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>

      <div className="ms-view-switcher">
        <button
          className={`ms-view-button ${
            view === "card" ? "ms-active-view" : ""
          }`}
          onClick={() => setView("card")}
        >
          Card View
        </button>
        <button
          className={`ms-view-button ${
            view === "table" ? "ms-active-view" : ""
          }`}
          onClick={() => setView("table")}
        >
          Table View
        </button>
      </div>

      {/* Render Students */}
      {view === "card" ? (
        <div className="ms-card-container">
          {filteredStudents.map((student) => (
            <div className="ms-student-card" key={student._id}>
              <div className="ms-card-header">
                {student.profilePhoto ? (
                  <img
                    src={student.profilePhoto}
                    alt={student.name}
                    className="ms-student-photo"
                  />
                ) : (
                  <FaUserCircle className="ms-student-icon" />
                )}
                <h3 className="ms-student-name">{student.name}</h3>
              </div>
              <div className="ms-card-content">
                <div className="ms-info-row">
                  <FaEnvelope className="ms-info-icon" />
                  <span>{student.email}</span>
                </div>
                <div className="ms-info-row">
                  <FaPhone className="ms-info-icon" />
                  <span>{student.contactNo}</span>
                </div>
                <div className="ms-info-row">
                  <FaUniversity className="ms-info-icon" />
                  <span>{student.college}</span>
                </div>
                <div className="ms-info-row">
                  <FaUserTag className="ms-info-icon" />
                  <span>{student.branch}</span>
                </div>
                <div className="ms-info-row">
                  <FaCalendarAlt className="ms-info-icon" />
                  <span>{student.admissionYear}</span>
                </div>
                <div className="ms-info-row">
                  <FaIdCard className="ms-info-icon" />
                  <span>PRN: {student.prn}</span>
                </div>
              </div>
              <div className="ms-card-actions">
                <button
                  className="ms-edit-button"
                  onClick={() => handleEdit(student)}
                >
                  <FaEdit /> Edit
                </button>
                <button
                  className="ms-delete-button"
                  onClick={() => handleDelete(student._id)}
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="ms-table-container">
          <table className="ms-students-table">
            <thead className="ms-table-header">
              <tr>
                <th>Photo</th>
                <th>Name</th>
                <th>Email</th>
                <th>Contact</th>
                <th>College</th>
                <th>Branch</th>
                <th>Years</th>
                <th>PRN</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="ms-table-body">
              {filteredStudents.map((student) => (
                <tr key={student._id} className="ms-table-row">
                  <td>
                    {student.profilePhoto ? (
                      <img
                        src={student.profilePhoto}
                        alt="Profile"
                        className="ms-table-photo"
                      />
                    ) : (
                      <FaUserCircle className="ms-table-icon" />
                    )}
                  </td>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.contactNo}</td>
                  <td>{student.college}</td>
                  <td>{student.branch}</td>
                  <td>{student.admissionYear}</td>
                  <td>{student.prn}</td>
                  <td>{student.role}</td>
                  <td className="ms-actions-cell">
                    <button
                      className="ms-table-edit-button"
                      onClick={() => handleEdit(student)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="ms-table-delete-button"
                      onClick={() => handleDelete(student._id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editingStudent && (
        <div className="ms-modal-backdrop">
          <div className="ms-modal-content">
            <div className="ms-modal-header">
              <h3 className="ms-modal-title">Edit Student</h3>
              <button className="ms-modal-close" onClick={closeModal}>
                &times;
              </button>
            </div>
            <form onSubmit={handleUpdateSubmit} className="ms-edit-form">
              <div className="ms-form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                />
              </div>

              <div className="ms-form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                />
              </div>

              <div className="ms-form-group">
                <label>Contact Number</label>
                <input
                  type="text"
                  name="contactNo"
                  value={formData.contactNo}
                  onChange={handleFormChange}
                />
              </div>

              <div className="ms-form-row">
                <div className="ms-form-group">
                  <label>College</label>
                  <input
                    type="text"
                    name="college"
                    value={formData.college}
                    onChange={handleFormChange}
                  />
                </div>

                <div className="ms-form-group">
                  <label>Branch</label>
                  <input
                    type="text"
                    name="branch"
                    value={formData.branch}
                    onChange={handleFormChange}
                  />
                </div>
              </div>

              <div className="ms-form-row">
                <div className="ms-form-group">
                  <label>Admission Year</label>
                  <input
                    type="text"
                    name="admissionYear"
                    value={formData.admissionYear}
                    onChange={handleFormChange}
                  />
                </div>
              </div>

              <div className="ms-form-group">
                <label>PRN</label>
                <input
                  type="text"
                  name="prn"
                  value={formData.prn}
                  onChange={handleFormChange}
                />
              </div>

              <div className="ms-form-group">
                <label>Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleFormChange}
                  className="ms-role-select"
                >
                  <option value="student">Student</option>
                  <option value="admin">Admin</option>
                  <option value="alumni">Alumni</option>
                </select>
              </div>

              <div className="ms-form-group">
                <label>Profile Photo URL</label>
                <input
                  type="text"
                  name="profilePhoto"
                  value={formData.profilePhoto}
                  onChange={handleFormChange}
                />
                {formData.profilePhoto && (
                  <img
                    src={formData.profilePhoto}
                    alt="Preview"
                    className="ms-photo-preview"
                  />
                )}
              </div>

              <div className="ms-form-actions">
                <button type="submit" className="ms-submit-button">
                  Update Student
                </button>
                <button
                  type="button"
                  className="ms-cancel-button"
                  onClick={closeModal}
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

export default ManageStudents;
