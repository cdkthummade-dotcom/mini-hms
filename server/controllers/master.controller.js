const sequelize = require('../config/database');
const { getMaster, invalidateMaster } = require('../services/cache.service');
const { writeAudit } = require('../services/audit.service');

const MASTER_MAP = {
  salutation: { table: 'salutation_master', valueCol: 'value', cacheKey: 'salutation' },
  'patient-type': { table: 'patient_type_master', valueCol: 'value', cacheKey: 'patient_type' },
  'referred-by': { table: 'referred_by_master', valueCol: 'name', cacheKey: 'referred_by' },
  consultant: { table: 'consultant_master', valueCol: 'name', cacheKey: 'consultant' },
  'identity-type': { table: 'identity_type_master', valueCol: 'value', cacheKey: 'identity_type' },
  'relation-type': { table: 'relation_type_master', valueCol: 'value', cacheKey: 'relation_type' },
  'marital-status': { table: 'marital_status_master', valueCol: 'value', cacheKey: 'marital_status' },
};

async function listMaster(req, res) {
  const { masterName } = req.params;
  const { orgId } = req.session.user;
  const masterDef = MASTER_MAP[masterName];
  if (!masterDef) return res.status(404).json({ error: 'Unknown master' });

  const data = await getMaster(orgId, masterDef.cacheKey);
  return res.json(data);
}

async function createMaster(req, res) {
  const { masterName } = req.params;
  const { orgId, id: userId } = req.session.user;
  const masterDef = MASTER_MAP[masterName];
  if (!masterDef) return res.status(404).json({ error: 'Unknown master' });

  const { value, name, type, specialisation, department, displayOrder, centerId } = req.body;
  const mainValue = value || name;
  if (!mainValue) return res.status(400).json({ error: 'Value is required' });

  let insertQuery, bind;
  if (masterName === 'referred-by') {
    insertQuery = `INSERT INTO referred_by_master (org_id, name, type) VALUES ($1,$2,$3) RETURNING id`;
    bind = [orgId, mainValue, type || 'doctor'];
  } else if (masterName === 'consultant') {
    insertQuery = `INSERT INTO consultant_master (org_id, center_id, name, specialisation, department) VALUES ($1,$2,$3,$4,$5) RETURNING id`;
    bind = [orgId, centerId || null, mainValue, specialisation || null, department || null];
  } else if (masterName === 'salutation') {
    insertQuery = `INSERT INTO salutation_master (org_id, value, display_order) VALUES ($1,$2,$3) RETURNING id`;
    bind = [orgId, mainValue, displayOrder || 0];
  } else {
    insertQuery = `INSERT INTO ${masterDef.table} (org_id, ${masterDef.valueCol}) VALUES ($1,$2) RETURNING id`;
    bind = [orgId, mainValue];
  }

  const [rows] = await sequelize.query(insertQuery, { bind });
  await invalidateMaster(orgId, masterDef.cacheKey);

  writeAudit({ orgId, tableName: masterDef.table, recordId: rows[0].id, action: 'CREATE', performedBy: userId, newValues: req.body, ip: req.ip, userAgent: req.headers['user-agent'] });

  return res.status(201).json({ id: rows[0].id, message: 'Created' });
}

async function updateMaster(req, res) {
  const { masterName, id } = req.params;
  const { orgId, id: userId } = req.session.user;
  const masterDef = MASTER_MAP[masterName];
  if (!masterDef) return res.status(404).json({ error: 'Unknown master' });

  const { value, name, type, specialisation, department, displayOrder } = req.body;
  const mainValue = value || name;

  let setClauses = [];
  let bind = [];

  if (mainValue) { bind.push(mainValue); setClauses.push(`${masterDef.valueCol}=$${bind.length}`); }
  if (type !== undefined) { bind.push(type); setClauses.push(`type=$${bind.length}`); }
  if (specialisation !== undefined) { bind.push(specialisation); setClauses.push(`specialisation=$${bind.length}`); }
  if (department !== undefined) { bind.push(department); setClauses.push(`department=$${bind.length}`); }
  if (displayOrder !== undefined) { bind.push(displayOrder); setClauses.push(`display_order=$${bind.length}`); }

  if (!setClauses.length) return res.status(400).json({ error: 'Nothing to update' });

  bind.push(id); bind.push(orgId);
  await sequelize.query(
    `UPDATE ${masterDef.table} SET ${setClauses.join(', ')} WHERE id=$${bind.length - 1} AND org_id=$${bind.length}`,
    { bind },
  );
  await invalidateMaster(orgId, masterDef.cacheKey);

  writeAudit({ orgId, tableName: masterDef.table, recordId: parseInt(id), action: 'UPDATE', performedBy: userId, newValues: req.body, ip: req.ip, userAgent: req.headers['user-agent'] });

  return res.json({ message: 'Updated' });
}

async function deleteMaster(req, res) {
  const { masterName, id } = req.params;
  const { orgId, id: userId } = req.session.user;
  const masterDef = MASTER_MAP[masterName];
  if (!masterDef) return res.status(404).json({ error: 'Unknown master' });

  await sequelize.query(
    `UPDATE ${masterDef.table} SET is_active=false WHERE id=$1 AND org_id=$2`,
    { bind: [id, orgId] },
  );
  await invalidateMaster(orgId, masterDef.cacheKey);

  writeAudit({ orgId, tableName: masterDef.table, recordId: parseInt(id), action: 'DELETE', performedBy: userId, newValues: { is_active: false }, ip: req.ip, userAgent: req.headers['user-agent'] });

  return res.json({ message: 'Deactivated (soft delete)' });
}

async function getSystemSettings(req, res) {
  const { orgId } = req.session.user;
  const [rows] = await sequelize.query(`SELECT id, name, code, logo_url, timezone FROM organizations WHERE id=$1`, { bind: [orgId] });
  return res.json(rows[0] || {});
}

async function updateSystemSettings(req, res) {
  const { orgId, id: userId } = req.session.user;
  const { name, code, logoUrl, timezone } = req.body;

  if (code && !/^[A-Z]{2}$/.test(code)) {
    return res.status(400).json({ error: 'Code must be exactly 2 uppercase letters' });
  }

  const updates = [];
  const bind = [];
  if (name) { bind.push(name); updates.push(`name=$${bind.length}`); }
  if (code) { bind.push(code); updates.push(`code=$${bind.length}`); }
  if (logoUrl) { bind.push(logoUrl); updates.push(`logo_url=$${bind.length}`); }
  if (timezone) { bind.push(timezone); updates.push(`timezone=$${bind.length}`); }

  if (!updates.length) return res.status(400).json({ error: 'Nothing to update' });

  bind.push(orgId);
  await sequelize.query(`UPDATE organizations SET ${updates.join(', ')} WHERE id=$${bind.length}`, { bind });

  writeAudit({ orgId, tableName: 'organizations', recordId: orgId, action: 'UPDATE', performedBy: userId, newValues: req.body, ip: req.ip, userAgent: req.headers['user-agent'] });

  return res.json({ message: 'Settings updated' });
}

module.exports = { listMaster, createMaster, updateMaster, deleteMaster, getSystemSettings, updateSystemSettings };
