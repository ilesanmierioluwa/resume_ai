import Groq from "groq-sdk";

let client;
const DEFAULT_MODEL = "llama-3.3-70b-versatile";

/**
 * Returns a configured Groq client instance.
 *
 * @returns {Groq} Groq client instance.
 */
function getGroqClient() {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is missing from the environment.");
  }
  if (!client) {
    client = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return client;
}

/**
 * Sends a single prompt and returns the text response.
 *
 * @param {string} prompt - The full prompt string.
 * @returns {Promise<string>} The model's text reply.
 */
export async function generateContent(prompt) {
  const completion = await getGroqClient().chat.completions.create({
    model: process.env.GROQ_MODEL || DEFAULT_MODEL,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });
  return completion.choices[0].message.content;
}

/**
 * Sends a multi-turn chat and returns the assistant's reply.
 *
 * @param {Array<{role: string, content: string}>} messages - Full message history.
 * @returns {Promise<string>} The model's text reply.
 */
export async function sendChat(messages) {
  const completion = await getGroqClient().chat.completions.create({
    model: process.env.GROQ_MODEL || DEFAULT_MODEL,
    messages,
    temperature: 0.7,
  });
  return completion.choices[0].message.content;
}

/**
 * Extracts a raw JSON object from model text and parses it.
 *
 * @param {string} text - Text returned by the model.
 * @returns {object} Parsed JSON response.
 */
export function parseGroqJson(text) {
  const cleaned = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (start === -1 || end === -1) {
    throw new Error("The AI response was not valid JSON.");
  }

  return JSON.parse(cleaned.slice(start, end + 1));
}

/**
 * Normalizes a parsed analysis into the exact shape stored by the database.
 *
 * @param {object} data - Parsed JSON response.
 * @returns {object} Normalized analysis fields.
 */
export function normalizeAnalysis(data) {
  return {
    structureFeedback: String(data.structure || data.structureFeedback || ""),
    contentQualityFeedback: String(
      data.contentQuality || data.contentQualityFeedback || "",
    ),
    keywordStrengthFeedback: String(
      data.keywordStrength || data.keywordStrengthFeedback || "",
    ),
    weaknesses: Array.isArray(data.weaknesses)
      ? data.weaknesses.map(String)
      : [],
    improvements: Array.isArray(data.improvements)
      ? data.improvements.map(String)
      : [],
    careerRecommendations: Array.isArray(data.careerRecommendations)
      ? data.careerRecommendations.slice(0, 5).map((item) => ({
          role: String(item.role || ""),
          explanation: String(item.explanation || ""),
        }))
      : [],
  };
}
