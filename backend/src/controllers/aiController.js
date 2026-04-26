const { generateAIResponse } = require("../aiServices");
const { generateSuggestions } = require("../aiService"); 


const handleAIChat = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    const aiReply = await generateAIResponse(message);

    return res.status(200).json({
      reply: aiReply,
    });

  } catch (error) {
    console.error("Error in AI Controller:", error);

    return res.status(500).json({
      error: "Failed to get AI response",
    });
  }
};



const handleAISuggestions = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    const suggestions = await generateSuggestions(message);

    return res.status(200).json({
      suggestions,
    });

  } catch (error) {
    console.error("Error in AI Suggestions:", error);

    return res.status(500).json({
      error: "Failed to get suggestions",
    });
  }
};

module.exports = { handleAIChat , handleAISuggestions};