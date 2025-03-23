import React from "react";
import { motion } from "framer-motion";

// Simple typing indicator component: three animated dots.
const TypingIndicator: React.FC = () => {
  return (
    <motion.div
      className="flex space-x-1"
      animate={{ opacity: [0.3, 1, 0.3] }}
      transition={{ duration: 1, repeat: Infinity }}
    >
      <span className="w-2 h-2 bg-gray-600 rounded-full" />
      <span className="w-2 h-2 bg-gray-600 rounded-full" />
      <span className="w-2 h-2 bg-gray-600 rounded-full" />
    </motion.div>
  );
};

export default TypingIndicator;