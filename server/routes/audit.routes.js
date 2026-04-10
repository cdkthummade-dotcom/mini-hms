const express = require('express');
const router = express.Router();
const { getAuditLog } = require('../controllers/audit.controller');
const { requireAuth } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');

router.get('/log', requireAuth, requireRole('admin', 'superadmin'), getAuditLog);

module.exports = router;
