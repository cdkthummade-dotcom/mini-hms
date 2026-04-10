const bcrypt = require('bcrypt');
const sequelize = require('../config/database');
const { getRedisClient } = require('../config/redis');
const { writeAudit } = require('../services/audit.service');

async function listUsers(req, res) {
  const { orgId } = req.session.user;
  const [users] = await sequelize.query(
    `SELECT id, username, full_name, role, is_active, created_at FROM users WHERE org_id=$1 ORDER BY created_at DESC`,
    { bind: [orgId] },
  );
  return res.json(users);
}

async function createUser(req, res) {
  const { orgId, id: userId } = req.session.user;
  const { username, password, fullName, role, centerId } = req.body;

  if (!username || !password || !fullName || !role) {
    return res.status(400).json({ error: 'username, password, fullName, role are required' });
  }
  if (!['receptionist', 'admin', 'superadmin'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }

  const hash = await bcrypt.hash(password, 12);
  try {
    const [rows] = await sequelize.query(
      `INSERT INTO users (org_id, center_id, username, password_hash, full_name, role) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`,
      { bind: [orgId, centerId || null, username, hash, fullName, role] },
    );
    writeAudit({ orgId, tableName: 'users', recordId: rows[0].id, action: 'CREATE', performedBy: userId, newValues: { username, fullName, role }, ip: req.ip, userAgent: req.headers['user-agent'] });
    return res.status(201).json({ id: rows[0].id, message: 'User created' });
  } catch (err) {
    if (err.message.includes('unique') || err.message.includes('duplicate')) {
      return res.status(409).json({ error: 'Username already exists' });
    }
    throw err;
  }
}

async function updateUser(req, res) {
  const { id } = req.params;
  const { orgId, id: userId } = req.session.user;
  const { fullName, role, password, isActive } = req.body;

  const updates = [];
  const bind = [];

  if (fullName) { bind.push(fullName); updates.push(`full_name=$${bind.length}`); }
  if (role && ['receptionist', 'admin', 'superadmin'].includes(role)) { bind.push(role); updates.push(`role=$${bind.length}`); }
  if (password) { const h = await bcrypt.hash(password, 12); bind.push(h); updates.push(`password_hash=$${bind.length}`); }
  if (isActive !== undefined) { bind.push(isActive); updates.push(`is_active=$${bind.length}`); }

  if (!updates.length) return res.status(400).json({ error: 'Nothing to update' });

  bind.push(id); bind.push(orgId);
  await sequelize.query(
    `UPDATE users SET ${updates.join(', ')}, updated_at=NOW() WHERE id=$${bind.length - 1} AND org_id=$${bind.length}`,
    { bind },
  );

  writeAudit({ orgId, tableName: 'users', recordId: parseInt(id), action: 'UPDATE', performedBy: userId, newValues: req.body, ip: req.ip, userAgent: req.headers['user-agent'] });

  return res.json({ message: 'User updated' });
}

async function deactivateUser(req, res) {
  const { id } = req.params;
  const { orgId, id: userId } = req.session.user;

  await sequelize.query(
    `UPDATE users SET is_active=false, updated_at=NOW() WHERE id=$1 AND org_id=$2`,
    { bind: [id, orgId] },
  );

  writeAudit({ orgId, tableName: 'users', recordId: parseInt(id), action: 'DELETE', performedBy: userId, newValues: { is_active: false }, ip: req.ip, userAgent: req.headers['user-agent'] });

  return res.json({ message: 'User deactivated' });
}

async function getActiveSessions(req, res) {
  const redis = getRedisClient();
  const { orgId } = req.session.user;

  // Scan for all session keys
  const keys = await redis.keys('sess:*');
  const sessions = [];

  for (const key of keys) {
    try {
      const raw = await redis.get(key);
      if (!raw) continue;
      const sess = JSON.parse(raw);
      if (sess.user && sess.user.orgId === orgId) {
        sessions.push({
          sessionId: key.replace('sess:', ''),
          username: sess.user.username,
          fullName: sess.user.fullName,
          role: sess.user.role,
          loginTime: sess.user.loginTime,
          expiresAt: sess.user.expiresAt,
        });
      }
    } catch (_) { /* skip malformed */ }
  }

  return res.json(sessions);
}

async function forceLogout(req, res) {
  const { sid } = req.params;
  const redis = getRedisClient();
  await redis.del(`sess:${sid}`);
  return res.json({ message: 'Session terminated' });
}

module.exports = { listUsers, createUser, updateUser, deactivateUser, getActiveSessions, forceLogout };
