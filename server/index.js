import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import analyzeRoutes from "./routes/analyze.js";
import authRoutes from "./routes/auth.js";
import chatRoutes from "./routes/chat.js";
import historyRoutes from "./routes/history.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "*", credentials: true }));
app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.use("/api/auth", authRoutes);
app.use("/api/analyze", analyzeRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/history", historyRoutes);

/**
 * Health-check route for confirming that the API server is running.
 *
 * @param {import('express').Request} _req - Incoming request object.
 * @param {import('express').Response} res - Outgoing response object.
 * @returns {void}
 */
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    app: "ResumeAI",
    aiModel: process.env.GROQ_MODEL || "llama-3.3-70b-versatile", // ← changed label
  });
});

/**
 * Connects to MongoDB and starts the Express HTTP server.
 *
 * @returns {Promise<void>} Resolves after the database connection is ready.
 */
async function startServer() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from the environment.");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    app.listen(PORT, () => {
      console.log(`ResumeAI server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();
