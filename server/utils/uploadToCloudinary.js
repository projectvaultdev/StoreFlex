import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";
const uploadToCloudinary = (fileBuffer, folder = "ecommerce/products") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve(result);
      },
    );

    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

export default uploadToCloudinary;
