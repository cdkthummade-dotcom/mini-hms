const sequelize = require('../config/database');

async function getStats(req, res) {
  const { orgId } = req.session.user;
  try {
    const [rows] = await sequelize.query(
      `SELECT
         COUNT(*) FILTER (WHERE DATE(created_at) = CURRENT_DATE) AS today,
         COUNT(*) FILTER (WHERE created_at >= DATE_TRUNC('week', NOW())) AS this_week,
         COUNT(*) FILTER (WHERE created_at >= DATE_TRUNC('month', NOW())) AS this_month,
         COUNT(*) FILTER (WHERE is_mlc=true AND DATE(created_at) = CURRENT_DATE) AS mlc_today
       FROM patients
       WHERE org_id=$1 AND is_deleted=false`,
      { bind: [orgId] },
    );

    const [byType] = await sequelize.query(
      `SELECT pt.value AS patient_type, COUNT(p.id) AS count
       FROM patients p
       JOIN patient_type_master pt ON pt.id = p.patient_type_id
       WHERE p.org_id=$1 AND p.is_deleted=false AND DATE(p.created_at)=CURRENT_DATE
       GROUP BY pt.value`,
      { bind: [orgId] },
    );

    const [byConsultant] = await sequelize.query(
      `SELECT c.name AS consultant, COUNT(p.id) AS count
       FROM patients p
       JOIN consultant_master c ON c.id = p.consultant_id
       WHERE p.org_id=$1 AND p.is_deleted=false AND DATE(p.created_at)=CURRENT_DATE AND p.consultant_id IS NOT NULL
       GROUP BY c.name`,
      { bind: [orgId] },
    );

    return res.json({
      today: parseInt(rows[0].today),
      thisWeek: parseInt(rows[0].this_week),
      thisMonth: parseInt(rows[0].this_month),
      mlcToday: parseInt(rows[0].mlc_today),
      byType,
      byConsultant,
    });
  } catch (err) {
    console.error('Dashboard stats error:', err);
    return res.status(500).json({ error: 'Failed to load dashboard stats' });
  }
}

async function getRecent(req, res) {
  const { orgId } = req.session.user;
  try {
    const [rows] = await sequelize.query(
      `SELECT p.uid, p.first_name, p.last_name, p.created_at, p.is_mlc,
              u.full_name AS registered_by, pt.value AS patient_type
       FROM patients p
       LEFT JOIN users u ON u.id = p.created_by
       LEFT JOIN patient_type_master pt ON pt.id = p.patient_type_id
       WHERE p.org_id=$1 AND p.is_deleted=false
       ORDER BY p.created_at DESC LIMIT 20`,
      { bind: [orgId] },
    );
    return res.json(rows);
  } catch (err) {
    console.error('Dashboard recent error:', err);
    return res.status(500).json({ error: 'Failed to load recent registrations' });
  }
}

async function getMlcToday(req, res) {
  const { orgId } = req.session.user;
  try {
    const [rows] = await sequelize.query(
      `SELECT COUNT(*) AS count FROM patients WHERE org_id=$1 AND is_mlc=true AND is_deleted=false AND DATE(created_at)=CURRENT_DATE`,
      { bind: [orgId] },
    );
    return res.json({ count: parseInt(rows[0].count) });
  } catch (err) {
    console.error('MLC today error:', err);
    return res.status(500).json({ error: 'Failed to load MLC count' });
  }
}

module.exports = { getStats, getRecent, getMlcToday };
