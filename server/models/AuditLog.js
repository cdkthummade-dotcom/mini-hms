const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AuditLog = sequelize.define('AuditLog', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  org_id: { type: DataTypes.INTEGER, allowNull: false },
  table_name: { type: DataTypes.STRING(100), allowNull: false },
  record_id: { type: DataTypes.INTEGER, allowNull: false },
  action: { type: DataTypes.ENUM('CREATE', 'UPDATE', 'DELETE', 'RESTORE'), allowNull: false },
  performed_by: { type: DataTypes.INTEGER, allowNull: false },
  performed_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  old_values: { type: DataTypes.JSONB, allowNull: true },
  new_values: { type: DataTypes.JSONB, allowNull: true },
  ip_address: { type: DataTypes.STRING(45), allowNull: true },
  user_agent: { type: DataTypes.TEXT, allowNull: true },
  device_info: { type: DataTypes.STRING(255), allowNull: true },
}, {
  tableName: 'audit_log',
  timestamps: false,
});

module.exports = AuditLog;
