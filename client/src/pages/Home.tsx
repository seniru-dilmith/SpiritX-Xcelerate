import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');

  useEffect(() => {
    // In a real app, user data would be fetched from session or an API.
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/');
    } else {
      setUsername(user);
    }
  }, [navigate]);

  return (
    <div className="max-w-md mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold">Hello, {username}!</h2>
      <p>Welcome to SecureConnect-Spirit11</p>
    </div>
  );
};

export default Home;
