const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const {
  getChats,
  accessChat,
  deleteChat
} = require("../controllers/chatController");

router.get("/", authMiddleware, getChats);
router.post("/access", authMiddleware, accessChat);
router.delete("/:chatId", authMiddleware, deleteChat);

module.exports = router;
