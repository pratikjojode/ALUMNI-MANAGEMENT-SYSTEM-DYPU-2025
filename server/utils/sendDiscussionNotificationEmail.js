import nodemailer from "nodemailer";

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

// Updated admin email
const adminEmail = "dypualumni@gmail.com";

const sendDiscussionNotificationEmail = async (
  recipients,
  { title, content, postedBy }
) => {
  const commonMailContent = {
    subject: `🗨️ New Discussion Posted: ${title}`,
    html: `
      <h2>New Discussion Alert!</h2>
      <p><strong>${postedBy}</strong> has started a new discussion on the DY Patil Alumni Platform.</p>
      <h3>${title}</h3>
      <p>${content}</p>
      <hr />
      <p>You are receiving this email because you are a registered user of the DY Patil Alumni Platform.</p>
    `,
  };

  try {
    const infoUser = await transporter.sendMail({
      from: `"DY Patil Alumni Portal" <${process.env.EMAIL_USER}>`,
      to: recipients,
      ...commonMailContent,
    });
    console.log("Discussion email sent to recipients:", infoUser.response);

    // 2. Send a separate copy to the admin
    const infoAdmin = await transporter.sendMail({
      from: `"DY Patil Alumni Portal" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      ...commonMailContent,
    });
    console.log("Admin copy sent:", infoAdmin.response);
  } catch (error) {
    console.error("Error sending discussion notification email:", error);
  }
};

export default sendDiscussionNotificationEmail;
