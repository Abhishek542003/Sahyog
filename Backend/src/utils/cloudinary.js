import dotenv from "dotenv";
dotenv.config();
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // Upload the file to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto", // Detects and handles different types of files (image, video, etc.)
    });

    // File has been uploaded to Cloudinary
    console.log("File is uploaded to Cloudinary:", response.url);

    // Remove the local file after successful upload
    fs.unlinkSync(localFilePath); // Corrected method name

    return response;
  } catch (error) {
    console.error("Error during Cloudinary upload:", error.message);

    // Optionally remove the file if desired (depending on your error-handling policy)
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath); // Ensure local file is cleaned up after error
    }

    return null;
  }
};

export { uploadOnCloudinary };
