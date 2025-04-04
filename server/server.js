import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/databaseAlumniSystems.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("🎓 Alumni Management System DYPU API is running");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`.bgBlack.yellow.bold);
});
