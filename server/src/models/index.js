const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const mysql = require('mysql2/promise');
dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
});

const createDatabse = async() => {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    await conn.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    console.log('Database created!');

    await conn.end();

  } catch (err) {
    console.log("database creation error:", err);
  }
}

const User = require('./User')(sequelize);
const Player = require('./Player')(sequelize);
const Team = require('./Team')(sequelize);

// associations
User.belongsToMany(Player, { through: Team, foreignKey: 'userId' });
Player.belongsToMany(User, { through: Team, foreignKey: 'playerId' });

module.exports = {
  sequelize,
  User,
  Player,
  Team,
  createDatabse,
};
