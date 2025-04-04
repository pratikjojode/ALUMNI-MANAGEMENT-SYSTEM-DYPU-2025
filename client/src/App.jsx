import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import "./index.css";
import StudentRegister from "./students/StudentRegister";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<h1>Hello Alumni! 🎓</h1>} />
        <Route path="/studentRegister" element={<StudentRegister />} />
      </Routes>
    </Router>
  );
};

export default App;
