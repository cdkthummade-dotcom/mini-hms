const express = require('express');
const router = express.Router();
const { getStats, getRecent, getMlcToday } = require('../controllers/dashboard.controller');
const { requireAuth } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');

router.get('/stats', requireAuth, requireRole('admin', 'superadmin'), getStats);
router.get('/recent', requireAuth, requireRole('admin', 'superadmin'), getRecent);
router.get('/mlc-today', requireAuth, requireRole('admin', 'superadmin'), getMlcToday);

module.exports = router;
