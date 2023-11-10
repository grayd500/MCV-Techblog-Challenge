// models/comment.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/config');

class Comment extends Model {}

Comment.init({
  // Define attributes
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // Foreign keys for the User and Post this comment belongs to
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  postId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'comment',
});

module.exports = Comment;
