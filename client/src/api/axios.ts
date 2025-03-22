import axios from "axios";

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
export const signup = (data: sighupData) => API.post("/auth/signup", data);

export const login = (data: loginData) => API.post("/auth/login", data);

// Get current logged-in user from HttpOnly cookies
export const fetchUser = async () => API.get("/auth/me");

// Refresh tokens endpoint
export const refreshToken = () => API.post("/auth/refresh");

// Logout endpoint
export const logout = () => API.post("/auth/logout");

// ========== Admin APIs ==========
export const fetchAdminPlayers = () => API.get("/admin/players");

export const fetchPlayerStats = (id: number) =>
  API.get(`/admin/player-stats/${id}`);

export const updatePlayer = (id: number, data: any) =>
  API.put(`/admin/player/${id}`, data);

export const deletePlayer = (id: number) => API.delete(`/admin/player/${id}`);

export const createPlayer = (data: any) => API.post("/admin/player", data);

export const fetchTournamentSummary = () =>
  API.get("/admin/tournament-summary");

// ========== User APIs ==========
export const fetchPlayers = () => API.get("/players");

export const addTeamPlayer = (playerId: number) =>
  API.post("/team/add", { playerId });

export const removeTeamPlayer = (playerId: number) =>
  API.post("/team/remove", { playerId });

export const getBudget = () => API.get("/budget");

export const getLeaderboard = (
  sortBy: string,
  order: string,
  page: number,
  limit: number
) =>
  API.get(
    `/leaderboard?sortBy=${sortBy}&order=${order}&page=${page}&limit=${limit}`
  );

export const fetchTeam = () => API.get("/team");

export const getTransactions = () => API.get('/transactions');

// ========== Chatbot API ==========
export const sendChatbotMessage = (message: string) =>
  API.post("/chatbot", { message });

// Response interceptor to auto-refresh token on 401 errors
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // Check for a 401 error and ensure we haven't already retried
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        // Attempt to refresh tokens
        await refreshToken();
        // Reattempt the original request
        return API(originalRequest);
      } catch (refreshError) {
        // If refresh fails, optionally redirect to login or handle logout logic
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
