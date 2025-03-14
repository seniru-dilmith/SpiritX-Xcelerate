const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { User, Player, Team } = require('./models');

function readCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (err) => reject(err));
  });
}

async function populateData() {
  const dataDir = path.join(__dirname, '..', 'data');
  
  if (!fs.existsSync(dataDir)) {
    console.log('Data directory not found. Skipping data population.');
    return;
  }
  
  // Populate Users if users.csv exists
  const usersCsv = path.join(dataDir, 'users.csv');
  if (fs.existsSync(usersCsv)) {
    try {
      const users = await readCSV(usersCsv);
      // Bulk create users with individualHooks to hash passwords
      await User.bulkCreate(users, { individualHooks: true });
      console.log('Users data populated.');
    } catch (err) {
      console.error('Error populating users:', err);
    }
  } else {
    console.log('users.csv not found, skipping users population.');
  }
  
  // Populate Players if players.csv exists
  const playersCsv = path.join(dataDir, 'players.csv');
  if (fs.existsSync(playersCsv)) {
    try {
      const players = await readCSV(playersCsv);
      await Player.bulkCreate(players, { individualHooks: true });
      console.log('Players data populated.');
    } catch (err) {
      console.error('Error populating players:', err);
    }
  } else {
    console.log('players.csv not found, skipping players population.');
  }
  
  // Populate Teams if teams.csv exists
  const teamsCsv = path.join(dataDir, 'teams.csv');
  if (fs.existsSync(teamsCsv)) {
    try {
      const teams = await readCSV(teamsCsv);
      await Team.bulkCreate(teams, { individualHooks: true });
      console.log('Teams data populated.');
    } catch (err) {
      console.error('Error populating teams:', err);
    }
  } else {
    console.log('teams.csv not found, skipping teams population.');
  }
}

module.exports = populateData;
