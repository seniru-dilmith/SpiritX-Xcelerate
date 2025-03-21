// routes/user.js
const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/general');
const { isUser } = require('../middleware/user'); 
const { getAllPlayers, addPlayerToTeam, removePlayerFromTeam, remainingBudget, getLeaderboard, getTeam } = require('../controllers/user');

// Get all players (for regular users)
router.get('/players', isAuthenticated, isUser, getAllPlayers);

// Add a player to the user's team
router.post('/team/add', isAuthenticated, isUser, addPlayerToTeam);

// Remove a player from the user's team
router.post('/team/remove', isAuthenticated, isUser, removePlayerFromTeam);

// Get the user's remaining budget
router.get('/budget', isAuthenticated, isUser, remainingBudget);

// Get the leaderboard
router.get('/leaderboard', isAuthenticated, isUser, getLeaderboard);

// Get the user's team
router.get('/team', isAuthenticated, isUser, getTeam);

module.exports = router;
