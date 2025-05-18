import nodemailer from "nodemailer";
import Alumni from "../models/Alumni.js";
import Student from "../models/Student.js";
import mongoose from "mongoose";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    tls: {
      rejectUnauthorized: false,
    },
  },
});

const adminEmail = "dypualumni@gmail.com";

const sendDiscussionDeletionEmail = async ({ title, category, postedBy }) => {
  if (!title || !category || !postedBy) {
    console.error("Missing email fields");
    return;
  }

  try {
    let user;

    if (mongoose.Types.ObjectId.isValid(postedBy)) {
      user =
        (await Alumni.findById(postedBy)) || (await Student.findById(postedBy));
    } else {
      user =
        (await Alumni.findOne({ name: postedBy })) ||
        (await Student.findOne({ name: postedBy }));
    }

    if (!user) {
      console.error("User not found");
      return;
    }

    const userEmail = user.email || "defaultEmail@example.com";
    const userName = user.name || "Unknown User";

    const subject = `🗑️ Discussion Deleted: ${title}`;
    const html = `
      <h2>Discussion Deleted</h2>
      <p><strong>${userName}</strong> has deleted a discussion in the category <em>${category}</em>.</p>
      <h3>${title}</h3>
      <p>This discussion has been removed from the DY Patil Alumni platform.</p>
      <hr />
      <p>This is a notification email from the DY Patil Alumni Platform.</p>
    `;

    const userInfo = await transporter.sendMail({
      from: `"DY Patil Alumni Portal" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject,
      html,
    });
    console.log("Deletion email sent to the user:", userInfo.response);

    const adminInfo = await transporter.sendMail({
      from: `"DY Patil Alumni Portal" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject,
      html,
    });
    console.log("Deletion email sent to the admin:", adminInfo.response);
  } catch (error) {
    console.error("Error sending deletion email:", error.stack || error);
  }
};

export default sendDiscussionDeletionEmail;
