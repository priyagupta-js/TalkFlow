const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser'); 
const authRoutes = require('./src/routes/authRoutes.js');
const connectDB = require('./src/config/db.js');
const {Server} = require("socket.io");
const jwt = require("jsonwebtoken");
const User = require("./src/models/UsersModel.js");
const http = require("http");
const Chat = require("./src/models/ChatModel.js");
const Message = require("./src/models/MessagesModel");
const userRoutes = require("./src/routes/userRoutes");
const chatRoutes = require("./src/routes/chatRoutes.js");
const messageRoutes = require("./src/routes/messageRoutes.js");


dotenv.config();
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  },
  transports: ["websocket", "polling"],
});

// accept JSON bodies from React
app.use(express.json());
app.use(cookieParser());

// allow your react dev server to call this API
app.use(
  cors({
    origin:process.env.CLIENT_ORIGIN,
    credentials:true
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chats",chatRoutes);
app.use("/api/messages",messageRoutes);


io.use((socket, next) => {
  try {
    const cookie = socket.handshake.headers.cookie;
    if (!cookie) return next(new Error("No cookie"));

    const token = cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (!token) return next(new Error("No token"));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.userId;

    next();
  } catch (err) {
    next(new Error("Authentication error"));
  }
});


// SOCKET LOGIC
io.on("connection", async(socket) => {
  console.log("Socket connected:", socket.userId);

   // mark user online
  await User.findByIdAndUpdate(socket.userId, {
    lastSeen: null,
  });

   // JOIN CHAT ROOM
  socket.on("joinChat", (chatId) => {
    if (!chatId) return;
    socket.join(chatId);
  });


    // 🔹 SEND MESSAGE
  socket.on("sendMessage", async ({ chatId, content }) => {
    try {
      // 1. Save message
      const message = await Message.create({
        sender: socket.userId,
        chat: chatId,
        content,
      });

      // 2. Update last message in chat
      await Chat.findByIdAndUpdate(chatId, {
        lastMessage: message._id,
      });

      // 3. Emit message to everyone in chat room
      io.to(chatId).emit("newMessage", {
        _id: message._id,
        sender: socket.userId,
        chat: chatId,
        content,
        createdAt: message.createdAt,
      });
    } catch (error) {
      console.error("Message send failed", error);
    }
  });


  socket.on("disconnect", async() => {
    console.log("Socket disconnected:", socket.userId);
    await User.findByIdAndUpdate(socket.userId, {
      lastSeen: new Date(),
    });
  });
});


// health check
app.get("/",(req,res) =>
  res.send("Auth API is running"));

const PORT = process.env.PORT || 5000;

// start server only after DB connects
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});