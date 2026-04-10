const express = require('express');
const router = express.Router();
const { getEmployee, getPincode } = require('../controllers/autofill.controller');
const { requireAuth } = require('../middleware/auth.middleware');

router.get('/employees/:empId', requireAuth, getEmployee);
router.get('/pincode/:code', requireAuth, getPincode);

module.exports = router;
