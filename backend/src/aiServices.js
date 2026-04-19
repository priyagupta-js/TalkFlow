const { GoogleGenAI } = require("@google/genai");

// Initialize client (API key auto-read from .env)
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const generateAIResponse = async (userMessage) => {
  try {
    const prompt = `
You are a helpful AI assistant inside a chat application.
You can:
- Generate content
- Summarize text
- Translate languages

Respond clearly and concisely.

User: ${userMessage}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("AI service failed");
  }
};

module.exports = { generateAIResponse };