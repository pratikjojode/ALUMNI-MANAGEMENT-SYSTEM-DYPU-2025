// controllers/exportController.js
import Appointment from "../models/Appointment.js";
import Chat from "../models/chatModel.js";
import Comment from "../models/Comment.js";
import Discussion from "../models/Discussion.js";
import JobApplication from "../models/JobApplication.js";
import JobPost from "../models/JobPost.js";
import LCRequest from "../models/LCRequest.js";
import Mentor from "../models/mentorModel.js";
import MentorshipRequest from "../models/mentorshipRequestModel.js";
import Notification from "../models/NotificationModel.js";
import Slot from "../models/Slot.js";
import Student from "../models/Student.js";
import SuccessStory from "../models/SuccessStory.js";
import Admin from "../models/Admin.js";
import Alumni from "../models/Alumni.js";

import { parse } from "json2csv";
import Excel from "exceljs";
import fs from "fs";
import path from "path";

const ensureExportsDir = () => {
  const exportsDir = path.join(process.cwd(), "exports");
  if (!fs.existsSync(exportsDir)) {
    fs.mkdirSync(exportsDir, { recursive: true });
  }
  return exportsDir;
};

const sanitizeData = (data) => {
  return data.map((item) => {
    const sanitized = { ...item };

    // Remove sensitive fields
    if (sanitized.password) delete sanitized.password;
    if (sanitized.passwordResetToken) delete sanitized.passwordResetToken;
    if (sanitized.passwordResetExpires) delete sanitized.passwordResetExpires;

    // Convert ObjectIds to strings for CSV compatibility
    Object.keys(sanitized).forEach((key) => {
      if (
        sanitized[key] &&
        sanitized[key].toString &&
        typeof sanitized[key] !== "string" &&
        typeof sanitized[key] !== "number" &&
        typeof sanitized[key] !== "boolean"
      ) {
        sanitized[key] = sanitized[key].toString();
      }
    });

    return sanitized;
  });
};

export const exportDataToCSV = async (req, res) => {
  try {
    const selectedCollections = req.query.collections
      ? req.query.collections.split(",")
      : null;

    const exportsDir = ensureExportsDir();
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const exportResults = [];

    const collections = {
      appointments: Appointment,
      chats: Chat,
      comments: Comment,
      discussions: Discussion,
      jobApplications: JobApplication,
      jobPosts: JobPost,
      lcRequests: LCRequest,
      mentors: Mentor,
      mentorshipRequests: MentorshipRequest,
      notifications: Notification,
      slots: Slot,
      students: Student,
      successStories: SuccessStory,
      admins: Admin,
      alumni: Alumni,
    };

    for (const [name, model] of Object.entries(collections)) {
      if (selectedCollections && !selectedCollections.includes(name)) {
        continue;
      }

      try {
        const data = await model.find().lean();

        if (data.length > 0) {
          const sanitizedData = sanitizeData(data);
          const csv = parse(sanitizedData);

          const fileName = `${name}_${timestamp}.csv`;
          const filePath = path.join(exportsDir, fileName);

          fs.writeFileSync(filePath, csv);

          exportResults.push({
            collection: name,
            status: "success",
            recordCount: data.length,
            fileName,
          });
        } else {
          exportResults.push({
            collection: name,
            status: "empty",
            recordCount: 0,
          });
        }
      } catch (collectionError) {
        console.error(`Error exporting ${name}:`, collectionError);
        exportResults.push({
          collection: name,
          status: "error",
          error: collectionError.message,
        });
      }
    }

    console.log(
      "✅ Data export summary:",
      exportResults.filter((r) => r.status === "success").length,
      "successful,",
      exportResults.filter((r) => r.status === "empty").length,
      "empty,",
      exportResults.filter((r) => r.status === "error").length,
      "failed"
    );

    // Return detailed results to the client
    res.status(200).json({
      message: "Data export completed",
      results: exportResults,
      exportTimestamp: timestamp,
    });
  } catch (error) {
    console.error("❌ Error exporting data:", error);
    res.status(500).json({
      message: "Error exporting data",
      error: error.message,
    });
  }
};

export const exportDataToExcel = async (req, res) => {
  try {
    const selectedCollections = req.query.collections
      ? req.query.collections.split(",")
      : null;

    const exportsDir = ensureExportsDir();
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const exportResults = [];

    // Create a new Excel workbook
    const workbook = new Excel.Workbook();
    const fileName = `full_export_${timestamp}.xlsx`;
    const filePath = path.join(exportsDir, fileName);

    const collections = {
      appointments: Appointment,
      chats: Chat,
      comments: Comment,
      discussions: Discussion,
      jobApplications: JobApplication,
      jobPosts: JobPost,
      lcRequests: LCRequest,
      mentors: Mentor,
      mentorshipRequests: MentorshipRequest,
      notifications: Notification,
      slots: Slot,
      students: Student,
      successStories: SuccessStory,
      admins: Admin,
      alumni: Alumni,
    };

    for (const [name, model] of Object.entries(collections)) {
      if (selectedCollections && !selectedCollections.includes(name)) {
        continue;
      }

      try {
        const data = await model.find().lean();

        if (data.length > 0) {
          const sanitizedData = sanitizeData(data);

          // Create a worksheet for this collection
          const worksheet = workbook.addWorksheet(name);

          // Add headers (column names)
          const headers = Object.keys(sanitizedData[0]);
          worksheet.addRow(headers);

          // Add data rows
          sanitizedData.forEach((item) => {
            const row = headers.map((header) => item[header] || "");
            worksheet.addRow(row);
          });

          // Format the worksheet for better readability
          worksheet.columns.forEach((column) => {
            column.width = 20;
          });

          // Style the header row
          worksheet.getRow(1).font = { bold: true };
          worksheet.getRow(1).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFE0E0E0" },
          };

          exportResults.push({
            collection: name,
            status: "success",
            recordCount: data.length,
          });
        } else {
          // Still create empty worksheet for consistency
          const worksheet = workbook.addWorksheet(name);
          worksheet.addRow(["No data available"]);

          exportResults.push({
            collection: name,
            status: "empty",
            recordCount: 0,
          });
        }
      } catch (collectionError) {
        console.error(`Error exporting ${name}:`, collectionError);

        // Create error worksheet
        const worksheet = workbook.addWorksheet(name);
        worksheet.addRow(["Error exporting data"]);
        worksheet.addRow([collectionError.message]);

        exportResults.push({
          collection: name,
          status: "error",
          error: collectionError.message,
        });
      }
    }

    // Add a summary worksheet
    const summarySheet = workbook.addWorksheet("Export Summary");
    summarySheet.addRow(["Collection", "Status", "Record Count"]);
    exportResults.forEach((result) => {
      summarySheet.addRow([
        result.collection,
        result.status,
        result.status === "success" ? result.recordCount : 0,
      ]);
    });
    summarySheet.addRow(["Export Date", new Date().toLocaleString()]);

    // Format summary sheet
    summarySheet.columns.forEach((column) => {
      column.width = 20;
    });
    summarySheet.getRow(1).font = { bold: true };

    // Save the workbook
    await workbook.xlsx.writeFile(filePath);

    // Direct download the Excel file
    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error("Error sending file:", err);
        res.status(500).send("Error sending file");
      }
    });
  } catch (error) {
    console.error("❌ Error exporting data:", error);
    res.status(500).json({
      message: "Error exporting data",
      error: error.message,
    });
  }
};

export const downloadExportedFile = (req, res) => {
  const { fileName } = req.params;

  if (!fileName) {
    return res.status(400).json({ message: "File name is required" });
  }

  const exportsDir = ensureExportsDir();
  const filePath = path.join(exportsDir, fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "File not found" });
  }

  res.download(filePath);
};

export const listExportedFiles = (req, res) => {
  try {
    const exportsDir = ensureExportsDir();
    const files = fs
      .readdirSync(exportsDir)
      .filter((file) => file.endsWith(".csv") || file.endsWith(".xlsx"))
      .map((file) => {
        const stats = fs.statSync(path.join(exportsDir, file));
        return {
          fileName: file,
          size: stats.size,
          createdAt: stats.birthtime,
        };
      })
      .sort((a, b) => b.createdAt - a.createdAt);

    res.status(200).json({ files });
  } catch (error) {
    console.error("Error listing exported files:", error);
    res.status(500).json({ message: "Error listing exported files" });
  }
};

export const deleteExportedFile = (req, res) => {
  const { fileName } = req.params;

  if (!fileName) {
    return res.status(400).json({ message: "File name is required" });
  }

  const exportsDir = ensureExportsDir();
  const filePath = path.join(exportsDir, fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "File not found" });
  }

  try {
    fs.unlinkSync(filePath);
    res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting file:", error);
    res
      .status(500)
      .json({ message: "Error deleting file", error: error.message });
  }
};
