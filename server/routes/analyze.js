import express from "express";
import multer from "multer";
import pdf from "pdf-parse/lib/pdf-parse.js";
import { requireAuth } from "../middleware/auth.js";
import Analysis from "../models/Analysis.js";
import {
  generateContent,
  normalizeAnalysis,
  parseGroqJson,
} from "../utils/groq.js"; // ← changed

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    if (file.mimetype !== "application/pdf") {
      callback(new Error("Only PDF files are allowed."));
      return;
    }
    callback(null, true);
  },
});

function uploadResume(req, res, next) {
  upload.single("resume")(req, res, (error) => {
    if (!error) {
      next();
      return;
    }
    const message =
      error.code === "LIMIT_FILE_SIZE"
        ? "The PDF file must not be larger than 5MB."
        : error.message;
    res.status(400).json({ message });
  });
}

async function analyzeResume(req, res) {
  try {
    if (!req.file) {
      res.status(400).json({ message: "Please upload a PDF resume." });
      return;
    }

    const parsedPdf = await pdf(req.file.buffer);
    const resumeText = parsedPdf.text?.trim();

    if (!resumeText) {
      res.status(400).json({
        message:
          "This PDF has no extractable text. Please upload a text-based PDF resume.",
      });
      return;
    }

    const prompt = `
Analyze this resume for a student or job seeker and return only a raw JSON object with no markdown fences, no preamble, and no explanation.
The JSON object must contain:
{
  "structure": "paragraph feedback about formatting and organization",
  "contentQuality": "paragraph feedback about achievements, clarity, and relevance",
  "keywordStrength": "paragraph feedback about ATS and role keywords",
  "weaknesses": ["weakness 1", "weakness 2", "weakness 3"],
  "improvements": ["improvement 1", "improvement 2", "improvement 3"],
  "careerRecommendations": [
    { "role": "role title", "explanation": "short reason this role fits the resume" }
  ]
}
Recommend 3 to 5 career roles.

Resume:
${resumeText}
`;

    const rawText = await generateContent(prompt); // ← changed (one clean call)
    const normalized = normalizeAnalysis(parseGroqJson(rawText));

    const analysis = await Analysis.create({
      userId: req.user.id,
      resumeFileName: req.file.originalname,
      resumeText,
      ...normalized,
    });

    res.status(201).json({ analysisId: analysis._id, analysis });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Unable to analyze resume.", error: error.message });
  }
}

router.post("/", requireAuth, uploadResume, analyzeResume);
export default router;
