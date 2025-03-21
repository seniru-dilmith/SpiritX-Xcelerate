import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../api/axios';
import AdminNavbar from './AdminNavbar';
import UserNavbar from './UserNavbar';
import { motion, AnimatePresence } from 'framer-motion';

const popupVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.5 } },
};

const Navbar: React.FC = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [logoutPopup, setLogoutPopup] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      const response = await logout(); // Call the backend logout endpoint
      // Display the backend logout message in the popup
      setLogoutPopup(response.data.message);
      // After 2 seconds, hide the popup, clear user state, and redirect
      setTimeout(() => {
        setLogoutPopup(null);
        setUser(null);
        navigate('/');
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
      <AnimatePresence>
        {logoutPopup && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={popupVariants}
            className="fixed inset-0 flex items-center justify-center bg-black/50"
          >
            <div className="p-4 bg-white rounded shadow-lg z-50">
              {logoutPopup}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
