const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const ReferredBy = sequelize.define('ReferredBy', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  org_id: { type: DataTypes.INTEGER, allowNull: false },
  name: { type: DataTypes.STRING(150), allowNull: false },
  type: { type: DataTypes.ENUM('doctor', 'clinic', 'camp'), allowNull: false, defaultValue: 'doctor' },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
  tableName: 'referred_by_master',
  timestamps: false,
});

module.exports = ReferredBy;
