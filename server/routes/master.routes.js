const express = require('express');
const router = express.Router();
const { listMaster, createMaster, updateMaster, deleteMaster, getSystemSettings, updateSystemSettings } = require('../controllers/master.controller');
const { requireAuth } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');

// System settings
router.get('/system-settings', requireAuth, requireRole('admin', 'superadmin'), getSystemSettings);
router.put('/system-settings', requireAuth, requireRole('admin', 'superadmin'), updateSystemSettings);

// Generic master CRUD
router.get('/:masterName', requireAuth, listMaster);
router.post('/:masterName', requireAuth, requireRole('admin', 'superadmin'), createMaster);
router.put('/:masterName/:id', requireAuth, requireRole('admin', 'superadmin'), updateMaster);
router.delete('/:masterName/:id', requireAuth, requireRole('admin', 'superadmin'), deleteMaster);

module.exports = router;
