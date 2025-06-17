import fs from "fs/promises";
import languageDetectionChain from "../chains/languageDetectionChain.js";
import codeConverterChain from "../chains/codeConverterChain.js";

export const handleFileUpload = async (req, res) => {
  const filePath = req.file?.path;

  try {
    const code = await fs.readFile(filePath, "utf-8");

    const { target_language } = req.body;
    if (!target_language || !code) {
      return res.status(400).json({ error: "Missing target_language or code" });
    }

    const detectionResult = await languageDetectionChain.call({ code });
    const source_language = detectionResult.response.trim();

    const conversionResult = await codeConverterChain.call({
      source_language,
      target_language,
      code,
    });

    await fs.unlink(filePath);

    res.json({
      source_language,
      target_language,
      converted_code: conversionResult.response.trim(),
    });
  } catch (error) {
    console.error("Upload conversion error:", error);
    if (filePath) await fs.unlink(filePath).catch(() => {});
    res.status(500).json({ error: "Internal server error" });
  }
};