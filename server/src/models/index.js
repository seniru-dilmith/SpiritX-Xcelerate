const { Sequelize } = require("sequelize");
const mysql = require("mysql2/promise");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
  }
);

const createDatabase = async () => {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    let needToPopulate = true;

    // Check if database exists
    const [rows] = await conn.query(
      `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?`,
      [process.env.DB_NAME]
    );

    if (rows.length > 0) {
      console.log(`ℹ️  Database "${process.env.DB_NAME}" already exists.`);
      needToPopulate = false; // Database exists
    } else {
      // If database doesn't exist, create it
      await conn.query(
        `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``
      );
      console.log(`✅ Database "${process.env.DB_NAME}" has been created.`);
    }
    await conn.end();

    return needToPopulate; // Database was created successfully
  } catch (err) {
    console.error("❌ Database creation error:", err);
    return false; // Something went wrong
  }
};

const User = require("./User")(sequelize);
const Player = require("./Player")(sequelize);
const Team = require("./Team")(sequelize);

// associations
User.belongsToMany(Player, { through: Team, foreignKey: "userId" });
Player.belongsToMany(User, { through: Team, foreignKey: "playerId" });

// Explicit associations for eager loading:
Team.belongsTo(Player, { foreignKey: "playerId" });
Team.belongsTo(User, { foreignKey: "userId" });

module.exports = { sequelize, User, Player, Team, createDatabase };
