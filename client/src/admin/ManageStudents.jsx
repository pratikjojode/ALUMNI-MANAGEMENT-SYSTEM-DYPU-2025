// admin/ManageStudents.jsx
import React, { useState, useEffect } from "react";

const ManageStudents = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    // Fetch student data
    const fetchStudents = async () => {
      const response = await fetch("/api/students"); // Example API call
      const data = await response.json();
      setStudents(data);
    };
    fetchStudents();
  }, []);

  return (
    <div>
      <h2>Manage Students</h2>
      {students.length === 0 ? (
        <p>No students found</p>
      ) : (
        <ul>
          {students.map((student) => (
            <li key={student._id}>
              <p>{student.name}</p>
              <p>{student.email}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ManageStudents;
