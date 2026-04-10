const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UidSequence = sequelize.define('UidSequence', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  org_id: { type: DataTypes.INTEGER, allowNull: false },
  year: { type: DataTypes.SMALLINT, allowNull: false },
  last_serial: { type: DataTypes.INTEGER, defaultValue: 0 },
}, {
  tableName: 'uid_sequences',
  timestamps: false,
  indexes: [{ unique: true, fields: ['org_id', 'year'] }],
});

module.exports = UidSequence;
