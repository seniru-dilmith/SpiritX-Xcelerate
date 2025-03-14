import React, { useState } from 'react';
import { addTeamPlayer, removeTeamPlayer } from '../api/api';

const Team: React.FC = () => {
  const [team, setTeam] = useState<any[]>([]);

  const handleAdd = (playerId: number) => {
    addTeamPlayer(playerId).then(res => {
      setTeam([...team, res.data]);
    });
  };

  const handleRemove = (playerId: number) => {
    removeTeamPlayer(playerId).then(() => {
      setTeam(team.filter(player => player.id !== playerId));
    });
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-4">Your Team</h2>
      {team.length === 0 ? (
        <p>No players in your team yet.</p>
      ) : (
        <ul>
          {team.map((player: any) => (
            <li key={player.id} className="border p-2 my-2 flex justify-between items-center">
              <span>{player.name} ({player.university})</span>
              <button className="bg-red-500 text-white p-1 rounded" onClick={() => handleRemove(player.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Team;
