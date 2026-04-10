const express = require('express');
const router = express.Router();
const { createPatient, getPatient, searchPatients, updatePatient, deletePatient, restorePatient } = require('../controllers/patient.controller');
const { requireAuth } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');

router.post('/', requireAuth, createPatient);
router.get('/search', requireAuth, requireRole('admin', 'superadmin'), searchPatients);
router.get('/:uid', requireAuth, requireRole('admin', 'superadmin'), getPatient);
router.put('/:id', requireAuth, requireRole('admin', 'superadmin'), updatePatient);
router.delete('/:id', requireAuth, requireRole('admin', 'superadmin'), deletePatient);
router.post('/:id/restore', requireAuth, requireRole('admin', 'superadmin'), restorePatient);

module.exports = router;
