import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, text }) => {
  if (!to || to.trim() === "") {
    throw new Error("No recipients defined (to address is missing)");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
      tls: {
        rejectUnauthorized: false,
      },
    },
  });

  const mailOptions = {
    from: `"DY Alumni Management" <${process.env.EMAIL_USER}>`,
    to: "dypualumni@gmail.com",
    subject,
    text,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
