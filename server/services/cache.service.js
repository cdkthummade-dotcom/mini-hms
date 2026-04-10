const { getRedisClient } = require('../config/redis');
const sequelize = require('../config/database');

const MASTER_TTL = 86400; // 24 hours

const MASTER_QUERIES = {
  salutation: `SELECT id, value, display_order FROM salutation_master WHERE org_id=$1 AND is_active=true ORDER BY display_order`,
  patient_type: `SELECT id, value FROM patient_type_master WHERE org_id=$1 AND is_active=true`,
  referred_by: `SELECT id, name, type FROM referred_by_master WHERE org_id=$1 AND is_active=true`,
  consultant: `SELECT id, name, specialisation, department FROM consultant_master WHERE org_id=$1 AND is_active=true`,
  identity_type: `SELECT id, value FROM identity_type_master WHERE org_id=$1 AND is_active=true`,
  relation_type: `SELECT id, value FROM relation_type_master WHERE org_id=$1 AND is_active=true`,
  marital_status: `SELECT id, value FROM marital_status_master WHERE org_id=$1 AND is_active=true`,
};

async function loadAllMasters(orgId) {
  const redis = getRedisClient();
  for (const [key, query] of Object.entries(MASTER_QUERIES)) {
    const cacheKey = `master:${orgId}:${key}`;
    const [rows] = await sequelize.query(query, { bind: [orgId] });
    await redis.set(cacheKey, JSON.stringify(rows), 'EX', MASTER_TTL);
    console.log(`Cached master: ${key} (${rows.length} entries)`);
  }
}

async function getMaster(orgId, masterKey) {
  const redis = getRedisClient();
  const cacheKey = `master:${orgId}:${masterKey}`;
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  // Cache miss — reload from DB
  const query = MASTER_QUERIES[masterKey];
  if (!query) return [];
  const [rows] = await sequelize.query(query, { bind: [orgId] });
  await redis.set(cacheKey, JSON.stringify(rows), 'EX', MASTER_TTL);
  return rows;
}

async function invalidateMaster(orgId, masterKey) {
  const redis = getRedisClient();
  await redis.del(`master:${orgId}:${masterKey}`);
}

module.exports = { loadAllMasters, getMaster, invalidateMaster };
