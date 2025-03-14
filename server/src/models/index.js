const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
});

const User = require('./User')(sequelize);
const Player = require('./Player')(sequelize);
const Team = require('./Team')(sequelize);

// Define associations
// User.belongsToMany(Player, { through: Team, foreignKey: 'userId' });
// Player.belongsToMany(User, { through: Team, foreignKey: 'playerId' });

module.exports = {
  sequelize,
  User,
  Player,
  Team,
};
