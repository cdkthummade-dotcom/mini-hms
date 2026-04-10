const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PatientIdentity = sequelize.define('PatientIdentity', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  patient_id: { type: DataTypes.INTEGER, allowNull: false },
  identity_type_id: { type: DataTypes.INTEGER, allowNull: false },
  identity_number: { type: DataTypes.STRING(150), allowNull: false },
}, {
  tableName: 'patient_identities',
  timestamps: false,
});

module.exports = PatientIdentity;
