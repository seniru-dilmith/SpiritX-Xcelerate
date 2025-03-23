import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Chatbot from "./Chatbot";

interface ChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatbotModal: React.FC<ChatbotModalProps> = ({ isOpen, onClose }) => {
  // Default width: 320px; user can resize between 200 and 600 pixels.
  const [width, setWidth] = useState<number>(320);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const isResizing = useRef<boolean>(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    isResizing.current = true;
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing.current) return;
    // Calculate new width: Since modal is fixed at bottom right, new width is (window.innerWidth - e.clientX)
    const newWidth = window.innerWidth - e.clientX;
    if (newWidth >= 200 && newWidth <= 600) {
      setWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    isResizing.current = false;
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <motion.div
      animate={
        isOpen
          ? { opacity: 1, x: 0, y: 0 }
          : { opacity: 0, x: 0, y: 100 }
      }
      initial={{ opacity: 0, x: 100, y: 100 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-4 right-4 z-50 max-w-full"
      style={{ width: width, pointerEvents: isOpen ? "auto" : "none" }}
      ref={modalRef}
    >
      <div className="relative bg-white rounded-lg shadow-xl overflow-hidden">
        {/* Resize handle on left edge */}
        <div
          onMouseDown={handleMouseDown}
          className="absolute left-0 top-0 h-full w-2 cursor-ew-resize bg-gray-200 hover:bg-gray-400 z-10"
        />
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
