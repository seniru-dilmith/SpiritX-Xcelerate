import React from "react";
import { motion } from "framer-motion";
import Chatbot from "./Chatbot";

interface ChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatbotModal: React.FC<ChatbotModalProps> = ({ isOpen, onClose }) => {
  return (
    <motion.div
      animate={
        isOpen
          ? { opacity: 1, x: 0, y: 0 }
          : { opacity: 0, x: 0, y: 100 }
      }
      initial={{ opacity: 0, x: 100, y: 100 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-4 right-4 z-50 w-80 max-w-full"
      style={{ pointerEvents: isOpen ? "auto" : "none" }}
    >
      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-blue-600 text-white px-4 py-2 flex justify-between items-center">
          <div className="font-bold text-xl">🧠 Spiriter Chatbot</div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200"
          >
           &mdash;
          </button>
        </div>
        <Chatbot />
      </div>
    </motion.div>
  );
};

export default ChatbotModal;
