// routes/user.js
const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/general');
const { isUser } = require('../middleware/user'); 
const { getAllPlayers, addPlayerToTeam, removePlayerFromTeam, remainingBudget, getTeam } = require('../controllers/user');
const { getLeaderboardForUser } = require('../controllers/LeaderboardController');
const { getTransactions } = require('../controllers/transaction');

// Get all players (for regular users)
router.get('/players', isAuthenticated, isUser, getAllPlayers);

// Add a player to the user's team
router.post('/team/add', isAuthenticated, isUser, addPlayerToTeam);

// Remove a player from the user's team
router.post('/team/remove', isAuthenticated, isUser, removePlayerFromTeam);

// Get the user's remaining budget
router.get('/budget', isAuthenticated, isUser, remainingBudget);

// Get the leaderboard
router.get('/leaderboard', isAuthenticated, isUser, getLeaderboardForUser);

// Get the user's team
router.get('/team', isAuthenticated, isUser, getTeam);

// Get the transactions for the user
router.get('/transactions', isAuthenticated, isUser, getTransactions);

module.exports = router;
