import LCRequest from "../models/LCRequest.js";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import cloudinary from "cloudinary";
import { Readable } from "stream";
import https from "https";
import axios from "axios";

import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const createLCRequest = async (req, res) => {
  try {
    const { reason } = req.body;
    const lc = await LCRequest.create({ alumni: req.user._id, reason });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const alumniMailOptions = {
      from: process.env.EMAIL_USER,
      to: req.user.email,
      subject: "LC Request Submitted",
      text: `Dear ${req.user.name},\n\nYour LC request has been successfully submitted with the reason: ${reason}.\n\nThank you.`,
    };

    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: "dypualumni@gmail.com",
      subject: "New LC Request Submitted",
      text: `A new LC request has been submitted by ${req.user.name}.\n\nReason: ${reason}\n\nPlease review the request.`,
    };

    await transporter.sendMail(alumniMailOptions);

    await transporter.sendMail(adminMailOptions);

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
  try {
    // Find the LC request by ID and populate the alumni field
    const lc = await LCRequest.findById(req.params.id).populate("alumni");
    if (!lc) return res.status(404).json({ message: "LC Request not found" });

    // Check if alumni data exists and has a valid email
    if (!lc.alumni || !lc.alumni.email) {
      return res.status(400).json({ message: "Alumni email not found" });
    }

    // Update the LC request status
    lc.isApproved = true;
    await lc.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const alumniMailOptions = {
      from: process.env.EMAIL_USER,
      to: lc.alumni.email,
      subject: "LC Request Approved",
      text: `Dear ${lc.alumni.name},\n\nYour LC request has been approved.\n\nThank you.`,
    };

    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: "dypualumni@gmail.com",
      subject: "LC Request Approved",
      text: `The LC request from ${lc.alumni.name} has been approved.\n\nReason: ${lc.reason}\n\nPlease review the request.`,
    };

    // Send email to alumni
    await transporter.sendMail(alumniMailOptions);

    // Send email to admin
    await transporter.sendMail(adminMailOptions);

    // Respond with a success message
    res.status(200).json({ message: "LC Approved" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to approve LC request", error: error.message });
  }
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

    // Set document metadata
    pdfDoc.setTitle(`No Dues Certificate - ${lc.alumni.name}`);
    pdfDoc.setAuthor("DY Patil Institute of Engineering");
    pdfDoc.setSubject("No Dues Certificate");
    pdfDoc.setKeywords(["certificate", "no dues", "alumni", "DY Patil"]);

    const page = pdfDoc.addPage([595.28, 841.89]); // A4 size in points
    const { width, height } = page.getSize();

    // Load fonts
    // For Poppins fonts, we need to fetch them from external sources
    const POPPINS_REGULAR_URL =
      "https://cdn.jsdelivr.net/npm/@fontsource/poppins@4.5.0/files/poppins-latin-400-normal.woff";
    const POPPINS_BOLD_URL =
      "https://cdn.jsdelivr.net/npm/@fontsource/poppins@4.5.0/files/poppins-latin-700-normal.woff";
    const POPPINS_ITALIC_URL =
      "https://cdn.jsdelivr.net/npm/@fontsource/poppins@4.5.0/files/poppins-latin-400-italic.woff";

    // Fallback fonts in case external fonts fail to load
    const fontRegularFallback = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBoldFallback = await pdfDoc.embedFont(
      StandardFonts.HelveticaBold
    );
    const fontItalicFallback = await pdfDoc.embedFont(
      StandardFonts.HelveticaOblique
    );

    // Try to load Poppins fonts
    let fontRegular, fontBold, fontItalic;

    try {
      // Fetch and embed Poppins Regular
      const regularFontBytes = (
        await axios.get(POPPINS_REGULAR_URL, { responseType: "arraybuffer" })
      ).data;
      fontRegular = await pdfDoc.embedFont(regularFontBytes);

      // Fetch and embed Poppins Bold
      const boldFontBytes = (
        await axios.get(POPPINS_BOLD_URL, { responseType: "arraybuffer" })
      ).data;
      fontBold = await pdfDoc.embedFont(boldFontBytes);

      // Fetch and embed Poppins Italic
      const italicFontBytes = (
        await axios.get(POPPINS_ITALIC_URL, { responseType: "arraybuffer" })
      ).data;
      fontItalic = await pdfDoc.embedFont(italicFontBytes);
    } catch (err) {
      console.error("Failed to load custom fonts, using fallbacks:", err);
      fontRegular = fontRegularFallback;
      fontBold = fontBoldFallback;
      fontItalic = fontItalicFallback;
    }

    // Colors
    const primaryColor = rgb(0.624, 0.11, 0.2); // #9f1c33 converted to RGB
    const accentColor = rgb(0.2, 0.2, 0.2); // Dark gray accent
    const textColor = rgb(0, 0, 0); // Black for text
    const lightColor = rgb(0.98, 0.95, 0.95); // Light pink/beige for backgrounds

    // Draw decorative border
    const borderWidth = 2;
    const borderPadding = 20;

    // Outer border
    page.drawRectangle({
      x: borderPadding,
      y: borderPadding,
      width: width - 2 * borderPadding,
      height: height - 2 * borderPadding,
      borderColor: primaryColor,
      borderWidth: borderWidth,
      color: rgb(1, 1, 1),
    });

    // Inner border
    page.drawRectangle({
      x: borderPadding + 10,
      y: borderPadding + 10,
      width: width - 2 * (borderPadding + 10),
      height: height - 2 * (borderPadding + 10),
      borderColor: primaryColor,
      borderWidth: 0.5,
      color: rgb(1, 1, 1),
    });

    // Header background
    page.drawRectangle({
      x: borderPadding + 10,
      y: height - (borderPadding + 10) - 150,
      width: width - 2 * (borderPadding + 10),
      height: 150,
      color: rgb(0.99, 0.97, 0.97),
    });

    // DY Patil logo
    const LOGO_URL =
      "https://res.cloudinary.com/dmlafjs0j/image/upload/v1744003139/DYPU-removebg-preview_nzv15s.png";
    const logoBytes = (
      await axios.get(LOGO_URL, { responseType: "arraybuffer" })
    ).data;
    const logoImage = await pdfDoc.embedPng(logoBytes);
    const headerLogoDims = logoImage.scale(0.15); // Slightly larger logo

    page.drawImage(logoImage, {
      x: width / 2 - headerLogoDims.width / 2,
      y: height - borderPadding - 120,
      width: headerLogoDims.width,
      height: headerLogoDims.height,
    });

    // University name
    const universityName = "D.Y. PATIL UNIVERSITY, AMBI - PUNE";
    page.drawText(universityName, {
      x: width / 2 - fontBold.widthOfTextAtSize(universityName, 16) / 2,
      y: height - borderPadding - 140,
      size: 16,
      font: fontBold,
      color: primaryColor,
    });

    // Certificate title with decorative elements
    page.drawText("CERTIFICATE OF NO DUES", {
      x: width / 2 - 120,
      y: height - borderPadding - 180,
      size: 22,
      font: fontBold,
      color: primaryColor,
    });

    // Decorative lines
    const lineY = height - borderPadding - 190;
    // Line left of title
    page.drawLine({
      start: { x: width / 2 - 170, y: lineY },
      end: { x: width / 2 - 130, y: lineY },
      thickness: 2,
      color: primaryColor,
    });

    // Line right of title
    page.drawLine({
      start: { x: width / 2 + 130, y: lineY },
      end: { x: width / 2 + 170, y: lineY },
      thickness: 2,
      color: primaryColor,
    });

    // Certificate number
    const certificateNumber = `ND${lc._id
      .toString()
      .slice(-6)}/${new Date().getFullYear()}`;
    page.drawText(`Certificate No: ${certificateNumber}`, {
      x: width - 200,
      y: height - borderPadding - 220,
      size: 10,
      font: fontItalic,
      color: textColor,
    });

    // Date
    const currentDate = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    page.drawText(`Date: ${currentDate}`, {
      x: borderPadding + 30,
      y: height - borderPadding - 220,
      size: 10,
      font: fontItalic,
      color: textColor,
    });

    // Decorative "certificate" watermark
    page.drawText("CERTIFICATE", {
      x: width / 2 - 120,
      y: height / 2 - 40,
      size: 60,
      font: fontBold,
      color: rgb(0.98, 0.95, 0.95),
      rotate: {
        type: "degrees",
        angle: 315,
      },
    });

    // Certificate content
    const startY = height - borderPadding - 270;

    // Opening text
    page.drawText("This is to certify that", {
      x: borderPadding + 50,
      y: startY,
      size: 12,
      font: fontRegular,
      color: textColor,
    });

    // Student name (highlighted)
    const nameY = startY - 30;
    page.drawText(`${lc.alumni.name}`, {
      x: width / 2 - fontBold.widthOfTextAtSize(lc.alumni.name, 16) / 2,
      y: nameY,
      size: 16,
      font: fontBold,
      color: primaryColor,
    });

    // Underline the name
    page.drawLine({
      start: { x: width / 2 - 150, y: nameY - 5 },
      end: { x: width / 2 + 150, y: nameY - 5 },
      thickness: 0.5,
      color: primaryColor,
    });

    // Certificate body
    let y = nameY - 50;

    const paragraphs = [
      `a graduate of ${lc.alumni.college}, from the Department of ${lc.alumni.branch}, who completed their studies in the academic year ${lc.alumni.passoutYear}, has settled all accounts with the institute and has NO OUTSTANDING DUES against their name.`,
      `This certificate is issued upon their request for the purpose of "${lc.reason}".`,
    ];

    paragraphs.forEach((paragraph) => {
      const lines = formatParagraphToWidth(
        paragraph,
        fontRegular,
        12,
        width - 2 * (borderPadding + 50)
      );
      lines.forEach((line) => {
        page.drawText(line, {
          x: borderPadding + 50,
          y,
          size: 12,
          font: fontRegular,
          color: textColor,
        });
        y -= 20;
      });
      y -= 10; // Extra space between paragraphs
    });

    // Student details section
    y -= 20;

    // Details box
    page.drawRectangle({
      x: borderPadding + 50,
      y: y - 120,
      width: width - 2 * (borderPadding + 50),
      height: 120,
      color: lightColor,
      borderColor: primaryColor,
      borderWidth: 0.5,
    });

    // Details heading
    page.drawText("STUDENT DETAILS", {
      x: borderPadding + 60,
      y: y - 15,
      size: 12,
      font: fontBold,
      color: primaryColor,
    });

    // Student info
    const details = [
      { label: "Email", value: lc.alumni.email },
      { label: "Contact", value: lc.alumni.contactNo },
      { label: "Department", value: lc.alumni.branch },
      { label: "Passout Year", value: lc.alumni.passoutYear.toString() },
    ];

    let detailY = y - 40;
    details.forEach((detail) => {
      page.drawText(`${detail.label}:`, {
        x: borderPadding + 60,
        y: detailY,
        size: 10,
        font: fontBold,
        color: textColor,
      });

      page.drawText(detail.value, {
        x: borderPadding + 160,
        y: detailY,
        size: 10,
        font: fontRegular,
        color: textColor,
      });

      detailY -= 20;
    });

    // Signature section
    const signatureY = borderPadding + 140;

    // Signature box
    page.drawRectangle({
      x: width - 250,
      y: signatureY,
      width: 200,
      height: 100,
      color: rgb(0.99, 0.97, 0.97),
      borderColor: primaryColor,
      borderWidth: 0.5,
    });

    // Signature image
    const SIGNATURE_URL =
      "https://res.cloudinary.com/dg3vw7ejd/image/upload/v1746345954/DYPU_ALUMNI_cocosign_2_tcrjcz.png";
    const signatureBytes = (
      await axios.get(SIGNATURE_URL, { responseType: "arraybuffer" })
    ).data;
    const signatureImage = await pdfDoc.embedPng(signatureBytes);
    const sigDims = signatureImage.scale(0.2);

    page.drawImage(signatureImage, {
      x: width - 200,
      y: signatureY + 30,
      width: sigDims.width,
      height: sigDims.height,
    });

    // Signature text
    page.drawText("Authorized Signatory", {
      x: width - 200,
      y: signatureY + 20,
      size: 10,
      font: fontBold,
      color: textColor,
    });

    page.drawText("Director, Alumni Relations", {
      x: width - 200,
      y: signatureY + 5,
      size: 9,
      font: fontItalic,
      color: textColor,
    });

    // Official seal/stamp - circular watermark
    page.drawText("OFFICIAL", {
      x: width - 180,
      y: signatureY + 60,
      size: 16,
      font: fontBold,
      color: rgb(0.9, 0.85, 0.85),
      rotate: {
        type: "degrees",
        angle: 30,
      },
    });

    page.drawText("SEAL", {
      x: width - 165,
      y: signatureY + 40,
      size: 16,
      font: fontBold,
      color: rgb(0.9, 0.85, 0.85),
      rotate: {
        type: "degrees",
        angle: 30,
      },
    });

    // Footer
    const footerY = borderPadding + 30;
    // Footer separator line
    page.drawLine({
      start: { x: borderPadding + 10, y: footerY + 20 },
      end: { x: width - borderPadding - 10, y: footerY + 20 },
      thickness: 0.5,
      color: primaryColor,
    });

    // Footer text
    const footerText =
      "This is a system-generated certificate from DY Patil University, Ambi - Pune.";
    page.drawText(footerText, {
      x: width / 2 - fontItalic.widthOfTextAtSize(footerText, 9) / 2,
      y: footerY,
      size: 9,
      font: fontItalic,
      color: textColor,
    });

    // Helper function to format paragraphs to fit width
    function formatParagraphToWidth(text, font, fontSize, maxWidth) {
      const words = text.split(" ");
      const lines = [];
      let currentLine = "";

      words.forEach((word) => {
        const potentialLine = currentLine ? `${currentLine} ${word}` : word;
        if (font.widthOfTextAtSize(potentialLine, fontSize) <= maxWidth) {
          currentLine = potentialLine;
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      });

      if (currentLine) {
        lines.push(currentLine);
      }

      return lines;
    }

    const pdfBytes = await pdfDoc.save();
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
            certificateNumber: certificateNumber,
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
