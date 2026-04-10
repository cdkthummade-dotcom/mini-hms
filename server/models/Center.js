const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Center = sequelize.define('Center', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  org_id: { type: DataTypes.INTEGER, allowNull: false },
  name: { type: DataTypes.STRING(200), allowNull: false },
  address: { type: DataTypes.TEXT, allowNull: true },
}, {
  tableName: 'centers',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = Center;
