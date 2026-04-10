const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Organization = sequelize.define('Organization', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(200), allowNull: false },
  code: { type: DataTypes.STRING(2), allowNull: false, defaultValue: 'DH', validate: { is: /^[A-Z]{2}$/ } },
  logo_url: { type: DataTypes.STRING, allowNull: true },
  timezone: { type: DataTypes.STRING(100), defaultValue: 'Asia/Kolkata' },
}, {
  tableName: 'organizations',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = Organization;
