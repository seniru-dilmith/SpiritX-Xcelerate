const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/general");
const { isAdmin } = require("../middleware/admin");
const { getPlayers, getPlayerStatsbyId, updatePlayer, deletePlayer, createPlayer, getTournamentSummary } = require("../controllers/admin");
const { getLeaderboardForAdmin } = require("../controllers/Leaderboard");

// Get all players (admin view)
router.get("/players", isAuthenticated, isAdmin, getPlayers);

// Get detailed player stats by ID
router.get("/player-stats/:id", isAuthenticated, isAdmin, getPlayerStatsbyId);

// Update player details
router.put("/player/:id", isAuthenticated, isAdmin, updatePlayer);

// Delete a player (only allowed for newly added players)
router.delete("/player/:id", isAuthenticated, isAdmin, deletePlayer);

// Create a new player
router.post("/player", isAuthenticated, isAdmin, createPlayer);

// Tournament summary endpoint
router.get("/tournament-summary", isAuthenticated, isAdmin, getTournamentSummary);

// Leaderboard endpoint
router.get("/leaderboard", isAuthenticated, isAdmin, getLeaderboardForAdmin);

module.exports = router;
