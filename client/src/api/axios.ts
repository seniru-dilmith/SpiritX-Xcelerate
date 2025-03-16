import axios from 'axios';

interface sighupData {
  username: string;
  password: string;
  confirmPassword: string;
}

interface loginData {
  username: string;
  password: string;
}

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// ========== Auth APIs ==========
export const signup = (data: sighupData) =>
  API.post('/auth/signup', data);

export const login = (data: loginData) =>
  API.post('/auth/login', data);

// Get current logged-in user from HttpOnly cookies
export const fetchUser = async () => 
  API.get('/auth/me');

// Refresh tokens endpoint
export const refreshTokens = () => 
  API.post('/auth/refresh');

// Logout endpoint
export const logout = () => 
  API.post('/auth/logout');

// ========== Admin APIs ==========
export const fetchAdminPlayers = () => 
  API.get('/admin/players');

export const fetchPlayerStats = (id: number) =>
  API.get(`/admin/player-stats/${id}`);

export const updatePlayer = (id: number, data: any) =>
  API.put(`/admin/player/${id}`, data);

export const deletePlayer = (id: number) =>
  API.delete(`/admin/player/${id}`);

export const createPlayer = (data: any) =>
  API.post('/admin/player', data);

export const fetchTournamentSummary = () =>
  API.get('/admin/tournament-summary');

// ========== User APIs ==========
export const fetchPlayers = () => 
  API.get('/players');

export const addTeamPlayer = (playerId: number) =>
  API.post('/team/add', { playerId });

export const removeTeamPlayer = (playerId: number) =>
  API.post('/team/remove', { playerId });

export const getBudget = () => 
  API.get('/budget');

export const getLeaderboard = () => 
  API.get('/leaderboard');

// ========== Chatbot API ==========
export const sendChatbotMessage = (message: string) =>
  API.post('/chatbot', { message });
