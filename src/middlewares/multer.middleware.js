import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/public/temp")
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  },
  limits: { fileSize: 100 * 1024 }
})

export const upload = multer({
    storage,
})