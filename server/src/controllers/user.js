const { Player, User, Team } = require("../models");

const getAllPlayers = async (req, res) => {
  try {
    const players = await Player.findAll();
    
    res.json(players);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching players", error: err.message });
  }
};

const addPlayerToTeam = async (req, res) => {
  const { playerId } = req.body;
  try {
    const existing = await Team.findOne({
      where: { userId: req.user.id, playerId },
    });
    if (existing) {
      return res.status(400).json({ message: "Player already in team" });
    }
    const teamCount = await Team.count({ where: { userId: req.user.id } });
    if (teamCount >= 11) {
      return res.status(400).json({ message: "Team is already complete" });
    }
    await Team.create({ userId: req.user.id, playerId });
    return res.json({ message: "Player added to team successfully..."});
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error adding player to team", error: err.message });
  }
};

const removePlayerFromTeam = async (req, res) => {
  const { playerId } = req.body;
  try {
    const teamEntry = await Team.findOne({
      where: { userId: req.user.id, playerId },
    });
    if (!teamEntry) {
      return res.status(400).json({ message: "Player not in team" });
    }
    await teamEntry.destroy();
    res.json({ message: "Player removed from team" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error removing player from team", error: err.message });
  }
};

const remainingBudget = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    res.json({ budget: user.budget });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching budget", error: err.message });
  }
};

const getLeaderboard = async (req, res) => {
  try {
    const users = await User.findAll({ order: [["points", "DESC"]] });
    res.json(users);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching leaderboard", error: err.message });
  }
};

const getTeam = async (req, res) => {
  try {
    const team = await Team.findAll({
      where: { userId: req.user.id },
      include: [{ model: Player }]
    });
    
    res.json(team);
  } catch (err) {
    console.error("Error fetching team:", err);
    res.status(500).json({ message: 'Error fetching team', error: err.message });
  }
};

module.exports = {
  getAllPlayers,
  addPlayerToTeam,
  removePlayerFromTeam,
  remainingBudget,
  getLeaderboard,
  getTeam,
};
