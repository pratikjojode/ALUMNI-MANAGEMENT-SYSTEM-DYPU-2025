// routes/exportRoutes.js
import express from "express";
import {
  exportDataToCSV,
  exportDataToExcel,
  downloadExportedFile,
  listExportedFiles,
  deleteExportedFile,
} from "../controllers/exportController.js";

const router = express.Router();


router.get("/export-csv", exportDataToCSV);
router.get("/export-excel", exportDataToExcel);


router.get("/export-files", listExportedFiles);
router.get("/download/:fileName", downloadExportedFile);
router.delete("/delete/:fileName", deleteExportedFile);

export default router;
