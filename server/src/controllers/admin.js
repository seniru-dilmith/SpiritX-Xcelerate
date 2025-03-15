const { Player, User } = require('../models');

const getPlayers = async (req, res) => {
  try {
    const players = await Player.findAll();
    res.json(players);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching players", error: err.message });
  }
};

const getPlayerStatsbyId = async (req, res) => {
  try {
    const player = await Player.findByPk(req.params.id);
    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }
    res.json(player);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching player stats", error: err.message });
  }
};

const updatePlayer = async (req, res) => {
  try {
    const player = await Player.findByPk(req.params.id);
    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }
    await player.update(req.body);
    res.json({ message: "Player updated", player });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating player", error: err.message });
  }
};

const deletePlayer = async (req, res) => {
  try {
    const player = await Player.findByPk(req.params.id);
    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }
    await player.destroy();
    res.json({ message: "Player deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting player", error: err.message });
  }
};

const createPlayer = async (req, res) => {
  try {
    const newPlayer = await Player.create(req.body);
    res.json({ message: "Player created", player: newPlayer });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating player", error: err.message });
  }
};

const getTournamentSummary = async (req, res) => {
  try {
    const players = await Player.findAll();
    const overallRuns = players.reduce(
      (acc, player) => acc + (player.runs || 0),
      0
    );
    const overallWickets = players.reduce(
      (acc, player) => acc + (player.wickets || 0),
      0
    );
    const highestRunScorer = players.reduce(
      (prev, current) => (prev.runs > current.runs ? prev : current),
      { runs: 0 }
    );
    const highestWicketTaker = players.reduce(
      (prev, current) => (prev.wickets > current.wickets ? prev : current),
      { wickets: 0 }
    );
    res.json({
      overallRuns,
      overallWickets,
      highestRunScorer,
      highestWicketTaker,
    });
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Error fetching tournament summary",
        error: err.message,
      });
  }
};

module.exports = { getPlayers, getPlayerStatsbyId, updatePlayer, deletePlayer, createPlayer, getTournamentSummary };
