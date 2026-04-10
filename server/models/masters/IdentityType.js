const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const IdentityType = sequelize.define('IdentityType', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  org_id: { type: DataTypes.INTEGER, allowNull: false },
  value: { type: DataTypes.STRING(100), allowNull: false },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
  tableName: 'identity_type_master',
  timestamps: false,
});

module.exports = IdentityType;
