import express from "express";
import storage from "../middlewares/multer.middleware.js";
import { handleFileUpload } from "../controllers/fileupload.controller.js";

const router = express.Router();

router.post("/upload", storage.single("codefile"), handleFileUpload);

export default router;