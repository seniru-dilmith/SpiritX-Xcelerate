const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Team = sequelize.define(
    "Team",
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "User", key: "id" },
      },
      playerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Player", key: "id" },
      },
    },
    {
      freezeTableName: true,
    }
  );

  return Team;
};
