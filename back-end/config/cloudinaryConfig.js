import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "blog_covers",
    allowed_formats: ["jpg", "png", "jpeg", "gif"],
  },
});

const cloudinaryUploader = multer({
  storage: storage,
  limits: { filesize: 5 * 1024 * 1024 }, // Limite di 5MB
});

export default cloudinaryUploader;
