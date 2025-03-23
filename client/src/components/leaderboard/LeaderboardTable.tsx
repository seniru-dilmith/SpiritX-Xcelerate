import React from "react";
import { motion } from "framer-motion";

export interface Player {
  id: number;
  name: string;
  university: string;
  total_runs: number;
  balls_faced: number;
  innings_played: number;
  wickets: number;
  overs_bowled: number;
  runs_conceded: number;
  value_in_rupees: number;
  points: number;
  inTeam?: boolean;
}

interface LeaderboardTableProps {
  players: Player[];
  isAdmin: boolean;
  onAddToTeam?: (id: number) => void;
}

const rowVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05 },
  }),
};

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  players,
  isAdmin,
  onAddToTeam,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border rounded-lg shadow-lg">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="py-3 px-4">Name</th>
            <th className="py-3 px-4">University</th>
            <th className="py-3 px-4">Total Runs</th>
            <th className="py-3 px-4">Balls Faced</th>
            <th className="py-3 px-4">Innings Played</th>
            <th className="py-3 px-4">Wickets</th>
            <th className="py-3 px-4">Overs Bowled</th>
            <th className="py-3 px-4">Runs Conceded</th>
            {isAdmin && <th className="py-3 px-4">Points</th>}
            <th className="py-3 px-4">Value</th>
            {!isAdmin && <th className="py-3 px-4">Action</th>}
          </tr>
        </thead>
        <tbody>
          {players.map((player, index) => (
            <motion.tr
              key={player.id}
              custom={index}
              variants={rowVariants}
              initial="hidden"
              animate="visible"
              className="border-t"
            >
              <td className="py-3 px-4">{player.name}</td>
              <td className="py-3 px-4">{player.university}</td>
              <td className="py-3 px-4">{player.total_runs}</td>
              <td className="py-3 px-4">{player.balls_faced}</td>
              <td className="py-3 px-4">{player.innings_played}</td>
              <td className="py-3 px-4">{player.wickets}</td>
              <td className="py-3 px-4">{player.overs_bowled}</td>
              <td className="py-3 px-4">{player.runs_conceded}</td>
              {isAdmin && (
                <td className="py-3 px-4">{player.points.toFixed(2)}</td>
              )}
              <td className="py-3 px-4">{player.value_in_rupees}</td>
              {!isAdmin && (
                <td className="py-3 px-4">
                  <button
                    onClick={() => onAddToTeam && onAddToTeam(player.id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition disabled:opacity-50"
                    disabled={player.inTeam}
                  >
                    {player.inTeam ? "Added" : "Add"}
                  </button>
                </td>
              )}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderboardTable;
