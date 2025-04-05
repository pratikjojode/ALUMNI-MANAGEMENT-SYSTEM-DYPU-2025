import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import "./index.css";
import StudentRegister from "./students/StudentRegister";
import AlumniRegisterForm from "./alumnis/AlumniRegisterForm";
import AdminRegister from "./admin/AdminRegister";
import AdminDashboard from "./admin/AdminDashboard";
import StudentDashboard from "./students/StudentDashboard";
import AlumniDashboard from "./alumnis/AlumniDashboard";
import LoginForm from "./components/LoginForm";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<h1>Hello Alumni! 🎓</h1>} />
        <Route path="/studentRegister" element={<StudentRegister />} />
        <Route path="/alumniRegister" element={<AlumniRegisterForm />} />
        <Route path="/adminRegister" element={<AdminRegister />} />
        <Route path="/unifiedLogin" element={<LoginForm />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/alumni" element={<AlumniDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
