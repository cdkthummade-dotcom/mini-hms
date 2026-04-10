const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Patient = sequelize.define('Patient', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  uid: { type: DataTypes.STRING(20), allowNull: false, unique: true },
  org_id: { type: DataTypes.INTEGER, allowNull: false },
  center_id: { type: DataTypes.INTEGER, allowNull: false },
  // Employee
  is_employee: { type: DataTypes.BOOLEAN, defaultValue: false },
  employee_id: { type: DataTypes.STRING(50), allowNull: true },
  photo_url: { type: DataTypes.STRING, allowNull: true },
  // Identity
  salutation_id: { type: DataTypes.INTEGER, allowNull: true },
  first_name: { type: DataTypes.STRING(50), allowNull: false },
  middle_name: { type: DataTypes.STRING(50), allowNull: true },
  last_name: { type: DataTypes.STRING(50), allowNull: false },
  // Demographics
  gender: { type: DataTypes.ENUM('Male', 'Female', 'Trans', 'Others'), allowNull: false },
  dob: { type: DataTypes.DATEONLY, allowNull: true },
  age_years: { type: DataTypes.SMALLINT, defaultValue: 0 },
  age_months: { type: DataTypes.SMALLINT, defaultValue: 0 },
  age_days: { type: DataTypes.SMALLINT, defaultValue: 0 },
  // Contact
  mobile: { type: DataTypes.STRING(15), allowNull: false },
  alternate_mobile: { type: DataTypes.STRING(15), allowNull: true },
  // Address
  pincode: { type: DataTypes.STRING(10), allowNull: false },
  area: { type: DataTypes.STRING(150), allowNull: true },
  city: { type: DataTypes.STRING(150), allowNull: false },
  district: { type: DataTypes.STRING(150), allowNull: false },
  state: { type: DataTypes.STRING(150), allowNull: false },
  current_address: { type: DataTypes.TEXT, allowNull: false },
  permanent_address: { type: DataTypes.TEXT, allowNull: false },
  same_address: { type: DataTypes.BOOLEAN, defaultValue: false },
  // Clinical
  patient_type_id: { type: DataTypes.INTEGER, allowNull: false },
  referred_by_id: { type: DataTypes.INTEGER, allowNull: false },
  consultant_id: { type: DataTypes.INTEGER, allowNull: true },
  // Personal
  blood_group: { type: DataTypes.ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'), allowNull: true },
  marital_status_id: { type: DataTypes.INTEGER, allowNull: true },
  // MLC
  is_mlc: { type: DataTypes.BOOLEAN, defaultValue: false },
  mlc_accompanied_by: { type: DataTypes.STRING(100), allowNull: true },
  mlc_accompanied_phone: { type: DataTypes.STRING(15), allowNull: true },
  mlc_police_batch_no: { type: DataTypes.STRING(150), allowNull: true },
  mlc_incident_spot: { type: DataTypes.STRING(150), allowNull: true },
  mlc_remarks: { type: DataTypes.STRING(150), allowNull: true },
  mlc_document_url: { type: DataTypes.STRING, allowNull: true },
  // System
  created_by: { type: DataTypes.INTEGER, allowNull: false },
  is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
  deleted_by: { type: DataTypes.INTEGER, allowNull: true },
  deleted_at: { type: DataTypes.DATE, allowNull: true },
}, {
  tableName: 'patients',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Patient;
