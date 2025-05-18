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

const adminEmail = "dypualumni@gmail.com";

const sendSuccessStoryEmail = async (
  recipients,
  { name, shortDescription, fullDescription }
) => {
  const emailContent = {
    subject: `🌟 New Alumni Success Story: ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f0f8ff;">
        <h2 style="color: #004080;">🎓 Celebrating Alumni Success - DY Patil University, Pune (Ambi)</h2>
        <p><strong>${name}</strong> has been featured on the DY Patil Alumni Portal!</p>

        <div style="background-color: #ffffff; padding: 15px; border-left: 5px solid #0077cc; margin: 20px 0;">
          <h3 style="margin-bottom: 10px;">Short Overview</h3>
          <p>${shortDescription}</p>
          ${
            fullDescription
              ? `
            <h3 style="margin-top: 20px;">Full Story</h3>
            <p>${fullDescription}</p>
          `
              : ""
          }
        </div>

        <p>👏 Join us in congratulating our amazing alumni!</p>
        <hr style="border: none; border-top: 1px solid #ccc;" />
        <p style="font-size: 12px; color: #666;">
          You’re receiving this email as a valued member of the DY Patil University Alumni Network.
        </p>
      </div>
    `,
  };

  try {
    const infoUser = await transporter.sendMail({
      from: `"DY Patil Alumni Portal" <${process.env.EMAIL_USER}>`,
      to: recipients,
      ...emailContent,
    });
    console.log(
      "✅ Success story email sent to recipients:",
      infoUser.response
    );

    const infoAdmin = await transporter.sendMail({
      from: `"DY Patil Alumni Portal" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      ...emailContent,
    });
    console.log("📬 Admin notified of new success story:", infoAdmin.response);
  } catch (error) {
    console.error("❌ Failed to send success story email:", error.message);
  }
};

export default sendSuccessStoryEmail;
