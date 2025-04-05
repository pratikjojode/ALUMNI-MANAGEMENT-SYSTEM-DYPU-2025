import React, { useState, useEffect } from "react";

const StudentProfile = () => {
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/v1/students/profile",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // JWT token for authentication
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setStudent(data);
        } else {
          alert("Failed to fetch student profile");
        }
      } catch (error) {
        console.error("Error fetching student profile:", error);
      }
    };

    fetchStudentData();
  }, []);

  return (
    <div className="profile-container">
      <h2 className="profile-heading">Student Profile</h2>
      {student ? (
        <div className="profile-info">
          <div className="profile-detail">
            <span className="label">Name:</span>
            <span className="value">{student.name}</span>
          </div>
          <div className="profile-detail">
            <span className="label">Email:</span>
            <span className="value">{student.email}</span>
          </div>
          <div className="profile-detail">
            <span className="label">PRN:</span>
            <span className="value">{student.PRN}</span>
          </div>
          <div className="profile-detail">
            <span className="label">Admission Year:</span>
            <span className="value">{student.admissionYear}</span>
          </div>
          <div className="profile-detail">
            <span className="label">Branch:</span>
            <span className="value">{student.branch}</span>
          </div>
          <div className="profile-detail">
            <span className="label">College:</span>
            <span className="value">{student.college}</span>
          </div>
          <div className="profile-detail">
            <span className="label">Contact No:</span>
            <span className="value">{student.contactNo}</span>
          </div>
          <div className="profile-detail">
            <span className="label">Project Idea:</span>
            <span className="value">{student.projectIdea || "N/A"}</span>
          </div>
          <div className="profile-detail">
            <span className="label">Profile Photo:</span>
            <img
              className="profile-photo"
              src={student.profilePhoto}
              alt="Profile"
            />
          </div>
          {/* You can add more details here */}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default StudentProfile;
