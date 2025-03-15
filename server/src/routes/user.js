const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/general');
const { getAllPlayers, addPlayerToTeam, removePlayerFromTeam, remainingBudget, getLeaderboard } = require('../controllers/user');

// Get all players (for users)
router.get('/players', isAuthenticated, getAllPlayers);

// Add a player to the user's team
router.post('/team/add', isAuthenticated, addPlayerToTeam);

// Remove a player from the user's team
router.post('/team/remove', isAuthenticated, removePlayerFromTeam);

// Get the user's remaining budget
router.get('/budget', isAuthenticated, remainingBudget);

// Get the leaderboard
router.get('/leaderboard', isAuthenticated, getLeaderboard);

module.exports = router;
