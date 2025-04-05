import cloudinary from "cloudinary";
import streamifier from "streamifier"; // Import streamifier

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload image to Cloudinary
export const uploadImage = async (fileBuffer) => {
  try {
    const stream = streamifier.createReadStream(fileBuffer);

    const uploadResponse = await new Promise((resolve, reject) => {
      const cloudinaryUploadStream = cloudinary.v2.uploader.upload_stream(
        { resource_type: "auto", folder: "alumni_system" },
        (error, result) => {
          if (error) reject(error);
          resolve(result);
        }
      );

      // Pipe the buffer as a readable stream to Cloudinary
      stream.pipe(cloudinaryUploadStream);
    });

    return uploadResponse; // Return Cloudinary response
  } catch (error) {
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};
