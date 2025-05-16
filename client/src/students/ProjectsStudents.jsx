import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import "../styles/ProjectsStudents.css";

const ProjectsStudents = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const { studentId: paramStudentId } = useParams();

  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    donationGoal: "",
    studentId: user?.id || paramStudentId,
  });
  const [editProjectId, setEditProjectId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState("grid");

  // Fetch projects for the current student
  const fetchProjects = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/projects/studentProjects/${formData.studentId}`
      );
      setProjects(data.projects || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to fetch projects.");
    }
  };

  useEffect(() => {
    const currentStudentId = user?.id || paramStudentId;
    if (currentStudentId) {
      setFormData((prev) => ({ ...prev, studentId: currentStudentId }));
      fetchProjects();
    }
  }, [user?.id, paramStudentId]);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission for creating/updating projects
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editProjectId) {
        await axios.put(`/api/v1/projects/${editProjectId}`, formData);
        setEditProjectId(null);
      } else {
        await axios.post("/api/v1/projects/create", formData);
      }
      setFormData({
        title: "",
        description: "",
        donationGoal: "",
        studentId: user?.id || paramStudentId,
      });
      fetchProjects();
      toast.success(
        editProjectId
          ? "Project updated successfully"
          : "Project created successfully"
      );
      setIsModalOpen(false);
    } catch (error) {
      console.error(
        "Error creating/updating project:",
        error.response?.data || error.message
      );
      toast.error(
        error.response?.data?.message || "Error creating/updating project."
      );
    }
  };

  // Handle editing a project
  const handleEdit = (projectId) => {
    const project = projects.find((p) => p._id === projectId);
    if (project) {
      setFormData({
        title: project.title,
        description: project.description,
        donationGoal: project.donationGoal,
        studentId: user?.id || paramStudentId,
      });
      setEditProjectId(projectId);
      setIsModalOpen(true);
    }
  };

  // Handle deleting a project
  const handleDelete = async (projectId) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await axios.delete(`/api/v1/projects/${projectId}`);
        fetchProjects();
        toast.success("Project deleted successfully");
      } catch (error) {
        console.error("Error deleting project:", error);
        toast.error("Error deleting project.");
      }
    }
  };

  // Open modal for creating a new project
  const openCreateForm = () => {
    setFormData({
      title: "",
      description: "",
      donationGoal: "",
      studentId: user?.id || paramStudentId,
    });
    setEditProjectId(null);
    setIsModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditProjectId(null);
    setFormData({
      title: "",
      description: "",
      donationGoal: "",
      studentId: user?.id || paramStudentId,
    });
  };

  // Toggle between grid and table view
  const toggleView = () => {
    setViewMode(viewMode === "grid" ? "table" : "grid");
  };

  return (
    <div className="projects-container">
      <h1 className="projects-heading">My Projects</h1>

      <div className="projects-controls">
        <button
          className="projects-btn create-project-btn-unique"
          onClick={openCreateForm}
        >
          + Create Project
        </button>
        <button className="projects-btn toggle-view-btn" onClick={toggleView}>
          Switch to {viewMode === "grid" ? "Table" : "Grid"} View
        </button>
      </div>

      {projects?.length === 0 ? (
        <p className="no-projects-message-unique">No projects found.</p>
      ) : (
        <>
          {viewMode === "grid" ? (
            <ul className="projects-list-unique">
              {projects.map((project) => (
                <li key={project._id} className="project-item-unique">
                  <h3 className="project-title-unique">{project.title}</h3>
                  <p className="project-description-unique">
                    {project.description}
                  </p>
                  <p className="project-donation-goal-unique">
                    Donation Goal: ₹{project.donationGoal}
                  </p>
                  <p className="project-total-donated-unique">
                    Total Donated: ₹{project.totalDonated || 0}
                  </p>
                  <div className="project-actions-unique">
                    <button
                      className="projects-btn edit-btn-unique"
                      onClick={() => handleEdit(project._id)}
                    >
                      Edit
                    </button>
                    <button
                      className="projects-btn delete-btn-unique"
                      onClick={() => handleDelete(project._id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <table className="projects-table-unique">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Goal</th>
                  <th>Donated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project._id}>
                    <td>{project.title}</td>
                    <td>{project.description}</td>
                    <td>₹{project.donationGoal}</td>
                    <td>₹{project.totalDonated || 0}</td>
                    <td>
                      <div className="project-actions-table">
                        <button
                          className="projects-btn edit-btn-unique"
                          onClick={() => handleEdit(project._id)}
                          style={{ marginRight: "5px" }}
                        >
                          Edit
                        </button>
                        <button
                          className="projects-btn delete-btn-unique"
                          onClick={() => handleDelete(project._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}

      {isModalOpen && (
        <div className="modal-overlay-unique">
          <div className="modal-content-unique">
            <form className="projects-form-unique" onSubmit={handleSubmit}>
              <h2 className="form-heading-unique">
                {editProjectId ? "Edit Project" : "Create Project"}
              </h2>
              <label className="form-label-unique">
                Title:
                <input
                  className="form-input-unique"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </label>
              <label className="form-label-unique">
                Description:
                <textarea
                  className="form-textarea-unique"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </label>
              <label className="form-label-unique">
                Donation Goal (₹):
                <input
                  className="form-input-unique"
                  type="number"
                  name="donationGoal"
                  value={formData.donationGoal}
                  onChange={handleChange}
                  min="0"
                />
              </label>

              <input
                type="hidden"
                name="studentId"
                value={formData.studentId}
              />

              <button className="form-btn submit-btn-unique" type="submit">
                {editProjectId ? "Update" : "Create"}
              </button>
              <button
                className="form-btn cancel-btn-unique"
                type="button"
                onClick={closeModal}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsStudents;
