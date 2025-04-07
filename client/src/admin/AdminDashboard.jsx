import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/AdminDashboard.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar, Doughnut, Line, PolarArea } from "react-chartjs-2";

// Register chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    alumni: 0,
    students: 0,
    admins: 0,
    events: 0,
    jobs: 0,
    applications: 0,
  });

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const [alumniRes, eventRes, jobRes] = await Promise.all([
        axios.get("http://localhost:5000/api/v1/alumni/all", config),
        axios.get("http://localhost:5000/api/v1/events/get", config),
        axios.get("http://localhost:5000/api/v1/jobsPosting/job-posts", config),
      ]);

      setStats({
        alumni: alumniRes.data.alumni?.length || 0,
        students: 5,
        admins: 2,
        events: eventRes.data.events?.length || 0,
        jobs: jobRes.data.length || 0,
        applications: 12,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const barData = {
    labels: ["Alumni", "Students", "Admins"],
    datasets: [
      {
        label: "User Count",
        data: [stats.alumni, stats.students, stats.admins],
        backgroundColor: ["#3498db", "#2ecc71", "#9b59b6"],
      },
    ],
  };

  const doughnutData = {
    labels: ["Events", "Jobs", "Applications"],
    datasets: [
      {
        label: "Content Count",
        data: [stats.events, stats.jobs, stats.applications],
        backgroundColor: ["#f1c40f", "#e67e22", "#e74c3c"],
      },
    ],
  };

  const lineData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Registrations",
        data: [5, 15, 10, 20],
        borderColor: "#3498db",
        backgroundColor: "rgba(52, 152, 219, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const polarData = {
    labels: ["IT", "ECE", "Mechanical", "Civil", "Other"],
    datasets: [
      {
        label: "Branch Distribution",
        data: [10, 8, 6, 3, 2],
        backgroundColor: [
          "#1abc9c",
          "#e74c3c",
          "#9b59b6",
          "#f39c12",
          "#2c3e50",
        ],
      },
    ],
  };

  return (
    <div className="admin-dashboard">
      <h1>Welcome, Admin</h1>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Alumni</h3>
          <p>{stats.alumni}</p>
        </div>
        <div className="stat-card">
          <h3>Total Students</h3>
          <p>{stats.students}</p>
        </div>
        <div className="stat-card">
          <h3>Total Admins</h3>
          <p>{stats.admins}</p>
        </div>
        <div className="stat-card">
          <h3>Total Events</h3>
          <p>{stats.events}</p>
        </div>
        <div className="stat-card">
          <h3>Total Job Postings</h3>
          <p>{stats.jobs}</p>
        </div>
        <div className="stat-card">
          <h3>Total Applications</h3>
          <p>{stats.applications}</p>
        </div>
      </div>

      <div className="dashboard-charts">
        <div className="chart-container">
          <h2>User Overview</h2>
          <Bar data={barData} />
        </div>
        <div className="chart-container">
          <h2>Content Overview</h2>
          <Doughnut data={doughnutData} />
        </div>
        <div className="chart-container">
          <h2>Registration Trends</h2>
          <Line data={lineData} />
        </div>
        <div className="chart-container">
          <h2>Alumni Branches</h2>
          <PolarArea data={polarData} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
