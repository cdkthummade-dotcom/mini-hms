const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

function uploadToCloudinary(buffer, folder, resourceType = 'image') {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType, quality: 'auto', fetch_format: 'auto' },
      (err, result) => { if (err) reject(err); else resolve(result); },
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

async function uploadPhoto(req, res) {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  try {
    const result = await uploadToCloudinary(req.file.buffer, 'hms/photos', 'image');
    return res.json({ url: result.secure_url });
  } catch (err) {
    console.error('Photo upload error:', err);
    return res.status(500).json({ error: 'Upload failed' });
  }
}

async function uploadDocument(req, res) {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  try {
    const result = await uploadToCloudinary(req.file.buffer, 'hms/mlc-documents', 'raw');
    return res.json({ url: result.secure_url });
  } catch (err) {
    console.error('Document upload error:', err);
    return res.status(500).json({ error: 'Upload failed' });
  }
}

module.exports = { uploadPhoto, uploadDocument };
