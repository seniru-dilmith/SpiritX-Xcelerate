import React, { useEffect, useState } from 'react';
import { fetchTeam, removeTeamPlayer } from '../api/axios';

const Team: React.FC = () => {
  const [team, setTeam] = useState<any[]>([]);

  const fetchTeamData = async () => {
    try {
      const res = await fetchTeam();
      setTeam(res.data);
    }
    catch (err) {
      console.error("Error fetching team data", err);
    }
  };

  // Fetch team on component mount
  useEffect(() => {
    fetchTeamData(), []
  });

  const handleRemove = async (playerId: number) => {
    try {
      await removeTeamPlayer(playerId);
      setTeam(team.filter(player => player.id !== playerId));
      await fetchTeamData();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-4">Your Team</h2>
      {team.length === 0 ? (
        <p>No players in your team yet.</p>
      ) : (
        <ul>
          {team.map((record: any) => (
            <li key={record.Player.id} className="border p-2 my-2 flex justify-between items-center">
              <span>{record.Player.name} ({record.Player.university})</span>
              <button className="bg-red-500 text-white p-1 rounded" onClick={() => handleRemove(record.Player.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Team;
