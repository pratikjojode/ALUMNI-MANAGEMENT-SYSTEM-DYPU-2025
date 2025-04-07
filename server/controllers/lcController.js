import LCRequest from "../models/LCRequest.js";
import Alumni from "../models/Alumni.js";
import fs from "fs";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import cloudinary from "cloudinary";
import { Readable } from "stream";

import https from "https";
import axios from "axios";

export const createLCRequest = async (req, res) => {
  try {
    const { reason } = req.body;
    const lc = await LCRequest.create({ alumni: req.user._id, reason });
    res.status(201).json({ message: "LC request submitted", lc });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to submit LC request", error: error.message });
  }
};

export const getAllLCRequests = async (req, res) => {
  const requests = await LCRequest.find().populate("alumni");
  res.status(200).json(requests);
};

export const approveLCRequest = async (req, res) => {
  const lc = await LCRequest.findById(req.params.id);
  if (!lc) return res.status(404).json({ message: "LC Request not found" });
  lc.isApproved = true;
  await lc.save();
  res.status(200).json({ message: "LC Approved" });
};

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const generateNoDuesPdf = async (req, res) => {
  try {
    const lc = await LCRequest.findById(req.params.id).populate("alumni");
    if (!lc || !lc.isApproved) {
      return res
        .status(400)
        .json({ message: "Invalid or unapproved LC request" });
    }

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontSize = 12;

    // Embed DYPU Logo for header and watermark
    const LOGO_URL =
      "https://res.cloudinary.com/dmlafjs0j/image/upload/v1744003139/DYPU-removebg-preview_nzv15s.png";
    const logoBytes = (
      await axios.get(LOGO_URL, { responseType: "arraybuffer" })
    ).data;
    const logoImage = await pdfDoc.embedPng(logoBytes);

    // Watermark (centered faint logo)
    const watermarkDims = logoImage.scale(0.3);
    page.drawImage(logoImage, {
      x: width / 2 - watermarkDims.width / 2,
      y: height / 2 - watermarkDims.height / 2,
      width: watermarkDims.width,
      height: watermarkDims.height,
      opacity: 0.1,
    });

    // Header Logo (top center)
    const headerLogoDims = logoImage.scale(0.13);
    page.drawImage(logoImage, {
      x: width / 2 - headerLogoDims.width / 2,
      y: height - 80,
      width: headerLogoDims.width,
      height: headerLogoDims.height,
    });

    // Title with Accent Color
    page.drawText("NO DUES CERTIFICATE", {
      x: width / 2 - 120,
      y: height - 110,
      size: 18,
      font: fontBold,
      color: rgb(0.2, 0.3, 0.7),
    });

    // Decorative line
    page.drawLine({
      start: { x: 60, y: height - 115 },
      end: { x: width - 60, y: height - 115 },
      thickness: 0.6,
      color: rgb(0.2, 0.3, 0.7),
    });

    // Certificate Body
    const info = [
      `This is to certify that Mr./Ms. ${lc.alumni.name},`,
      `from ${lc.alumni.college}, ${lc.alumni.branch} Department,`,
      `has completed all formalities and has no dues pending with the institution.`,
      ``,
      `Passout Year: ${lc.alumni.passoutYear}`,
      `Email: ${lc.alumni.email}`,
      `Contact: ${lc.alumni.contactNo}`,
      ``,
      `Purpose: ${lc.reason}`,
      `Issued On: ${new Date().toLocaleDateString()}`,
    ];

    let y = height - 150;
    info.forEach((line, index) => {
      const isHeading = index === 0;
      page.drawText(line, {
        x: 60,
        y,
        size: fontSize,
        font: isHeading ? fontBold : font,
        color: isHeading ? rgb(0.2, 0.3, 0.7) : rgb(0, 0, 0),
      });
      y -= 22;
    });

    // Signature
    const SIGNATURE_URL =
      "https://res.cloudinary.com/dmlafjs0j/image/upload/v1744001791/Lcighn_gkywe6.png";
    const signatureBytes = (
      await axios.get(SIGNATURE_URL, { responseType: "arraybuffer" })
    ).data;
    const signatureImage = await pdfDoc.embedPng(signatureBytes);
    const sigDims = signatureImage.scale(0.25);

    page.drawImage(signatureImage, {
      x: width - 180,
      y: 80,
      width: sigDims.width,
      height: sigDims.height,
    });

    page.drawText("Authorized Signature", {
      x: width - 180,
      y: 70,
      size: 9,
      font,
      color: rgb(0.3, 0.3, 0.3),
    });

    // Footer
    page.drawText(
      "Generated & Verified by DY Patil Institute of Engineering, Ambi – Pune",
      {
        x: width / 2 - 180,
        y: 40,
        size: 9,
        font,
        color: rgb(0.4, 0.4, 0.4),
      }
    );

    page.drawText(
      "This is a system-generated certificate and does not require a physical signature.",
      {
        x: width / 2 - 200,
        y: 25,
        size: 8,
        font,
        color: rgb(0.5, 0.5, 0.5),
      }
    );

    const pdfBytes = await pdfDoc.save();

    // Upload to Cloudinary
    const bufferStream = Readable.from(pdfBytes);
    cloudinary.v2.uploader
      .upload_stream(
        {
          resource_type: "raw",
          folder: "no_dues",
          public_id: `nodues_${lc._id}`,
        },
        async (error, result) => {
          if (error)
            return res
              .status(500)
              .json({ message: "Cloudinary upload failed", error });

          lc.lcPdfUrl = result.secure_url;
          await lc.save();

          res.status(200).json({
            message: "No Dues PDF uploaded to Cloudinary",
            pdfUrl: result.secure_url,
          });
        }
      )
      .end(pdfBytes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const downloadLcFromCloudinary = async (req, res) => {
  try {
    const lc = await LCRequest.findById(req.params.id);
    if (!lc || !lc.lcPdfUrl) {
      return res.status(404).json({ message: "LC PDF not found" });
    }

    const fileUrl = lc.lcPdfUrl;
    const fileName = `LC_${lc._id}.pdf`;

    https
      .get(fileUrl, (fileRes) => {
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="${fileName}"`
        );
        res.setHeader("Content-Type", "application/pdf");
        fileRes.pipe(res);
      })
      .on("error", () => {
        res
          .status(500)
          .json({ message: "Error downloading file from Cloudinary" });
      });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getLcById = async (req, res) => {
  try {
    const lcRequest = await LCRequest.findOne({
      alumni: req.user._id,
    }).populate("alumni");

    if (!lcRequest) {
      return res.status(404).json({ message: "LC Request not found" });
    }

    res.status(200).json({
      message: "LC request fetched successfully",
      lc: lcRequest,
    });
  } catch (error) {
    console.error("Error fetching LC by user ID:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
