// models/user.js:
const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('user', {
  // Define attributes
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = User;