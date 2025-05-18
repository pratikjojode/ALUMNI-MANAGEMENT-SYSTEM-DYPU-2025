const nodemailer = require("nodemailer");

const sendJobApplicationEmail = async ({
  employerEmail,
  applicantName,
  applicantEmail,
  jobTitle,
  companyName,
}) => {
  try {
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

    const mailToEmployer = {
      from: `"Alumni Job Portal" <${process.env.EMAIL_USER}>`,
      to: employerEmail,
      subject: `New Application for "${jobTitle}"`,
      html: `
        <h3>New Job Application</h3>
        <p><strong>Applicant Name:</strong> ${applicantName}</p>
        <p><strong>Email:</strong> ${applicantEmail}</p>
        <p><strong>Job Title:</strong> ${jobTitle}</p>
        <p><strong>Company:</strong> ${companyName}</p>
      `,
    };

    const mailToAdmin = {
      from: `"Alumni Job Portal" <${process.env.EMAIL_USER}>`,
      to: "dypualumni@gmail.com",
      subject: `COPY: Application for "${jobTitle}" at ${companyName}`,
      html: `
        <h3>Job Application Copy (Admin)</h3>
        <p><strong>Applicant Name:</strong> ${applicantName}</p>
        <p><strong>Email:</strong> ${applicantEmail}</p>
        <p><strong>Job Title:</strong> ${jobTitle}</p>
        <p><strong>Company:</strong> ${companyName}</p>
        <p>This is a copy of the application email sent to the employer.</p>
      `,
    };

    await transporter.sendMail(mailToEmployer);
    await transporter.sendMail(mailToAdmin);

    console.log("Application email sent to employer and admin.");
  } catch (error) {
    console.error("Failed to send job application emails:", error);
    throw error;
  }
};

module.exports = sendJobApplicationEmail;
