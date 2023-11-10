// models/post.js

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/config');

class Post extends Model {}

Post.init({
  // Define attributes
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'user', // Make sure this is the table name of the User model in your database
      key: 'id',
    },
    field: 'user_id' // This specifies the actual column name in the database
  },
}, {
  sequelize,
  freezeTableName: true,
  underscored: true,
  modelName: 'post',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});
Post.associate = (models) => {
  Post.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'user'
  });
  Post.hasMany(models.Comment, {
    foreignKey: 'postId',
    as: 'comments'
  });
};

module.exports = Post;
