const sequelize = require('../config/database');

/**
 * Write audit log entry asynchronously (non-blocking).
 * Captures IP, user-agent, device info on every data-changing action.
 */
function writeAudit({ orgId, tableName, recordId, action, performedBy, oldValues, newValues, ip, userAgent }) {
  // Non-blocking — fire and forget
  sequelize.query(
    `INSERT INTO audit_log
       (org_id, table_name, record_id, action, performed_by, performed_at, old_values, new_values, ip_address, user_agent, device_info)
     VALUES ($1,$2,$3,$4,$5,NOW(),$6,$7,$8,$9,$10)`,
    {
      bind: [
        orgId,
        tableName,
        recordId,
        action,
        performedBy,
        oldValues ? JSON.stringify(oldValues) : null,
        newValues ? JSON.stringify(newValues) : null,
        ip || null,
        userAgent || null,
        parseDeviceInfo(userAgent),
      ],
    },
  ).catch((err) => console.error('Audit write error:', err.message));
}

function parseDeviceInfo(ua) {
  if (!ua) return null;
  if (/mobile/i.test(ua)) return 'Mobile';
  if (/tablet/i.test(ua)) return 'Tablet';
  return 'Desktop';
}

module.exports = { writeAudit };
