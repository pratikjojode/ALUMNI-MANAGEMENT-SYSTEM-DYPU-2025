import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/databaseAlumniSystems.js";
import studentRoutes from "./routes/studentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import alumniRoutes from "./routes/alumniRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import jobPostRoutes from "./routes/jobPostRoutes.js";
import jobApplicationRoutes from "./routes/jobApplicationRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import lcRoutes from "./routes/lcRoutes.js";
import morgan from "morgan";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));

connectDB();

app.get("/", (req, res) => {
  res.send("🎓 Alumni Management System DYPU API is running");
});

app.use("/api/v1/students", studentRoutes);
app.use("/api/v1/alumni", alumniRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/jobsPosting", jobPostRoutes);
app.use("/api/v1/job-applications", jobApplicationRoutes);
app.use("/api/v1/events", eventRoutes);
app.use("/api/v1/lc", lcRoutes);

// Import event routes

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`.bgBlack.yellow.bold);
});
