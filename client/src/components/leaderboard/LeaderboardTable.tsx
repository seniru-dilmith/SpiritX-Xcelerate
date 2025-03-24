import React from "react";
import { motion } from "framer-motion";

export interface Player {
  id: number;
  name: string;
  university: string;
  category: string;
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
  onSortChange: (column: string) => void;
  sortBy: string;
  sortOrder: "ASC" | "DESC";
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
  onSortChange,
  sortBy,
  sortOrder,
}) => {
  const renderHeader = (label: string, column: string) => (
    <th
      className="py-3 px-4 cursor-pointer select-none"
      onClick={() => onSortChange(column)}
    >
      {label} {sortBy === column && (sortOrder === "ASC" ? "↑" : "↓")}
    </th>
  );

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border rounded-lg shadow-lg">
        <thead className="bg-blue-600 text-white">
          <tr>
            {renderHeader("Name", "name")}
            {renderHeader("University", "university")}
            {renderHeader("Category", "category")}
            {renderHeader("Total Runs", "total_runs")}
            {renderHeader("Balls Faced", "balls_faced")}
            {renderHeader("Innings Played", "innings_played")}
            {renderHeader("Wickets", "wickets")}
            {renderHeader("Overs Bowled", "overs_bowled")}
            {renderHeader("Runs Conceded", "runs_conceded")}
            {isAdmin && renderHeader("Points", "points")}
            {renderHeader("Value", "value_in_rupees")}
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
              <td className="py-3 px-4">{player.category}</td>
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
