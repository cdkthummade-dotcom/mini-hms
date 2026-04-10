const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Employee = sequelize.define('Employee', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  org_id: { type: DataTypes.INTEGER, allowNull: false },
  employee_id: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  first_name: { type: DataTypes.STRING(100), allowNull: false },
  middle_name: { type: DataTypes.STRING(100), allowNull: true },
  last_name: { type: DataTypes.STRING(100), allowNull: false },
  salutation: { type: DataTypes.STRING(20), allowNull: true },
  gender: { type: DataTypes.ENUM('Male', 'Female', 'Trans', 'Others'), allowNull: true },
  dob: { type: DataTypes.DATEONLY, allowNull: true },
  mobile: { type: DataTypes.STRING(15), allowNull: true },
  email: { type: DataTypes.STRING(200), allowNull: true },
  designation: { type: DataTypes.STRING(150), allowNull: true },
  band: { type: DataTypes.STRING(50), allowNull: true },
  location_dept: { type: DataTypes.STRING(150), allowNull: true },
  pincode: { type: DataTypes.STRING(10), allowNull: true },
  area: { type: DataTypes.STRING(150), allowNull: true },
  city: { type: DataTypes.STRING(150), allowNull: true },
  district: { type: DataTypes.STRING(150), allowNull: true },
  state: { type: DataTypes.STRING(150), allowNull: true },
  current_address: { type: DataTypes.TEXT, allowNull: true },
  permanent_address: { type: DataTypes.TEXT, allowNull: true },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
  tableName: 'employees',
  timestamps: false,
});

module.exports = Employee;
