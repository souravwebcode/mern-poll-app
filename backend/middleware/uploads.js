import multer from "multer";
import fs from "fs";
import path from "path";

// ✅ Ensure uploads folder exists
const uploadPath = path.join("uploads");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

// ✅ Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

// ✅ File filter (safe)
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false); // ❗ don't crash server
  }
};

// ✅ Export upload
export const upload = multer({
  storage,
  fileFilter,
});