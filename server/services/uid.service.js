const sequelize = require('../config/database');

/**
 * Generate next UID atomically.
 * Format: {2-char orgCode}{YYYY}{6-digit serial}
 * Serial resets every January 1st (per org, per year).
 */
async function generateUID(orgId, orgCode) {
  const year = new Date().getFullYear();

  // Atomic increment using PostgreSQL UPDATE ... RETURNING
  const [rows] = await sequelize.query(
    `INSERT INTO uid_sequences (org_id, year, last_serial)
     VALUES (:orgId, :year, 1)
     ON CONFLICT (org_id, year) DO UPDATE
       SET last_serial = uid_sequences.last_serial + 1
     RETURNING last_serial`,
    { replacements: { orgId, year } },
  );

  const serial = rows[0].last_serial;
  const serialStr = String(serial).padStart(6, '0');
  return `${orgCode.toUpperCase()}${year}${serialStr}`;
}

module.exports = { generateUID };
