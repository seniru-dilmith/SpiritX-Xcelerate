// src/components/Navbar.tsx
import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { logout } from "../../api/axios";
import AdminNavbar from "./AdminNavbar";
import UserNavbar from "./UserNavbar";
import { motion, AnimatePresence } from "framer-motion";
import ChatbotModal from "../chatbot/ChatbotModal";

const popupVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.5 } },
};

const Navbar: React.FC = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [logoutPopup, setLogoutPopup] = useState<string | null>(null);
  const [showChatbot, setShowChatbot] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await logout();
      setLogoutPopup(response.data.message);
      setTimeout(() => {
        setLogoutPopup(null);
        setUser(null);
        localStorage.removeItem("chatHistory");
        navigate("/");
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return null;

  return (
    <>
      {user.isAdmin ? (
        <AdminNavbar onLogout={handleLogout} />
      ) : (
        <UserNavbar onLogout={handleLogout} />
      )}

      {/* Floating Chatbot Button */}
      <button
        onClick={() => setShowChatbot(true)}
        className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg z-50"
      >
        💬
      </button>

      {/* Chatbot Modal Panel */}
      <ChatbotModal isOpen={showChatbot} onClose={() => setShowChatbot(false)} />

      {/* Logout Popup */}
      <AnimatePresence>
        {logoutPopup && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={popupVariants}
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
          >
            <div className="p-4 bg-white rounded shadow-lg">{logoutPopup}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
