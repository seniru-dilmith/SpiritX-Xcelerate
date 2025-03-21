import React, { useEffect, useState, useCallback } from 'react';
import { fetchPlayers, fetchTeam, addTeamPlayer } from '../api/axios';
import { useLoading } from '../context/LoadingContext';

interface Player {
  id: number;
  name: string;
  university: string;
  inTeam?: boolean;
}

const Players: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const { loading, setLoading } = useLoading();
  const [message, setMessage] = useState<string>('');

  // Helper function to load and merge players and team data
  const loadData = useCallback(async () => {
    try {
      const [playersRes, teamRes] = await Promise.all([fetchPlayers(), fetchTeam()]);
      // Extract player IDs that are already in the team
      const teamPlayerIds = teamRes.data.map((record: any) => record.playerId);
      // Merge: if a player's id is in teamPlayerIds, mark inTeam true
      const mergedPlayers: Player[] = playersRes.data.map((player: Player) => ({
        ...player,
        inTeam: teamPlayerIds.includes(player.id),
      }));
      setPlayers(mergedPlayers);
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || err.message;
      setMessage(`Error loading players: ${errorMsg}`);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddToTeam = async (playerId: number) => {
    try {
      setLoading(true);
      const res = await addTeamPlayer(playerId);
      setMessage(res.data.message || "Player added to team successfully.");
      // Re-fetch data after adding to ensure UI is in sync
      await loadData();
    } catch (err: any) {
      console.error(err);
      const errorMsg =
        err.response?.data?.message || err.message;
      setMessage(`Error adding player to team: ${errorMsg}`);
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-4">Players</h2>
      {message && <div className="mb-4 text-green-600">{message}</div>}
      <ul>
        {players.map((player) => (
          <li
            key={player.id}
            className={`border p-4 my-2 flex flex-col md:flex-row justify-between items-center ${
              player.inTeam ? "bg-green-200" : "bg-red-200"
            }`}
          >
            <div>
              <p className="font-semibold">Name: {player.name}</p>
              <p>University: {player.university}</p>
            </div>
            <button
              onClick={() => handleAddToTeam(player.id)}
              className="mt-2 md:mt-0 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              disabled={player.inTeam || loading}
            >
              {loading ? 'Adding...' : player.inTeam ? 'Added' : 'Add to Team'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Players;
