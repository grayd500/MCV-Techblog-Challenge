// models/index.js
const Sequelize = require('sequelize');
const sequelize = require('../config/config');

const User = require('./user');
const Post = require('./post');
const Comment = require('./comment');

// Define associations here
User.hasMany(Post, { foreignKey: 'userId' });
Post.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Comment, { foreignKey: 'userId' });
Comment.belongsTo(User, { foreignKey: 'userId' });

Post.hasMany(Comment, { foreignKey: 'postId' });
Comment.belongsTo(Post, { foreignKey: 'postId' });

module.exports = {
  sequelize,
  Sequelize,
  User,
  Post,
  Comment
};
