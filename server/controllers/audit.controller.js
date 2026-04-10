const sequelize = require('../config/database');

async function getAuditLog(req, res) {
  const { orgId, role } = req.session.user;
  const { page = 1, action, fromDate, toDate, userId: filterUserId } = req.query;
  const limit = 50;
  const offset = (page - 1) * limit;

  let where = 'a.org_id=$1';
  const bind = [orgId];

  if (action) { bind.push(action); where += ` AND a.action=$${bind.length}`; }
  if (fromDate) { bind.push(fromDate); where += ` AND a.performed_at >= $${bind.length}`; }
  if (toDate) { bind.push(toDate + ' 23:59:59'); where += ` AND a.performed_at <= $${bind.length}`; }
  if (filterUserId) { bind.push(filterUserId); where += ` AND a.performed_by=$${bind.length}`; }

  // Super admin sees IP/device/browser; admin does not
  const deviceColumns = role === 'superadmin'
    ? ', a.ip_address, a.user_agent, a.device_info'
    : '';

  const [rows] = await sequelize.query(
    `SELECT a.id, a.table_name, a.record_id, a.action, a.performed_at,
            a.old_values, a.new_values,
            u.full_name AS performed_by_name, u.username AS performed_by_username
            ${deviceColumns}
     FROM audit_log a
     LEFT JOIN users u ON u.id = a.performed_by
     WHERE ${where}
     ORDER BY a.performed_at DESC
     LIMIT $${bind.length + 1} OFFSET $${bind.length + 2}`,
    { bind: [...bind, limit, offset] },
  );

  const [countRows] = await sequelize.query(
    `SELECT COUNT(*) AS total FROM audit_log a WHERE ${where}`,
    { bind },
  );

  return res.json({ logs: rows, total: parseInt(countRows[0].total), page: parseInt(page), limit });
}

module.exports = { getAuditLog };
