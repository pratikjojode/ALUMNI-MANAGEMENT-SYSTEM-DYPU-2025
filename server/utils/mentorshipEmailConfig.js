// utils/mentorshipEmailConfig.js

import nodemailer from "nodemailer";

const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
      tls: {
        rejectUnauthorized: false,
      },
    },
  });
};

export const sendMentorshipEmail = async ({ to, subject, text }) => {
  if (!to || to.trim() === "") {
    throw new Error("No recipients defined (to address is missing)");
  }

  const transporter = createTransporter();

  const mailOptions = {
    from: `"DY Alumni Management" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  };

  await transporter.sendMail(mailOptions);
};
