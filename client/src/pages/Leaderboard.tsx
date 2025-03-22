import React, { useEffect, useState, useCallback } from 'react';
import { getLeaderboard, fetchTeam, addTeamPlayer } from '../api/axios';
import { motion } from 'framer-motion';
import { useLoading } from '../context/LoadingContext';

interface Player {
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
  points: number; // used for overall sorting (hidden)
  inTeam?: boolean;
}

const sortingOptions = [
  { label: 'Name', value: 'name' },
  { label: 'Total Runs', value: 'total_runs' },
  { label: 'Balls Faced', value: 'balls_faced' },
  { label: 'Innings Played', value: 'innings_played' },
  { label: 'Wickets', value: 'wickets' },
  { label: 'Overs Bowled', value: 'overs_bowled' },
  { label: 'Runs Conceded', value: 'runs_conceded' },
  { label: 'Value', value: 'value_in_rupees' },
  { label: 'Overall Performance', value: 'overall' },
];

const Leaderboard: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [message, setMessage] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('overall'); // default sort: overall (by points)
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC'); // overall descending by default
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [totalPages, setTotalPages] = useState<number>(1);
  const { loading, setLoading } = useLoading();

  // Load data with sorting and pagination
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [leaderboardRes, teamRes] = await Promise.all([
        getLeaderboard(sortBy, sortOrder, currentPage, pageSize),
        fetchTeam()
      ]);
      // Expect leaderboardRes.data = { rows: Player[], count: number }
      const { rows, count } = leaderboardRes.data;
      setTotalPages(Math.ceil(count / pageSize));
      const teamPlayerIds = teamRes.data.map((record: any) => record.playerId);
      const mergedPlayers: Player[] = rows.map((player: Player) => ({
        ...player,
        inTeam: teamPlayerIds.includes(player.id)
      }));
      setPlayers(mergedPlayers);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message;
      setMessage(`Error loading players: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  }, [sortBy, sortOrder, currentPage, pageSize, setLoading]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle change in sort column; reset page to 1.
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    if (selected !== sortBy) {
      setSortBy(selected);
      setSortOrder('ASC'); // reset order to ascending for new column
    }
    setCurrentPage(1);
  };

  // Toggle sort order for current column; reset page to 1.
  const toggleSortOrder = () => {
    setSortOrder(prev => (prev === 'ASC' ? 'DESC' : 'ASC'));
    setCurrentPage(1);
  };

  // Handle page size change; reset page to 1.
  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(parseInt(e.target.value));
    setCurrentPage(1);
  };

  // Pagination controls
  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  // Handle adding a player to team (integrated from Players.tsx)
  const handleAddToTeam = async (playerId: number) => {
    try {
      setLoading(true);
      const res = await addTeamPlayer(playerId);
      setMessage(res.data.message || "Player added to team successfully.");
      await loadData();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message;
      setMessage(`Error adding player to team: ${errorMsg}`);
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // Framer Motion variants for table rows
  const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05 }
    }),
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-4">
      <h2 className="text-4xl font-bold text-center mb-6">Leaderboard</h2>

      {/* Sorting and Pagination Controls */}
      <div className="flex flex-wrap justify-center items-center space-x-4 mb-6">
        <div>
          <label className="mr-2">Sort by:</label>
          <select
            value={sortBy}
            onChange={handleSortChange}
            className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {sortingOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <button
            onClick={toggleSortOrder}
            className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Order: {sortOrder}
          </button>
        </div>
        <div>
          <label className="mr-2">Rows per page:</label>
          <select
            value={pageSize}
            onChange={handlePageSizeChange}
            className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {message && <div className="mb-4 text-center text-green-600">{message}</div>}

      {loading ? (
        <div className="text-center text-xl">Loading leaderboard...</div>
      ) : (
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
                <th className="py-3 px-4">Value</th>
                <th className="py-3 px-4">Action</th>
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
                  <td className="py-3 px-4">{player.value_in_rupees}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleAddToTeam(player.id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition disabled:opacity-50"
                      disabled={player.inTeam || loading}
                    >
                      {loading ? 'Processing...' : player.inTeam ? 'Added' : 'Add'}
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-6">
        <button 
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <div>
          Page {currentPage} of {totalPages}
        </div>
        <button 
          onClick={() => {
            if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
          }}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <p className="mt-4 text-center text-sm text-gray-600">
        Sorted by: {sortBy === 'overall' ? 'Overall Performance' : sortBy} ({sortOrder})
      </p>
    </div>
  );
};

export default Leaderboard;
