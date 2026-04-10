const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Salutation = sequelize.define('Salutation', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  org_id: { type: DataTypes.INTEGER, allowNull: false },
  value: { type: DataTypes.STRING(20), allowNull: false },
  display_order: { type: DataTypes.INTEGER, defaultValue: 0 },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
  tableName: 'salutation_master',
  timestamps: false,
});

module.exports = Salutation;
