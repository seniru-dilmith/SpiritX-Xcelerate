// src/components/AdminNavbar.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
  onLogout: () => void;
}

const AdminNavbar: React.FC<NavbarProps> = ({ onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto" },
    exit: { opacity: 0, height: 0, transition: { duration: 0.3 } },
  };

  return (
    <nav className="bg-gray-900 text-lime-300 p-4 w-full">
      <div className="flex items-center justify-between">
        <div className="text-white font-bold text-lg">
          SecureConnect-Spirit11
        </div>
        {/* Desktop menu */}
        <div className="hidden md:flex space-x-4">
          <Link to="/home" className="hover:bg-amber-600 hover:text-white px-4 py-2 rounded-lg transition duration-300 transform hover:scale-105"> Home </Link>
          <Link to="/leaderboard" className="hover:bg-amber-600 hover:text-white px-4 py-2 rounded-lg transition duration-300 transform hover:scale-105" > Leaderboard </Link>
          <Link to="/chatbot" className="hover:bg-amber-600 hover:text-white px-4 py-2 rounded-lg transition duration-300 transform hover:scale-105" > Chatbot </Link>
          <Link to="/admin" className="hover:bg-amber-600 hover:text-white px-4 py-2 rounded-lg transition duration-300 transform hover:scale-105"> Admin Panel </Link>
          <button
            onClick={onLogout}
            className="hover:bg-red-600 hover:text-white text-red-400 px-4 py-2 rounded-lg transition duration-300 transform hover:scale-105"
          >
            Logout
          </button>
        </div>
        {/* Hamburger icon for mobile */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={ isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16" } />
            </svg>
          </button>
        </div>
      </div>
      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="md:hidden mt-2 overflow-hidden"
          >
            <ul className="flex flex-col space-y-2">
              <li> <Link to="/home" className="block hover:bg-amber-600 hover:text-white px-4 py-2 rounded-lg transition duration-300" onClick={() => setIsOpen(false)} > Home </Link> </li>
              <li> <Link to="/leaderboard" className="block hover:bg-amber-600 hover:text-white px-4 py-2 rounded-lg transition duration-300" onClick={() => setIsOpen(false)} > Leaderboard </Link> </li>
              <li> <Link to="/chatbot" className="block hover:bg-amber-600 hover:text-white px-4 py-2 rounded-lg transition duration-300" onClick={() => setIsOpen(false)} > Chatbot </Link> </li>
              <li> <Link to="/admin" className="block hover:bg-amber-600 hover:text-white px-4 py-2 rounded-lg transition duration-300" onClick={() => setIsOpen(false)} > Admin Panel </Link> </li>
              <li> <button onClick={() => { setIsOpen(false); onLogout(); }} className="w-full text-left hover:bg-red-600 hover:text-white text-red-400 px-4 py-2 rounded-lg transition duration-300" > Logout </button> </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default AdminNavbar;
