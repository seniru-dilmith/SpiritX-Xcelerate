const express = require('express');
const router = express.Router();
const { Player, User } = require('../models');

// Middleware to check admin rights
const isAdmin = (req, res, next) => {
  if (req.session.userId) {
    User.findByPk(req.session.userId).then(user => {
      if (user && user.isAdmin) {
        next();
      } else {
        res.status(403).json({ message: 'Access denied' });
      }
    });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
};

// Get all players (admin view)
router.get('/players', isAdmin, async (req, res) => {
  try {
    const players = await Player.findAll();
    res.json(players);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching players', error: err.message });
  }
});

// Get detailed player stats by ID
router.get('/player-stats/:id', isAdmin, async (req, res) => {
  try {
    const player = await Player.findByPk(req.params.id);
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }
    res.json(player);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching player stats', error: err.message });
  }
});

// Update player details
router.put('/player/:id', isAdmin, async (req, res) => {
  try {
    const player = await Player.findByPk(req.params.id);
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }
    await player.update(req.body);
    res.json({ message: 'Player updated', player });
  } catch (err) {
    res.status(500).json({ message: 'Error updating player', error: err.message });
  }
});

// Delete a player (only allowed for newly added players)
router.delete('/player/:id', isAdmin, async (req, res) => {
  try {
    const player = await Player.findByPk(req.params.id);
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }
    await player.destroy();
    res.json({ message: 'Player deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting player', error: err.message });
  }
});

// Create a new player
router.post('/player', isAdmin, async (req, res) => {
  try {
    const newPlayer = await Player.create(req.body);
    res.json({ message: 'Player created', player: newPlayer });
  } catch (err) {
    res.status(500).json({ message: 'Error creating player', error: err.message });
  }
});

// Tournament summary endpoint
router.get('/tournament-summary', isAdmin, async (req, res) => {
  try {
    const players = await Player.findAll();
    const overallRuns = players.reduce((acc, player) => acc + (player.runs || 0), 0);
    const overallWickets = players.reduce((acc, player) => acc + (player.wickets || 0), 0);
    const highestRunScorer = players.reduce((prev, current) => (prev.runs > current.runs ? prev : current), { runs: 0 });
    const highestWicketTaker = players.reduce((prev, current) => (prev.wickets > current.wickets ? prev : current), { wickets: 0 });
    res.json({
      overallRuns,
      overallWickets,
      highestRunScorer,
      highestWicketTaker
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tournament summary', error: err.message });
  }
});

module.exports = router;
