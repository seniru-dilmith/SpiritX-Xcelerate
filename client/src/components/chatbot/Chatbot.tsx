import React, { useState, useRef, useEffect } from "react";
import { sendChatbotMessage } from "../../api/axios";
import { motion } from "framer-motion";

// Lazy initializer to load chat history from localStorage.
const getInitialChat = () => {
  const storedChat = localStorage.getItem("chatHistory");
  return storedChat ? JSON.parse(storedChat) : [];
};

const Chatbot: React.FC = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<{ sender: string; text: string }[]>(getInitialChat);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const [isUserAtBottom, setIsUserAtBottom] = useState(true);

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMsg = { sender: "You", text: message };
    setChat((prev) => [...prev, userMsg]);

    try {
      const res = await sendChatbotMessage(message);
      const botMsg = { sender: "Spiriter", text: res.data.response };
      setChat((prev) => [...prev, botMsg]);
    } catch {
      const errorMsg = { sender: "Spiriter", text: "Error communicating with chatbot." };
      setChat((prev) => [...prev, errorMsg]);
    }

    setMessage("");
  };

  // Save chat history to localStorage whenever it changes.
  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(chat));
  }, [chat]);

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
  }, [chat]);

  const handleScroll = () => {
    const container = chatContainerRef.current;
    if (container) {
      const threshold = 100;
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
        {chat.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`px-4 py-2 max-w-[75%] rounded-lg text-sm ${
                msg.sender === "You"
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-gray-200 text-gray-800 rounded-bl-none"
              }`}
            >
              <span className="block font-medium mb-1">{msg.sender}</span>
              <span>{msg.text}</span>
            </div>
          </motion.div>
        ))}
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
