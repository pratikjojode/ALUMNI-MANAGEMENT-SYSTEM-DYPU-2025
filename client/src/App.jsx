import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast"; // ✅ Import Toaster
import "./App.css";
import "./index.css";

import StudentRegister from "./students/StudentRegister";
import AlumniRegisterForm from "./alumnis/AlumniRegisterForm";
import AdminRegister from "./admin/AdminRegister";
import AdminDashboard from "./admin/AdminDashboard";
import StudentDashboard from "./students/StudentDashboard";
import AlumniDashboard from "./alumnis/AlumniDashboard";
import LoginForm from "./components/LoginForm";
import AlumniProfile from "./alumnis/AlumniProfile";
import UpdateAlumniProfile from "./alumnis/UpdateAlumniProfile";
import AlumniLayout from "./layouts/AlumniLayout";
import SearchAlumni from "./alumnis/SearchAlumni";
import AllAlumni from "./alumnis/AllAlumni";
import StudentLayout from "./layouts/StudentLayout";
import AdminLayout from "./layouts/AdminLayout";

import ManageStudents from "./admin/ManageStudents";
import ManageAlumni from "./admin/ManageAlumni";
import ApplyForJobs from "./students/ApplyForJobs";
import StudentProfile from "./students/StudentProfile";
import JobPostForm from "./components/JobPostForm";
import AdminJobPosts from "./admin/AdminJobPosts";
import HomePage from "./pages/HomePage";
import AdminProfile from "./admin/AdminProfile";
import Events from "./alumnis/Events";
import AlumniEventCalendar from "./alumnis/AlumniEventCalendar";
import LCRequestForm from "./alumnis/LCRequestForm";
import AdminLCRequests from "./admin/AdminLCRequests";
import CreateSlot from "./admin/CreateSlot";
import ManageAppointments from "./admin/ManageAppointments";
import BookAppointment from "./alumnis/BookAppointment";
import NotFoundPage from "./components/NotFoundPage";
import Systems from "./components/Systems";

const App = () => {
  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />{" "}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/studentRegister" element={<StudentRegister />} />
        <Route path="/alumniRegister" element={<AlumniRegisterForm />} />
        <Route path="/adminRegister" element={<AdminRegister />} />
        <Route path="/unifiedLogin" element={<LoginForm />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="*" element={<NotFoundPage />} />

        <Route path="/alumni" element={<AlumniLayout />}>
          <Route index element={<AlumniDashboard />} />
          <Route path="profile" element={<AlumniProfile />} />
          <Route path="/alumni/search" element={<SearchAlumni />} />
          <Route path="update-profile" element={<UpdateAlumniProfile />} />
          <Route path="/alumni/all" element={<AllAlumni />} />
          <Route path="/alumni/post-job" element={<JobPostForm />} />
          <Route path="/alumni/events" element={<Events />} />
          <Route path="/alumni/LcRequest" element={<LCRequestForm />} />

          <Route
            path="/alumni/eventCalender"
            element={<AlumniEventCalendar />}
          />
          <Route path="book-appointment" element={<BookAppointment />} />
        </Route>

        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<StudentDashboard />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="apply" element={<ApplyForJobs />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="job-posts" element={<AdminJobPosts />} />
          <Route path="students" element={<ManageStudents />} />
          <Route path="alumni" element={<ManageAlumni />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="/admin/events" element={<Events />} />
          <Route path="/admin/LcApproval" element={<AdminLCRequests />} />
          <Route path="/admin/create-slot" element={<CreateSlot />} />
          <Route path="/admin/appointments" element={<ManageAppointments />} />
          <Route path="/admin/system" element={<Systems />} />
          <Route
            path="/admin/eventCalender"
            element={<AlumniEventCalendar />}
          />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
