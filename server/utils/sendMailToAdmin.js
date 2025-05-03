import nodemailer from "nodemailer";

export const sendMailToAdmin = async ({
  adminEmail,
  studentName,
  studentEmail,
  jobTitle,
  resumeUrl,
}) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // Gmail email
      pass: process.env.EMAIL_PASS, // Gmail password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: adminEmail,
    subject: "New Job Application Submitted",
    html: `
      <h3>New Job Application</h3>
      <p><strong>Student:</strong> ${studentName}</p>
      <p><strong>Email:</strong> ${studentEmail}</p>
      <p><strong>Job Title:</strong> ${jobTitle}</p>
      <p><strong>Resume:</strong> <a href="${resumeUrl}">View Resume</a></p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendMailToStudent = async ({
  studentEmail,
  studentName,
  jobTitle,
}) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: studentEmail,
    subject: "Job Application Submitted Successfully",
    html: `
      <h3>Your Application has been Submitted</h3>
      <p>Hello ${studentName},</p>
      <p>Your application for the job post <strong>${jobTitle}</strong> has been successfully submitted.</p>
      <p>Good luck!</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendMailToAlumni = async ({
  alumniEmail,
  alumniName,
  jobTitle,
  studentName,
  studentEmail,
  resumeUrl,
}) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // Gmail email
      pass: process.env.EMAIL_PASS, // Gmail password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: alumniEmail,
    subject: `New Application for Your Job Post: ${jobTitle}`,
    html: `
      <h3>New Job Application</h3>
      <p><strong>Alumni:</strong> ${alumniName}</p>
      <p><strong>Job Title:</strong> ${jobTitle}</p>
      <p><strong>Student:</strong> ${studentName}</p>
      <p><strong>Email:</strong> ${studentEmail}</p>
      <p><strong>Resume:</strong> <a href="${resumeUrl}">View Resume</a></p>
    `,
  };

  await transporter.sendMail(mailOptions);
};
