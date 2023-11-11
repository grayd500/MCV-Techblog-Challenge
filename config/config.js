// config/config.js
require('dotenv').config();

const Sequelize = require('sequelize');
let sequelize;

// Check for JAWSDB_URL to use on Heroku
if (process.env.JAWSDB_URL) {
  sequelize = new Sequelize(process.env.JAWSDB_URL, {
    dialect: 'mysql',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // This line is necessary for Heroku deployment
      }
    }
  });
} else {
  // Fallback to local .env variables if JAWSDB_URL isn't set
  sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: 'localhost',
    dialect: 'mysql',
    // ... rest of your local config
  });
}

module.exports = sequelize;

