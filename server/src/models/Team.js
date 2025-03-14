const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Team = sequelize.define('Team', {
    // This join table links users and players. Additional attributes can be added if needed.
  }
  ,{
    tableName: 'Team',
    freezeTableName: true,
  });

  return Team;
};
