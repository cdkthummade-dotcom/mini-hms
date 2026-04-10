const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const PatientType = sequelize.define('PatientType', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  org_id: { type: DataTypes.INTEGER, allowNull: false },
  value: { type: DataTypes.STRING(50), allowNull: false },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
  tableName: 'patient_type_master',
  timestamps: false,
});

module.exports = PatientType;
