import React, { useState, useEffect } from "react";
import {
  FaEdit,
  FaTrash,
  FaEnvelope,
  FaPhone,
  FaUniversity,
  FaGraduationCap,
  FaCalendarAlt,
  FaIdCard,
  FaLightbulb,
  FaUserTag,
  FaUserCircle,
} from "react-icons/fa";
import "../styles/manageStudents.css";

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [view, setView] = useState("card");
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactNo: "",
    college: "",
    branch: "",
    admissionYear: "",
    passoutYear: "",
    prn: "",
    projectIdea: "",
    profilePhoto: "",
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
        } else {
          console.error("Failed to fetch students:", data.message);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };
    fetchStudents();
  }, []);

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

  return (
    <div className="manage-students-container">
      <h2 className="alumni-header">Manage Students</h2>

      <div className="view-toggle-container">
        <button
          className={`view-toggle ${view === "card" ? "active" : ""}`}
          onClick={() => setView("card")}
        >
          Card View
        </button>
        <button
          className={`view-toggle ${view === "table" ? "active" : ""}`}
          onClick={() => setView("table")}
        >
          Table View
        </button>
      </div>

      {view === "card" ? (
        <div className="card-grid">
          {students.map((student) => (
            <div className="student-card" key={student._id}>
              <div className="card-header">
                {student.profilePhoto ? (
                  <img
                    src={student.profilePhoto}
                    alt={student.name}
                    className="profile-photo"
                  />
                ) : (
                  <FaUserCircle className="profile-icon" />
                )}
                <h3>{student.name}</h3>
              </div>
              <div className="card-body">
                <div className="info-row">
                  <FaEnvelope className="info-icon" />
                  <span>{student.email}</span>
                </div>
                <div className="info-row">
                  <FaPhone className="info-icon" />
                  <span>{student.contactNo}</span>
                </div>
                <div className="info-row">
                  <FaUniversity className="info-icon" />
                  <span>{student.college}</span>
                </div>
                <div className="info-row">
                  <FaUserTag className="info-icon" />
                  <span>{student.branch}</span>
                </div>
                <div className="info-row">
                  <FaCalendarAlt className="info-icon" />
                  <span>{student.admissionYear}</span>
                </div>
                <div className="info-row">
                  <FaIdCard className="info-icon" />
                  <span>PRN: {student.prn}</span>
                </div>
              </div>
              <div className="card-actions">
                <button
                  className="edit-btn"
                  onClick={() => handleEdit(student)}
                >
                  <FaEdit /> Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(student._id)}
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="table-container">
          <table className="students-table">
            <thead>
              <tr>
                <th>Photo</th>
                <th>Name</th>
                <th>Email</th>
                <th>Contact</th>
                <th>College</th>
                <th>Branch</th>
                <th>Years</th>
                <th>PRN</th>

                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id}>
                  <td>
                    {student.profilePhoto ? (
                      <img
                        src={student.profilePhoto}
                        alt="Profile"
                        className="table-profile-photo"
                      />
                    ) : (
                      <FaUserCircle className="table-icon" />
                    )}
                  </td>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.contactNo}</td>
                  <td>{student.college}</td>
                  <td>{student.branch}</td>
                  <td>{student.admissionYear}</td>
                  <td>{student.prn}</td>

                  <td className="action-cell">
                    <button
                      className="table-edit"
                      onClick={() => handleEdit(student)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="table-delete"
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
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Edit Student</h3>
              <button className="close-modal" onClick={closeModal}>
                &times;
              </button>
            </div>
            <form onSubmit={handleUpdateSubmit} className="student-form">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                />
              </div>

              <div className="form-group">
                <label>Contact Number</label>
                <input
                  type="text"
                  name="contactNo"
                  value={formData.contactNo}
                  onChange={handleFormChange}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>College</label>
                  <input
                    type="text"
                    name="college"
                    value={formData.college}
                    onChange={handleFormChange}
                  />
                </div>

                <div className="form-group">
                  <label>Branch</label>
                  <input
                    type="text"
                    name="branch"
                    value={formData.branch}
                    onChange={handleFormChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Admission Year</label>
                  <input
                    type="text"
                    name="admissionYear"
                    value={formData.admissionYear}
                    onChange={handleFormChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>PRN</label>
                <input
                  type="text"
                  name="prn"
                  value={formData.prn}
                  onChange={handleFormChange}
                />
              </div>

              <div className="form-group">
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
                    className="photo-preview"
                  />
                )}
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-btn">
                  Update Student
                </button>
                <button
                  type="button"
                  className="cancel-btn"
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
