require('dotenv').config();
const { QueryInterface, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

async function runMigrations() {
  const qi = sequelize.getQueryInterface();

  console.log('Enabling pgcrypto extension...');
  await sequelize.query("CREATE EXTENSION IF NOT EXISTS pgcrypto;");

  console.log('Creating organizations table...');
  await qi.createTable('organizations', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(200), allowNull: false },
    code: { type: DataTypes.STRING(2), allowNull: false, defaultValue: 'DH' },
    logo_url: { type: DataTypes.STRING, allowNull: true },
    timezone: { type: DataTypes.STRING(100), defaultValue: 'Asia/Kolkata' },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  }, { ifNotExists: true });

  console.log('Creating centers table...');
  await qi.createTable('centers', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    org_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'organizations', key: 'id' } },
    name: { type: DataTypes.STRING(200), allowNull: false },
    address: { type: DataTypes.TEXT, allowNull: true },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  }, { ifNotExists: true });

  console.log('Creating users table...');
  await qi.createTable('users', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    org_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'organizations', key: 'id' } },
    center_id: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'centers', key: 'id' } },
    username: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    password_hash: { type: DataTypes.STRING(255), allowNull: false },
    full_name: { type: DataTypes.STRING(200), allowNull: false },
    role: { type: DataTypes.ENUM('receptionist', 'admin', 'superadmin'), allowNull: false },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
    failed_attempts: { type: DataTypes.INTEGER, defaultValue: 0 },
    locked_until: { type: DataTypes.DATE, allowNull: true },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  }, { ifNotExists: true });

  console.log('Creating salutation_master table...');
  await qi.createTable('salutation_master', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    org_id: { type: DataTypes.INTEGER, allowNull: false },
    value: { type: DataTypes.STRING(20), allowNull: false },
    display_order: { type: DataTypes.INTEGER, defaultValue: 0 },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  }, { ifNotExists: true });

  console.log('Creating patient_type_master table...');
  await qi.createTable('patient_type_master', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    org_id: { type: DataTypes.INTEGER, allowNull: false },
    value: { type: DataTypes.STRING(50), allowNull: false },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  }, { ifNotExists: true });

  console.log('Creating referred_by_master table...');
  await qi.createTable('referred_by_master', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    org_id: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING(150), allowNull: false },
    type: { type: DataTypes.ENUM('doctor', 'clinic', 'camp'), allowNull: false, defaultValue: 'doctor' },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  }, { ifNotExists: true });

  console.log('Creating consultant_master table...');
  await qi.createTable('consultant_master', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    org_id: { type: DataTypes.INTEGER, allowNull: false },
    center_id: { type: DataTypes.INTEGER, allowNull: true },
    name: { type: DataTypes.STRING(150), allowNull: false },
    specialisation: { type: DataTypes.STRING(100), allowNull: true },
    department: { type: DataTypes.STRING(100), allowNull: true },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  }, { ifNotExists: true });

  console.log('Creating identity_type_master table...');
  await qi.createTable('identity_type_master', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    org_id: { type: DataTypes.INTEGER, allowNull: false },
    value: { type: DataTypes.STRING(100), allowNull: false },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  }, { ifNotExists: true });

  console.log('Creating relation_type_master table...');
  await qi.createTable('relation_type_master', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    org_id: { type: DataTypes.INTEGER, allowNull: false },
    value: { type: DataTypes.STRING(100), allowNull: false },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  }, { ifNotExists: true });

  console.log('Creating marital_status_master table...');
  await qi.createTable('marital_status_master', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    org_id: { type: DataTypes.INTEGER, allowNull: false },
    value: { type: DataTypes.STRING(50), allowNull: false },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  }, { ifNotExists: true });

  console.log('Creating employees table...');
  await qi.createTable('employees', {
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
  }, { ifNotExists: true });

  console.log('Creating patients table...');
  await qi.createTable('patients', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    uid: { type: DataTypes.STRING(20), allowNull: false, unique: true },
    org_id: { type: DataTypes.INTEGER, allowNull: false },
    center_id: { type: DataTypes.INTEGER, allowNull: false },
    is_employee: { type: DataTypes.BOOLEAN, defaultValue: false },
    employee_id: { type: DataTypes.STRING(50), allowNull: true },
    photo_url: { type: DataTypes.STRING, allowNull: true },
    salutation_id: { type: DataTypes.INTEGER, allowNull: true },
    first_name: { type: DataTypes.STRING(50), allowNull: false },
    middle_name: { type: DataTypes.STRING(50), allowNull: true },
    last_name: { type: DataTypes.STRING(50), allowNull: false },
    gender: { type: DataTypes.ENUM('Male', 'Female', 'Trans', 'Others'), allowNull: false },
    dob: { type: DataTypes.DATEONLY, allowNull: true },
    age_years: { type: DataTypes.SMALLINT, defaultValue: 0 },
    age_months: { type: DataTypes.SMALLINT, defaultValue: 0 },
    age_days: { type: DataTypes.SMALLINT, defaultValue: 0 },
    mobile: { type: DataTypes.STRING(15), allowNull: false },
    alternate_mobile: { type: DataTypes.STRING(15), allowNull: true },
    pincode: { type: DataTypes.STRING(10), allowNull: false },
    area: { type: DataTypes.STRING(150), allowNull: true },
    city: { type: DataTypes.STRING(150), allowNull: false },
    district: { type: DataTypes.STRING(150), allowNull: false },
    state: { type: DataTypes.STRING(150), allowNull: false },
    current_address: { type: DataTypes.TEXT, allowNull: false },
    permanent_address: { type: DataTypes.TEXT, allowNull: false },
    same_address: { type: DataTypes.BOOLEAN, defaultValue: false },
    patient_type_id: { type: DataTypes.INTEGER, allowNull: false },
    referred_by_id: { type: DataTypes.INTEGER, allowNull: false },
    consultant_id: { type: DataTypes.INTEGER, allowNull: true },
    blood_group: { type: DataTypes.STRING(5), allowNull: true },
    marital_status_id: { type: DataTypes.INTEGER, allowNull: true },
    is_mlc: { type: DataTypes.BOOLEAN, defaultValue: false },
    mlc_accompanied_by: { type: DataTypes.STRING(100), allowNull: true },
    mlc_accompanied_phone: { type: DataTypes.STRING(15), allowNull: true },
    mlc_police_batch_no: { type: DataTypes.STRING(150), allowNull: true },
    mlc_incident_spot: { type: DataTypes.STRING(150), allowNull: true },
    mlc_remarks: { type: DataTypes.STRING(150), allowNull: true },
    mlc_document_url: { type: DataTypes.STRING, allowNull: true },
    created_by: { type: DataTypes.INTEGER, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    deleted_by: { type: DataTypes.INTEGER, allowNull: true },
    deleted_at: { type: DataTypes.DATE, allowNull: true },
  }, { ifNotExists: true });

  console.log('Creating patient_identities table...');
  await qi.createTable('patient_identities', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    patient_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'patients', key: 'id' } },
    identity_type_id: { type: DataTypes.INTEGER, allowNull: false },
    identity_number: { type: DataTypes.STRING(150), allowNull: false },
  }, { ifNotExists: true });

  console.log('Creating patient_relations table...');
  await qi.createTable('patient_relations', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    patient_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'patients', key: 'id' } },
    relation_type_id: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING(150), allowNull: false },
    phone: { type: DataTypes.STRING(15), allowNull: true },
    address: { type: DataTypes.TEXT, allowNull: true },
  }, { ifNotExists: true });

  console.log('Creating uid_sequences table...');
  await qi.createTable('uid_sequences', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    org_id: { type: DataTypes.INTEGER, allowNull: false },
    year: { type: DataTypes.SMALLINT, allowNull: false },
    last_serial: { type: DataTypes.INTEGER, defaultValue: 0 },
  }, { ifNotExists: true });
  await sequelize.query("CREATE UNIQUE INDEX IF NOT EXISTS uid_seq_org_year ON uid_sequences(org_id, year);");

  console.log('Creating audit_log table...');
  await qi.createTable('audit_log', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    org_id: { type: DataTypes.INTEGER, allowNull: false },
    table_name: { type: DataTypes.STRING(100), allowNull: false },
    record_id: { type: DataTypes.INTEGER, allowNull: false },
    action: { type: DataTypes.ENUM('CREATE', 'UPDATE', 'DELETE', 'RESTORE'), allowNull: false },
    performed_by: { type: DataTypes.INTEGER, allowNull: false },
    performed_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    old_values: { type: DataTypes.JSONB, allowNull: true },
    new_values: { type: DataTypes.JSONB, allowNull: true },
    ip_address: { type: DataTypes.STRING(45), allowNull: true },
    user_agent: { type: DataTypes.TEXT, allowNull: true },
    device_info: { type: DataTypes.STRING(255), allowNull: true },
  }, { ifNotExists: true });

  console.log('All 17 tables created successfully!');
  await sequelize.close();
}

runMigrations().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
