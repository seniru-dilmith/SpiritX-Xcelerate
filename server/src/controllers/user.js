const { Player, User, Team, Transaction } = require("../models");

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
    const player = await Player.findByPk(playerId);
    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.budget < player.value_in_rupees) {
      return res
        .status(400)
        .json({ message: "Insufficient budget to buy this player" });
    }
    user.budget -= player.value_in_rupees;
    await user.save();
    const teamEntry = await Team.create({ userId: req.user.id, playerId });
    // Create a transaction record for the purchase
    await Transaction.create({
      userId: req.user.id,
      playerId,
      type: "purchase",
      amount: player.value_in_rupees,
    });
    res.json({
      message: "Player added to team successfully",
      teamEntry,
      budget: user.budget,
    });
  } catch (err) {
    console.error("Error in addPlayerToTeam:", err);
    res
      .status(500)
      .json({ message: "Error adding player to team", error: err.message });
  }
};

const removePlayerFromTeam = async (req, res) => {
  const { playerId } = req.body;
  try {
    const teamEntry = await Team.findOne({ where: { userId: req.user.id, playerId } });
    if (!teamEntry) {
      return res.status(400).json({ message: "Player not in team" });
    }
    const player = await Player.findByPk(playerId);
    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.budget += player.value_in_rupees;
    await user.save();
    await teamEntry.destroy();
    // Create a transaction record for the sale
    await Transaction.create({
      userId: req.user.id,
      playerId,
      type: 'sale',
      amount: player.value_in_rupees,
    });
    res.json({ message: "Player removed from team successfully", budget: user.budget });
  } catch (err) {
    console.error("Error in removePlayerFromTeam:", err);
    res.status(500).json({ message: "Error removing player from team", error: err.message });
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

const getTeam = async (req, res) => {
  try {
    const team = await Team.findAll({
      where: { userId: req.user.id },
      include: [{ model: Player }],
    });

    res.json(team);
  } catch (err) {
    console.error("Error fetching team:", err);
    res
      .status(500)
      .json({ message: "Error fetching team", error: err.message });
  }
};

module.exports = {
  getAllPlayers,
  addPlayerToTeam,
  removePlayerFromTeam,
  remainingBudget,
  getTeam,
};
