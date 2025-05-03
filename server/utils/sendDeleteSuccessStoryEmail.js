import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const adminEmail = "dypualumni@gmail.com";

/**

 * @param {Array} recipients 
 * @param {Object} story 
 */
const sendDeleteSuccessStoryEmail = async (recipients, story) => {
  const { name, shortDescription, fullDescription, alumni } = story;

  const emailContent = {
    subject: `🗑️ Success Story Deleted: ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #fff3f3;">
        <h2 style="color: #cc0000;">❗ Alumni Success Story Deleted</h2>
        <p><strong>${name}</strong>'s story has been <strong>removed</strong> from the DY Patil Alumni Portal.</p>

        <div style="background-color: #ffffff; padding: 15px; border-left: 5px solid #cc0000; margin: 20px 0;">
          <h3 style="margin-bottom: 10px;">Short Description</h3>
          <p>${shortDescription}</p>
          ${
            fullDescription
              ? `
            <h3 style="margin-top: 20px;">Full Description</h3>
            <p>${fullDescription}</p>
          `
              : ""
          }
        </div>

        <p><strong>Deleted By Alumni:</strong> ${alumni?.name || "Unknown"} (${
      alumni?.email || "N/A"
    })</p>

        <hr style="border: none; border-top: 1px solid #ccc;" />
        <p style="font-size: 12px; color: #666;">
          You’re receiving this notification as part of the DY Patil Alumni Network.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail({
      from: `"DY Patil Alumni Portal" <${process.env.EMAIL_USER}>`,
      to: [adminEmail, ...recipients],
      ...emailContent,
    });

    console.log("📧 Deletion email sent successfully to all recipients");
  } catch (error) {
    console.error("❌ Failed to send deletion email:", error.message);
  }
};

export default sendDeleteSuccessStoryEmail;
