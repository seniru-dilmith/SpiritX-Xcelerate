import React, { useState, useEffect } from "react";
import { fetchAdminPlayers, createPlayer, updatePlayer, deletePlayer } from "../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import PlayerModal, { Player } from "../components/adminPanel/PlayerModal";
import DeletePlayerModal from "../components/adminPanel/DeletePlayerModal";

const modalVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
};

const AdminPanel: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("ASC");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalCount, setTotalCount] = useState(0);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const fetchPlayersData = async () => {
    setLoading(true);
    try {
      // Pass search, pagination and sorting parameters to the API.
      const res = await fetchAdminPlayers(searchTerm, currentPage, pageSize, sortBy, sortOrder);
      // Use res.data.rows as the players array.
      setPlayers(res.data.rows);
      setTotalCount(res.data.count);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Error fetching players");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayersData();
  }, [searchTerm, currentPage, pageSize, sortBy, sortOrder]);

  const handleAddPlayer = async (playerData: Partial<Player>) => {
    try {
      await createPlayer(playerData);
      fetchPlayersData();
      setIsAddModalOpen(false);
    } catch (err: any) {
      console.error("Error adding player:", err);
    }
  };

  const handleUpdatePlayer = async (playerId: number, playerData: Partial<Player>) => {
    try {
      await updatePlayer(playerId, playerData);
      fetchPlayersData();
      setIsEditModalOpen(false);
      setSelectedPlayer(null);
    } catch (err: any) {
      console.error("Error updating player:", err);
    }
  };

  const handleDeletePlayer = async (playerId: number) => {
    try {
      await deletePlayer(playerId);
      fetchPlayersData();
      setIsDeleteModalOpen(false);
      setSelectedPlayer(null);
    } catch (err: any) {
      console.error("Error deleting player:", err);
    }
  };

  const toggleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder((prev) => (prev === "ASC" ? "DESC" : "ASC"));
    } else {
      setSortBy(column);
      setSortOrder("ASC");
    }
    setCurrentPage(1);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-4">Admin Panel - Players</h2>
      
      <div className="flex flex-col sm:flex-row sm:justify-between mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          placeholder="Search by name..."
          className="p-2 border rounded w-full sm:w-64 mb-2 sm:mb-0"
        />
        <div className="flex items-center gap-4">
          <label className="text-sm">Rows per page:</label>
          <select
            value={pageSize}
            onChange={(e) => { setPageSize(parseInt(e.target.value)); setCurrentPage(1); }}
            className="p-2 border rounded"
          >
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>
      
      <button
        onClick={() => setIsAddModalOpen(true)}
        className="mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
      >
        Add Player
      </button>

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <table className="min-w-full bg-white border rounded-lg shadow">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-2 px-4 cursor-pointer" onClick={() => toggleSort("name")}>
                Name {sortBy === "name" && (sortOrder === "ASC" ? "↑" : "↓")}
              </th>
              <th className="py-2 px-4 cursor-pointer" onClick={() => toggleSort("university")}>
                University {sortBy === "university" && (sortOrder === "ASC" ? "↑" : "↓")}
              </th>
              <th className="py-2 px-4 cursor-pointer" onClick={() => toggleSort("category")}>
                Category {sortBy === "category" && (sortOrder === "ASC" ? "↑" : "↓")}
              </th>
              <th className="py-2 px-4 cursor-pointer" onClick={() => toggleSort("total_runs")}>
                Total Runs {sortBy === "total_runs" && (sortOrder === "ASC" ? "↑" : "↓")}
              </th>
              <th className="py-2 px-4 cursor-pointer" onClick={() => toggleSort("wickets")}>
                Wickets {sortBy === "wickets" && (sortOrder === "ASC" ? "↑" : "↓")}
              </th>
              <th className="py-2 px-4 cursor-pointer" onClick={() => toggleSort("points")}>
                Points {sortBy === "points" && (sortOrder === "ASC" ? "↑" : "↓")}
              </th>
              <th className="py-2 px-4 cursor-pointer" onClick={() => toggleSort("value_in_rupees")}>
                Value {sortBy === "value_in_rupees" && (sortOrder === "ASC" ? "↑" : "↓")}
              </th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player) => (
              <tr key={player.id} className="border-t">
                <td className="py-2 px-4">{player.name}</td>
                <td className="py-2 px-4">{player.university}</td>
                <td className="py-2 px-4">{player.category}</td>
                <td className="py-2 px-4">{player.total_runs}</td>
                <td className="py-2 px-4">{player.wickets}</td>
                <td className="py-2 px-4">{player.points}</td>
                <td className="py-2 px-4">{player.value_in_rupees}</td>
                <td className="py-2 px-4 space-x-2">
                  <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedPlayer(player);
                      setIsEditModalOpen(true);
                    }}
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setSelectedPlayer(player);
                      setIsDeleteModalOpen(true);
                    }}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <div>
          Page {currentPage} of {Math.ceil(totalCount / pageSize)}
        </div>
        <button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={players.length < pageSize}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Add/Edit Player Modal */}
      <AnimatePresence>
        {(isAddModalOpen || isEditModalOpen) && (
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          >
            <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md">
              <h3 className="text-xl font-bold mb-4">
                {isAddModalOpen ? "Add Player" : "Edit Player"}
              </h3>
              <PlayerModal
                initialData={selectedPlayer || {}}
                onSubmit={(data) =>
                  isAddModalOpen
                    ? handleAddPlayer(data)
                    : selectedPlayer
                    ? handleUpdatePlayer(selectedPlayer.id as number, data)
                    : null
                }
                onCancel={() => {
                  setIsAddModalOpen(false);
                  setIsEditModalOpen(false);
                  setSelectedPlayer(null);
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && selectedPlayer && (
          <DeletePlayerModal
            playerName={selectedPlayer.name}
            onCancel={() => {
              setIsDeleteModalOpen(false);
              setSelectedPlayer(null);
            }}
            onConfirm={() => handleDeletePlayer(selectedPlayer.id as number)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPanel;
