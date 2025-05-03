import nodemailer from "nodemailer";
import Alumni from "../models/Alumni.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


const sendEmail = (recipientEmail, subject, message) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipientEmail,
    subject: subject,
    html: message,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log("Error sending email:", err);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};


export const sendJobPostEmail = async (jobPost) => {
  const subject = `New Job Post Created: ${jobPost.title} at ${jobPost.companyName}`;

  const message = `
    <h2>New Job Opportunity Available!</h2>
    <p><strong>Company:</strong> ${jobPost.companyName}</p>
    <p><strong>Job Title:</strong> ${jobPost.title}</p>
    <p><strong>Location:</strong> ${jobPost.location || "Not specified"}</p>
    <p><strong>Job Type:</strong> ${jobPost.jobType}</p>
    
    <h3>Job Description:</h3>
    <p>${jobPost.description}</p>
    
    <h3>Requirements:</h3>
    <p>${jobPost.requirements || "Not specified"}</p>
    
    <h3>Application Deadline:</h3>
    <p>${new Date(jobPost.applicationDeadline).toLocaleDateString()}</p>

    <p>If you are interested in this job opportunity, please visit our platform to apply.</p>
    <br>
    <p>Best Regards,</p>
    <p>Your Alumni Management System</p>

    <hr>
    <p><i>This is an automated email sent to inform you about a new job posting.</i></p>
  `;

  const adminEmail = "dypualumni@gmail.com";

  const alumniAndStudents = await Alumni.find({});
  const alumniEmails = alumniAndStudents.map((alumni) => alumni.email);

  
  sendEmail(adminEmail, subject, message);

  alumniEmails.forEach((email) => {
    sendEmail(email, subject, message);
  });
};


export const sendJobPostStatusEmail = async (jobPost, status) => {
  const subject = `Your Job Post has been ${status}`;
  const message = `
    <h2>Job Post Status Update</h2>
    <p><strong>Job Title:</strong> ${jobPost.title}</p>
    <p><strong>Company:</strong> ${jobPost.companyName}</p>
    <p><strong>Status:</strong> ${status}</p>
    <p><strong>Location:</strong> ${jobPost.location || "Not specified"}</p>
    <p><strong>Job Type:</strong> ${jobPost.jobType}</p>
    
    <h3>Job Description:</h3>
    <p>${jobPost.description}</p>
    
    <h3>Requirements:</h3>
    <p>${jobPost.requirements || "Not specified"}</p>
    
    <h3>Application Deadline:</h3>
    <p>${new Date(jobPost.applicationDeadline).toLocaleDateString()}</p>

    <p>Thank you for posting your job. If you need to make any changes, please visit our platform.</p>
    <br>
    <p>Best Regards,</p>
    <p>Your Alumni Management System</p>

    <hr>
    <p><i>This is an automated email sent to inform you about the status of your job posting.</i></p>
  `;

  
  const userEmail = jobPost.postedBy.email;
  sendEmail(userEmail, subject, message);


  const adminSubject = `Job Post "${jobPost.title}" has been ${status}`;
  const adminMessage = `
    <h2>Job Post Status Update</h2>
    <p><strong>Job Title:</strong> ${jobPost.title}</p>
    <p><strong>Company:</strong> ${jobPost.companyName}</p>
    <p><strong>Status:</strong> ${status}</p>
    <p><strong>Location:</strong> ${jobPost.location || "Not specified"}</p>
    <p><strong>Job Type:</strong> ${jobPost.jobType}</p>
    
    <h3>Job Description:</h3>
    <p>${jobPost.description}</p>
    
    <h3>Requirements:</h3>
    <p>${jobPost.requirements || "Not specified"}</p>
    
    <h3>Application Deadline:</h3>
    <p>${new Date(jobPost.applicationDeadline).toLocaleDateString()}</p>

    <p>This is to inform you that the job post titled "${
      jobPost.title
    }" has been ${status}.</p>
    <br>
    <p>Best Regards,</p>
    <p>Your Alumni Management System</p>

    <hr>
    <p><i>This is an automated email sent to inform you about the status of a job posting.</i></p>
  `;

  const adminEmail = "dypualumni@gmail.com";
  sendEmail(adminEmail, adminSubject, adminMessage);
};
