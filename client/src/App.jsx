import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
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
import AdminMessages from "./admin/AdminMessages";
import AlumniRegistermentor from "./alumnis/AlumniRegistermentor";
import AdminMentorList from "./admin/AdminMentorList";
import StudentsEvents from "./students/StudentsEvents";
import AllMentors from "./students/AllMentors";
import MentorshipRequests from "./alumnis/MentorshipRequests";
import ContactForm from "./pages/ContactForm";
import PrivateRoute from "./components/PrivateRoute";
import DiscussionForm from "./components/DiscussionForm";
import DiscussionsPage from "./pages/DiscussionsPage";
import AdminDiscusiions from "./admin/AdminDiscusiions";
import VerifyOtp from "./components/VerifyOtp";
import AlumniStories from "./alumnis/AlumniStories";
import AlumniStoriesHome from "./pages/AlumniStoriesHome";
import AdminAllStories from "./admin/AdminAllStories";
import AdminiDataExport from "./admin/AdminiDataExport";
import AdminJobApplications from "./admin/AdminJobApplications";
import MyAllApointments from "./students/MyAllApointments";
import AlumniMapPage from "./pages/AlumniMapPage";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import AlumniUpload from "./components/AlumniUpload";
import ProjectsStudents from "./students/ProjectsStudents";
import AdminProjectAll from "./admin/AdminProjectAll";
import AdminScheduleMentorship from "./admin/AdminScheduleMentorship";
import ScheduledSessions from "./alumnis/ScheduledSessions";

const App = () => {
  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/studentRegister" element={<StudentRegister />} />
        <Route path="/alumniRegister" element={<AlumniRegisterForm />} />
        <Route path="/adminRegister" element={<AdminRegister />} />
        <Route path="/unifiedLogin" element={<LoginForm />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/contact" element={<ContactForm />} />
        <Route path="/alumniStories" element={<AlumniStoriesHome />} />
        <Route path="/alumni-map" element={<AlumniMapPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="*" element={<NotFoundPage />} />

        <Route
          path="/alumni"
          element={
            <PrivateRoute allowedRoles={["alumni"]}>
              <AlumniLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<AlumniDashboard />} />
          <Route path="profile" element={<AlumniProfile />} />
          <Route path="/alumni/search" element={<SearchAlumni />} />
          <Route path="update-profile" element={<UpdateAlumniProfile />} />
          <Route path="/alumni/all" element={<AllAlumni />} />
          <Route path="/alumni/post-job" element={<JobPostForm />} />
          <Route path="/alumni/events" element={<Events />} />
          <Route path="/alumni/mentorship" element={<AlumniRegistermentor />} />
          <Route path="/alumni/LcRequest" element={<LCRequestForm />} />
          <Route path="/alumni/discussions" element={<DiscussionsPage />} />
          <Route path="/alumni/stories" element={<AlumniStories />} />
          <Route path="/alumni/sessions" element={<ScheduledSessions />} />
          <Route
            path="/alumni/discussionFormAll"
            element={<DiscussionForm />}
          />
          <Route
            path="/alumni/eventCalender"
            element={<AlumniEventCalendar />}
          />
          <Route path="/alumni/bookAppointment" element={<BookAppointment />} />
          <Route
            path="/alumni/mentorshiprequest"
            element={<MentorshipRequests />}
          />
        </Route>

        <Route
          path="/student"
          element={
            <PrivateRoute allowedRoles={["student"]}>
              <StudentLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<StudentDashboard />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="apply" element={<ApplyForJobs />} />
          <Route path="/student/events" element={<StudentsEvents />} />
          <Route path="/student/projects" element={<ProjectsStudents />} />
          <Route path="/student/mentors" element={<AllMentors />} />
          <Route path="/student/discussions" element={<DiscussionsPage />} />
          <Route path="/student/appointments" element={<MyAllApointments />} />
          <Route path="/student/all" element={<AllAlumni />} />
          <Route
            path="/student/discussionFormAll"
            element={<DiscussionForm />}
          />
        </Route>

        <Route
          path="/admin"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </PrivateRoute>
          }
        >
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
          <Route path="/admin/mentorsAll" element={<AdminMentorList />} />
          <Route path="/admin/messages" element={<AdminMessages />} />
          <Route path="/admin/stories" element={<AdminAllStories />} />
          <Route path="/admin/Discussions" element={<AdminDiscusiions />} />
          <Route path="/admin/alumni-exel-upload" element={<AlumniUpload />} />
          <Route path="/admin/DataExport" element={<AdminiDataExport />} />
          <Route path="/admin/allProjects" element={<AdminProjectAll />} />
          <Route
            path="/admin/scheduleMentorshipSession"
            element={<AdminScheduleMentorship />}
          />
          <Route
            path="/admin/job-applications"
            element={<AdminJobApplications />}
          />
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
