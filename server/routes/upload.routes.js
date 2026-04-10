const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadPhoto, uploadDocument } = require('../controllers/upload.controller');
const { requireAuth } = require('../middleware/auth.middleware');

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5 MB max

router.post('/photo', requireAuth, upload.single('photo'), uploadPhoto);
router.post('/document', requireAuth, upload.single('document'), uploadDocument);

module.exports = router;
