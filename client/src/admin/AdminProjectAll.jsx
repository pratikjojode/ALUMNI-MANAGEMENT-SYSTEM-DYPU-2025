import axios from "axios";
import React, { useEffect, useState } from "react";
import "../styles/AdminProjectAll.css";

const AdminProjectAll = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("card");

  const fetchProjectsForAdmin = async () => {
    try {
      const response = await axios.get(
        "/api/v1/projects/getAllProjectsForAdmin"
      );
      if (response.data && response.data.projects) {
        setProjects(response.data.projects);
      } else {
        setProjects([]);
        setError("Failed to fetch projects");
      }
    } catch (error) {
      console.error("Error fetching projects", error);
      setError("Error fetching projects");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectsForAdmin();
  }, []);

  const toggleViewMode = () => {
    setViewMode(viewMode === "card" ? "table" : "card");
  };

  let content;

  if (loading) {
    content = <div className="admin-projects-loading">Loading...</div>;
  } else if (error) {
    content = <div className="admin-projects-error">{error}</div>;
  } else if (projects.length === 0) {
    content = <div className="admin-projects-empty">No projects available</div>;
  } else {
    content = (
      <>
        <div className="admin-projects-view-toggle">
          <button
            onClick={toggleViewMode}
            className="admin-projects-toggle-button"
          >
            Switch to {viewMode === "card" ? "Table" : "Card"} View
          </button>
        </div>

        {viewMode === "card" ? (
          <div className="admin-projects-card-view">
            {projects.map((project) => (
              <div key={project._id} className="project-card">
                <h3 className="project-card-title">
                  {project.title || "No Title"}
                </h3>
                <p className="project-card-description">
                  <strong>Description:</strong> {project.description || "N/A"}
                </p>
                <p className="project-card-id">
                  <strong>Project ID:</strong> {project._id}
                </p>
                <p className="project-card-goal">
                  <strong>Donation Goal:</strong> ₹{project.donationGoal || 0}
                </p>
                <p className="project-card-donated">
                  <strong>Total Donated:</strong> ₹{project.totalDonated || 0}
                </p>
                {project.studentId && typeof project.studentId === "object" ? (
                  <div className="project-card-student-info">
                    <p>
                      <strong>Student Name:</strong> {project.studentId.name}
                    </p>
                    <p>
                      <strong>Email:</strong> {project.studentId.email}
                    </p>
                    <p>
                      <strong>Contact No:</strong> {project.studentId.contactNo}
                    </p>
                    <p>
                      <strong>College:</strong> {project.studentId.college}
                    </p>
                    <p>
                      <strong>Branch:</strong> {project.studentId.branch}
                    </p>
                  </div>
                ) : (
                  <p className="project-card-student-info">
                    <strong>Student:</strong> Not Available
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="admin-projects-table-view">
            <table className="projects-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Project ID</th>
                  <th>Goal</th>
                  <th>Donated</th>
                  <th colSpan="5">Student Info</th>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Contact No</th>
                  <th>College</th>
                  <th>Branch</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project._id}>
                    <td>{project.title || "No Title"}</td>
                    <td>{project.description || "N/A"}</td>
                    <td>{project._id}</td>
                    <td>₹{project.donationGoal || 0}</td>
                    <td>₹{project.totalDonated || 0}</td>
                    {project.studentId &&
                    typeof project.studentId === "object" ? (
                      <>
                        <td>{project.studentId.name || "N/A"}</td>
                        <td>{project.studentId.email || "N/A"}</td>
                        <td>{project.studentId.contactNo || "N/A"}</td>
                        <td>{project.studentId.college || "N/A"}</td>
                        <td>{project.studentId.branch || "N/A"}</td>
                      </>
                    ) : (
                      <td colSpan="5">Not Available</td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </>
    );
  }

  return <div className="admin-projects-container">{content}</div>;
};

export default AdminProjectAll;
