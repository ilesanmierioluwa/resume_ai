import express from "express";
import { requireAuth } from "../middleware/auth.js";
import Analysis from "../models/Analysis.js";
import ChatMessage from "../models/ChatMessage.js";
import { sendChat } from "../utils/groq.js"; // ← changed

const router = express.Router();

/**
 * Converts stored chat history into OpenAI-compatible message format (used by Groq).
 *
 * @param {string} systemContext - System prompt with resume context.
 * @param {Array<{role: string, content: string}>} history - Prior messages.
 * @param {string} newMessage - The latest user message.
 * @returns {Array<{role: string, content: string}>} Full message array for the API.
 */
function buildMessages(systemContext, history, newMessage) {
  const messages = [{ role: "system", content: systemContext }];

  for (const item of history) {
    if (item.role === "user" || item.role === "assistant") {
      messages.push({ role: item.role, content: item.content });
    }
  }

  messages.push({ role: "user", content: newMessage });
  return messages;
}

router.post("/", requireAuth, async (req, res) => {
  try {
    const { message, analysisId, history = [] } = req.body;

    if (!message || !analysisId) {
      res.status(400).json({ message: "Message and analysisId are required." });
      return;
    }

    const analysis = await Analysis.findOne({
      _id: analysisId,
      userId: req.user.id,
    });
    if (!analysis) {
      res.status(404).json({ message: "Analysis not found." });
      return;
    }

    const systemContext = `You are ResumeAI, a helpful career advisor. Use this resume as context for every answer:\n\n${analysis.resumeText}`;
    const messages = buildMessages(systemContext, history, message);

    const reply = await sendChat(messages); // ← changed (one clean call)

    const savedMessages = await ChatMessage.insertMany([
      { userId: req.user.id, analysisId, role: "user", content: message },
      { userId: req.user.id, analysisId, role: "assistant", content: reply },
    ]);

    res.json({ reply, messages: savedMessages });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Unable to send chat message.", error: error.message });
  }
});

export default router;
