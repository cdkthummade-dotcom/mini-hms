const express = require('express');
const router = express.Router();
const { listUsers, createUser, updateUser, deactivateUser, getActiveSessions, forceLogout } = require('../controllers/user.controller');
const { requireAuth } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');

router.get('/', requireAuth, requireRole('admin', 'superadmin'), listUsers);
router.post('/', requireAuth, requireRole('admin', 'superadmin'), createUser);
router.put('/:id', requireAuth, requireRole('admin', 'superadmin'), updateUser);
router.delete('/:id', requireAuth, requireRole('admin', 'superadmin'), deactivateUser);

// Sessions
router.get('/sessions/active', requireAuth, requireRole('admin', 'superadmin'), getActiveSessions);
router.delete('/sessions/:sid', requireAuth, requireRole('admin', 'superadmin'), forceLogout);

module.exports = router;
