const bcrypt = require('bcrypt');
const sequelize = require('../config/database');
const { loadAllMasters } = require('../services/cache.service');

const SESSION_DURATION_MS = 8 * 60 * 60 * 1000; // 8 hours

async function login(req, res) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  try {
    const [users] = await sequelize.query(
      `SELECT id, org_id, center_id, username, password_hash, full_name, role,
              is_active, failed_attempts, locked_until
       FROM users WHERE username=$1 LIMIT 1`,
      { bind: [username] },
    );

    const user = users[0];

    if (!user || !user.is_active) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check lockout
    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      const remaining = Math.ceil((new Date(user.locked_until) - new Date()) / 60000);
      return res.status(423).json({ error: `Account locked. Try again in ${remaining} minute(s).` });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      const newAttempts = (user.failed_attempts || 0) + 1;
      if (newAttempts >= 5) {
        const lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
        await sequelize.query(
          `UPDATE users SET failed_attempts=$1, locked_until=$2 WHERE id=$3`,
          { bind: [newAttempts, lockedUntil, user.id] },
        );
        return res.status(423).json({ error: 'Too many failed attempts. Account locked for 15 minutes.' });
      }
      await sequelize.query(
        `UPDATE users SET failed_attempts=$1 WHERE id=$2`,
        { bind: [newAttempts, user.id] },
      );
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Reset failed attempts on success
    await sequelize.query(
      `UPDATE users SET failed_attempts=0, locked_until=NULL WHERE id=$1`,
      { bind: [user.id] },
    );

    // Get org code
    const [orgs] = await sequelize.query(`SELECT code FROM organizations WHERE id=$1 LIMIT 1`, { bind: [user.org_id] });
    const orgCode = orgs[0]?.code || 'DH';

    const loginTime = new Date();
    const expiresAt = new Date(loginTime.getTime() + SESSION_DURATION_MS);

    req.session.user = {
      id: user.id,
      orgId: user.org_id,
      centerId: user.center_id,
      orgCode,
      username: user.username,
      fullName: user.full_name,
      role: user.role,
      loginTime: loginTime.toISOString(),
      expiresAt: expiresAt.toISOString(),
    };

    // Pre-load masters into Redis for this org
    loadAllMasters(user.org_id).catch(console.error);

    return res.json({
      id: user.id,
      username: user.username,
      fullName: user.full_name,
      role: user.role,
      orgId: user.org_id,
      centerId: user.center_id,
      orgCode,
      loginTime: loginTime.toISOString(),
      expiresAt: expiresAt.toISOString(),
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

async function logout(req, res) {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: 'Logout failed' });
    res.clearCookie('hms.sid');
    return res.json({ message: 'Logged out successfully' });
  });
}

async function me(req, res) {
  return res.json(req.session.user);
}

module.exports = { login, logout, me };
