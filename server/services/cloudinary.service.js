import cloudinary from "../config/cloudinary.js";

export const uploadImage = async (file) => {
  const result = await cloudinary.uploader.upload(file, {
    folder: "storeflex",
  });

  return {
    url: result.secure_url,

    publicId: result.public_id,
  };
};
