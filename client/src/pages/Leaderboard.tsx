import React, { useEffect, useState } from 'react';
import { getLeaderboard } from '../api/axios';

const Leaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    getLeaderboard()
      .then(res => setLeaderboard(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="max-w-md mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
      <ul>
        {leaderboard.map((user: any, index: number) => (
          <li key={user.id} className="border p-2 my-2">
            {index + 1}. {user.username} - {user.points} points
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;
