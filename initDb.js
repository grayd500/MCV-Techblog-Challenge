// initDb.js
const sequelize = require("./config/config");
const User = require("./models/user");

sequelize
  .sync({ force: true })
  .then(() => {
    console.log("Database & tables created!");
  })
  .catch((error) => {
    console.error("Unable to create database:", error);
  });
