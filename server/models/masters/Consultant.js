const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Consultant = sequelize.define('Consultant', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  org_id: { type: DataTypes.INTEGER, allowNull: false },
  center_id: { type: DataTypes.INTEGER, allowNull: true },
  name: { type: DataTypes.STRING(150), allowNull: false },
  specialisation: { type: DataTypes.STRING(100), allowNull: true },
  department: { type: DataTypes.STRING(100), allowNull: true },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
  tableName: 'consultant_master',
  timestamps: false,
});

module.exports = Consultant;
