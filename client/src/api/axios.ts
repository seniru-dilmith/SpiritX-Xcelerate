import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Auth APIs
export const signup = (data: { username: string; password: string; confirmPassword: string; }) =>
  API.post('/auth/signup', data);

export const login = (data: { username: string; password: string; }) =>
  API.post('/auth/login', data);

// New API call to retrieve the current logged-in user
export const fetchUser = () => API.get('/auth/me');

// Refresh tokens 
export const refreshTokens = () => API.post('/auth/refresh');

// Other APIs
export const fetchPlayers = () => API.get('/players');
export const addTeamPlayer = (playerId: number) => API.post('/team/add', { playerId });
export const removeTeamPlayer = (playerId: number) => API.post('/team/remove', { playerId });
export const getBudget = () => API.get('/budget');
export const getLeaderboard = () => API.get('/leaderboard');
export const sendChatbotMessage = (message: string) => API.post('/chatbot', { message });
