import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (to, subject, htmlContent) => {
  if (!to) {
    console.error("Email not sent: No recipient provided");
    return;
  }

  try {
    const info = await transporter.sendMail({
      from: `"Alumni Connect" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlContent,
    });
    console.log(`Email sent to ${to}:`, info.messageId);
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error);
  }
};

export const sendProjectCreationEmail = async (
  studentEmail,
  alumniEmail,
  adminEmail,
  projectDetails
) => {
  const subject = "🎉 New Project Created!";
  const htmlContent = `
    <h2>New Project Created</h2>
    <p><strong>Title:</strong> ${projectDetails.title}</p>
    <p><strong>Description:</strong> ${projectDetails.description}</p>
    <p><strong>Donation Goal:</strong> ₹${projectDetails.donationGoal}</p>
    <hr />
    <p>This email was sent to all concerned parties for transparency.</p>
  `;

  await sendEmail(studentEmail, subject, htmlContent);
  await sendEmail(alumniEmail, subject, htmlContent);
  await sendEmail(adminEmail, subject, htmlContent);
};

export const sendProjectDeletionEmail = async (
  studentEmail,
  alumniEmail,
  adminEmail,
  projectTitle
) => {
  const subject = "⚠️ Project Deleted";
  const htmlContent = `
    <h2>Project Deleted</h2>
    <p>The following project has been removed:</p>
    <p><strong>Title:</strong> ${projectTitle}</p>
    <hr />
    <p>This notification is sent to all relevant parties.</p>
  `;

  await sendEmail(studentEmail, subject, htmlContent);
  await sendEmail(alumniEmail, subject, htmlContent);
  await sendEmail(adminEmail, subject, htmlContent);
};
