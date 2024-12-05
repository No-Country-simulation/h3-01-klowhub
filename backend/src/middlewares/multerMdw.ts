import multer from "multer";
import path from "path";
import fs from "fs";

const uploadsPath = path.join(__dirname, "..", "uploads");

// Crear el directorio si no existe
fs.promises.mkdir(uploadsPath, { recursive: true }).catch((err) => {
  console.error("Error al crear el directorio de uploads:", err);
});

// Configuración de multer
export const uploadImageMdw = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadsPath);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Tipo de archivo no permitido. Solo JPG, JPEG y PNG son válidos."));
    }
  },
  limits: {
    fileSize: 2 * 1024 * 1024, // 2 MB
  },
});
