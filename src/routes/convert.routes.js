import express from "express";
import { convertCode } from "../controllers/convert.controller.js";

const router = express.Router();

router.post("/convert", convertCode);

export default router;