const express = require("express");
const { handleAIChat } = require("../controllers/aiController");

const router = express.Router();

// POST /ai/chat
router.post("/chat", handleAIChat);
router.post("/suggestions", handleAISuggestions);
module.exports = router;   