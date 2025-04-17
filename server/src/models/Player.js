const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Player = sequelize.define(
    "Player",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      university: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      category: {
        type: DataTypes.STRING,
      },
      total_runs: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      balls_faced: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      innings_played: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      wickets: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      overs_bowled: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      runs_conceded: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      points: {
        type: DataTypes.DOUBLE,
        defaultValue: 0,
      },
      value_in_rupees: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      tableName: "Player",
      freezeTableName: true,
    }
  );

  // Hook to calculate points before saving
  Player.beforeCreate((player) => {
    player.points = calculatePlayerPoints(player);
  });

  Player.beforeUpdate((player) => {
    player.points = calculatePlayerPoints(player);
  });
  Player.beforeSave((player) => {
    player.setDataValue("points", calculatePlayerPoints(player));
    player.setDataValue("value_in_rupees", calculatePlayerValue(player.points));
  });

  function calculatePlayerPoints(player) {
    // Batting Strike Rate
    let batting_strike_rate =
      player.balls_faced > 0
        ? (player.total_runs / player.balls_faced) * 100
        : 0;

    // Batting Average
    let batting_average =
      player.innings_played > 0 ? player.total_runs / player.innings_played : 0;

    // Bowling Strike Rate
    let bowling_strike_rate =
      player.wickets > 0 ? (player.overs_bowled * 6) / player.wickets : 0;

    // Economy Rate
    let economy_rate =
      player.overs_bowled > 0
        ? (player.runs_conceded / (player.overs_bowled * 6)) * 6
        : 0;

    // Player Points Calculation
    let points = batting_strike_rate / 5 + batting_average * 0.8;
    if (bowling_strike_rate > 0 && economy_rate > 0) {
      points += 500 / bowling_strike_rate + 140 / economy_rate;
    }

    return points;
  }

  function calculatePlayerValue(points) {
    let value = (9 * points + 100) * 1000;

    // Round value to the nearest multiple of 50,000
    return Math.round(value / 50000) * 50000;
  }

  return Player;
};
