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

const generateSuggestions = async (incomingMessage) => {
  try {
    const prompt = `
You are an AI assistant.

Generate 3 short, natural reply suggestions for the following message.

Rules:
- Keep replies very short (max 6-8 words)
- Make them conversational and human-like
- No numbering
- No explanations
- Return each reply on a new line

Message: "${incomingMessage}"
`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    // Extract text safely
    let text = "";

    if (response.text) {
      text = response.text;
    } else if (response.candidates?.length > 0) {
      text =
        response.candidates[0]?.content?.parts?.[0]?.text || "";
    }

    // Convert into array
    const suggestions = text
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    return suggestions.slice(0, 3);

  } catch (error) {
    console.error("Suggestion API Error:", error);
    throw new Error("Suggestion generation failed");
  }
};
module.exports = { generateAIResponse ,  generateSuggestions};