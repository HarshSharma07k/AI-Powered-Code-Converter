import { userPrompt, model } from "../chains/codeConverter.chain.js";

export const convertCode = async (req, res) => {
  try {
    let { source_language, target_language, code } = req.body;

    if (!target_language || !code) {
      return res.status(400).json({ error: "Missing target_language or code" });
    }

    if (!source_language) {
      const detectionResponse = await languageDetectionChain.call({ code });
      source_language = detectionResponse.response.trim();
      console.log(`Detected source language: ${source_language}`);
    }
    
    const myPrompt = (await userPrompt.format({code: code, targetLanguage: target_language}))?.content;

    const conversionResponse = await model.invoke(myPrompt)?.response;

    console.log(`Models Output Is : ${conversionResponse}`);

    res.json({
      source_language,
      target_language,
      converted_code: conversionResponse.trim(),
    });
  } catch (error) {
    console.error("Conversion error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};