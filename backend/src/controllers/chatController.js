const Chat = require("../models/ChatModel");
const Message = require("../models/MessagesModel");
const mongoose = require("mongoose");

// 🔹 Get all chats for logged-in user
exports.getChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      users: { $in: [req.userId] },
      isGroupChat: false,
    })
      .populate("users", "name email")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch chats" });
  }
};

// 🔹 Create or access one-to-one chat (DUPLICATE SAFE)
exports.accessChat = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }

  try {
    const loggedInUserId = new mongoose.Types.ObjectId(req.userId);
    const selectedUserId = new mongoose.Types.ObjectId(userId);

    // 🔴 DUPLICATE CHECK
    let chat = await Chat.findOne({
      isGroupChat: false,
      users: { $all: [loggedInUserId, selectedUserId] },
    }).populate("users", "name email");

    if (chat) {
      return res.status(200).json({
        chat,
        alreadyExists: true,
      });
    }

    //CREATE NEW CHAT
    const newChat = await Chat.create
    ({
      isGroupChat: false,
      users: [loggedInUserId, selectedUserId],
    });

    const populatedChat = await Chat.findById(newChat._id).populate(
      "users",
      "name email"
    );

    res.status(201).json({
      chat: populatedChat,
      alreadyExists: false,
    });
  } catch (error) {
    console.error("Access chat error:", error);
    res.status(500).json({ message: "Chat access failed" });
  }
};


exports.deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.userId;

    // 1. Find chat
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // 2. Check if user belongs to chat
    const isMember = chat.users.some(
      (u) => u.toString() === userId
    );

    if (!isMember) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // 3. Delete all messages of this chat
    await Message.deleteMany({ chat: chatId });

    // 4. Delete chat itself
    await Chat.findByIdAndDelete(chatId);

    res.status(200).json({ message: "Chat deleted successfully" });
  } catch (error) {
    console.error("Delete chat error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
