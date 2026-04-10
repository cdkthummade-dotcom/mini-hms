const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PatientRelation = sequelize.define('PatientRelation', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  patient_id: { type: DataTypes.INTEGER, allowNull: false },
  relation_type_id: { type: DataTypes.INTEGER, allowNull: false },
  name: { type: DataTypes.STRING(150), allowNull: false },
  phone: { type: DataTypes.STRING(15), allowNull: true },
  address: { type: DataTypes.TEXT, allowNull: true },
}, {
  tableName: 'patient_relations',
  timestamps: false,
});

module.exports = PatientRelation;
