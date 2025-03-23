import React, { useState, useRef, useEffect } from "react";
import { sendChatbotMessage } from "../../api/axios";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useAuth } from "../../context/AuthContext";
import TypingIndicator from "./TypingIndicator";

const Chatbot: React.FC = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<{ sender: string; text: string }[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const [isUserAtBottom, setIsUserAtBottom] = useState(true);
  const { user } = useAuth();

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMsg = { sender: user?.name || "You", text: message };
    setChat((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const res = await sendChatbotMessage(message);
      const botMsg = { sender: "Spiriter", text: res.data.response };
      setChat((prev) => [...prev, botMsg]);
    } catch {
      const errorMsg = { sender: "Spiriter", text: "Error communicating with chatbot." };
      setChat((prev) => [...prev, errorMsg]);
    }

    setMessage("");
    setIsTyping(false);
  };

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      const container = chatContainerRef.current;
      if (container && isUserAtBottom) {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: "smooth",
        });
      }
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat, isUserAtBottom]);

  const handleScroll = () => {
    const container = chatContainerRef.current;
    if (container) {
      const threshold = 100; // px from bottom
      const distanceFromBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight;
      setIsUserAtBottom(distanceFromBottom < threshold);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white rounded-lg shadow-xl border border-gray-200">
      <div
        ref={chatContainerRef}
        onScroll={handleScroll}
        className="min-h-72 max-h-[450px] overflow-y-auto p-4 space-y-4 bg-gray-50 scroll-smooth"
      >
        {chat.map((msg, index) => {
          const isUserMessage = msg.sender === (user?.name || "You");
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${isUserMessage ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 max-w-[85%] rounded-lg text-sm ${
                  isUserMessage
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-200 text-gray-800 rounded-bl-none"
                }`}
              >
                <span className="block font-medium mb-1">{msg.sender}</span>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {msg.text}
                </ReactMarkdown>
              </div>
            </motion.div>
          );
        })}
        {/* Render typing indicator if isTyping is true */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex justify-start"
          >
            <div className="px-4 py-2 max-w-[85%] rounded-lg text-sm bg-gray-200 text-gray-800 rounded-bl-none">
              <span className="block font-medium mb-1">Spiriter</span>
              <TypingIndicator />
            </div>
          </motion.div>
        )}
      </div>

      <div className="flex border-t p-4 gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Type your message..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          onClick={handleSend}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Send
        </motion.button>
      </div>
    </div>
  );
};

export default Chatbot;
