const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  org_id: { type: DataTypes.INTEGER, allowNull: false },
  center_id: { type: DataTypes.INTEGER, allowNull: true },
  username: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  password_hash: { type: DataTypes.STRING(255), allowNull: false },
  full_name: { type: DataTypes.STRING(200), allowNull: false },
  role: { type: DataTypes.ENUM('receptionist', 'admin', 'superadmin'), allowNull: false },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  failed_attempts: { type: DataTypes.INTEGER, defaultValue: 0 },
  locked_until: { type: DataTypes.DATE, allowNull: true },
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = User;
