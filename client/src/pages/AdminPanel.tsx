import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminPanel: React.FC = () => {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    axios.get('/api/admin/players')
      .then(res => setPlayers(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-4">Admin Panel - Players</h2>
      <ul>
        {players.map((player: any) => (
          <li key={player.id} className="border p-2 my-2">
            <p>Name: {player.name}</p>
            <p>University: {player.university}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPanel;
