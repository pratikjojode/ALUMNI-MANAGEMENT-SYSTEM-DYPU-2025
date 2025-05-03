import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendAdminConfirmationEmail = (email, name) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    bcc: "dypualumni@gmail.com",
    subject: "Admin Registration Confirmation",
    html: `
      <h1>Welcome, ${name}!</h1>
      <p>Your admin account has been successfully created. You can now log in to the dashboard.</p>
      <p>Thank you for registering!</p>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email:", error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
