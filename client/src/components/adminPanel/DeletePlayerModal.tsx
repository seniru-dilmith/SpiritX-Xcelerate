import React from "react";
import { motion } from "framer-motion";

interface DeletePlayerModalProps {
  playerName: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const DeletePlayerModal: React.FC<DeletePlayerModalProps> = ({
  playerName,
  onCancel,
  onConfirm,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-sm">
        <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
        <p>
          Are you sure you want to delete{" "}
          <span className="font-bold">{playerName}</span>?
        </p>
        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default DeletePlayerModal;
