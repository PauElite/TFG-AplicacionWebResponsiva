import multer from "multer";

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (_req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Middleware para receta + archivos de pasos
export const recipeUploads = upload.fields([
  { name: "imageFile", maxCount: 1 },
  { name: "stepFiles"}
]);
