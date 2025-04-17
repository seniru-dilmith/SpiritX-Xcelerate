import React from "react";
import { motion } from "framer-motion";

interface FooterProps {
  position?: string;
}

const Footer: React.FC<FooterProps> = ({ position }) => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: -2 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className={`${position} bg-gray-900 text-white py-6 bottom-0 w-full`}
    >
      <div className="mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        <div className="mb-4 md:mb-0">
          <h3 className="text-2xl font-bold">SecureConnect-Spirit11</h3>
          <p className="text-sm">Connecting security and excitement.</p>
        </div>
        <div className="flex space-x-4">
          <a href="/privacy" className="hover:underline text-sm">
            Privacy Policy
          </a>
          <a href="/terms" className="hover:underline text-sm">
            Terms & Conditions
          </a>
          <a href="/contact" className="hover:underline text-sm">
            Contact Us
          </a>
        </div>
      </div>
      <div className="mt-4 text-center text-sm">
        © {new Date().getFullYear()} SecureConnect-Spirit11. All rights reserved.
      </div>
    </motion.footer>
  );
};

export default Footer;
