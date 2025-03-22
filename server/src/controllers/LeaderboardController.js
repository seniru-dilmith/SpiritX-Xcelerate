const { Player } = require('../models');

const getLeaderboardForUser = async (req, res) => {
  try {
    const sortBy = req.query.sortBy || "overall";
    const order = (req.query.order || "ASC").toUpperCase();
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    let orderClause;
    if (sortBy === "overall") {
      orderClause = [["points", order]];
    } else if (
      [
        "name",
        "total_runs",
        "balls_faced",
        "innings_played",
        "wickets",
        "overs_bowled",
        "runs_conceded",
        "value_in_rupees",
      ].includes(sortBy)
    ) {
      orderClause = [[sortBy, order]];
    } else {
      orderClause = [["points", order]];
    }

    const result = await Player.findAndCountAll({
      order: orderClause,
      limit,
      offset,
    });

    // Remove the points property for regular users
    const rows = result.rows.map(player => {
      const p = player.toJSON();
      delete p.points;
      return p;
    });

    res.json({ rows, count: result.count });
  } catch (err) {
    res.status(500).json({ 
      message: "Error fetching leaderboard", 
      error: err.message 
    });
  }
};

const getLeaderboardForAdmin = async (req, res) => {
  try {
    const sortBy = req.query.sortBy || "overall";
    const order = (req.query.order || "ASC").toUpperCase();
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    let orderClause;
    if (sortBy === "overall") {
      orderClause = [["points", order]];
    } else if (
      [
        "name",
        "total_runs",
        "balls_faced",
        "innings_played",
        "wickets",
        "overs_bowled",
        "runs_conceded",
        "points",
        "value_in_rupees",
      ].includes(sortBy)
    ) {
      orderClause = [[sortBy, order]];
    } else {
      orderClause = [["points", order]];
    }

    const result = await Player.findAndCountAll({
      order: orderClause,
      limit,
      offset,
    });

    // For admins, we include the points in the returned data.
    res.json({ rows: result.rows, count: result.count });
  } catch (err) {
    res.status(500).json({ 
      message: "Error fetching leaderboard", 
      error: err.message 
    });
  }
};

module.exports = { getLeaderboardForUser, getLeaderboardForAdmin };
