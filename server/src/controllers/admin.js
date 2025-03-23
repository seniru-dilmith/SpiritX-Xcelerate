const { Op } = require("sequelize");
const { Player } = require("../models");
const socketIO = require("../socket");

// Helper function for emitting socket events safely
const emitSocketEvent = (event, data) => {
  try {
    socketIO.getIO().emit(event, data);
  } catch (error) {
    console.log("Socket emission error:", error);
    // Socket errors shouldn't affect the API response
  }
};

const getPlayers = async (req, res) => {
  try {
    const searchTerm = req.query.searchTerm || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const sortBy = req.query.sortBy || "name";
    const order = req.query.order || "ASC";

    let whereClause = {};
    if (searchTerm) {
      whereClause = {
        name: { [Op.like]: `%${searchTerm}%` },
      };
    }

    const result = await Player.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [[sortBy, order]],
    });

    const players = result.rows.map((player) => {
      const p = player.toJSON();
      if (typeof p.points === "number") {
        p.points = p.points.toFixed(2);
      }
      return p;
    });

    res.json({ rows: players, count: result.count });
  } catch (err) {
    console.log("Error in getPlayers:", err);
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
    console.log("Error in getPlayerStatsbyId:", err);
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
    
    const updatedPlayer = await player.update(req.body);

    // Emit socket event
    emitSocketEvent("playersUpdated");

    res.json({ message: "Player updated", player: updatedPlayer });
  } catch (err) {
    console.log("Error in updatePlayer:", err);
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

    // Emit socket event
    emitSocketEvent("playersUpdated");

    res.json({ message: "Player deleted", id: req.params.id });
  } catch (err) {
    console.log("Error in deletePlayer:", err);
    res
      .status(500)
      .json({ message: "Error deleting player", error: err.message });
  }
};

const createPlayer = async (req, res) => {
  try {
    const allowedCategories = ["Batsman", "Bowler", "All-Rounder"];
    const { category } = req.body;

    if (!allowedCategories.includes(category)) {
      return res.status(400).json({
        message:
          "Invalid category. Allowed categories are: Batsman, Bowler, All-Rounder.",
      });
    }

    const newPlayer = await Player.create(req.body);

    // Emit socket event
    emitSocketEvent("playersUpdated");

    res.json({ message: "Player created", player: newPlayer });
  } catch (err) {
    console.log("Error in createPlayer:", err);
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
    console.log("Error in getTournamentSummary:", err);
    res.status(500).json({
      message: "Error fetching tournament summary",
      error: err.message,
    });
  }
};

module.exports = {
  getPlayers,
  getPlayerStatsbyId,
  updatePlayer,
  deletePlayer,
  createPlayer,
  getTournamentSummary,
};
