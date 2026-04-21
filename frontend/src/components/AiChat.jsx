import React, { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import axios from "axios";

const AI_STORAGE_KEY = "nexus_ai_chat_messages";

const TypingIndicator = () => (
  <div className="flex justify-start">
    <div className="bg-white text-gray-800 rounded-2xl rounded-bl-none px-4 py-3 shadow flex items-center gap-1">
      <span
        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
        style={{ animationDelay: "0ms" }}
      />
      <span
        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
        style={{ animationDelay: "150ms" }}
      />
      <span
        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
        style={{ animationDelay: "300ms" }}
      />
    </div>
  </div>
);

export default function AIChatWindow() {
  const [messages, setMessages] = useState(() => {
    try {
      const stored = localStorage.getItem(AI_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const emojis = [
    "😀","😄","😁","😂","🤣","😊","😍","😘","😎",
    "🥳","😢","😭","😡","👍","👎","🙏","🔥","❤️",
  ];

  // Persist messages to localStorage on every update
  useEffect(() => {
    localStorage.setItem(AI_STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMsg = { role: "user", content: trimmed, id: Date.now() };
    const updatedMessages = [...messages, userMsg];

    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      const res = await axios.post("http://localhost:5000/ai/chat", {
        message: trimmed,
      });

      const aiContent =
        res.data.reply || "Sorry, I couldn't generate a response.";

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: aiContent, id: Date.now() + 1 },
      ]);
    } catch (err) {
      console.error("AI fetch error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Something went wrong. Please try again.",
          id: Date.now() + 1,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="w-2/3 flex-1 flex flex-col h-screen">
      {/* HEADER */}
      <div className="px-6 py-4 border-b border-gray-300 flex items-center gap-3">
        {/* AI Avatar */}
        <div className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-bold shadow">
          AI
        </div>
        <div>
          <div className="font-semibold text-gray-900 leading-tight">
            Nexus AI
          </div>
          <div className="text-xs text-green-500 font-medium">● Always online</div>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 p-6 overflow-y-auto space-y-3 bg-gray-50">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
            <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-2xl font-bold shadow">
              AI
            </div>
            <p className="text-gray-600 font-medium">Hi! I'm Nexus AI 👋</p>
            <p className="text-gray-400 text-sm max-w-xs">
              Ask me anything — summarize text, answer questions, brainstorm
              ideas, and more.
            </p>
          </div>
        )}

        {messages.map((msg) => {
          const isUser = msg.role === "user";
          return (
            <div
              key={msg.id}
              className={`flex ${isUser ? "justify-end" : "justify-start"}`}
            >
              {/* AI avatar for assistant messages */}
              {!isUser && (
                <div className="w-7 h-7 rounded-full bg-purple-600 text-white text-xs font-bold flex items-center justify-center mr-2 mt-1 shrink-0">
                  AI
                </div>
              )}
              <div
                className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl shadow text-sm whitespace-pre-wrap leading-relaxed
                  ${
                    isUser
                      ? "bg-purple-600 text-white rounded-br-none"
                      : "bg-white text-gray-800 rounded-bl-none"
                  }`}
              >
                {msg.content}
              </div>
            </div>
          );
        })}

        {isLoading && <TypingIndicator />}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <div className="px-6 py-4 mb-8 flex items-center gap-3 relative bg-white border-t border-gray-200">
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
                  setInput((prev) => prev + emoji);
                  setShowEmojiPicker(false);
                }}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        {/* TEXT INPUT */}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onInput={(e) => {
            e.target.style.height = "auto";
            e.target.style.height =
              Math.min(e.target.scrollHeight, 120) + "px";
          }}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="Ask Nexus AI anything..."
          className="flex-1 px-3 py-2 bg-gray-100 rounded-2xl outline-none resize-none leading-relaxed"
          style={{ maxHeight: "120px" }}
          disabled={isLoading}
        />

        {/* SEND BUTTON */}
        <button
          onClick={sendMessage}
          disabled={isLoading || !input.trim()}
          className="bg-purple-600 text-white w-10 h-10 rounded-full flex items-center justify-center disabled:opacity-40 transition"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}