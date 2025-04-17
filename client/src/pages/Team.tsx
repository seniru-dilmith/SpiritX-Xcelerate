import React, { useEffect, useState } from 'react';
import { fetchTeam, removeTeamPlayer } from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';

const Team: React.FC = () => {
  const [team, setTeam] = useState<any[]>([]);

  // Helper function to fetch team data
  const fetchTeamData = async () => {
    try {
      const res = await fetchTeam();
      setTeam(res.data);
    } catch (err) {
      console.error("Error fetching team data", err);
    }
  };

  // Fetch team data on mount
  useEffect(() => {
    fetchTeamData();
  }, []);

  // Handle removal of a player
  const handleRemove = async (playerId: number) => {
    try {
      await removeTeamPlayer(playerId);
      // Option: re-fetch team data
      await fetchTeamData();
    } catch (error) {
      console.error(error);
    }
  };

  // Variants for the list container and items
  const listVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20, transition: { duration: 0.3 } },
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <h2 className="text-3xl font-bold mb-6 text-center">Your Team</h2>
      {team.length === 0 ? (
        <p className="text-center text-gray-600">No players in your team yet.</p>
      ) : (
        <AnimatePresence>
          <motion.ul
            variants={listVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="space-y-4"
          >
            {team.map((record: any) => (
              <motion.li
                key={record.Player.id}
                variants={itemVariants}
                className="bg-white rounded-lg shadow p-4 flex flex-col md:flex-row justify-between items-center border border-gray-200"
              >
                <div>
                  <p className="text-xl font-semibold">{record.Player.name}</p>
                  <p className="text-gray-600">{record.Player.university}</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleRemove(record.Player.id)}
                  className="mt-2 md:mt-0 bg-red-500 text-white px-4 py-2 rounded transition"
                >
                  Remove
                </motion.button>
              </motion.li>
            ))}
          </motion.ul>
        </AnimatePresence>
      )}
    </div>
  );
};

export default Team;
