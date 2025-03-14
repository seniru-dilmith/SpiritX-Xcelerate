import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './pages/SignUp';
import Login from './pages/Login';
import Home from './pages/Home';
import Players from './pages/Players';
import Team from './pages/Team';
import Budget from './pages/Budget';
import Leaderboard from './pages/Leaderboard';
import AdminPanel from './pages/AdminPanel';
import Chatbot from './pages/Chatbot';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/players" element={<Players />} />
        <Route path="/team" element={<Team />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/chatbot" element={<Chatbot />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
