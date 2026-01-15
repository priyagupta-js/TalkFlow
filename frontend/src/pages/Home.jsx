Home.jsx;
import React, { useEffect, useState, useRef } from "react";
import { Menu, MoreVertical, Send, Plus } from "lucide-react";
import { useSocket } from "../context/SocketContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const socket = useSocket();
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const userId = user?._id || user?.id || null;

  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const [showStartChat, setShowStartChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [chatSearch, setChatSearch] = useState("");

  const [openMenuChatId, setOpenMenuChatId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [chatToDelete, setChatToDelete] = useState(null);

  const textareaRef = useRef(null);

  /* ---------------- LOGOUT ---------------- */
  const handleLogout = async () => {
    await fetch(`${import.meta.env.VITE_BACKEND_API}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    setUser(null);
    navigate("/login");
  };

  /* ---------------- HELPER: GET OTHER USER ---------------- */
  const getOtherUser = (chat) => {
    if (!chat || !Array.isArray(chat.users)) return null;

    return chat.users.find(
      (u) => u && typeof u === "object" && u._id !== userId
    );
  };

  /* ---------------- CHAT SEARCH FILTER ---------------- */
  const filteredChats = chats.filter((chat) => {
    const otherUser = getOtherUser(chat);
    if (!otherUser?.name) return false;

    return otherUser.name.toLowerCase().includes(chatSearch.toLowerCase());
  });

  /* ---------------- GUARD ---------------- */
  if (!userId) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Loading chats...
      </div>
    );
  }

  /* ---------------- FETCH MESSAGES ---------------- */
  useEffect(() => {
    if (!activeChat) return;

    fetch(
      `${import.meta.env.VITE_BACKEND_API}/api/messages/${activeChat._id}`,
      { credentials: "include" }
    )
      .then((res) => res.json())
      .then((data) => {
        setMessages(Array.isArray(data) ? data : []);
      })
      .catch(() => setMessages([]));
  }, [activeChat]);

  /* ---------------- FETCH CHATS ---------------- */
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_API}/api/chats`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then(setChats)
      .catch(() => setChats([]));
  }, []);

  /* ---------------- JOIN ALL CHATS ---------------- */
  useEffect(() => {
    if (!socket || chats.length === 0) return;

    chats.forEach((chat) => {
      if (chat?._id) {
        socket.emit("joinChat", chat._id);
      }
    });
  }, [socket, chats]);

  /* ---------------- RECEIVE MESSAGE ---------------- */
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg) => {
      if (activeChat && msg.chat === activeChat._id) {
        setMessages((prev) => [...prev, msg]);
      }

      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat._id === msg.chat ? { ...chat, lastMessage: msg } : chat
        )
      );
    };

    socket.on("newMessage", handleNewMessage);
    return () => socket.off("newMessage", handleNewMessage);
  }, [socket, activeChat]);

  /* ---------------- SEND MESSAGE ---------------- */
  const sendMessage = () => {
    if (!message.trim() || !activeChat) return;

    socket.emit("sendMessage", {
      chatId: activeChat._id,
      content: message,
    });

    setMessage("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  /* ---------------- START CONVERSATION ---------------- */
  const startConversation = async () => {
    const userRes = await fetch(
      `${import.meta.env.VITE_BACKEND_API}/api/users/search?q=${searchQuery}`,
      { credentials: "include" }
    );

    if (!userRes.ok) {
      alert("User not found");
      return;
    }

    const otherUser = await userRes.json();

    const chatRes = await fetch(
      `${import.meta.env.VITE_BACKEND_API}/api/chats/access`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId: otherUser._id }),
      }
    );

    const data = await chatRes.json();
    const chat = data.chat;

    setChats((prev) => {
      const exists = prev.some((c) => c._id === chat._id);
      return exists ? prev : [chat, ...prev];
    });

    setActiveChat(chat);
    setShowStartChat(false);
    setSearchQuery("");
  };

  const emojis = [
    "😀",
    "😄",
    "😁",
    "😂",
    "🤣",
    "😊",
    "😍",
    "😘",
    "😎",
    "🥳",
    "😢",
    "😭",
    "😡",
    "👍",
    "👎",
    "🙏",
    "🔥",
    "❤️",
  ];

  // if clicked outside the modal - modal closes

  useEffect(() => {
    const handleClickOutside = () => {
      setOpenMenuChatId(null);
      setShowDeleteModal(false);
      setChatToDelete(null);
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const confirmDeleteChat = async () => {
    if (!chatToDelete) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_API}/api/chats/${chatToDelete._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!res.ok) {
        throw new Error("Delete failed");
      }

      // Remove chat from UI
      setChats((prev) => prev.filter((c) => c._id !== chatToDelete._id));

      // Reset active chat if needed
      if (activeChat?._id === chatToDelete._id) {
        setActiveChat(null);
        setMessages([]);
      }

      // Close modal
      setShowDeleteModal(false);
      setChatToDelete(null);
      setOpenMenuChatId(null);
    } catch (err) {
      console.error(err);
      alert("Failed to delete chat");
    }
  };

  return (
    <div className="h-screen flex bg-gray-50">
      {/* LEFT SIDEBAR */}
      <div className="w-1/3 bg-white border-r border-gray-300 relative">
        {/* TOP BAR */}
        <div className="p-4 border-b border-gray-300 relative">
          <div className="flex items-center gap-3">
            <button onClick={() => setOpen(!open)}>
              <Menu />
            </button>
            <input
              value={chatSearch}
              onChange={(e) => setChatSearch(e.target.value)}
              placeholder="Search chats"
              className="flex-1 px-3 py-2 text-sm bg-gray-100 rounded-full outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={() => setShowStartChat(true)}
              className="text-sm text-purple-600 font-medium"
            >
              <Plus />
            </button>
          </div>

          {/* SEARCH BAR */}
          {open && (
            <div className="absolute top-15 left-4 bg-white shadow-[0_4px_22px_rgba(0,0,0,0.12)] rounded-lg w-48 p-3 z-50">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-semibold">
                  {user?.name?.[0] || "U"}
                </div>
                <span className="font-medium text-sm">
                  {user?.name || "User"}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="text-red-500 text-sm w-full text-left"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* CHAT LIST */}
        {filteredChats.length === 0 ? (
          <div className="p-6 text-gray-500 text-center text-sm">
            No user found
          </div>
        ) : (
          filteredChats.map((chat) => {
            const otherUser = getOtherUser(chat);
            const isActive = activeChat?._id === chat._id;

            return (
              <div
                key={chat._id}
                onClick={() => setActiveChat(chat)}
                className={`p-4 cursor-pointer transition 
                  ${
                    isActive ? "bg-purple-500 text-white" : "hover:bg-gray-100"
                  }`}
              >
                <div className="font-semibold">
                  {otherUser?.name || "New Chat"}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* RIGHT PANEL */}
      <div className=" w-2/3 flex-1 flex flex-col">
        {/* HEADER */}
        <div className="px-6 py-4 border-b border-gray-300 flex justify-between">
          <div className="font-semibold">
            {activeChat
              ? getOtherUser(activeChat)?.name || "Chat"
              : "Select a chat"}
          </div>
          {activeChat && (
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <MoreVertical
                className="cursor-pointer"
                onClick={() =>
                  setOpenMenuChatId(
                    openMenuChatId === activeChat._id ? null : activeChat._id
                  )
                }
              />

              {openMenuChatId === activeChat._id && (
                <div className="absolute right-0 mt-2 bg-white shadow rounded z-50">
                  <button
                    onClick={() => {
                      setChatToDelete(activeChat);
                      setShowDeleteModal(true);
                      setOpenMenuChatId(null);
                    }}
                    className="px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-34 text-left"
                  >
                    Delete chat
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* MESSAGES */}
        <div className="flex-1 p-6 overflow-y-auto space-y-3">
          {messages.map((msg) => {
            const isOwnMessage =
              msg.sender === userId || msg.sender?._id === userId;

            return (
              <div
                key={msg._id}
                className={`flex ${
                  isOwnMessage ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-2xl shadow text-sm whitespace-pre-wrap
            ${
              isOwnMessage
                ? "bg-purple-600 text-white rounded-br-none"
                : "bg-white text-gray-800 rounded-bl-none"
            }`}
                >
                  {msg.content}
                </div>
              </div>
            );
          })}
        </div>

        {/* INPUT */}
        {activeChat && (
          <div className="px-6 py-4 mb-8 flex items-center gap-3 relative">
            {/* EMOJI BUTTON */}
            <button
              onClick={() => setShowEmojiPicker((prev) => !prev)}
              className="text-xl"
            >
              🙂
            </button>

            {/* EMOJI PICKER */}
            {showEmojiPicker && (
              <div className="absolute bottom-16 left-6 bg-white border shadow-lg rounded-lg p-3 grid grid-cols-6 gap-2 z-50">
                {emojis.map((emoji) => (
                  <button
                    key={emoji}
                    className="text-xl hover:scale-110 transition"
                    onClick={() => {
                      setMessage((prev) => prev + emoji);
                      setShowEmojiPicker(false);
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}

            {/* MESSAGE INPUT */}
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height =
                  Math.min(e.target.scrollHeight, 120) + "px";
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.ctrlKey && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
                // Ctrl + Enter → default behavior → new line
              }}
              rows={1}
              placeholder="Message"
              className="flex-1 px-3 py-2 bg-gray-100 rounded-2xl outline-none resize-none leading-relaxed"
              style={{ maxHeight: "120px" }}
            />
            {/* flex-1 px-3 py-2 bg-gray-300 rounded-full outline-none" */}

            {/* ATTACHMENT BUTTON */}
            <button
              className="text-xl"
              title="Attach file"
              onClick={() => alert("Attachments coming next 😉")}
            >
              📎
            </button>

            {/* SEND BUTTON */}
            <button
              onClick={sendMessage}
              className="bg-purple-600 text-white w-10 h-10 rounded-full flex items-center justify-center"
            >
              <Send size={18} />
            </button>
          </div>
        )}
      </div>

      {/* START CHAT MODAL */}
      {showStartChat && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setShowStartChat(false)}
        >
          <div
            className="bg-white p-6 rounded-lg w-80"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-semibold mb-3">Start Conversation</h3>

            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Username or Email"
              className="w-full px-3 py-2 border rounded"
            />

            <button
              onClick={startConversation}
              className="mt-4 w-full bg-purple-600 text-white py-2 rounded"
            >
              Start
            </button>
          </div>
        </div>
      )}

      {showDeleteModal && chatToDelete && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            className="bg-white p-6 rounded-lg w-80"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-semibold mb-4">Delete this chat?</h3>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={confirmDeleteChat}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
